"use client";
import { useEffect, useState } from "react";

export default function IncidentList() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/incidents?resolved=false")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  const handleResolve = async (id: number) => {
    setResolving(id);
    setIncidents((prev) => prev.filter((i) => i.id !== id)); // optimistic
    await fetch(`/api/incidents?id=${id}`, { method: "PATCH" });
    setResolving(null);
  };

  if (loading) return <div>Loading...</div>;
  if (incidents.length === 0) return <div className="text-gray-500">No unresolved incidents.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold text-lg mb-4">Incidents</h2>
      <div className="space-y-4">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={`flex items-center gap-3 p-2 rounded transition-opacity ${resolving === incident.id ? "opacity-50" : ""}`}
          >
            <img
              src={incident.thumbnailUrl}
              alt={incident.type}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${getTypeColor(incident.type)}`}></span>
                <span className="font-medium">{incident.type}</span>
              </div>
              <div className="text-xs text-gray-500">
                {incident.cameraLocation} | {formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)}
              </div>
            </div>
            <button
              className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => handleResolve(incident.id)}
              disabled={resolving === incident.id}
            >
              Resolve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTypeColor(type: string) {
  switch (type) {
    case "Gun Threat":
      return "bg-red-600";
    case "Unauthorised Access":
      return "bg-yellow-500";
    case "Face Recognised":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
}

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
} 