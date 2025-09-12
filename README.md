# STO Mob Design - Portfolio & Admin

## Project Structure
- **backend/** -> Express API + MySQL (products, offers, contact)
- **frontend/** -> Vue 3 + Vite + Tailwind  
  (final build in `dist/` after `npm run build`)

## Requirements
- Node.js v18+
- MySQL 8+
- NPM or Yarn

## Setup

### 1. Database
- Create database `sto_mob`
- Import SQL file:
  ```bash
  mysql -u root -p sto_mob < sto_mob.sql
  ```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
- API runs at [http://localhost:5174](http://localhost:5174)  
- Uploaded images are stored in `backend/uploads`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
- App runs at [http://localhost:5173](http://localhost:5173)

### 4. Build frontend for production
```bash
cd frontend
npm run build
```
- Output is in `frontend/dist/`

## Login
- Admin login:
  - user: `admin`
  - password: `admin123`

## Features
- **Portfolio** -> list of products with image, description, category  
- **Offers** -> send offers with JPG attachments  
- **Contact** -> form saved as `[CONTACT]` in offers  
- **Admin** -> manage offers & messages, change status, delete  
