import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaCopy, FaQuoteRight } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: [0.42, 0, 0.58, 1] } },
};

const Citations = ({ data, updateData }) => {
  const [source, setSource] = useState("");
  const [format, setFormat] = useState("APA");

  const addCitation = () => {
    if (source) {
      const text = `${source} (${format})`;
      const newCite = { id: Date.now(), source, format, text };
      updateData({ citations: [...data.citations, newCite] });
      navigator.clipboard.writeText(text);
      setSource("");
    }
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.input
        placeholder="Source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
        variants={itemVariants}
        whileFocus={{ scale: 1.02 }}
      />
      <motion.select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
        variants={itemVariants}
      >
        <option>APA</option>
        <option>MLA</option>
      </motion.select>
      <motion.button
        onClick={addCitation}
        className="w-full p-2 bg-primary text-white rounded-md card-hover"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaPlus className="inline mr-2" /> <FaCopy className="inline mr-2" />{" "}
        Add & Copy
      </motion.button>
      <AnimatePresence>
        <motion.ul
          className="space-y-2 max-h-40 overflow-y-auto"
          initial="hidden"
          animate="visible"
        >
          {data.citations.map((c, index) => (
            <motion.li
              key={c.id}
              onClick={() => navigator.clipboard.writeText(c.text)}
              className="p-2 bg-white border border-gray-300 rounded-md cursor-pointer card-hover hover:bg-gray-50"
              variants={itemVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, ease: [0.42, 0, 0.58, 1] }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <FaQuoteRight className="text-sm" />
                {c.text}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </motion.div>
  );
};

export default Citations;
