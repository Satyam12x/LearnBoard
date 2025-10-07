import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardStats = ({ tasks, timeSessions, searchTerm, setSearchTerm }) => {
  const totalTime = timeSessions.reduce((sum, s) => sum + s.duration, 0);
  const completionRate = tasks.length
    ? ((tasks.filter((t) => t.completed).length / tasks.length) * 100).toFixed(
        1
      )
    : 0;

  const chartData = {
    labels: ["Work", "Study", "Personal"],
    datasets: [
      {
        data: [
          tasks.filter((t) => t.category === "Work").length,
          tasks.filter((t) => t.category === "Study").length,
          tasks.filter((t) => t.category === "Personal").length,
        ],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
      },
    ],
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Stats</h3>
      <div className="space-y-2 text-sm">
        <p>Total Time Tracked: {totalTime.toFixed(1)} min</p>
        <p>Completion Rate: {completionRate}%</p>
        <p>Active Tasks: {tasks.length}</p>
      </div>
      <input
        placeholder="Filter categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <div className="h-32 flex justify-center">
        <Pie
          data={chartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
};

export default DashboardStats;
