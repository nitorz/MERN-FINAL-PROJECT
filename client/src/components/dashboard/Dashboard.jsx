import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard(){
  const [habits, setHabits] = useState([]);
  useEffect(()=>{ api.get('/habits').then(r=>setHabits(r.data)).catch(()=>{}); }, []);

  // aggregate weekly and monthly
  const now = new Date();
  const format = d=>d.toISOString().slice(0,10);
  const last30 = Array.from({length:30}).map((_,i)=>{ const d = new Date(); d.setDate(now.getDate() - (29-i)); return format(d); });
  const counts = Object.fromEntries(last30.map(d=>[d,0]));
  const categoryCounts = {};
  habits.forEach(h=>{
    const day = format(new Date(h.date));
    if (day in counts) counts[day]++;
    categoryCounts[h.category] = (categoryCounts[h.category]||0)+1;
  });
  const lineData = Object.keys(counts).map(k=>({ date: k, count: counts[k] }));
  const barData = Object.keys(categoryCounts).map(k=>({ category: k, count: categoryCounts[k]}));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-4">Analytics</h2>
      <div style={{width:'100%', height:300}}>
        <ResponsiveContainer>
          <LineChart data={lineData}>
            <CartesianGrid />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{width:'100%', height:200}} className="mt-4">
        <ResponsiveContainer>
          <BarChart data={barData}>
            <CartesianGrid />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
