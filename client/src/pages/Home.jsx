import React, { useEffect, useState } from 'react';
import { api } from '../api';
import HabitForm from '../components/HabitForm';
import HabitList from '../components/HabitList';

export default function Home(){
  const [habits, setHabits] = useState([]);
  useEffect(()=>{ api.get('/habits').then(r=>setHabits(r.data)).catch(()=>{}) }, []);
  const add = (h)=> setHabits([h, ...habits]);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Add a sustainable habit</h2>
      <HabitForm onAdd={add} />
      <HabitList habits={habits} />
    </div>
  );
}
