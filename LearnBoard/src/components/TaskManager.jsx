import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaCheck,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: [0.42, 0, 0.58, 1] } },
};

const TaskManager = ({ tasks = [], updateData }) => {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("medium");

  const addTask = () => {
    if (title && due) {
      const newTask = {
        id: Date.now(),
        title,
        due,
        completed: false,
        priority,
      };
      updateData({ tasks: [...tasks, newTask] });
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

  const removeTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    updateData({ tasks: updated });
  };

  const priorityColors = {
    high: "border-red-500",
    medium: "border-orange-500",
    low: "border-green-500",
  };
  const priorityIcons = {
    high: FaExclamationTriangle,
    medium: FaClock,
    low: FaCheck,
  };

  return (
    <motion.div
      className="space-y-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-2 gap-1 text-xs">
        <motion.input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-1 border border-gray-300 rounded text-xs"
          variants={itemVariants}
        />
        <motion.input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className="p-1 border border-gray-300 rounded text-xs"
          variants={itemVariants}
        />
        <motion.select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-1 border border-gray-300 rounded text-xs"
          variants={itemVariants}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </motion.select>
      </div>
      <motion.button
        onClick={addTask}
        className="w-full p-1 bg-primary text-white rounded card-hover text-xs"
        variants={itemVariants}
        whileTap={{ scale: 0.98 }}
      >
        <FaPlus className="inline mr-0.5" /> Add
      </motion.button>
      <motion.ul
        className="space-y-1 max-h-40 overflow-y-auto"
        initial="hidden"
        animate="visible"
      >
        {tasks
          .sort((a, b) => new Date(a.due) - new Date(b.due))
          .map((t, index) => {
            const PriorityIcon = priorityIcons[t.priority];
            return (
              <motion.li
                key={t.id}
                className={`flex justify-between items-center p-1.5 bg-white rounded border-l-4 ${
                  priorityColors[t.priority]
                } card-hover text-xs`}
                variants={itemVariants}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-1 flex-1">
                  {PriorityIcon && <PriorityIcon className="text-xs" />}
                  <span className="truncate">
                    {t.title} - {t.due}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <motion.input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t.id)}
                    whileTap={{ scale: 0.8 }}
                  />
                  <motion.button
                    onClick={() => removeTask(t.id)}
                    className="text-red-500 card-hover"
                    whileTap={{ scale: 0.8 }}
                  >
                    <FaTrash className="text-xs" />
                  </motion.button>
                </div>
              </motion.li>
            );
          })}
      </motion.ul>
    </motion.div>
  );
};

export default TaskManager;
