import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import TaskManager from "./components/TaskManager";
import TimeTracker from "./components/TimeTracker";
import Notes from "./components/Notes";
import Citations from "./components/Citations";
import DashboardStats from "./components/DashboardStats";
import { loadData, saveData } from "./utils/storage";
import "./index.css"; // Tailwind import

const App = () => {
  const [data, setData] = useState({
    tasks: [],
    timeSessions: [],
    notes: [],
    citations: [],
    settings: { pomodoroLength: 25, breakLength: 5 },
  });
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData().then(setData);
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

  const filteredTasks = data.tasks.filter(
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
      const updatedData = { ...data, tasks: [...data.tasks, newTask] };
      setData(updatedData);
      saveData(updatedData);
      chrome.alarms.create(`deadline-${newTask.id}`, {
        when: new Date(newTask.due).getTime() - 24 * 60 * 60 * 1000,
      });
    }
  };

  const updateData = (newData) => {
    const updated = { ...data, ...newData };
    setData(updated);
    saveData(updated);
  };

  const exportData = () => {
    const csv = `Tasks: ${JSON.stringify(data.tasks)}\nTime: ${JSON.stringify(
      data.timeSessions
    )}\nNotes: ${JSON.stringify(data.notes)}\nCitations: ${JSON.stringify(
      data.citations
    )}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url,
      filename: "unidash-backup.csv",
      saveAs: true,
    });
  };

  const sections = [
    {
      id: "dashboard",
      label: "📊 Dashboard",
      comp: (
        <DashboardStats
          tasks={filteredTasks}
          timeSessions={data.timeSessions}
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
    <div className="p-4 bg-gray-100 min-h-[500px] max-w-[400px] font-sans">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        UniDash Multi-Task Dashboard
      </h2>
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 p-2 bg-gray-200 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-300 ${
              activeSection === s.id ? "bg-primary text-white" : ""
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="h-[400px] overflow-y-auto border border-gray-300 p-4 rounded-md bg-white">
        {sections.find((s) => s.id === activeSection)?.comp}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={exportData}
          className="flex-1 p-2 bg-secondary text-white rounded-md hover:bg-blue-700"
        >
          Export CSV
        </button>
        <button
          onClick={addQuickTask}
          className="flex-1 p-2 bg-primary text-white rounded-md hover:bg-green-600"
        >
          Quick Add (Ctrl+Enter)
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
