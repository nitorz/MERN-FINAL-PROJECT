import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token); // save token
      alert("Logged in successfully");
      navigate("/dashboard"); // redirect after login
    } catch (e) {
      alert("Login failed");
      console.error(e);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow"
    >
      <h2 className="text-xl mb-4 font-bold text-center">Login</h2>
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
        Login
      </button>
    </form>
  );
}
