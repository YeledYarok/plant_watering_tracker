const express = require("express");
const cors = require("cors");
const { readDB, writeDB } = require("./database");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// GET /api/plants — return all plants sorted by name
// ---------------------------------------------------------------------------
app.get("/api/plants", (req, res) => {
  const { plants } = readDB();
  res.json([...plants].sort((a, b) => a.name.localeCompare(b.name)));
});

// ---------------------------------------------------------------------------
// POST /api/plants — add a new plant
// Body: { name: string, frequency: number }
// ---------------------------------------------------------------------------
app.post("/api/plants", (req, res) => {
  const { name, frequency } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Plant name is required." });
  }
  if (!frequency || frequency < 1) {
    return res.status(400).json({ error: "Frequency must be at least 1 day." });
  }

  const db = readDB();
  const newPlant = {
    id: db.nextId,
    name: name.trim(),
    frequency: Number(frequency),
    last_watered: new Date().toISOString(),
  };

  db.plants.push(newPlant);
  db.nextId += 1;
  writeDB(db);

  res.status(201).json(newPlant);
});

// ---------------------------------------------------------------------------
// PUT /api/plants/:id/water — mark a plant as watered right now
// ---------------------------------------------------------------------------
app.put("/api/plants/:id/water", (req, res) => {
  const id = Number(req.params.id);
  const db = readDB();
  const plant = db.plants.find((p) => p.id === id);

  if (!plant) return res.status(404).json({ error: "Plant not found." });

  plant.last_watered = new Date().toISOString();
  writeDB(db);

  res.json(plant);
});

// ---------------------------------------------------------------------------
// DELETE /api/plants/:id — remove a plant
// ---------------------------------------------------------------------------
app.delete("/api/plants/:id", (req, res) => {
  const id = Number(req.params.id);
  const db = readDB();
  const index = db.plants.findIndex((p) => p.id === id);

  if (index === -1) return res.status(404).json({ error: "Plant not found." });

  db.plants.splice(index, 1);
  writeDB(db);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Plant tracker API running at http://localhost:${PORT}`);
});
