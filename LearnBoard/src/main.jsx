import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import TaskManager from "./components/TaskManager";
import CopySaver from "./components/CopySaver";
import TimetableReminders from "./components/TimeTableReminders";
import Dashboard from "./components/Dashboard";
import { loadData, saveData } from "./utils/storage";
import { FaPlus, FaDownload } from "react-icons/fa";
import "./index.css";

const defaults = {
  tasks: [],
  notes: [],
  timetable: { slots: {} },
  reminders: [],
};

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
    className="space-y-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="skeleton skeleton-line w-full"></div>
    <div className="skeleton skeleton-card w-full"></div>
    <div className="skeleton skeleton-line w-1/2"></div>
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
      if (e.key === "2") setActiveSection("copysaver");
      if (e.key === "3") setActiveSection("timetable");
      if (e.key === "4") setActiveSection("dashboard");
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
    )}\nNotes: ${JSON.stringify(data.notes || [])}\nTimetable: ${JSON.stringify(
      data.timetable || {}
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
        <Dashboard
          tasks={filteredTasks}
          notes={data.notes || []}
          timetable={data.timetable || { slots: {} }}
        />
      ),
    },
    {
      id: "tasks",
      label: "Tasks",
      comp: <TaskManager tasks={filteredTasks} updateData={updateData} />,
    },
    {
      id: "copysaver",
      label: "Copy Saver",
      comp: (
        <CopySaver data={data} updateData={updateData} tasks={filteredTasks} />
      ),
    },
    {
      id: "timetable",
      label: "Timetable",
      comp: <TimetableReminders data={data} updateData={updateData} />,
    },
  ];

  if (isLoading) {
    return (
      <motion.div
        className="p-3 bg-gray-100 min-h-[400px] max-w-[320px] font-ubuntu"
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
      className="p-2 bg-gray-100 min-h-[400px] max-w-[320px] font-ubuntu"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-lg font-bold text-center mb-2 text-gray-800"
        variants={itemVariants}
      >
        UniDash
      </motion.h2>
      <motion.input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-1.5 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        variants={itemVariants}
      />
      <motion.div className="flex flex-wrap gap-1 mb-2" variants={itemVariants}>
        {sections.map((s) => (
          <motion.button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 p-1 bg-gray-200 border border-gray-300 rounded card-hover text-xs ${
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
          className="h-[280px] overflow-y-auto border border-gray-300 p-2 rounded bg-white"
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
      <motion.div className="flex gap-1 mt-2" variants={itemVariants}>
        <motion.button
          onClick={exportData}
          className="flex-1 p-1 bg-secondary text-white rounded card-hover text-xs"
          whileTap={{ scale: 0.98 }}
        >
          <FaDownload className="inline mr-0.5 text-xs" /> Export
        </motion.button>
        <motion.button
          onClick={addQuickTask}
          className="flex-1 p-1 bg-primary text-white rounded card-hover text-xs"
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus className="inline mr-0.5 text-xs" /> Quick Add
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
