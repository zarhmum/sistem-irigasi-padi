import React, { useEffect, useState } from "react";
import axios from "axios";

const IrigasiLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/irigasi/logs");
        setLogs(res.data);
      } catch (error) {
        console.error("Gagal ambil data log:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="overflow-x-auto mt-4">
      <h2 className="text-xl font-semibold mb-2">📋 Log Irigasi</h2>
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-green-100">
          <tr>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Waktu</th>
            <th className="border p-2">Ketinggian Air</th>
            <th className="border p-2">Pompa Isi</th>
            <th className="border p-2">Pompa Buang</th>
            <th className="border p-2">Metode</th>
            <th className="border p-2">Fase</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{log.tanggal}</td>
              <td className="border p-2">{log.waktu}</td>
              <td className="border p-2">{log.ketinggian_air}</td>
              <td className="border p-2">{log.pompa_isi}</td>
              <td className="border p-2">{log.pompa_buang}</td>
              <td className="border p-2">{log.metode}</td>
              <td className="border p-2">{log.fase || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IrigasiLog;
