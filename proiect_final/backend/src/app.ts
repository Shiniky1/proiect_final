// backend/src/app.ts
import express from "express";
import cors from "cors";
import { pool } from "./db";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// test server
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// test conexiune MySQL
app.get("/api/health-db", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ db: "connected", rows });
  } catch (e: any) {
    res.status(500).json({ db: "error", message: e?.message || "unknown" });
  }
});
// OFERTE: listă
app.get("/api/oferte", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM oferte ORDER BY createdAt DESC");
  res.json(rows);
});

// OFERTE: adăugare
app.post("/api/oferta", async (req, res) => {
  const { produs, nume, telefon, email, mesaj, schite } = req.body || {};
  if (!produs || !nume || !telefon || !email) {
    return res.status(422).json({ error: "Câmpuri lipsă (produs, nume, telefon, email)" });
  }
  const id = "OF-" + Date.now() + Math.floor(Math.random() * 900 + 100);
  const createdAt = new Date().toISOString();

  await pool.execute(
    `INSERT INTO oferte (id, produs, nume, telefon, email, mesaj, schite, status, createdAt)
     VALUES (:id, :produs, :nume, :telefon, :email, :mesaj, :schite, :status, :createdAt)`,
    {
      id, produs, nume, telefon, email,
      mesaj: mesaj ?? null,
      schite: JSON.stringify(schite ?? []),
      status: "noua",
      createdAt,
    }
  );

  const [rows] = await pool.query("SELECT * FROM oferte WHERE id=:id", { id });
  res.status(201).json((rows as any)[0]);
});
// OFERTE: update (ex. status/mesaj)
app.put("/api/oferte/:id", async (req, res) => {
  const { id } = req.params;
  const { status, mesaj } = req.body || {};
  if (status === undefined && mesaj === undefined) {
    return res.status(400).json({ error: "Nimic de actualizat" });
  }
  const fields: string[] = [];
  const params: any = { id };
  if (status !== undefined) { fields.push("status=:status"); params.status = status; }
  if (mesaj !== undefined)  { fields.push("mesaj=:mesaj");   params.mesaj  = mesaj; }
  await pool.execute(`UPDATE oferte SET ${fields.join(", ")} WHERE id=:id`, params);
  const [rows] = await pool.query("SELECT * FROM oferte WHERE id=:id", { id });
  if (!(rows as any)[0]) return res.status(404).json({ error: "Ofertă inexistentă" });
  res.json((rows as any)[0]);
});

// OFERTE: ștergere
app.delete("/api/oferte/:id", async (req, res) => {
  const { id } = req.params;
  await pool.execute("DELETE FROM oferte WHERE id=:id", { id });
  res.json({ ok: true });
});
// ORDERS: listă
app.get("/api/orders", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM orders ORDER BY createdAt DESC");
  res.json(rows);
});

// ORDERS: creare
app.post("/api/orders", async (req, res) => {
  const { nume, email, telefon, adresa, observatii, items, total } = req.body || {};
  if (!nume || !email || !telefon || !adresa || !items || !Array.isArray(items) || total === undefined) {
    return res.status(422).json({ error: "Câmpuri lipsă (nume, email, telefon, adresa, items, total)" });
  }
  const id = "ORD-" + Date.now() + Math.floor(Math.random() * 900 + 100);
  const createdAt = new Date().toISOString();

  await pool.execute(
    `INSERT INTO orders (id, nume, email, telefon, adresa, observatii, items, total, status, createdAt)
     VALUES (:id,:nume,:email,:telefon,:adresa,:observatii,:items,:total,:status,:createdAt)`,
    {
      id, nume, email, telefon, adresa,
      observatii: observatii ?? null,
      items: JSON.stringify(items),
      total: Number(total || 0),
      status: "plasata",
      createdAt,
    }
  );

  const [rows] = await pool.query("SELECT * FROM orders WHERE id=:id", { id });
  res.status(201).json((rows as any)[0]);
});

const PORT = Number(process.env.PORT || 5174);
app.listen(PORT, () => {
  console.log(`API pornit pe http://localhost:${PORT}`);
});
