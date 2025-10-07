import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaPlus, FaTimes } from 'react-icons/fa';
import { saveData } from '../utils/storage'; // Import storage

const Editor = () => {
  const [data, setData] = useState({ timetable: { slots: {} } });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get('timetable', ({ timetable }) => {
      setData({ timetable: timetable || { slots: {} } });
      setIsLoading(false);
    });
  }, []);

  const updateSlot = (slotId, text) => {
    const newSlots = { ...data.timetable.slots, [slotId]: text || '' };
    setData({ timetable: { ...data.timetable, slots: newSlots } });
  };

  const saveSchedule = () => {
    chrome.storage.sync.set({ timetable: data.timetable });
    // Auto-set reminders (5 min before each class, Mon-Fri only)
    Object.keys(data.timetable.slots).forEach(slotId => {
      const [day, timeStr] = slotId.split('-');
      if (['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day)) {
        const [hour, ampm] = timeStr.split('');
        let hour24 = parseInt(hour);
        if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;
        const remindTime = new Date();
        remindTime.setHours(hour24 - 0.083); // 5 min before (0.083 hours)
        remindTime.setMinutes(0, 0, 0); // Round to hour
        chrome.alarms.create(`timetable-${slotId}`, { when: remindTime.getTime() });
      }
    });
    alert('Schedule saved! Reminders set.');
    window.close(); // Close editor
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'];

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col p-4 bg-gray-100 overflow-auto">
      <h2 className="text-xl font-bold text-center mb-4">Weekly Schedule Editor</h2>
      <div className="timetable-grid mb-4 overflow-auto max-h-96">
        {days.map(day => <div key={day} className="timetable-slot font-bold text-center bg-gray-100"> {day} </div>)}
        {times.map(time => (
          <React.Fragment key={time}>
            <div className="timetable-slot font-bold text-center bg-gray-100"> {time} </div>
            {days.map(day => {
              const slotId = `${day}-${time}`;
              return (
                <input
                  key={`${day}-${time}`}
                  placeholder="Subject"
                  value={data.timetable.slots[slotId] || ''}
                  onChange={(e) => updateSlot(slotId, e.target.value)}
                  className="timetable-slot text-center text-xs border-none focus:outline-none bg-white"
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <motion.button 
        onClick={saveSchedule} 
        className="w-full p-2 bg-primary text-white rounded font-semibold flex items-center justify-center gap-2" 
        whileTap={{ scale: 0.98 }}
      >
        <FaSave /> Save & Set Reminders
      </motion.button>
    </div>
  );
};

export default Editor;