import React, { useState, useEffect } from "react";
import { FaBars, FaPowerOff } from "react-icons/fa";

export default function DashboardLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  // 🔁 Observe section yang terlihat untuk highlight sidebar aktif
  useEffect(() => {
    const sections = ["dashboard", "monitoring", "jadwal", "grafik"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 📍 Fungsi scroll ke bagian tertentu
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-green-800 text-white w-64 p-4 space-y-4 transition-all duration-300 ${
          sidebarOpen ? "block" : "hidden sm:block"
        }`}
      >
        <div className="text-2xl font-bold text-center border-b pb-4">
          🌾 Irigasi Padi
        </div>

        <div className="space-y-2 text-sm">
          <button
            onClick={() => scrollToSection("dashboard")}
            className={`w-full text-left hover:underline ${
              activeSection === "dashboard" ? "text-yellow-300 font-bold" : ""
            }`}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => scrollToSection("monitoring")}
            className={`w-full text-left hover:underline ${
              activeSection === "monitoring" ? "text-yellow-300 font-bold" : ""
            }`}
          >
            💧 Monitoring
          </button>

          <button
            onClick={() => scrollToSection("jadwal")}
            className={`w-full text-left hover:underline ${
              activeSection === "jadwal" ? "text-yellow-300 font-bold" : ""
            }`}
          >
            📅 Jadwal
          </button>

          <button
            onClick={() => scrollToSection("grafik")}
            className={`w-full text-left hover:underline ${
              activeSection === "grafik" ? "text-yellow-300 font-bold" : ""
            }`}
          >
            📈 Grafik
          </button>
        </div>

        {/* Tombol Logout */}
        <button
          onClick={onLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <FaPowerOff />
          Logout
        </button>
      </div>

      {/* Konten utama */}
      <div className="flex-1">
        {/* Top bar */}
        <div className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-green-700 sm:hidden text-xl"
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-semibold text-green-700">
            Dashboard Irigasi
          </h1>
        </div>

        {/* Isi konten dari Dashboard.jsx */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
