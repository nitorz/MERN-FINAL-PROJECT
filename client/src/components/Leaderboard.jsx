import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Leaderboard() {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/leaderboard");
        setList(r.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold mb-3">Leaderboard</h3>
      <ol className="list-decimal pl-5 space-y-2">
        {list.map((l, idx) => (
          <li key={l.userId} className="flex justify-between">
            <span>{l.name}</span>
            <span className="font-semibold">{l.totalCompleted}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
