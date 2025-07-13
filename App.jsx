import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);

  // Debug log setiap kali user berubah
  useEffect(() => {
    console.log("User login:", user);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <Dashboard onLogout={() => setUser(null)} />
      ) : (
        <Login onLogin={(username) => setUser(username)} />
      )}
    </div>
  );
}
