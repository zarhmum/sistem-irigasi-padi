import React from "react";

export default function PhaseCard({ method }) {
  const phases = ["Penyiangan", "Pertumbuhan", "Pembungaan"];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Fase Pertumbuhan</h2>
      <div className="grid grid-cols-3 gap-4">
        {phases.map((phase) => (
          <div
            key={phase}
            className="bg-green-200 p-4 rounded shadow text-center font-semibold"
          >
            {phase}
          </div>
        ))}
      </div>
    </div>
  );
}
