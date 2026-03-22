# Plant Watering Tracker

A fullstack web app to track when your plants need watering.

## Prerequisites

Install [Node.js](https://nodejs.org/) (LTS version recommended). This gives you both `node` and `npm`.

## First-time setup

Open **two** terminal windows.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

The API server starts at http://localhost:3001

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

The React app starts at http://localhost:5173 — open this in your browser.

## How it works

```
Browser (React)  ──fetch──▶  Express (port 3001)  ──JSON──▶  plants.json (file DB)
     ◀──JSON──────────────────────────────────────────────────────────────────────
```

- **Frontend** (React + Vite): UI, rendered in the browser
- **Backend** (Node.js + Express): REST API, runs on your machine
- **Database**: a single `backend/plants.json` file — no separate DB server needed

## API reference

| Method | Path                    | Description              |
|--------|-------------------------|--------------------------|
| GET    | /api/plants             | List all plants          |
| POST   | /api/plants             | Add a plant              |
| PUT    | /api/plants/:id/water   | Mark a plant as watered  |
| DELETE | /api/plants/:id         | Remove a plant           |
