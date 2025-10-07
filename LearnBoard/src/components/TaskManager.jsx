import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  FaPlus,
  FaChartPie,
  FaCheck,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: [0.42, 0, 0.58, 1] } },
};

const TaskManager = ({ tasks, updateData }) => {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Work");

  const addTask = () => {
    if (title && due) {
      const newTask = {
        id: Date.now(),
        title,
        due,
        completed: false,
        priority,
        category,
      };
      updateData({ tasks: [...tasks, newTask] });
      if (typeof chrome !== "undefined") {
        chrome.alarms.create(`deadline-${newTask.id}`, {
          when: new Date(due).getTime() - 24 * 60 * 60 * 1000,
        });
      }
      setTitle("");
      setDue("");
    }
  };

  const toggleTask = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    updateData({ tasks: updated });
  };

  const chartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [
          tasks.filter((t) => t.completed).length,
          tasks.length - tasks.filter((t) => t.completed).length,
        ],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const priorityColors = {
    high: "border-red-500",
    medium: "border-orange-500",
    low: "border-yellow-500",
  };
  const priorityIcons = {
    high: FaExclamationTriangle,
    medium: FaClock,
    low: FaCheck,
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-2 gap-2">
        <motion.input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
          variants={itemVariants}
          whileFocus={{ scale: 1.02 }}
        />
        <motion.input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
          variants={itemVariants}
          whileFocus={{ scale: 1.02 }}
        />
        <motion.select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
          variants={itemVariants}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </motion.select>
        <motion.select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
          variants={itemVariants}
        >
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Personal">Personal</option>
        </motion.select>
      </div>
      <motion.button
        onClick={addTask}
        className="w-full p-2 bg-primary text-white rounded-md card-hover"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaPlus className="inline mr-2" /> Add Task
      </motion.button>
      <AnimatePresence>
        <motion.ul className="space-y-2" initial="hidden" animate="visible">
          {tasks
            .sort((a, b) => new Date(a.due) - new Date(b.due))
            .map((t, index) => {
              const PriorityIcon = priorityIcons[t.priority];
              return (
                <motion.li
                  key={t.id}
                  className={`flex justify-between items-center p-3 bg-white rounded-md border-l-4 ${
                    priorityColors[t.priority] || "border-gray-300"
                  } card-hover`}
                  variants={itemVariants}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, ease: [0.42, 0, 0.58, 1] }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2">
                    {PriorityIcon && <PriorityIcon className="text-sm" />}
                    <span className="text-sm">
                      {t.title} - {t.category} - Due: {t.due}
                    </span>
                  </div>
                  <motion.input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t.id)}
                    className="ml-2"
                    whileTap={{ scale: 0.8 }}
                  />
                </motion.li>
              );
            })}
        </motion.ul>
      </AnimatePresence>
      <motion.div
        className="h-32 flex justify-center card-hover"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1500, easing: "easeOut" },
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default TaskManager;
