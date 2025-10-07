import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaPlay, FaStop, FaClock, FaSync } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: [0.42, 0, 0.58, 1] } },
};

const TimeTracker = ({ data, updateData, tasks }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || null);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCycle, setPomodoroCycle] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setCurrentTime((c) => c + 1), 1000);
      const target = isBreak
        ? data.settings.breakLength * 60
        : data.settings.pomodoroLength * 60;
      if (currentTime >= target) {
        setIsRunning(false);
        const newSession = {
          taskId: selectedTaskId,
          duration: currentTime / 60,
          date: new Date().toISOString().split("T")[0],
          type: isBreak ? "break" : "pomodoro",
        };
        updateData({ timeSessions: [...data.timeSessions, newSession] });
        if (!isBreak) {
          setIsBreak(true);
          setPomodoroCycle((c) => c + 1);
          setCurrentTime(0);
          setTimeout(() => setIsRunning(true), 1000);
        } else {
          setIsBreak(false);
          setCurrentTime(0);
        }
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTime, isBreak, selectedTaskId, data.settings]);

  const startTimer = () => {
    setIsRunning(true);
    setCurrentTime(0);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (currentTime > 0 && selectedTaskId) {
      const newSession = {
        taskId: selectedTaskId,
        duration: currentTime / 60,
        date: new Date().toISOString().split("T")[0],
        type: "manual",
      };
      updateData({ timeSessions: [...data.timeSessions, newSession] });
    }
    setCurrentTime(0);
  };

  const togglePomodoro = () => {
    setIsBreak(false);
    startTimer();
  };

  const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(11, 8);

  const chartData = {
    labels: data.timeSessions.map((s) => {
      const task = tasks.find((t) => t.id === s.taskId);
      return `${task?.title?.slice(0, 5) || "N/A"} (${s.date})`;
    }),
    datasets: [
      {
        label: "Minutes",
        data: data.timeSessions.map((s) => s.duration),
        backgroundColor: "#2196f3",
      },
    ],
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.select
        value={selectedTaskId}
        onChange={(e) => setSelectedTaskId(parseInt(e.target.value))}
        className="w-full p-2 border border-gray-300 rounded-md"
        variants={itemVariants}
      >
        {tasks.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </motion.select>
      <motion.div
        className="text-lg font-semibold text-center"
        variants={itemVariants}
        animate={{ color: isRunning ? "#4caf50" : "#f44336" }}
        transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
      >
        <FaClock className="inline mr-2" /> {formatTime(currentTime)}{" "}
        {isBreak ? "(Break)" : ""} Cycle: {pomodoroCycle}
      </motion.div>
      <div className="flex gap-2">
        <motion.button
          onClick={isRunning ? stopTimer : startTimer}
          className={`flex-1 p-2 rounded-md text-white card-hover ${
            isRunning ? "bg-red-500" : "bg-primary"
          }`}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {isRunning ? (
            <FaStop className="inline mr-2" />
          ) : (
            <FaPlay className="inline mr-2" />
          )}
          {isRunning ? "Stop" : "Start"}
        </motion.button>
        <motion.button
          onClick={togglePomodoro}
          className="flex-1 p-2 bg-secondary text-white rounded-md card-hover"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaSync className="inline mr-2" /> Pomodoro
        </motion.button>
      </div>
      <motion.div
        className="h-32 card-hover"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1000, easing: "easeOut" },
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default TimeTracker;
