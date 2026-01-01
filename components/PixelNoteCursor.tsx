import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  type: 'single' | 'double';
}

export const PixelNoteCursor: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const lastSpawnTime = useRef(0);
  const noteIdCounter = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Spawn slightly less frequently so they don't clutter, but keep it fun
      if (now - lastSpawnTime.current > 80) {
        
        const colors = ['#EF4444', '#FFFFFF', '#D6D3D1', '#FCA5A5']; 
        
        const newNote: Note = {
          id: noteIdCounter.current++,
          x: e.clientX,
          y: e.clientY,
          rotation: (Math.random() - 0.5) * 20, // Subtle tilt
          scale: 0.8 + Math.random() * 0.4, // Consistent size
          color: colors[Math.floor(Math.random() * colors.length)],
          type: Math.random() > 0.6 ? 'single' : 'double' // More singles usually looks cleaner
        };

        setNotes((prev) => [...prev.slice(-10), newNote]); 
        lastSpawnTime.current = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cleanup loop
  useEffect(() => {
    const interval = setInterval(() => {
        if (notes.length > 0) {
            setNotes(prev => prev.filter(n => Date.now() - n.id * 1 > 1500)); 
        }
    }, 1000);
    return () => clearInterval(interval);
  }, [notes]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 1, x: note.x, y: note.y, scale: 0 }}
            animate={{ 
              opacity: 0, 
              y: note.y - 120 - Math.random() * 50, // Float higher
              x: note.x + (Math.random() - 0.5) * 60, // Drift more
              scale: note.scale 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="absolute top-0 left-0"
            style={{ color: note.color }}
          >
             <PixelNoteSvg type={note.type} rotate={note.rotation} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const PixelNoteSvg: React.FC<{ type: 'single' | 'double', rotate: number }> = ({ type, rotate }) => {
  // Scaled UP pixel art (approx 48px visual size)
  return (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      style={{ 
        transform: `rotate(${rotate}deg)`, 
        filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,1))', // Hard shadow for pop
        imageRendering: 'pixelated', // Crisp edges
        display: 'block'
      }}
    >
        {type === 'single' ? (
           // Chunky Single Note
           <path d="M9 16H13V6H15V4H11V14H9V16ZM7 16V18H13V16H7Z" />
        ) : (
           // Chunky Double Note
           <path d="M5 16H9V8H15V16H19V18H15V10H9V18H5V16ZM5 6H19V8H5V6Z" />
        )}
    </svg>
  );
}