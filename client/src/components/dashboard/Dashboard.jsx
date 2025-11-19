import Heatmap from "../components/Heatmap";
import Badges from "../components/Badges";
import Leaderboard from "../components/Leaderboard";
import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import socket from '../../socket';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard(){
  const [habits, setHabits] = useState([]);

  const fetchHabits = async () => {
    try {
      const res = await api.get('/habits');
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchHabits();

    // Connect socket
    socket.connect();

    // Listen for habit events
    socket.on("habit:created", (payload) => {
      console.log("Habit created", payload);
      fetchHabits(); // refresh data
    });

    socket.on("habit:completed", (payload) => {
      console.log("Habit completed", payload);
      fetchHabits(); // refresh data
    });

    socket.on("achievement:unlocked", (payload) => {
      console.log("Achievement unlocked", payload);
      // optional: show toast / update UI
    });

    return () => {
      socket.off("habit:created");
      socket.off("habit:completed");
      socket.off("achievement:unlocked");
      socket.disconnect();
    };
  }, []);

  // --- Chart preparation ---
  const now = new Date();
  const format = d => d.toISOString().slice(0,10);
  const last30 = Array.from({length:30}).map((_,i)=>{
    const d = new Date();
    d.setDate(now.getDate() - (29-i));
    return format(d);
  });

  const dailyCounts = Object.fromEntries(last30.map(d=>[d,0]));
  const categoryCounts = {};

  habits.forEach(habit => {
    habit.completedDates.forEach(cd => {
      const day = format(new Date(cd));
      if(day in dailyCounts) dailyCounts[day]++;
    });
    categoryCounts[habit.category] = (categoryCounts[habit.category] || 0) + habit.completedDates.length;
  });

  const lineData = Object.keys(dailyCounts).map(k=>({ date: k, count: dailyCounts[k] }));
  const barData = Object.keys(categoryCounts).map(k=>({ category: k, count: categoryCounts[k] }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-4">Analytics</h2>

      <div style={{width:'100%', height:300}}>
        <ResponsiveContainer>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{width:'100%', height:200}} className="mt-4">
        <ResponsiveContainer>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
}
