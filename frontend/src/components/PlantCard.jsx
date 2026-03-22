import { useState } from "react";

// Given a plant's last_watered date and frequency, compute display info.
function getWateringStatus(lastWatered, frequency) {
  const now = new Date();
  const last = new Date(lastWatered);

  // daysSince: how many full days have passed since last watering
  const daysSince = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  // daysUntil: negative means overdue
  const daysUntil = frequency - daysSince;

  let status;
  if (daysUntil < 0) {
    status = "overdue";           // past due
  } else if (daysUntil <= 2) {
    status = "soon";              // due within 2 days → yellow warning
  } else {
    status = "ok";                // plenty of time → green
  }

  return { daysSince, daysUntil, status };
}

// Props:
//   plant        — the plant object from the database
//   onWatered(updatedPlant) — called after a successful "mark as watered" API call
//   onDelete(id)            — called after a successful delete API call
export default function PlantCard({ plant, onWatered, onDelete }) {
  const [loading, setLoading] = useState(false);

  const { daysSince, daysUntil, status } = getWateringStatus(
    plant.last_watered,
    plant.frequency
  );

  const statusLabels = {
    ok: "All good",
    soon: "Due soon",
    overdue: "Overdue!",
  };

  async function handleWater() {
    setLoading(true);
    try {
      const res = await fetch(`/api/plants/${plant.id}/water`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to update.");
      const updated = await res.json();
      onWatered(updated); // tell App to replace this plant in its list
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Remove "${plant.name}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/plants/${plant.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete.");
      onDelete(plant.id); // tell App to remove this plant from its list
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  }

  return (
    <div className={`plant-card status-${status}`}>
      <div className="plant-name">{plant.name}</div>

      <div className="plant-meta">Every {plant.frequency} day{plant.frequency !== 1 ? "s" : ""}</div>

      <span className={`status-badge ${status}`}>{statusLabels[status]}</span>

      <div className="countdown">
        <span>
          <strong>{daysSince}</strong> day{daysSince !== 1 ? "s" : ""} since watered
        </span>
        <span>
          {daysUntil >= 0
            ? <><strong>{daysUntil}</strong> day{daysUntil !== 1 ? "s" : ""} left</>
            : <><strong>{Math.abs(daysUntil)}</strong> day{Math.abs(daysUntil) !== 1 ? "s" : ""} overdue</>
          }
        </span>
      </div>

      <div className="card-actions">
        <button className="btn-water" onClick={handleWater} disabled={loading}>
          {loading ? "Saving…" : "💧 Mark as Watered"}
        </button>
        <button className="btn-delete" onClick={handleDelete} disabled={loading}>
          ✕
        </button>
      </div>
    </div>
  );
}
