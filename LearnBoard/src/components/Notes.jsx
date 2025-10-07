import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaSave, FaPercentage } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: [0.42, 0, 0.58, 1] } },
};

const Notes = ({ data, updateData, tasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || null);
  const [content, setContent] = useState("");
  const [progress, setProgress] = useState(0);

  const saveNote = () => {
    const existing = data.notes.find((n) => n.taskId === selectedTaskId);
    const note = { taskId: selectedTaskId, content, progress };
    const updated = existing
      ? data.notes.map((n) => (n.taskId === selectedTaskId ? note : n))
      : [...data.notes, note];
    updateData({ notes: updated });
    setContent("");
    setProgress(0);
  };

  const note = data.notes.find((n) => n.taskId === selectedTaskId);

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
      <motion.textarea
        placeholder="Notes..."
        value={content || note?.content || ""}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-md resize-none"
        variants={itemVariants}
        whileFocus={{ scale: 1.01 }}
      />
      <motion.input
        type="range"
        min="0"
        max="100"
        value={progress || note?.progress || 0}
        onChange={(e) => setProgress(parseInt(e.target.value))}
        className="w-full"
        variants={itemVariants}
      />
      <motion.button
        onClick={saveNote}
        className="w-full p-2 bg-primary text-white rounded-md card-hover"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaSave className="inline mr-2" /> Save Note
      </motion.button>
      {note && (
        <motion.div className="space-y-2" variants={itemVariants}>
          <div className="progress-container">
            <motion.div
              className="progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${note.progress}%` }}
              transition={{ duration: 0.8, ease: [0.42, 0, 0.58, 1] }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaPercentage className="text-primary" /> Progress: {note.progress}%
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Notes;
