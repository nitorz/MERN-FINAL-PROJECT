import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // mobile menu toggle

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="font-bold text-lg">SDG Tracker</h1>

        {/* Hamburger button for mobile */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <nav
          className={`flex flex-col md:flex-row gap-3 md:gap-4 md:items-center ${
            open ? "block" : "hidden md:flex"
          }`}
        >
          <Link to="/" className="hover:underline">Home</Link>
          {!token && <Link to="/login" className="hover:underline">Login</Link>}
          {!token && <Link to="/register" className="hover:underline">Register</Link>}
          {token && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
          {token && <Link to="/habits" className="hover:underline">My Habits</Link>}
          {token && (
            <button
              onClick={handleLogout}
              className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-200 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
