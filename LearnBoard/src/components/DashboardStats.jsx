import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaTasks, FaCheckCircle, FaChartPie, FaSearch } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const DashboardStats = ({ tasks = [], searchTerm, setSearchTerm }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks
    ? ((completedTasks / totalTasks) * 100).toFixed(1)
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

  const stats = [
    {
      icon: FaTasks,
      label: "Active Tasks",
      value: totalTasks,
      color: "text-purple-600",
    },
    {
      icon: FaCheckCircle,
      label: "Completion Rate",
      value: `${completionRate}%`,
      color: "text-green-600",
    },
  ];

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3
        className="text-lg font-bold text-gray-800 flex items-center gap-2"
        variants={itemVariants}
      >
        <FaChartPie className="text-primary" />
        Stats Overview
      </motion.h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-2">
        <AnimatePresence>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`p-3 bg-white rounded shadow-sm card-hover ${stat.color} text-xs`}
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1, ease: [0.42, 0, 0.58, 1] }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <stat.icon className="text-lg" />
                  <div>
                    <p className="font-medium text-gray-600">{stat.label}</p>
                    <p className="font-bold">{stat.value}</p>
                  </div>
                </div>
                {/* Animated progress bar for completion */}
                {stat.label === "Completion Rate" && (
                  <motion.div
                    className="w-16 h-1.5 bg-gray-200 rounded overflow-hidden progress-container"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1.5, ease: [0.42, 0, 0.58, 1] }}
                  >
                    <div className="h-full bg-green-500" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Search Input */}
      <motion.div variants={itemVariants} className="relative">
        <motion.input
          placeholder="Filter categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-xs"
          whileFocus={{ opacity: 0.8 }}
        />
        <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        className="h-28 flex justify-center items-center bg-white rounded shadow-sm card-hover"
        variants={itemVariants}
      >
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom", labels: { font: { size: 10 } } },
            },
            animation: {
              animateRotate: true,
              duration: 1500,
              easing: "easeOut",
            },
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default DashboardStats;
