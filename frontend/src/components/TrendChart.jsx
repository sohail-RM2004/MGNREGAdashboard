import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Expects data = [{ month: "01", _avg: { avgWageRatePerDayPerPerson: 200, avgDaysOfEmploymentPerHH: 30 } }, ...]
 * We'll flatten for charting
 */
export default function TrendChart({ data=[] }) {
  const chartData = data.map(d => ({
    month: d.month,
    wage: d._avg?.avgWageRatePerDayPerPerson || 0,
    days: d._avg?.avgDaysOfEmploymentPerHH || 0
  }));

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="wage" name="Avg Wage" />
          <Line type="monotone" dataKey="days" name="Avg Days" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
