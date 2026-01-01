
import React from 'react';
import { motion } from 'framer-motion';

interface CDCardProps {
  coverUrl: string;
  title: string;
  date: string; // Format: YYYY.MM.DD
  theme?: string;
  onClick?: () => void;
  index?: number;
}

export const CDCard: React.FC<CDCardProps> = ({ title, date, theme, onClick, index = 0 }) => {
  // Parsing date for display
  const [year, month, day] = date.split('.'); 
  
  // Use index to alternate slightly for visual variety
  const isAlternate = index % 2 === 0;

  // Title Splitting Logic
  let displayLines = [title];
  let isMultiColumn = false;

  // Check for Chinese Comma first (Primary split point based on request)
  if (title.includes('，')) {
      displayLines = title.split('，');
      isMultiColumn = true;
  } else if (title.includes(',')) {
      displayLines = title.split(',');
      isMultiColumn = true;
  } else if (title.length > 14) {
      // Long title without comma: Allow it to be treated as multi-column (wrapping handled by CSS or just scale down)
      // We keep it as one string but apply the small font class
      isMultiColumn = true;
  }

  return (
    <motion.div
      onClick={onClick}
      className="relative w-[70px] h-[400px] flex-shrink-0 cursor-pointer group perspective-1000"
      whileHover={{ y: -20, scaleY: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Spine Container */}
      <div className={`w-full h-full rounded-sm border-l border-r border-white/10 overflow-hidden relative shadow-lg flex flex-col items-center py-4 transition-colors duration-300 ${isAlternate ? 'bg-[#0a0a0a]' : 'bg-[#141414]'}`}>
        
        {/* Plastic Sheen / Cylinder Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/40 pointer-events-none z-10" />
        <div className="absolute left-1 top-0 bottom-0 w-[1px] bg-white/10 z-10" />
        <div className="absolute right-1 top-0 bottom-0 w-[1px] bg-white/5 z-10" />

        {/* --- Top: Date & Vol --- */}
        <div className="flex flex-col items-center gap-2 z-20 bg-gradient-to-b from-[#0a0a0a] to-transparent pb-2 w-full flex-shrink-0">
            <div className="w-full h-[2px] bg-red-600/50" />
            <span className="text-[9px] text-stone-500 font-['Space_Mono'] font-bold rotate-[-90deg] whitespace-nowrap mt-2">
                {year}
            </span>
            <span className="text-xs text-stone-300 font-['Space_Mono'] font-bold">
                {month}.{day}
            </span>
        </div>

        {/* --- Center: Title (Vertical Split) --- */}
        {/* mb-[100px] reserves space for the absolute bottom content */}
        <div className="flex-1 w-full relative flex justify-center items-center py-2 mb-[100px] overflow-hidden px-1"> 
             {/* 
                writing-vertical = writing-mode: vertical-rl
                flex-col inside vertical-rl = Stack Right-to-Left (Block direction)
                This creates the two-column look requested
             */}
             <div className="writing-vertical h-full flex flex-col justify-center items-center content-center gap-1">
                 {displayLines.map((line, i) => (
                    <span 
                        key={i} 
                        className={`
                            text-white/90 font-['Zen_Kaku_Gothic_New'] whitespace-nowrap
                            group-hover:text-red-500 transition-colors duration-300
                            ${isMultiColumn ? 'text-xs font-bold leading-4' : 'text-lg font-bold tracking-wider'}
                        `}
                    >
                        {line}
                    </span>
                 ))}
             </div>
        </div>

        {/* --- Bottom: Theme / Meta (Refined Alignment) --- */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-4 z-20 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent h-36 w-full pointer-events-none">
             
             {/* Theme/Genre Text */}
             {theme && (
               <div className="mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                   <span className="block text-[8px] text-red-600 font-['Space_Mono'] font-bold uppercase tracking-widest writing-vertical">
                      {theme}
                   </span>
               </div>
             )}

             {/* Index Number Circle */}
             <div className="w-6 h-6 rounded-full border border-stone-700/60 flex items-center justify-center bg-[#0f0f0f] mb-2 group-hover:border-red-900/50 transition-colors">
                 <span className="text-[9px] text-stone-400 font-['Space_Mono'] group-hover:text-stone-200">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                 </span>
             </div>
             
             {/* Decorative Barcode Lines - Centered and Sharp */}
             <div className="flex flex-col gap-[2px] opacity-40 items-center w-full">
                <div className="w-5 h-[1px] bg-white" />
                <div className="w-5 h-[1px] bg-transparent" />
                <div className="w-5 h-[2px] bg-white" />
                <div className="w-5 h-[1px] bg-white" />
             </div>
        </div>

      </div>
      
      {/* Reflection on the "Shelf" below */}
      <div className="absolute top-full left-0 w-full h-8 bg-gradient-to-b from-white/5 to-transparent skew-x-12 opacity-0 group-hover:opacity-50 transition-opacity" />
    </motion.div>
  );
};
