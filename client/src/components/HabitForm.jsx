import React, { useState } from 'react';
import { api } from '../api';
export default function HabitForm({ onAdd }){
  const [title,setTitle]=useState('');
  const submit = async (e)=>{ e.preventDefault(); try{ const token = localStorage.getItem('token'); const res = await api.post('/habits', { title }, { headers: { Authorization: `Bearer ${token}` } }); onAdd(res.data); setTitle(''); }catch(e){ alert('Add failed (try logging in)') } };
  return (
    <form onSubmit={submit} className="flex gap-2 mb-4">
      <input className="border p-2 flex-1" placeholder="Enter sustainable habit..." value={title} onChange={e=>setTitle(e.target.value)} />
      <button className="bg-green-600 text-white px-4">Add</button>
    </form>
  )
}
