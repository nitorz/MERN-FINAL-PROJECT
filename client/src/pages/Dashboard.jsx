import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const token = localStorage.getItem("token");

  const fetchHabits = async () => {
    try {
      const res = await api.get("/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  // Compute basic stats
  const totalHabits = habits.length;
  const totalCompleted = habits.reduce(
    (sum, habit) => sum + habit.completedDates.length,
    0
  );

  // Group habits by SDG category
  const categories = {};
  habits.forEach((h) => {
    if (!categories[h.category]) categories[h.category] = 0;
    categories[h.category] += h.completedDates.length;
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Habits</p>
          <p className="text-xl font-bold">{totalHabits}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Completed</p>
          <p className="text-xl font-bold">{totalCompleted}</p>
        </div>
      </div>

      {/* SDG Category Summary */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="font-semibold mb-2">Habits by SDG Category</h3>
        {Object.keys(categories).length === 0 ? (
          <p className="text-gray-500">No habits added yet.</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(categories).map(([cat, count]) => (
              <li key={cat} className="flex justify-between">
                <span>{cat}</span>
                <span className="font-semibold">{count} completed</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Habit List */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold mb-2">Recent Habits</h3>
        <ul className="space-y-2">
          {habits.slice(-5).map((h) => (
            <li key={h._id} className="flex justify-between">
              <span>{h.title}</span>
              <span className="text-gray-500">
                Completed {h.completedDates.length} times
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
