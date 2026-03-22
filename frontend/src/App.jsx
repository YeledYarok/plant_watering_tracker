import { useState, useEffect } from "react";
import AddPlantForm from "./components/AddPlantForm.jsx";
import PlantCard from "./components/PlantCard.jsx";

export default function App() {
  // plants: the single source of truth for our plant list.
  // Every PlantCard reads from here; any mutation goes through setPlants.
  const [plants, setPlants] = useState([]);
  const [fetchState, setFetchState] = useState("loading"); // "loading" | "ok" | "error"

  // useEffect runs after the component mounts (appears on screen).
  // The empty array [] means "run this only once", like a constructor.
  // We fetch the current plant list from the backend to populate the dashboard.
  useEffect(() => {
    fetch("/api/plants")
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        setPlants(data);
        setFetchState("ok");
      })
      .catch(() => setFetchState("error"));
  }, []);

  // Called by AddPlantForm when a plant is successfully created.
  function handleAdd(newPlant) {
    setPlants((prev) => [...prev, newPlant]);
  }

  // Called by PlantCard when a plant is successfully watered.
  // Replace just the one updated plant in the array; leave the rest untouched.
  function handleWatered(updatedPlant) {
    setPlants((prev) =>
      prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p))
    );
  }

  // Called by PlantCard when a plant is deleted.
  function handleDelete(id) {
    setPlants((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="app">
      <header>
        <h1>🌿 Plant Watering Tracker</h1>
        <p>Keep your plants happy — never forget a watering again.</p>
      </header>

      <AddPlantForm onAdd={handleAdd} />

      <div className="dashboard-header">
        <h2>Your Plants</h2>
        <span className="plant-count">({plants.length})</span>
      </div>

      {fetchState === "loading" && <div className="loading">Loading your plants…</div>}

      {fetchState === "error" && (
        <div className="fetch-error">
          Could not reach the server. Make sure the backend is running on port 3001.
        </div>
      )}

      {fetchState === "ok" && plants.length === 0 && (
        <div className="empty-state">
          <div className="emoji">🪴</div>
          <p>No plants yet. Add one above to get started!</p>
        </div>
      )}

      {fetchState === "ok" && plants.length > 0 && (
        <div className="plant-grid">
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onWatered={handleWatered}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
