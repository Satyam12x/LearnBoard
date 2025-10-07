import React, { useState } from "react";

const Citations = ({ data, updateData }) => {
  const [source, setSource] = useState("");
  const [format, setFormat] = useState("APA");

  const addCitation = () => {
    if (source) {
      const text = `${source} (${format})`; // Simplified
      const newCite = { id: Date.now(), source, format, text };
      updateData({ citations: [...data.citations, newCite] });
      navigator.clipboard.writeText(text);
      setSource("");
    }
  };

  return (
    <div className="space-y-4">
      <input
        placeholder="Source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option>APA</option>
        <option>MLA</option>
      </select>
      <button
        onClick={addCitation}
        className="w-full p-2 bg-primary text-white rounded-md hover:bg-green-600"
      >
        Add & Copy
      </button>
      <ul className="space-y-2 max-h-40 overflow-y-auto">
        {data.citations.map((c) => (
          <li
            key={c.id}
            onClick={() => navigator.clipboard.writeText(c.text)}
            className="p-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Citations;
