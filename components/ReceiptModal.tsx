
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Song, Episode } from '../types';
import { X, QrCode, Download, Loader2, ArrowUpRight } from 'lucide-react';
import { PODCAST_MAIN_URL, SOCIALS } from '../constants';
import html2canvas from 'html2canvas';

interface Props {
  episode: Episode;
  songs: Song[];
  onClose: () => void;
}

export const ReceiptModal: React.FC<Props> = ({ episode, songs, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // LOGO URL: Reverted to empty to use Text Fallback matching App.tsx
  const LOGO_URL = ""; 

  // 1. (REMOVED) Duration Calculation Logic
  // As requested, since we cannot guarantee real-time accuracy from iTunes for all tracks,
  // we are removing the duration display.

  // 2. Real QR Code Generation
  const targetUrl = episode.linkUrl || PODCAST_MAIN_URL;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(targetUrl)}&bgcolor=f0f0f0`;

  // 3. Download Function
  const handleDownload = async () => {
      if (!receiptRef.current || isDownloading) return;
      setIsDownloading(true);

      try {
          // A. Wait for fonts to ensure text renders
          await document.fonts.ready;

          // B. Clone the node to render it off-screen
          const original = receiptRef.current;
          const clone = original.cloneNode(true) as HTMLElement;

          // Style the clone to be visible to the engine but out of user sight
          // NOTE: We place it at top:0, left:0 to ensure html2canvas captures it fully
          // without scroll offset issues, but hide it via z-index.
          clone.style.position = 'fixed';
          clone.style.top = '0px';
          clone.style.left = '0px';
          clone.style.zIndex = '-9999';
          clone.style.width = `${original.offsetWidth}px`;
          clone.style.height = 'auto'; 
          clone.style.overflow = 'visible';
          clone.style.transform = 'none'; 
          clone.style.borderRadius = '0'; // simplify
          
          // Force text rendering settings for canvas
          clone.style.fontFeatureSettings = '"liga" 0';
          clone.style.textRendering = 'geometricPrecision';

          document.body.appendChild(clone);

          // C. Artificial Delay to allow layout/fonts to settle in the DOM
          // This fixes the "missing text" glitch
          await new Promise(resolve => setTimeout(resolve, 800));

          // D. Capture the Clone
          const canvas = await html2canvas(clone, {
              scale: 2, // High resolution
              backgroundColor: null, 
              useCORS: true,
              logging: false,
              allowTaint: true,
              scrollX: 0,
              scrollY: 0,
              width: original.offsetWidth,
              height: clone.scrollHeight + 20, // Add padding buffer
              onclone: (doc) => {
                  // Final safety check inside the cloned doc context
                  const el = doc.body.lastChild as HTMLElement;
                  if (el) el.style.visibility = 'visible';
              }
          });

          // Clean up
          document.body.removeChild(clone);

          const image = canvas.toDataURL("image/png");
          
          // Trigger download
          const link = document.createElement('a');
          link.href = image;
          link.download = `AnyBGM_Receipt_${episode.date}.png`;
          link.click();
      } catch (err) {
          console.error("Download failed:", err);
      } finally {
          setIsDownloading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div className="min-h-full w-full flex flex-col items-center justify-center p-4 py-12">
        <motion.div 
            className="relative flex flex-col items-center gap-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* --- RECEIPT CONTENT (This part gets captured) --- */}
            <div 
                ref={receiptRef}
                className="relative w-full max-w-sm bg-[#f0f0f0] shadow-2xl overflow-hidden"
                style={{
                // Jagged edge using mask
                maskImage: 'linear-gradient(to bottom, black calc(100% - 10px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 10px), transparent 100%)',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 98% 99%, 96% 100%, 94% 99%, 92% 100%, 90% 99%, 88% 100%, 86% 99%, 84% 100%, 82% 99%, 80% 100%, 78% 99%, 76% 100%, 74% 99%, 72% 100%, 70% 99%, 68% 100%, 66% 99%, 64% 100%, 62% 99%, 60% 100%, 58% 99%, 56% 100%, 54% 99%, 52% 100%, 50% 99%, 48% 100%, 46% 99%, 44% 100%, 42% 99%, 40% 100%, 38% 99%, 36% 100%, 34% 99%, 32% 100%, 30% 99%, 28% 100%, 26% 99%, 24% 100%, 22% 99%, 20% 100%, 18% 99%, 16% 100%, 14% 99%, 12% 100%, 10% 99%, 8% 100%, 6% 99%, 4% 100%, 2% 99%, 0% 100%)'
                }}
            >
                {/* Paper Texture */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                {/* Content Container */}
                <div className="p-6 pb-12 font-['Space_Mono'] text-stone-800 flex flex-col items-center text-center">
                    
                    {/* Header with LOGO (Text Fallback) */}
                    <div className="flex flex-col items-center mb-6 border-b-2 border-dashed border-stone-300 w-full pb-4">
                        {LOGO_URL ? (
                            <img src={LOGO_URL} className="h-8 w-auto object-contain mix-blend-multiply mb-2" alt="AnyBGM Logo" />
                        ) : (
                            <h1 className="text-3xl font-black not-italic tracking-tighter mb-2 font-['Zen_Kaku_Gothic_New'] text-stone-900">AnyBGM</h1>
                        )}

                        <span className="text-xs tracking-[0.2em] mb-2 font-bold text-stone-400">TRACKLIST RECEIPT</span>
                        <span className="text-[10px] text-stone-500">{new Date().toLocaleDateString()}</span>
                        <span className="text-[10px] text-stone-500 uppercase text-center font-bold mt-1 px-4 leading-tight">{episode.title}</span>
                    </div>

                    {/* List (Centered, No Duration) */}
                    <div className="w-full flex flex-col gap-4 text-xs mb-8">
                        {songs.map((song, i) => (
                            <div key={song.id} className="flex flex-col items-center gap-1 group">
                                <div className="flex items-center gap-2 text-stone-400">
                                    <span className="font-bold text-[10px]">{i + 1 < 10 ? `0${i+1}` : i+1}</span>
                                </div>
                                <span className="font-bold uppercase text-sm leading-none">{song.title}</span>
                                <span className="text-[10px] text-stone-500 uppercase tracking-widest">{song.artist}</span>
                            </div>
                        ))}
                    </div>

                    {/* Summary (No Duration) */}
                    <div className="w-full border-t-2 border-dashed border-stone-300 pt-4 flex justify-center text-xs font-black mb-6">
                        <span>TOTAL TRACKS: {songs.length}</span>
                    </div>

                    {/* Footer / QR ONLY */}
                    <div className="w-full flex flex-col items-center gap-3">
                        <div className="text-[10px] font-bold uppercase tracking-widest border-b border-stone-300 pb-1">SCAN TO LISTEN</div>
                        <div className="p-1 bg-white">
                            <img 
                                src={qrCodeUrl} 
                                alt="Scan to Listen" 
                                className="w-24 h-24 mix-blend-multiply" 
                                crossOrigin="anonymous" 
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6 text-[8px] text-stone-400 uppercase tracking-widest text-center">
                        THANK YOU FOR LISTENING
                    </div>

                </div>
            </div>

            {/* --- ACTION BUTTONS (High Visibility) --- */}
            <div className="flex items-center gap-4 z-50">
                <button 
                    onClick={onClose}
                    className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors px-4 py-3"
                >
                    CLOSE
                </button>

                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-white text-black hover:bg-stone-200 px-6 py-3 rounded-full font-black text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
                >
                    {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    <span>{isDownloading ? 'SAVING...' : 'SAVE IMAGE'}</span>
                </motion.button>
            </div>
        </motion.div>
      </div>
    </div>
  );
};
