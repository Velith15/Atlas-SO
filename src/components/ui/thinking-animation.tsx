import React from 'react';
import { motion } from 'framer-motion';

export const ThinkingAnimation = () => {
  return (
    <div className="flex items-center self-start mb-4 pointer-events-none select-none">
      <span className="text-[13px] font-medium text-[#A0A0A0] tracking-tight antialiased">
        Thinking
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
        >
          .
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        >
          .
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        >
          .
        </motion.span>
      </span>
    </div>
  );
};
