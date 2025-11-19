import React, { useEffect, useState } from "react";
import { api } from "../api";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  LineElement,
  PointElement
} from "chart.js";

import { Bar, Pie, Line, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  LineElement,
  PointElement
);

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

  // Totals
  const totalHabits = habits.length;
  const totalCompleted = habits.reduce(
    (sum, habit) => sum + habit.completedDates.length,
    0
  );

  // Completion percentage
  const completionRate =
    totalHabits === 0
      ? 0
      : Math.round((totalCompleted / (totalHabits * 30)) * 100); // assuming 30-day month

  // SDG category summary
  const categories = {};
  habits.forEach((h) => {
    if (!categories[h.category]) categories[h.category] = 0;
    categories[h.category] += h.completedDates.length;
  });

  // Weekly trend (last 7 days)
  const weekLabels = ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "Yesterday", "Today"];
  const weeklyData = Array(7).fill(0);

  habits.forEach((habit) => {
    habit.completedDates.forEach((date) => {
      const diff = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 7) {
        weeklyData[6 - diff]++; // reverse order
      }
    });
  });

  // Streak detection
  const today = new Date().toDateString();
  let streak = 0;
  let checking = true;

  for (let i = 0; i < 50; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toDateString();
    const completedToday = habits.some((h) =>
      h.completedDates.some((d) => new Date(d).toDateString() === date)
    );

    if (completedToday && checking) streak++;
    else checking = false;
  }

  // Radar Chart (SDG strengths)
  const radarData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "SDG Strength",
        data: Object.values(categories),
        backgroundColor: "rgba(34,197,94,0.2)",
        borderColor: "rgba(34,197,94,1)",
      },
    ],
  };

  // Weekly line chart
  const lineData = {
    labels: weekLabels,
    datasets: [
      {
        label: "Weekly Completions",
        data: weeklyData,
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.3)",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Habits</p>
          <p className="text-xl font-bold">{totalHabits}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Completed</p>
          <p className="text-xl font-bold">{totalCompleted}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Completion Rate</p>
          <p className="text-xl font-bold">{completionRate}%</p>
        </div>
      </div>

      {/* Streak */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="font-semibold mb-2">Current Streak</h3>
        <p className="text-xl font-bold">{streak} days 🔥</p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">Weekly Trend</h3>
          <Line data={lineData} />
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">SDG Strength Radar</h3>
          <Radar data={radarData} />
        </div>
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
