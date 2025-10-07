import { createRoot } from 'react-dom/client';
import Editor from '../src/components/Editor.jsx'; // Adjust path after build

const root = createRoot(document.getElementById('editor-root'));
root.render(<Editor />);

// Listen for storage changes from main popup
chrome.storage.onChanged.addListener((changes) => {
  if (changes.timetable) {
    // Reload data if changed
    window.location.reload();
  }
});