import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { GiPlantSeed, GiGrass, GiWheat } from "react-icons/gi";
import { FaPowerOff } from "react-icons/fa";
import DashboardLayout from "./DashboardLayout";
//import IrigasiLog from "./IrigasiLog";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = ({ onLogout }) => {
  const [method, setMethod] = useState("SRI");
  const [waterLevel, setWaterLevel] = useState(2.5);
  const [pumpOn, setPumpOn] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [log, setLog] = useState([]);
  const [schedule, setSchedule] = useState({ start: "", end: "" });
  const [currentPhase, setCurrentPhase] = useState("Pertumbuhan");
  const [summary, setSummary] = useState({ total: 0, sri: 0, pbk: 0 });
  const [filterDate, setFilterDate] = useState("");

  const phases = {
    SRI: [
      { title: "Fase Pertumbuhan", desc: "8–15 hari. Air stabil 1–3 cm.", icon: <GiPlantSeed size={24} /> },
      { title: "Fase Penyiangan", desc: "Dilakukan 2–3 kali, metode kering-basah.", icon: <GiGrass size={24} /> },
      { title: "Fase Pembungaan", desc: "Air stabil 3 cm.", icon: <GiWheat size={24} /> },
    ],
    PBK: [
      { title: "Fase Pertumbuhan", desc: "8–15 hari. Air stabil 1–5 cm.", icon: <GiPlantSeed size={24} /> },
      { title: "Fase Penyiangan", desc: "Air 3–4 cm, dikeringkan jika perlu.", icon: <GiGrass size={24} /> },
      { title: "Fase Pembungaan", desc: "Air stabil 5 cm.", icon: <GiWheat size={24} /> },
    ],
  };

  useEffect(() => {
    const getSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/irigasi/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch {
        console.error("❌ Gagal ambil ringkasan");
      }
    };
    getSummary();
  }, []);

 useEffect(() => {
  let interval;

  if (pumpOn) {
    interval = setInterval(async () => {
      const simulated = parseFloat((Math.random() * (method === "SRI" ? 3 : 5)).toFixed(1));
      const now = new Date();

      setWaterLevel(simulated);
      setChartData((prev) => [
        ...prev.slice(-19), // maksimal 20 data biar ringan
        {
          waterLevel: simulated,
          pumpStatus: true,
        },
      ]);

      setLog((prev) => [
        ...prev.slice(-9),
        {
          time: now,
          waterLevel: simulated,
          pumpStatus: true,
          method,
          phase: currentPhase,
        },
      ]);

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/api/irigasi/log",
          {
            waterLevel: simulated,
            pumpStatus: true,
            method,
            phase: currentPhase,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.error("❌ Gagal simpan log ke backend:", err.message);
      }
    }, 2000);
  }

  return () => clearInterval(interval);
}, [pumpOn, method, currentPhase]);


            const togglePump = () => setPumpOn((prev) => !prev);

            const chart = {
            labels: chartData.map((_, i) => `${i + 1}s`),
            datasets: [
              {
                label: "Tinggi Air (cm)",
                data: chartData.map((d) => d.waterLevel),
                borderColor: "skyblue",
                backgroundColor: "rgba(135,206,250,0.2)",
                tension: 0.4,
                fill: true,
                yAxisID: "y",
              },
            ],
          };

          const options = {
            responsive: true,
            interaction: {
              mode: "index",
              intersect: false,
            },
            scales: {
              y: {
                type: "linear",
                position: "left",
                title: {
                  display: true,
                  text: "Tinggi Air (cm)",
                },
                beginAtZero: true,
                max: 6,
              },
            },
          };


  const isWaterOutOfRange =
    (method === "SRI" && (waterLevel < 1 || waterLevel > 3)) ||
    (method === "PBK" && (waterLevel < 1 || waterLevel > 5));

  const isScheduleActive = (() => {
    if (!schedule.start || !schedule.end) return false;
    const now = new Date();
    const [startH, startM] = schedule.start.split(":").map(Number);
    const [endH, endM] = schedule.end.split(":").map(Number);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;
    return nowMinutes >= start && nowMinutes <= end;
  })();

  return (
    <DashboardLayout onLogout={onLogout}>
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow space-y-6">
        
        {/* Ringkasan */}
        <div id="dashboard" className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 text-green-800">📊 Ringkasan Irigasi</h2>
          <div className="flex gap-6 text-sm text-gray-700">
            <div>Total Log: <strong>{summary.total}</strong></div>
            <div>SRI: <strong>{summary.sri}</strong></div>
            <div>PBK: <strong>{summary.pbk}</strong></div>
          </div>
        </div>

        {/* Monitoring */}
        <div id="monitoring" className="bg-green-50 border border-green-200 p-4 rounded shadow space-y-3">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Metode</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="border px-3 py-1 rounded w-40"
                    >
                      <option value="SRI">SRI (1–3 cm)</option>
                      <option value="PBK">PBK (1–5 cm)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fase</label>
                    <select
                      value={currentPhase}
                      onChange={(e) => setCurrentPhase(e.target.value)}
                      className="border px-3 py-1 rounded w-40"
                    >
                      <option value="Pertumbuhan">Pertumbuhan</option>
                      <option value="Penyiangan">Penyiangan</option>
                      <option value="Pembungaan">Pembungaan</option>
                    </select>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <button
                      onClick={togglePump}
                      className={`px-6 py-2 rounded-md flex items-center text-sm font-semibold text-white shadow ${
                        pumpOn ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      <FaPowerOff className="mr-2" />
                      {pumpOn ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>

                {/* Penjelasan Fase */}
                <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                  <strong>Penjelasan Fase:</strong>{" "}
                  {
                    phases[method].find((p) =>
                      p.title.toLowerCase().includes(currentPhase.toLowerCase())
                    )?.desc || "-"
                  }
                </div>

                {/* Notifikasi batas air */}
                {isWaterOutOfRange && (
                  <div className="bg-red-100 border-l-4 border-red-500 p-4 text-red-800 rounded">
                    ⚠️ Ketinggian air {waterLevel} cm melebihi batas metode {method}.
                  </div>
                )}

                {/* Info Tinggi Air */}
                <h2 className="text-lg font-semibold text-green-900">
                  Tinggi Air Saat Ini: {waterLevel} cm
                </h2>
              </div>

        {/* Grafik */}
        <div id="grafik" className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 text-green-800">📈 Grafik Ketinggian Air</h2>
          <div className="h-[300px]"><Line data={chart} options={options} /></div>
        </div>

        {/* Filter Tanggal */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 text-green-800">📅 Filter Log per Tanggal</h2>
          <div className="flex gap-4 items-center">
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border px-3 py-1 rounded" />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const res = await axios.get(
                    `http://localhost:5000/api/irigasi/logs/date?date=${filterDate}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  setLog(res.data);
                } catch (err) {
                  alert("Gagal ambil data log berdasarkan tanggal");
                }
              }}
            >Tampilkan</button>
          </div>
        </div>

        {/* Riwayat */}
        <div className="bg-white p-4 rounded shadow overflow-auto max-h-64">
          <h2 className="text-lg font-semibold mb-2 text-green-800">📄 Riwayat Irigasi</h2>
          <table className="w-full text-sm border min-w-[600px]">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="px-3 py-1 border">Waktu</th>
                <th className="px-3 py-1 border">Tinggi Air</th>
                <th className="px-3 py-1 border">Pompa</th>
                <th className="px-3 py-1 border">Metode</th>
                <th className="px-3 py-1 border">Fase</th>
              </tr>
            </thead>
            <tbody>
              {log.map((entry, i) => (
                <tr key={i} className="border-t hover:bg-green-50">
                  <td className="px-3 py-1 border">
                    {new Date(entry.time).toLocaleDateString("id-ID").replace(/\//g, "-") + ": " +
                     new Date(entry.time).toLocaleTimeString("id-ID", { hour12: false }).replace(/:/g, ".")}
                  </td>
                  <td className="px-3 py-1 border">{entry.waterLevel} cm</td>
                  <td className="px-3 py-1 border">{entry.pumpStatus ? "ON" : "OFF"}</td>
                  <td className="px-3 py-1 border">{entry.method}</td>
                  <td className="px-3 py-1 border">{entry.phase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Jadwal */}
        <div id="jadwal" className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 text-green-800">🕒 Penjadwalan Pompa</h2>
          <div className="flex gap-4 items-end flex-wrap">
            <input type="time" value={schedule.start} onChange={(e) => setSchedule({ ...schedule, start: e.target.value })} className="border px-3 py-1 rounded" />
            <input type="time" value={schedule.end} onChange={(e) => setSchedule({ ...schedule, end: e.target.value })} className="border px-3 py-1 rounded" />
            <button className="bg-green-600 text-white px-4 py-2 rounded">Simpan Jadwal</button>
          </div>
          {isScheduleActive && (
            <p className="mt-2 text-sm text-green-700 font-medium">
              ⏱️ Jadwal aktif sekarang. Pompa menyala otomatis.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
