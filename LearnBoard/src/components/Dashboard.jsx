import React from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaStar, FaTasks, FaBook, FaChartPie, FaClock } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ tasks = [], notes = [], timetable = { slots: {} } }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks
    ? ((completedTasks / totalTasks) * 100).toFixed(1)
    : 0;
  const performanceStars = Math.round(completionRate / 20); // 0-5 stars
  const totalSlots = Object.keys(timetable.slots).length;
  const adherenceScore = totalSlots
    ? ((completedTasks / totalSlots) * 100).toFixed(1)
    : 0;

  const chartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completedTasks, totalTasks - completedTasks],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  return (
    <motion.div
      className="space-y-3 text-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="font-bold flex items-center gap-1">
        <FaChartPie /> Performance
      </h3>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`text-lg ${
              i < performanceStars ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span>{completionRate}%</span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="p-2 bg-white rounded shadow-sm">
          <FaTasks className="inline mr-1" /> Tasks: {totalTasks}
        </div>
        <div className="p-2 bg-white rounded shadow-sm">
          <FaBook className="inline mr-1" /> Notes: {notes.length}
        </div>
        <div className="p-2 bg-white rounded shadow-sm">
          <FaClock className="inline mr-1" /> Adherence: {adherenceScore}%
        </div>
      </div>
      <div className="h-20 flex justify-center bg-white rounded shadow-sm">
        <Pie
          data={chartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </motion.div>
  );
};

export default Dashboard;
