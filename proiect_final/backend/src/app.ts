import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import { pool } from "./db";

dotenv.config();

const PORT = Number(process.env.PORT || 5174);
const ORIGIN = (process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map(s => s.trim());

const BASE_URL = `http://localhost:${PORT}`;

const app = express();

// CORS + body parsers
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());

// Static /uploads (asigură-te că există folderul backend/uploads)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Multer: salvare fișiere în backend/uploads, nume safe+timestamp
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
    cb(null, `${ts}__${safe}`);
  },
});
const upload = multer({ storage });

// ============ UTIL ============

function normalizeSchite(value: any): string[] {
  let arr: string[] = [];
  try { arr = JSON.parse(value || "[]"); } catch { arr = []; }

  return arr
    .map((s) => {
      if (!s) return "";
      const v = String(s).trim();
      if (/^https?:\/\//i.test(v)) return v;
      if (v.startsWith("/uploads/")) return `${BASE_URL}${v}`;
      if (v.startsWith("/")) return `${BASE_URL}${v}`;
      return `${BASE_URL}/uploads/${v}`;
    })
    .filter(Boolean);
}

// ============ PRODUCTS ============

// listă fără preț
app.get("/api/products", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nume, descriere, material, categorie, imagine
       FROM products
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (e: any) {
    console.error("GET /api/products:", e);
    res.status(500).json({ error: "DB error", message: e.message });
  }
});

// detaliu
app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, nume, descriere, material, categorie, imagine
       FROM products WHERE id = ?`,
      [req.params.id]
    );
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(rows[0]);
  } catch (e: any) {
    console.error("GET /api/products/:id:", e);
    res.status(500).json({ error: "DB error", message: e.message });
  }
});

// ============ HEALTH ============

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get("/api/health-db", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ db: "connected", rows });
  } catch (e: any) {
    res.status(500).json({ db: "error", message: e?.message || "unknown" });
  }
});

// ============ OFERTE ============

// listă (normalizează schite în URL-uri absolute)
app.get("/api/oferte", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM oferte ORDER BY createdAt DESC");
    const list = (rows as any[]).map((o) => ({ ...o, schite: normalizeSchite(o?.schite) }));
    res.json(list);
  } catch (e: any) {
    console.error("GET /api/oferte:", e);
    res.status(500).json({ error: "DB error", message: e.message });
  }
});

// creare ofertă
// Acceptă:
//  - multipart/form-data cu câmpuri + fișiere sub cheia "schite"
//  - application/json (schite: [] / listă URL-uri)
app.post("/api/oferta", upload.array("schite", 10), async (req, res) => {
  try {
    const { produs, nume, telefon, email, mesaj } = req.body || {};
    if (!produs || !nume || !telefon || !email) {
      return res.status(422).json({ error: "Câmpuri lipsă (produs, nume, telefon, email)" });
    }

    // din upload
    const files = Array.isArray(req.files) ? (req.files as Express.Multer.File[]) : [];
    const uploadedUrls = files.map((f) => `/uploads/${f.filename}`);

    // din body (opțional)
    let bodyUrls: string[] = [];
    try {
      if (req.body.schite) {
        const v = typeof req.body.schite === "string" ? JSON.parse(req.body.schite) : req.body.schite;
        if (Array.isArray(v)) bodyUrls = v.filter(Boolean);
      }
    } catch {}

    const schite = JSON.stringify([...uploadedUrls, ...bodyUrls]);

    const id = "OF-" + Date.now() + Math.floor(Math.random() * 900 + 100);
    const createdAt = new Date().toISOString();

    await pool.query(
      `INSERT INTO oferte (id, produs, nume, telefon, email, mesaj, schite, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, produs, nume, telefon, email, mesaj ?? null, schite, "noua", createdAt]
    );

    const [rows]: any = await pool.query("SELECT * FROM oferte WHERE id = ?", [id]);
    const row = rows[0];
    row.schite = normalizeSchite(row?.schite);
    res.status(201).json(row);
  } catch (e: any) {
    console.error("POST /api/oferta:", e);
    res.status(500).json({ error: "DB error", message: e.message });
  }
});

// update ofertă (status / mesaj)
app.put("/api/oferte/:id", async (req, res) => {
  try {
    const { status, mesaj } = req.body || {};
    const { id } = req.params;
    if (status === undefined && mesaj === undefined) {
      return res.status(400).json({ error: "Nimic de actualizat" });
    }
    const fields: string[] = [];
    const params: any[] = [];
    if (status !== undefined) { fields.push("status = ?"); params.push(status); }
    if (mesaj  !== undefined) { fields.push("mesaj = ?");  params.push(mesaj);  }
    params.push(id);

    await pool.query(`UPDATE oferte SET ${fields.join(", ")} WHERE id = ?`, params);

    const [rows]: any = await pool.query("SELECT * FROM oferte WHERE id = ?", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Ofertă inexistentă" });
    const row = rows[0];
    row.schite = normalizeSchite(row?.schite);
    res.json(row);
  } catch (e: any) {
    console.error("PUT /api/oferte/:id:", e);
    res.status(500).json({ error: "DB error", message: e.message });
  }
});

// ștergere ofertă
app.delete("/api/oferte/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM oferte WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/oferte/:id:", e);
    res.status(500).json({ error: "DB error", message: e.message });
  }
});

// ============ START ============

app.listen(PORT, () => {
  console.log(`API pornit pe ${BASE_URL}`);
});
