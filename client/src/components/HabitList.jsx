import React from 'react';
export default function HabitList({ habits }){
  return (
    <ul className="space-y-2">
      {habits.map(h=>(
        <li key={h._id} className="p-3 bg-white rounded shadow-sm">
          <div className="font-medium">{h.title}</div>
          <div className="text-sm text-gray-500">{new Date(h.date).toLocaleString()}</div>
        </li>
      ))}
    </ul>
  );
}
