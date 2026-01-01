import React, { useEffect, useRef } from 'react';

export const DigitalGlitchFooter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    // Configuration
    const GRID_SIZE = 12; 
    const INFLUENCE_RADIUS = 180;
    const MAX_LIFT = 80;
    
    const COLOR_BG_DOT = 'rgba(255, 255, 255, 0.05)';
    const COLOR_ACTIVE_CORE = 'rgba(220, 38, 38, 1)'; 
    
    // Wave Params
    const WAVE_AMPLITUDE = 60;
    const WAVE_FREQUENCY = 0.005;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const time = Date.now() * 0.003;

      // Base line for the terrain - moves like a wave
      // We iterate X first, then Y downwards
      
      for (let x = 0; x < w; x += GRID_SIZE) {
        
        // Calculate the "surface" Y position for this X based on multiple sine waves
        const surfaceYOffset = 
            Math.sin(x * WAVE_FREQUENCY + time) * WAVE_AMPLITUDE + 
            Math.sin(x * WAVE_FREQUENCY * 2.5 + time * 1.5) * (WAVE_AMPLITUDE * 0.4);
            
        const startY = (h - (h * 0.25)) + surfaceYOffset; // Start drawing lower down

        for (let y = startY; y < h; y += GRID_SIZE) {
          
          // 1. Mouse Interaction
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let force = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
          force = Math.pow(force, 2); 

          // 2. Position
          let drawX = x;
          let drawY = y;
          let size = 2;
          let color = COLOR_BG_DOT;

          // Lift effect
          if (force > 0) {
             drawY -= force * MAX_LIFT;
             drawX += (Math.random() - 0.5) * 5 * force; // Jitter
             
             if (force > 0.7) {
                color = COLOR_ACTIVE_CORE;
                size = 3;
             } else {
                color = `rgba(255, 255, 255, ${0.1 + force * 0.6})`;
             }
          }

          // 3. Draw
          ctx.fillStyle = color;
          
          // Render stylistic "glitch strips" instead of just dots sometimes
          if (force > 0.6 && Math.random() > 0.9) {
             ctx.fillRect(drawX, drawY - 20, 2, 40); // Vertical data beams
          } else {
             ctx.fillRect(drawX, drawY, size, size);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed bottom-0 left-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
    />
  );
};