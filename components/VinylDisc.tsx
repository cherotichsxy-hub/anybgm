import React from 'react';
import { motion } from 'framer-motion';

export const VinylDisc: React.FC<{ isPlaying: boolean; coverUrl: string }> = ({ isPlaying, coverUrl }) => {
  return (
    <motion.div
      className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-black relative flex items-center justify-center shadow-xl border-4 border-stone-800"
      animate={{ rotate: isPlaying ? 360 : 0 }}
      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
    >
        {/* Vinyl Grooves */}
        <div className="absolute inset-2 rounded-full border border-stone-800/50" />
        <div className="absolute inset-4 rounded-full border border-stone-800/50" />
        <div className="absolute inset-6 rounded-full border border-stone-800/50" />
        <div className="absolute inset-8 rounded-full border border-stone-800/50" />

        {/* Center Label */}
        <div className="w-24 h-24 rounded-full overflow-hidden relative z-10 border-2 border-stone-500">
            <img src={coverUrl} className="w-full h-full object-cover opacity-80" alt="Disc Label" />
        </div>
        
        {/* Shine */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
    </motion.div>
  );
};