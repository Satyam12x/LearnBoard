import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaClock, FaCheckCircle, FaTasks, FaChartPie } from 'react-icons/fa'; // Icons from react-icons

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardStats = ({ tasks, timeSessions, searchTerm, setSearchTerm }) => {
  const totalTime = timeSessions.reduce((sum, s) => sum + s.duration, 0);
  const completionRate = tasks.length ? (tasks.filter(t => t.completed).length / tasks.length * 100).toFixed(1) : 0;

  const chartData = {
    labels: ['Work', 'Study', 'Personal'],
    datasets: [{
      data: [
        tasks.filter(t => t.category === 'Work').length, 
        tasks.filter(t => t.category === 'Study').length, 
        tasks.filter(t => t.category === 'Personal').length
      ],
      backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
    }],
  };

  // Animation variants for smooth staggered entrance
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
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const stats = [
    { icon: FaClock, label: 'Total Time Tracked', value: `${totalTime.toFixed(1)} min`, color: 'text-blue-600' },
    { icon: FaCheckCircle, label: 'Completion Rate', value: `${completionRate}%`, color: 'text-green-600' },
    { icon: FaTasks, label: 'Active Tasks', value: tasks.length, color: 'text-purple-600' },
  ];

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 
        className="text-xl font-bold text-gray-800 flex items-center gap-2"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <FaChartPie className="text-primary" />
        Stats Overview
      </motion.h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`p-4 bg-white rounded-lg shadow-md card-hover ${stat.color}`}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                transition: { duration: 0.2, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' } 
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <stat.icon className="text-2xl" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
                {/* Animated progress bar for completion */}
                {stat.label === 'Completion Rate' && (
                  <motion.div 
                    className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1.5, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    <div className="h-full bg-green-500" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Search Input with Animation */}
      <motion.input 
        placeholder="Filter categories..." 
        value={searchTerm} 
        onChange={e => setSearchTerm(e.target.value)} 
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out"
        variants={itemVariants}
        whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)' }}
      />

      {/* Animated Pie Chart */}
      <motion.div 
        className="chart-container h-40 flex justify-center items-center bg-white rounded-lg shadow-md card-hover"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <Pie 
          data={chartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom' },
            },
            animation: {
              animateRotate: true,
              duration: 2000,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }} 
        />
      </motion.div>
    </motion.div>
  );
};

export default DashboardStats;