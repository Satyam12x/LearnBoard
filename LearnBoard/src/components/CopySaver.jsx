import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClipboard, FaGoogle, FaSave } from 'react-icons/fa';

const CopySaver = ({ data, updateData, tasks = [] }) => {
  const [copiedText, setCopiedText] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // On popup open, check for stored copied text
    chrome.storage.local.get('copiedText', (result) => {
      if (result.copiedText && result.copiedText.length > 5) {
        setCopiedText(result.copiedText);
        setShowPrompt(true);
        // Clear after reading
        chrome.storage.local.remove('copiedText');
      }
    });
  }, []);

  const saveToNotes = () => {
    const newNote = { id: Date.now(), text: copiedText, date: new Date().toISOString().split('T')[0] };
    updateData({ notes: [...(data.notes || []), newNote] });
    setShowPrompt(false);
    setCopiedText('');
  };

  const askGoogle = () => {
    chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(copiedText)}` });
    setShowPrompt(false);
    setCopiedText('');
  };

  if (!showPrompt) {
    return (
      <motion.div className="text-center text-xs text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <FaClipboard className="mx-auto mb-2 text-lg" />
        <p>Copy text on any page to save or search.</p>
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-2 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p className="bg-gray-50 p-2 rounded">Copied: {copiedText.substring(0, 50)}...</p>
      <div className="flex gap-1">
        <motion.button onClick={saveToNotes} className="flex-1 p-1 bg-primary text-white rounded card-hover" whileTap={{ scale: 0.98 }}>
          <FaSave className="inline mr-0.5" /> Save Note
        </motion.button>
        <motion.button onClick={askGoogle} className="flex-1 p-1 bg-secondary text-white rounded card-hover" whileTap={{ scale: 0.98 }}>
          <FaGoogle className="inline mr-0.5" /> Ask Google
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CopySaver;