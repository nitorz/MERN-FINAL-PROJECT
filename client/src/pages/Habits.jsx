import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const token = localStorage.getItem("token"); // JWT token

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
      console.log(err);
    }
  };

  const markComplete = async (id) => {
    try {
      await api.patch(
        `/habits/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchHabits();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-green-600">My SDG Habits</h2>

      {/* Add Habit Form */}
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Habit Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border rounded p-2 flex-1"
          placeholder="SDG Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          onClick={addHabit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Habit
        </button>
      </div>

      {/* Habit List */}
      <ul className="space-y-3">
        {habits.map((h) => (
          <li
            key={h._id}
            className="flex justify-between items-center border rounded p-3 bg-white shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold text-gray-800">{h.title}</p>
              <p className="text-sm text-gray-500">Category: {h.category}</p>
              <p className="text-sm text-gray-500">
                Completed: {h.completedDates.length} times
              </p>
            </div>
            <button
              onClick={() => markComplete(h._id)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
            >
              Complete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
