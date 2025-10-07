import React, { useState } from 'react';

const Notes = ({ data, updateData, tasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || null);
  const [content, setContent] = useState('');
  const [progress, setProgress] = useState(0);

  const saveNote = () => {
    const existing = data.notes.find(n => n.taskId === selectedTaskId);
    const note = { taskId: selectedTaskId, content, progress };
    const updated = existing ? 
      data.notes.map(n => n.taskId === selectedTaskId ? note : n) : 
      [...data.notes, note];
    updateData({ notes: updated });
    setContent('');
    setProgress(0);
  };

  const note = data.notes.find(n => n.taskId === selectedTaskId);

  return (
    <div className="space-y-4">
      <select 
        value={selectedTaskId} 
        onChange={e => setSelectedTaskId(parseInt(e.target.value))} 
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
      </select>
      <textarea 
        placeholder="Notes..." 
        value={content || note?.content || ''} 
        onChange={e => setContent(e.target.value)} 
        rows={4} 
        className="w-full p-2 border border-gray-300 rounded-md resize-none"
      />
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={progress || note?.progress || 0} 
        onChange={e => setProgress(parseInt(e.target.value))} 
        className="w-full"
      />
      <button onClick={saveNote} className="w-full p-2 bg-primary text-white rounded-md hover:bg-green-600">Save Note</button>
      {note && (
        <div className="space-y-2">
          <div className="bg-gray-200 h-5 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300" 
              style={{ width: `${note.progress}%` }} 
            />
          </div>
          <span className="text-sm">Progress: {note.progress}%</span>
        </div>
      )}
    </div>
  );
};

export default Notes;