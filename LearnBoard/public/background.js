// Deadline alarms (from tasks)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('deadline-')) {
    chrome.storage.sync.get('tasks', ({ tasks }) => {
      const task = tasks.find(t => `deadline-${t.id}` === alarm.name);
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: `Reminder: ${task?.title}`,
        message: 'Due soon!'
      });
    });
  } else if (alarm.name.startsWith('timetable-')) {
    // Timetable class reminders (5 min before)
    chrome.storage.sync.get('timetable', ({ timetable }) => {
      const [day, time] = alarm.name.split('-');
      const slot = timetable.slots?.[`${day}-${time}`];
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: `Class Time: ${slot}`,
        message: 'Starting in 5 min!'
      });
    });
  }
});