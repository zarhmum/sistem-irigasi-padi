import React, { useState } from "react";


export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        onLogin(username);
      } else {
        alert(data.message || "Login gagal");
      }
    } catch (err) {
      alert("Tidak bisa terhubung ke server");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/padi 5.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-4 py-2 mb-4 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 mb-4 rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
