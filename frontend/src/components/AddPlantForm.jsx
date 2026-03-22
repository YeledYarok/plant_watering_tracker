import { useState } from "react";

// Props:
//   onAdd(plant) — called with the newly created plant object returned from the API
export default function AddPlantForm({ onAdd }) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // prevent the browser from reloading the page (default form behaviour)
    setError("");

    // Basic client-side validation before hitting the network
    if (!name.trim()) return setError("Please enter a plant name.");
    if (!frequency || Number(frequency) < 1) return setError("Frequency must be at least 1 day.");

    setLoading(true);
    try {
      const res = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), frequency: Number(frequency) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add plant.");
      }

      const newPlant = await res.json();
      onAdd(newPlant);    // bubble the new plant up to App so the dashboard updates immediately
      setName("");         // reset the form
      setFrequency("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-plant-card">
      <h2>Add a Plant</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="Plant name (e.g. Monstera)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Water every X days"
            min="1"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
          <button className="btn-add" type="submit" disabled={loading}>
            {loading ? "Adding…" : "Add Plant"}
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </form>
    </div>
  );
}
