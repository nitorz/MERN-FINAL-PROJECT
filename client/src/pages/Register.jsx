import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", { name, email, password });
      // If your backend returns a token, save it
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      alert("Registered successfully");
      navigate("/dashboard"); // redirect to dashboard after registering
    } catch (e) {
      alert("Register failed");
      console.error(e);
    }
  };

  return (
    <form className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow" onSubmit={submit}>
      <h2 className="text-xl mb-4 font-bold text-center">Register</h2>
      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-4 rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition">
        Register
      </button>
    </form>
  );
}
