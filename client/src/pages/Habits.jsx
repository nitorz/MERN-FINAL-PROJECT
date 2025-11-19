import React, { useEffect, useState } from "react";
import { api } from "../api";
import socket from "../socket";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const token = localStorage.getItem("token");

  // Predefined habit titles for dropdown
  const habitTitles = [
    "Exercise",
    "Meditation",
    "Reading",
    "Plant Trees",
    "Recycle",
    "Volunteer",
    "Healthy Eating",
    "Water Conservation",
  ];

  // Predefined SDG categories
  const categories = ["Health", "Education", "Environment"];

  const categoryColors = {
    Health: "bg-red-200 text-red-800",
    Education: "bg-blue-200 text-blue-800",
    Environment: "bg-green-200 text-green-800",
    Default: "bg-gray-200 text-gray-800",
  };

  const fetchHabits = async () => {
    try {
      const res = await api.get("/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addHabit = async () => {
    if (!title || !category) return;
    try {
      await api.post(
        "/habits",
        { title, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setCategory("");
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const markComplete = async (id) => {
    try {
      await api.patch(
        `/habits/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowConfetti(true);
      fetchHabits();
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const removeHabit = async (id) => {
    try {
      await api.delete(`/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    socket.connect();
    socket.on("habit:created", fetchHabits);
    socket.on("habit:completed", fetchHabits);

    fetchHabits();
    return () => {
      socket.off("habit:created", fetchHabits);
      socket.off("habit:completed", fetchHabits);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <h2 className="text-3xl font-bold text-green-600 mb-6">My SDG Habits</h2>

      {/* Add Habit Form */}
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        {/* Habit Title Dropdown */}
        <select
          className="border rounded p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        >
          <option value="">Select Habit</option>
          {habitTitles.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        {/* SDG Category Dropdown */}
        <select
          className="border rounded p-2 flex-1"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Add Habit Button */}
        <button
          onClick={addHabit}
          disabled={!title || !category}
          className={`px-4 py-2 rounded text-white transition ${
            title && category
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Add Habit
        </button>
      </div>

      {/* Habit List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {habits.map((h) => (
            <motion.div
              key={h._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white shadow-md rounded-lg p-4 transition-shadow hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{h.title}</h3>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    categoryColors[h.category] || categoryColors.Default
                  }`}
                >
                  {h.category}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-2">
                Completed {h.completedDates.length} times
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (h.completedDates.length / 10) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <button
                onClick={() => markComplete(h._id)}
                className="mt-2 w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Complete
              </button>
              <button
                onClick={() => removeHabit(h._id)}
                className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
