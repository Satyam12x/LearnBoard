import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import TaskManager from "./components/TaskManager";
import Notes from "./components/Notes";
import DashboardStats from "./components/DashboardStats";
import Reminders from "./components/Reminders";
import { loadData, saveData } from "./utils/storage";
import { FaDownload, FaPlus } from "react-icons/fa";
import "./index.css";

// Default data structure
const defaults = {
  tasks: [],
  notes: [],
  reminders: [],
  settings: { pomodoroLength: 25, breakLength: 5 },
};

// Animation variants (subtle, no scale)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: [0.42, 0, 0.58, 1] } },
};

const SkeletonLoader = () => (
  <motion.div
    className="space-y-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="skeleton skeleton-line w-full"></div>
    <div className="skeleton skeleton-card w-full"></div>
    <div className="skeleton skeleton-card w-3/4"></div>
  </motion.div>
);

const App = () => {
  const [data, setData] = useState(defaults);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData().then((stored) => {
      setData({ ...defaults, ...stored });
      setIsLoading(false);
    });
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === "Enter") addQuickTask();
      if (e.key === "1") setActiveSection("tasks");
      if (e.key === "2") setActiveSection("notes");
      if (e.key === "3") setActiveSection("reminders");
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const filteredTasks = (data.tasks || []).filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addQuickTask = () => {
    const title = prompt("Quick task title:");
    if (title) {
      const newTask = {
        id: Date.now(),
        title,
        due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        completed: false,
        priority: "medium",
        category: "Work",
      };
      const updatedData = { ...data, tasks: [...(data.tasks || []), newTask] };
      setData(updatedData);
      saveData(updatedData);
      if (typeof chrome !== "undefined" && chrome.alarms) {
        chrome.alarms.create(`deadline-${newTask.id}`, {
          when: new Date(newTask.due).getTime() - 24 * 60 * 60 * 1000,
        });
      }
    }
  };

  const updateData = (newData) => {
    const updated = { ...data, ...newData };
    setData(updated);
    saveData(updated);
  };

  const exportData = () => {
    const csv = `Tasks: ${JSON.stringify(
      data.tasks || []
    )}\nNotes: ${JSON.stringify(data.notes || [])}\nReminders: ${JSON.stringify(
      data.reminders || []
    )}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    if (typeof chrome !== "undefined" && chrome.downloads) {
      chrome.downloads.download({
        url,
        filename: "unidash-backup.csv",
        saveAs: true,
      });
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = "unidash-backup.csv";
      a.click();
    }
  };

  const sections = [
    {
      id: "dashboard",
      label: "Dashboard",
      comp: (
        <DashboardStats
          tasks={filteredTasks}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ),
    },
    {
      id: "tasks",
      label: "Tasks",
      comp: <TaskManager tasks={filteredTasks} updateData={updateData} />,
    },
    {
      id: "notes",
      label: "Notes",
      comp: <Notes data={data} updateData={updateData} tasks={filteredTasks} />,
    },
    {
      id: "reminders",
      label: "Reminders",
      comp: <Reminders tasks={filteredTasks} updateData={updateData} />,
    },
  ];

  if (isLoading) {
    return (
      <motion.div
        className="p-4 bg-gray-100 min-h-[400px] max-w-[350px] font-sans"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SkeletonLoader />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-3 bg-gray-100 min-h-[400px] max-w-[350px] font-sans font-ubuntu"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-xl font-bold text-center mb-3 text-gray-800"
        variants={itemVariants}
      >
        UniDash Dashboard
      </motion.h2>
      <motion.input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        variants={itemVariants}
      />
      <motion.div className="flex flex-wrap gap-1 mb-3" variants={itemVariants}>
        {sections.map((s) => (
          <motion.button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 p-1.5 bg-gray-200 border border-gray-300 rounded-md card-hover text-sm ${
              activeSection === s.id ? "bg-primary text-white" : ""
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {s.label}
          </motion.button>
        ))}
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          className="h-[300px] overflow-y-auto border border-gray-300 p-3 rounded-md bg-white"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }}
        >
          {sections.find((s) => s.id === activeSection)?.comp || (
            <SkeletonLoader />
          )}
        </motion.div>
      </AnimatePresence>
      <motion.div className="flex gap-2 mt-3" variants={itemVariants}>
        <motion.button
          onClick={exportData}
          className="flex-1 p-1.5 bg-secondary text-white rounded-md card-hover text-sm"
          whileTap={{ scale: 0.98 }}
        >
          <FaDownload className="inline mr-1 text-xs" /> Export
        </motion.button>
        <motion.button
          onClick={addQuickTask}
          className="flex-1 p-1.5 bg-primary text-white rounded-md card-hover text-sm"
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus className="inline mr-1 text-xs" /> Quick Add
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
