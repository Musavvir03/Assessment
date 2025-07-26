"use client";
import { useEffect, useState } from "react";

export default function IncidentPlayer() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("/api/incidents?resolved=false")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setSelected(data[0] || null);
      });
  }, []);

  if (!selected) return <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">No incident selected.</div>;

  // Show the main incident and two others as thumbnails
  const others = incidents.filter((i) => i.id !== selected.id).slice(0, 2);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center mb-4 overflow-hidden rounded">
        <img
          src={selected.thumbnailUrl}
          alt={selected.type}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex gap-2">
        {others.map((incident) => (
          <img
            key={incident.id}
            src={incident.thumbnailUrl}
            alt={incident.type}
            className="w-20 h-12 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500"
            onClick={() => setSelected(incident)}
          />
        ))}
      </div>
    </div>
  );
} 