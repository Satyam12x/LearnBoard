import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import TaskManager from "./components/TaskManager";
import TimeTracker from "./components/TimeTracker";
import Notes from "./components/Notes";
import Citations from "./components/Citations";
import DashboardStats from "./components/DashboardStats";
import { loadData, saveData } from "./utils/storage";
import { FaDownload, FaPlus , FaChartPie} from "react-icons/fa"; // Icons for buttons
import "./index.css"; // Tailwind + Ubuntu styles

// Default data structure
const defaults = {
  tasks: [],
  timeSessions: [],
  notes: [],
  citations: [],
  settings: { pomodoroLength: 25, breakLength: 5 },
};

// Animation variants for App
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const App = () => {
  const [data, setData] = useState(defaults);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData().then((stored) => {
      // Merge stored data with defaults (ensures tasks etc. are always arrays/objects)
      setData({ ...defaults, ...stored });
    });
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === "Enter") addQuickTask();
      if (e.key === "1") setActiveSection("tasks");
      if (e.key === "2") setActiveSection("time");
      if (e.key === "3") setActiveSection("notes");
      if (e.key === "4") setActiveSection("citations");
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Safe filteredTasks with fallback
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
    )}\nTime: ${JSON.stringify(
      data.timeSessions || []
    )}\nNotes: ${JSON.stringify(data.notes || [])}\nCitations: ${JSON.stringify(
      data.citations || []
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
      label: "📊 Dashboard",
      comp: (
        <DashboardStats
          tasks={filteredTasks}
          timeSessions={data.timeSessions || []}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ),
    },
    {
      id: "tasks",
      label: "📝 Tasks",
      comp: <TaskManager tasks={filteredTasks} updateData={updateData} />,
    },
    {
      id: "time",
      label: "⏱️ Time Tracker",
      comp: (
        <TimeTracker
          data={data}
          updateData={updateData}
          tasks={filteredTasks}
        />
      ),
    },
    {
      id: "notes",
      label: "📔 Notes",
      comp: <Notes data={data} updateData={updateData} tasks={filteredTasks} />,
    },
    {
      id: "citations",
      label: "🔗 Citations",
      comp: <Citations data={data} updateData={updateData} />,
    },
  ];

  return (
    <motion.div
      className="p-4 bg-gray-100 min-h-[500px] max-w-[400px] font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-2xl font-bold text-center mb-4 text-gray-800 flex items-center justify-center gap-2"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
      >
        <FaChartPie className="text-primary" /> UniDash Multi-Task Dashboard
      </motion.h2>
      <motion.input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        variants={itemVariants}
        whileFocus={{ scale: 1.02 }}
      />
      <motion.div className="flex flex-wrap gap-2 mb-4" variants={itemVariants}>
        {sections.map((s) => (
          <motion.button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 p-2 bg-gray-200 border border-gray-300 rounded-md cursor-pointer card-hover ${
              activeSection === s.id ? "bg-primary text-white" : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {s.label}
          </motion.button>
        ))}
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          className="h-[400px] overflow-y-auto border border-gray-300 p-4 rounded-md bg-white card-hover"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
        >
          {sections.find((s) => s.id === activeSection)?.comp}
        </motion.div>
      </AnimatePresence>
      <motion.div className="flex gap-2 mt-4" variants={itemVariants}>
        <motion.button
          onClick={exportData}
          className="flex-1 p-2 bg-secondary text-white rounded-md card-hover"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaDownload className="inline mr-2" /> Export CSV
        </motion.button>
        <motion.button
          onClick={addQuickTask}
          className="flex-1 p-2 bg-primary text-white rounded-md card-hover"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus className="inline mr-2" /> Quick Add
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
