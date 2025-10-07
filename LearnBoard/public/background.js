// Existing alarms code (keep unchanged)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('deadline-')) {
    chrome.storage.sync.get('tasks', ({ tasks }) => {
      const task = tasks.find(t => `deadline-${t.id}` === alarm.name);
      chrome.notifications.create({
        type: 'basic',
        title: `Reminder: ${task?.title}`,
        message: 'Due soon!'
      });
    });
  } else if (alarm.name.startsWith('timetable-')) {
    chrome.storage.sync.get('timetable', ({ timetable }) => {
      const [day, time] = alarm.name.split('-');
      const slot = timetable.slots?.[`${day}-${time}`];
      chrome.notifications.create({
        type: 'basic',
        title: `Class Time: ${slot}`,
        message: 'Starting in 5 min!'
      });
    });
  }
});

// New: Handle copy detection from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyDetected' && request.text.length > 5) {
    // Open popup with the copied text (passes via query param for simplicity)
    chrome.action.openPopup(); // Opens the popup
    // Store text in storage for popup to read
    chrome.storage.local.set({ copiedText: request.text });
    sendResponse({ status: 'promptOpened' });
  }
});