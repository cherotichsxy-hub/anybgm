
import React from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types';

interface Props {
  song: Song;
  isActive: boolean;
}

export const TransparentCDCase: React.FC<Props> = ({ song, isActive }) => {
  return (
    <div className="flex flex-col items-center group perspective-1000 relative">
      
      {/* 
         THE JEWEL CASE CONTAINER 
      */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 transition-all duration-500 flex items-center justify-center">
        
        {/* 1. Enhanced Plastic Shell (Acrylic Gloss) */}
        <div className="absolute inset-0 bg-white/5 rounded-sm border border-white/20 shadow-2xl backdrop-blur-sm z-0 overflow-hidden">
            {/* Hinge Detail */}
            <div className="absolute left-2 top-0 bottom-0 w-[4px] bg-white/10 border-r border-white/5 z-20" /> 
            
            {/* Plastic Noise Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
            
            {/* Hard Plastic Reflections (The Gloss) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-60 pointer-events-none z-30" />
            <div className="absolute top-0 right-0 w-full h-[1px] bg-white/40 z-30" />
            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-black/40 z-30" />
            
            {/* Diagonal Sheen */}
            <div className="absolute -inset-full top-[-50%] block w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 pointer-events-none" />
        </div>

        {/* 2. THE PICTURE DISC (Static, Large Cover) */}
        <motion.div 
            className="relative w-[92%] h-[92%] rounded-full shadow-lg z-10 overflow-hidden"
            animate={{ 
                scale: isActive ? 1 : 0.95,
                rotate: 0 // Explicitly stop rotation
            }}
            whileHover={{ scale: 1.02 }} // Subtle breath on hover
            transition={{ duration: 0.5 }}
        >
             {/* The Cover Image mapped to the Disc */}
             <div className="absolute inset-0 bg-black">
                {song.coverUrl ? (
                    <img 
                        src={song.coverUrl} 
                        className="w-full h-full object-cover" 
                        alt={song.title} 
                    />
                ) : (
                    <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-500 text-xs">NO DISC</div>
                )}
             </div>

             {/* CD Texture Overlays (Subtle) */}
             {/* Rainbow Sheen (Prismatic) */}
             <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.3)_50deg,transparent_70deg,rgba(255,255,255,0.3)_150deg,transparent_180deg)] opacity-40 pointer-events-none mix-blend-overlay" />
             
             {/* Center Hole */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-transparent rounded-full border-[6px] border-white/20 backdrop-blur-md shadow-inner flex items-center justify-center z-20">
                 <div className="w-full h-full rounded-full border border-white/30" />
             </div>
        </motion.div>
        
        {/* 3. SILVER FOIL STICKER (Redesigned) */}
        {/* Positioned at the bottom of the plastic case, overlapping the disc slightly for depth */}
        <div className="absolute bottom-4 right-4 max-w-[80%] z-40 transform rotate-[-2deg]">
            <motion.div 
                className="relative px-3 py-2 bg-gradient-to-br from-[#e0e0e0] via-[#ffffff] to-[#c0c0c0] shadow-[2px_4px_8px_rgba(0,0,0,0.4)] border border-white/60"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Holographic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-green-500/20 to-blue-500/20 opacity-40 mix-blend-color-dodge pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                {/* Text Content */}
                <p className="relative z-10 text-[10px] md:text-xs font-['Space_Mono'] font-bold text-black leading-tight">
                    "{song.description || "LIMITED EDITION"}"
                </p>
                
                {/* Sticker Shine */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/80" />
            </motion.div>
        </div>

      </div>
      
      {/* 
          TITLE INFO (Clean Typography below)
      */}
      <motion.div 
        className="text-center z-20 max-w-[280px] mt-6"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: isActive ? 1 : 0.6 }}
      >
          <h3 className={`font-['Zen_Kaku_Gothic_New'] font-bold text-stone-100 leading-tight mb-1 ${isActive ? 'text-2xl' : 'text-lg'} drop-shadow-lg`}>
              {song.title}
          </h3>
          <p className="font-['Space_Mono'] text-stone-400 text-xs uppercase tracking-[0.2em]">
              {song.artist}
          </p>
      </motion.div>

    </div>
  );
};
