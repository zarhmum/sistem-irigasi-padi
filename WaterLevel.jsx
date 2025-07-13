import React from "react";

export default function WaterLevel({ method }) {
  // Contoh data statis, nanti bisa diganti real-time
  const level = method === "SRI" ? 2 : 4;

  return (
    <div className="bg-blue-100 p-4 rounded mb-6">
      <h2 className="text-xl font-semibold mb-2">Tinggi Air Saat Ini</h2>
      <p className="text-4xl font-bold">{level} cm</p>
    </div>
  );
}
