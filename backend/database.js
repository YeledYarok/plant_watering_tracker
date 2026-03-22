const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "plants.json");

// If the file doesn't exist yet, create it with an empty plants array.
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ nextId: 1, plants: [] }, null, 2));
}

// Read the whole file and parse it as JSON.
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

// Serialize the data back to the file.
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
