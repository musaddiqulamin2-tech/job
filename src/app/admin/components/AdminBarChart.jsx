"use client";

import { useEffect, useState } from "react";

export default function AdminBarChart({ data }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="admin-chart">
      {data.map((item, i) => (
        <div className="admin-chart-col" key={i}>
          <div className="admin-chart-track">
            <div
              className="admin-chart-bar"
              style={{
                height: animated ? `${Math.max((item.value / max) * 100, 4)}%` : "0%",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <span className="admin-chart-value">{item.value}</span>
            </div>
          </div>
          <span className="admin-chart-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}