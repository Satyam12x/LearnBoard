import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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
      chrome.alarms.create(`deadline-${newTask.id}`, {
        when: new Date(due).getTime() - 24 * 60 * 60 * 1000,
      });
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Personal">Personal</option>
        </select>
      </div>
      <button
        onClick={addTask}
        className="w-full p-2 bg-primary text-white rounded-md hover:bg-green-600"
      >
        Add Task
      </button>
      <ul className="space-y-2">
        {tasks
          .sort((a, b) => new Date(a.due) - new Date(b.due))
          .map((t) => (
            <li
              key={t.id}
              className={`flex justify-between items-center p-3 bg-white rounded-md border-l-4 ${
                priorityColors[t.priority] || "border-gray-300"
              }`}
            >
              <span className="text-sm">
                {t.title} - {t.category} - Due: {t.due}
              </span>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTask(t.id)}
                className="ml-2"
              />
            </li>
          ))}
      </ul>
      <div className="h-32 flex justify-center">
        <Pie
          data={chartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
};

export default TaskManager;
