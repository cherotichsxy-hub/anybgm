import React from 'react';
import { motion } from 'framer-motion';

export const Explosion: React.FC = () => {
  // Generate random particles
  const particles = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i / 24) * 360;
    const distance = Math.random() * 300 + 100; // Random explosion radius
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;
    
    return {
      id: i,
      x,
      y,
      size: Math.random() * 20 + 5,
      delay: Math.random() * 0.1
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ 
            x: p.x, 
            y: p.y, 
            opacity: 0, 
            scale: [1, 0.5] 
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: p.delay 
          }}
          className="rounded-full bg-stone-100/80 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          style={{ width: p.size, height: p.size }}
        />
      ))}
      {/* Shockwave ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0.5, borderWidth: 20 }}
        animate={{ scale: 2, opacity: 0, borderWidth: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute rounded-full border-stone-100"
        style={{ width: 100, height: 100 }}
      />
    </div>
  );
};