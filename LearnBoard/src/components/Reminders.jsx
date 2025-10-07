import React from "react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: [0.42, 0, 0.58, 1] } },
};

const Reminders = ({ tasks, updateData }) => {
  const snoozeReminder = (id) => {
    const updated = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            due: new Date(Date.now() + 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          }
        : t
    );
    updateData({ tasks: updated });
  };

  const upcoming = tasks
    .filter((t) => !t.completed && new Date(t.due) > new Date())
    .sort((a, b) => new Date(a.due) - new Date(b.due))
    .slice(0, 5);

  return (
    <motion.div
      className="space-y-3"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <h4 className="font-semibold text-sm">Upcoming Deadlines</h4>
      {upcoming.length === 0 ? (
        <p className="text-xs text-gray-500">No upcoming reminders</p>
      ) : (
        upcoming.map((t, index) => (
          <motion.div
            key={t.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs"
            variants={itemVariants}
          >
            <span>
              {t.title} ({t.due})
            </span>
            <motion.button
              onClick={() => snoozeReminder(t.id)}
              className="text-primary text-xs card-hover"
              whileTap={{ scale: 0.98 }}
            >
              Snooze
            </motion.button>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default Reminders;
