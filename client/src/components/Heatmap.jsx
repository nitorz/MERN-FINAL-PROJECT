import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { api } from "../api";

export default function Heatmap() {
  const [values, setValues] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/habits/calendar", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }});
        // r.data is [{date:'2025-11-19', count:3}, ...]
        const map = r.data.map(item => ({ date: item.date, count: item.count }));
        setValues(map);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div>
      <h4 className="font-semibold mb-2">Activity Heatmap</h4>
      <CalendarHeatmap
        startDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
        endDate={new Date()}
        values={values}
        classForValue={(val) => {
          if (!val) return "color-empty";
          if (val.count >= 5) return "color-github-4";
          if (val.count >= 3) return "color-github-3";
          if (val.count >= 1) return "color-github-2";
          return "color-github-1";
        }}
        showWeekdayLabels
      />
      <style>{`
        .color-empty { fill: #ebedf0; }
        .color-github-1 { fill: #c6e48b; }
        .color-github-2 { fill: #7bc96f; }
        .color-github-3 { fill: #239a3b; }
        .color-github-4 { fill: #196127; }
      `}</style>
    </div>
  );
}
