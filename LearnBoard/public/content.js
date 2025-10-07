document.addEventListener('copy', (e) => {
  const text = e.clipboardData.getData('text');
  if (text.length > 5) { // Ignore short copies
    chrome.runtime.sendMessage({ action: 'copyDetected', text });
  }
});