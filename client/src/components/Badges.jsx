import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Badges() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/achievements", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
        setAchievements(r.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold mb-3">Achievements</h3>
      {achievements.length === 0 ? <p className="text-gray-500">No achievements yet.</p> :
        <ul className="space-y-2">
          {achievements.map(a => (
            <li key={a._id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-sm text-gray-500">{a.description}</div>
              </div>
              <div className="text-sm text-gray-400">{new Date(a.unlockedAt).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}
