import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaBell, FaPlus } from "react-icons/fa";

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: [0.42, 0, 0.58, 1] } },
};

const TimetableReminders = ({ data, updateData }) => {
  const [reminderText, setReminderText] = useState("");

  const openEditor = () => {
    chrome.windows.create({
      url: chrome.runtime.getURL("editor.html"),
      type: "popup",
      width: 600,
      height: 800,
      left: Math.round((screen.availWidth - 600) / 2),
      top: Math.round((screen.availHeight - 800) / 2),
    });
  };

  const addReminder = () => {
    if (reminderText) {
      const newReminder = {
        id: Date.now(),
        text: reminderText,
        time: new Date().toTimeString().split(" ")[0],
      };
      updateData({ reminders: [...(data.reminders || []), newReminder] });
      setReminderText("");
    }
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const times = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM"];

  return (
    <motion.div
      className="space-y-3 text-xs"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      {/* Timetable Grid (Read-Only) */}
      <div className="space-y-1">
        <h4 className="font-semibold flex items-center gap-1">
          <FaEdit className="text-xs" /> Timetable
          <motion.button
            onClick={openEditor}
            className="ml-auto text-primary text-xs card-hover"
            whileTap={{ scale: 0.98 }}
          >
            Edit
          </motion.button>
        </h4>
        <div className="timetable-grid overflow-auto max-h-32">
          {days.map((day) => (
            <div
              key={day}
              className="timetable-slot font-bold text-center bg-gray-100"
            >
              {day}
            </div>
          ))}
          {times.map((time) => (
            <React.Fragment key={time}>
              <div className="timetable-slot font-bold text-center bg-gray-100">
                {time}
              </div>
              {days.map((day) => {
                const slotId = `${day}-${time}`;
                const slotText = data.timetable?.slots?.[slotId] || "";
                return (
                  <div
                    key={`${day}-${time}`}
                    className="timetable-slot text-center text-[10px]"
                  >
                    {slotText}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Reminders */}
      <div className="space-y-1">
        <h4 className="font-semibold flex items-center gap-1">
          <FaBell /> Reminders
        </h4>
        <div className="flex gap-1">
          <input
            placeholder="Add reminder"
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            className="flex-1 p-1 border border-gray-300 rounded text-xs"
          />
          <motion.button
            onClick={addReminder}
            className="p-1 bg-secondary text-white rounded card-hover"
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus className="text-xs" />
          </motion.button>
        </div>
        <ul className="space-y-1 max-h-20 overflow-y-auto">
          {(data.reminders || []).map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between p-1 bg-gray-50 rounded text-xs"
            >
              <span>
                <FaPlus className="inline mr-0.5" />
                {r.text}
              </span>
              <span className="text-gray-500">{r.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default TimetableReminders;
