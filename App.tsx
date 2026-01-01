
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { Disc3, ListMusic, ChevronLeft, ArrowLeft, Hand, X, Play, Pause, Star, Globe, Zap, Radio, Battery, Disc, Power, FastForward, Rewind, Volume2, Printer, Headphones, Mail, BookHeart, AlertCircle, AlertTriangle } from 'lucide-react';
import { MOCK_EPISODES, THEME, PODCAST_MAIN_URL, SOCIALS } from './constants';
import { Episode, ViewMode, Song } from './types';
import { CDCard } from './components/CDCard';
import { VinylDisc } from './components/VinylDisc';
import { Explosion } from './components/Explosion';
import { TransparentCDCase } from './components/TransparentCDCase';
import { DigitalGlitchFooter } from './components/DigitalGlitchFooter';
import { PixelNoteCursor } from './components/PixelNoteCursor';
import { ReceiptModal } from './components/ReceiptModal';
import { enrichSongMetadata } from './utils/itunes';

const App: React.FC = () => {
  // Navigation State
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ALBUMS);
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  
  // Data State (For fetched songs)
  const [enrichedSongs, setEnrichedSongs] = useState<Song[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Refs for Gestures
  const songWallRef = useRef(null);
  const detailRef = useRef(null);

  // LOGO: Reverted to Text based on user feedback
  const GLOBAL_LOGO_URL = ""; 

  // --- ACTIONS ---

  const enterSongWall = async (episode: Episode) => {
    setSelectedEpisode(episode);
    setActiveSongIndex(0);
    setViewMode(ViewMode.SONGS);
    
    // Start Fetching Real Data!
    setIsFetching(true);
    // Deep clone to avoid mutating constant directly during async
    const initialSongs = [...episode.songs];
    setEnrichedSongs(initialSongs); // Show initial data first

    const promisedSongs = initialSongs.map(song => enrichSongMetadata(song));
    const realSongs = await Promise.all(promisedSongs);
    
    setEnrichedSongs(realSongs);
    setIsFetching(false);
  };

  const currentSong = enrichedSongs.length > 0 ? enrichedSongs[activeSongIndex] : null;
  const hasAudio = currentSong?.previewUrl && currentSong.previewUrl.length > 0;

  // --- AUDIO LOGIC ---
  useEffect(() => {
    if (hasAudio) {
      if (audioRef.current) {
        audioRef.current.src = currentSong.previewUrl!;
        if (isPlaying) audioRef.current.play();
      }
    } else {
      // No preview available
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      setIsPlaying(false);
    }
  }, [currentSong, activeSongIndex]); // Update when song changes

  const togglePlay = () => {
    if (!audioRef.current || !hasAudio) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSongChange = (newIndex: number) => {
    setIsPlaying(false); // Stop playing when switching
    setActiveSongIndex(newIndex);
  }


  // --- LEVEL 2: SONG WALL SWIPE LOGIC ---
  const handleSongSwipe = (direction: number) => {
    if (!selectedEpisode) return;
    const newIndex = activeSongIndex + direction;
    if (newIndex >= 0 && newIndex < enrichedSongs.length) {
      handleSongChange(newIndex);
    }
  };

  // --- GESTURES (Level 2 & 3 only - Simple Touch) ---
  useGesture({
    // Use onDragEnd for more reliable mobile behavior (captures both fast swipes and slow drags)
    onDragEnd: ({ movement: [mx], swipe: [swipeX] }) => {
       // Priority 1: Fast Swipe (Velocity based)
       if (swipeX === -1) { handleSongSwipe(1); return; } // Left -> Next
       if (swipeX === 1)  { handleSongSwipe(-1); return; } // Right -> Prev

       // Priority 2: Slow Drag Distance (Fallback)
       // If user drags more than 50px, we treat it as a navigation
       if (mx < -50) handleSongSwipe(1);
       else if (mx > 50) handleSongSwipe(-1);
    },
    onPinch: ({ offset: [d], direction: [dd] }) => {
      if (d > 20 && dd > 0) setViewMode(ViewMode.DETAIL); // Pinch Out -> Expand
    }
  }, { target: songWallRef });

  useGesture({
    onPinch: ({ direction: [dd] }) => {
      if (dd < 0) {
        setViewMode(ViewMode.SONGS); // Pinch In -> Close
        setIsPlaying(false);
      }
    }
  }, { target: detailRef });


  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center select-none"
      style={{ backgroundColor: THEME.red }}
    >
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)} 
        onError={() => setIsPlaying(false)}
      />

      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* 1. Dynamic Blur from Cover */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-125 transition-all duration-1000"
          animate={{ 
            backgroundImage: viewMode !== ViewMode.ALBUMS && currentSong 
              ? `url(${currentSong.coverUrl})` 
              : 'none',
            backgroundColor: viewMode === ViewMode.ALBUMS ? '#0f0f0f' : 'transparent'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* 2. Giant Logo Watermark (Visible mostly on Home) */}
        <motion.div 
            className="absolute inset-0 flex items-center justify-center opacity-5 z-0"
            animate={{ 
                opacity: viewMode === ViewMode.ALBUMS ? 0.08 : 0.02,
                scale: viewMode === ViewMode.ALBUMS ? 1 : 1.5
            }}
            transition={{ duration: 0.8 }}
        >
            <h1 className="text-[20vw] font-black text-white font-['Space_Mono'] tracking-tighter rotate-[-10deg] whitespace-nowrap select-none">
                AnyBGM
            </h1>
        </motion.div>
      </div>

      {/* --- GLOBAL EFFECTS --- */}
      <DigitalGlitchFooter />
      <PixelNoteCursor />

      {/* --- HEADER NAVIGATION & SOCIALS (Global) --- */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
          {/* Left: Branding / Logo / Back Button */}
          <div className="pointer-events-auto flex items-center gap-4">
             {/* Back Button (Only visible if NOT in Album view) */}
             {viewMode !== ViewMode.ALBUMS && (
                <button 
                  onClick={() => setViewMode(ViewMode.ALBUMS)} 
                  className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors group bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10"
                >
                   <ArrowLeft size={16} />
                   <span className="text-xs font-['Space_Mono'] font-bold">BACK</span>
                </button>
             )}

             {/* MAIN LOGO */}
             <div onClick={() => setViewMode(ViewMode.ALBUMS)} className="cursor-pointer group">
                 {GLOBAL_LOGO_URL ? (
                     <img src={GLOBAL_LOGO_URL} alt="AnyBGM Logo" className="h-10 md:h-12 w-auto object-contain drop-shadow-lg hover:scale-105 transition-transform" />
                 ) : (
                     <div className="flex flex-col">
                        {/* ADDED not-italic explicitly */}
                        <h1 className="text-white font-['Zen_Kaku_Gothic_New'] font-black text-3xl tracking-tighter leading-none group-hover:text-red-500 transition-colors drop-shadow-md not-italic">
                            AnyBGM
                        </h1>
                        {/* REMOVED PODCAST TEXT AS REQUESTED */}
                     </div>
                 )}
             </div>
          </div>

          {/* Right: Social Matrix (Pointer events auto) */}
          <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="pointer-events-auto flex flex-col items-end gap-2"
          >
             {/* Main Social Buttons using Real Favicons as Logos */}
             <div className="flex gap-2">
                 {/* 小宇宙 */}
                 <SocialPill 
                    href={SOCIALS.xiaoyuzhou} 
                    iconUrl="https://www.xiaoyuzhoufm.com/favicon.ico"
                    label="播客" 
                    color="hover:bg-[#5C3C92] hover:border-[#5C3C92]" 
                 />
                 {/* RED / 小红书 */}
                 <SocialPill 
                    href={SOCIALS.xiaohongshu} 
                    iconUrl="https://www.xiaohongshu.com/favicon.ico"
                    label="RED" 
                    color="hover:bg-[#FF2442] hover:border-[#FF2442]" 
                 />
                 {/* Jike / 即刻 */}
                 <SocialPill 
                    href={SOCIALS.jike} 
                    iconUrl="https://web-resources.okjike.com/favicon.ico"
                    label="即刻" 
                    color="hover:bg-[#FFE411] hover:text-black hover:border-[#FFE411]" 
                 />
             </div>
             
             {/* Email */}
             <div className="flex gap-2">
                 <a 
                    href={SOCIALS.email}
                    className="bg-black/40 backdrop-blur-md border border-white/10 text-stone-300 flex items-center gap-2 rounded-full transition-all duration-300 hover:bg-white hover:text-black px-3 py-1"
                 >
                     <Mail size={10} />
                     <span className="font-['Space_Mono'] font-bold text-[9px]">MAIL</span>
                 </a>
             </div>
          </motion.div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ================= LEVEL 1: CD SHELF (Horizontal Spines) ================= */}
        {viewMode === ViewMode.ALBUMS && (
          <motion.div 
            key="albums"
            className="relative w-full h-full flex flex-col z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(5px)' }}
          >
            {/* Header Text (Visual only) */}
            <div className="pt-24 px-8 mb-4 relative z-10 pointer-events-none">
               <h2 className="text-stone-100 font-['Space_Mono'] text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-none opacity-20">
                   SELECT<br/>VOLUME
               </h2>
            </div>

            {/* Shelf Scroll Container */}
            <div className="flex-1 w-full overflow-x-auto no-scrollbar flex flex-col justify-center" style={{ touchAction: 'pan-x' }}>
                 <div className="min-w-full w-fit mx-auto px-12 flex items-center gap-[4px] py-10">
                     {MOCK_EPISODES.map((ep, idx) => (
                       <motion.div
                         key={ep.id}
                         initial={{ opacity: 0, y: 100, rotateX: 45 }}
                         animate={{ opacity: 1, y: 0, rotateX: 0 }}
                         transition={{ 
                            delay: idx * 0.05, 
                            type: 'spring',
                            stiffness: 100 
                         }}
                         className="flex-shrink-0"
                       >
                           <CDCard 
                             {...ep} 
                             index={idx}
                             onClick={() => enterSongWall(ep)} 
                           />
                       </motion.div>
                     ))}
                 </div>
            </div>

            {/* Footer / Shelf Graphic */}
            <div className="h-16 w-full border-t border-white/10 bg-black/40 backdrop-blur flex items-center px-8 justify-between text-[10px] text-stone-600 font-['Space_Mono'] relative z-10">
                <span>SELECT A SPINE TO EXPAND</span>
                <span>TOTAL: {MOCK_EPISODES.length}</span>
            </div>
          </motion.div>
        )}

        {/* ================= LEVEL 2: SONG WALL (Jewel Cases) ================= */}
        {viewMode === ViewMode.SONGS && selectedEpisode && (
          <motion.div 
            key="songs"
            ref={songWallRef}
            className="w-full h-full flex flex-col items-center justify-center relative z-20 touch-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            style={{ touchAction: 'none' }} // IMPORTANT: Disable scroll here to allow gesture drag
          >
             {/* MOVED RECEIPT MODAL OUTSIDE TO ROOT LEVEL FOR PROPER SCROLLING */}

             {/* Header Info (STATIC TITLE - No Marquee) */}
             <div className="absolute top-20 z-20 pointer-events-none px-4 w-full flex flex-col items-center">
                <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 italic tracking-tighter uppercase text-center leading-tight max-w-4xl drop-shadow-2xl">
                    {selectedEpisode.title}
                </h2>
                
                {/* Meta Row with Episode Link */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pointer-events-auto">
                   <div className="text-xs text-stone-400 font-['Space_Mono'] tracking-widest flex items-center gap-2">
                       <span>{selectedEpisode.date}</span>
                       <span className="text-red-500">///</span>
                       <span>{selectedEpisode.theme}</span>
                   </div>
                   
                   {/* Episode Link Button */}
                   <a 
                      href={selectedEpisode.linkUrl || PODCAST_MAIN_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 bg-white/10 hover:bg-white hover:text-black text-white text-[10px] font-bold px-2 py-1 rounded transition-colors"
                   >
                       <Headphones size={10} />
                       LISTEN
                   </a>
                </div>
             </div>

             {/* Gallery Flow - CASES */}
             <div className="w-full h-[60%] flex items-center justify-center perspective-1000 relative">
                 <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                 >
                    {enrichedSongs.map((song, idx) => {
                       const offset = idx - activeSongIndex;
                       // Only render visible range
                       if (Math.abs(offset) > 2) return null;
                       const isActive = offset === 0;

                       return (
                          <motion.div
                             key={song.id}
                             className="absolute cursor-pointer"
                             animate={{
                                x: offset * (window.innerWidth < 768 ? 320 : 420), // Responsive spacing
                                z: Math.abs(offset) * -300,
                                rotateY: offset * -15,
                                scale: isActive ? 1 : 0.85,
                                opacity: isActive ? 1 : 0.4,
                                filter: isActive ? 'blur(0px)' : 'blur(3px)',
                                zIndex: isActive ? 20 : 10
                             }}
                             transition={{ type: "spring", stiffness: 120, damping: 20 }}
                             onClick={() => {
                                 if (isActive) setViewMode(ViewMode.DETAIL);
                                 else handleSongChange(idx);
                             }}
                          >
                             <TransparentCDCase song={song} isActive={isActive} />
                          </motion.div>
                       );
                    })}
                 </motion.div>
             </div>

             {/* Bottom Controls: Receipt & Hint */}
             <div className="absolute bottom-8 w-full px-8 flex justify-between items-end z-30 pointer-events-auto">
                 <div className="text-stone-500/30 font-['Space_Mono'] text-sm tracking-widest hidden md:block">
                    PINCH OUT TO PLAY
                 </div>
                 
                 {/* PRINT RECEIPT BUTTON */}
                 <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReceipt(true)}
                    className="flex items-center gap-2 bg-black/40 backdrop-blur border border-white/20 text-stone-300 px-4 py-2 rounded-lg"
                 >
                     <Printer size={16} />
                     <span className="text-xs font-['Space_Mono'] font-bold">PRINT TRACKLIST</span>
                 </motion.button>
             </div>
          </motion.div>
        )}

        {/* ================= LEVEL 3: DETAIL (HIGH TECH DISCMAN) ================= */}
        {viewMode === ViewMode.DETAIL && selectedEpisode && currentSong && (
           <motion.div
             key="detail"
             ref={detailRef}
             className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] touch-none overflow-hidden"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }} 
           >
             {/* 1. BACKGROUND VOID */}
             <div className="absolute inset-0 z-0 pointer-events-none bg-black">
                <div 
                   className="absolute inset-0 opacity-40 mix-blend-overlay"
                   style={{ 
                       backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')`
                   }} 
                />
                <FloatingGlitchElements />
             </div>

             <Explosion />

             {/* 2. THE DISCMAN PLAYER (COMPACTED) */}
             <motion.div 
                className="relative z-20 flex flex-col items-center justify-center w-full max-w-md mx-4"
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
             >
                {/* 
                   THE DEVICE BODY
                   Compacted layout to save vertical space
                */}
                <div className="bg-[#1a1a1a] rounded-[32px] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_2px_2px_rgba(255,255,255,0.1)] border border-white/10 relative overflow-hidden flex flex-col items-center w-full">
                    {/* Metal Texture Overlay */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

                    {/* Top Screen / Status Bar (Compact) */}
                    <div className="w-full mb-4 bg-[#0a0a0a] rounded-lg border border-[#333] px-3 py-1.5 flex justify-between items-center shadow-[inset_0_0_10px_rgba(0,0,0,1)] relative">
                         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[size:100%_2px,2px_100%] pointer-events-none opacity-40" />
                         
                         <div className={`font-['Space_Mono'] text-[9px] flex items-center gap-2 ${hasAudio ? 'text-red-500' : 'text-stone-600'}`}>
                             <div className={`w-1.5 h-1.5 rounded-full ${hasAudio ? 'bg-red-500 ' + (isPlaying ? 'animate-pulse' : '') : 'bg-stone-700'}`} />
                             {hasAudio ? (isPlaying ? 'PLAYING' : 'READY') : 'NO DATA'}
                         </div>
                         <div className="font-['Space_Mono'] text-[9px] text-stone-500">
                             TRK {activeSongIndex + 1 < 10 ? `0${activeSongIndex + 1}` : activeSongIndex + 1}
                         </div>
                         <Battery size={10} className={hasAudio ? "text-green-500" : "text-stone-700"} />
                    </div>

                    {/* MAIN DISC AREA - MAXIMIZED COVER ART */}
                    <div className={`relative w-[300px] h-[300px] sm:w-[320px] sm:h-[320px] rounded-full flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,1)] border transition-colors ${hasAudio ? 'bg-[#050505] border-stone-800' : 'bg-[#0a0a0a] border-stone-900 grayscale opacity-80'}`}>
                        {/* Mechanical Rings (Subtle) */}
                        <div className="absolute inset-1 rounded-full border border-stone-800/50" />
                        
                        {/* The Spinning Vinyl/CD - Scaled to fill almost ALL space */}
                        <div className="relative z-10 cursor-pointer scale-[1.15]" onClick={togglePlay}>
                            <VinylDisc isPlaying={isPlaying} coverUrl={currentSong.coverUrl} />
                            
                            {/* Play/Pause Overlay */}
                            {hasAudio && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] group">
                                    {isPlaying ? (
                                        <Pause size={48} className="text-white fill-current drop-shadow-lg" />
                                    ) : (
                                        <Play size={48} className="text-white fill-current drop-shadow-lg ml-2" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CONTROL PANEL (Compact) */}
                    <div className="w-full mt-4 bg-[#222] rounded-xl p-3 border-t border-white/5 relative shadow-lg flex flex-col items-center">
                        
                        {/* Song Info */}
                        <div className="text-center mb-4 w-full">
                            <h2 className="text-white font-['Zen_Kaku_Gothic_New'] font-bold text-lg leading-tight truncate px-2">
                                {currentSong.title}
                            </h2>
                            <p className="text-stone-500 text-[10px] font-['Space_Mono'] uppercase tracking-widest mt-0.5">
                                {currentSong.artist}
                            </p>
                        </div>

                        {/* Tactile Buttons */}
                        <div className="flex items-center justify-center gap-4 mb-3">
                            <RoundButton onClick={() => handleSongSwipe(-1)} small><Rewind size={16} /></RoundButton>
                            
                            {/* Play Button */}
                            <button
                                onClick={togglePlay}
                                disabled={!hasAudio}
                                className={`w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-[0_3px_6px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-none transition-all ${
                                    hasAudio 
                                        ? (isPlaying ? 'bg-gradient-to-br from-red-600 to-red-800 border-red-900 cursor-pointer' : 'bg-gradient-to-br from-stone-200 to-stone-400 border-stone-500 cursor-pointer') 
                                        : 'bg-stone-800 border-stone-900 opacity-50 cursor-not-allowed'
                                }`}
                            >
                                {isPlaying ? <Pause size={20} className="text-black fill-black" /> : <Play size={20} className="text-black fill-black ml-1" />}
                            </button>

                            <RoundButton onClick={() => handleSongSwipe(1)} small><FastForward size={16} /></RoundButton>
                        </div>

                        {/* --- NEW: PREVIEW DISCLAIMER BOX (Dynamic) --- */}
                        <div className={`w-full rounded border p-2 flex items-start gap-2 mt-1 transition-colors ${hasAudio ? 'bg-[#151515] border-white/5' : 'bg-red-900/10 border-red-900/30'}`}>
                            {hasAudio ? (
                                <AlertCircle size={12} className="text-stone-500 shrink-0 mt-0.5" />
                            ) : (
                                <AlertTriangle size={12} className="text-red-500 shrink-0 mt-0.5" />
                            )}
                            
                            <div className="flex flex-col items-start text-left">
                                <span className={`text-[9px] font-['Space_Mono'] font-bold leading-tight ${hasAudio ? 'text-stone-400' : 'text-red-400'}`}>
                                    {hasAudio ? 'DEMO MODE (30s)' : 'SOURCE NOT FOUND'}
                                </span>
                                <span className={`text-[8px] font-['Space_Mono'] leading-tight ${hasAudio ? 'text-stone-600' : 'text-red-900/50'}`}>
                                    {hasAudio ? 'Generate Receipt to save tracklist.' : 'Track not available in preview.'}
                                </span>
                            </div>
                            
                            {hasAudio && (
                                <button 
                                    onClick={() => setShowReceipt(true)}
                                    className="ml-auto text-[9px] bg-stone-800 text-stone-300 px-2 py-1 rounded hover:bg-stone-700 font-bold"
                                >
                                    SAVE
                                </button>
                            )}
                        </div>

                    </div>
                </div>

                {/* Eject / Close - Now visible because body is compacted */}
                <motion.button
                  onClick={() => {
                      setIsPlaying(false);
                      setViewMode(ViewMode.SONGS);
                  }}
                  className="mt-4 flex items-center gap-2 text-stone-500 hover:text-white transition-colors py-2"
                >
                    <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                        <X size={14} />
                    </div>
                    <span className="text-xs font-['Space_Mono'] tracking-widest">EJECT DISC</span>
                </motion.button>
             </motion.div>
           </motion.div>
        )}

      </AnimatePresence>

      {/* 
         GLOBAL MODALS (Outside AnimatePresence of Pages to prevent 'transform' clipping issues) 
         This fixes the issue where Receipt Modal couldn't scroll because it was inside a scaled/transformed motion.div
      */}
      <AnimatePresence>
         {showReceipt && selectedEpisode && enrichedSongs.length > 0 && (
             <ReceiptModal 
                episode={selectedEpisode} 
                songs={enrichedSongs} 
                onClose={() => setShowReceipt(false)} 
             />
         )}
      </AnimatePresence>

    </div>
  );
};

// --- Helper Components ---

const SocialPill: React.FC<{ href: string, iconUrl?: string, label: string, color: string, small?: boolean }> = ({ href, iconUrl, label, color, small }) => (
    <a 
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`bg-black/40 backdrop-blur-md border border-white/10 text-stone-300 flex items-center gap-2 rounded-full transition-all duration-300 ${color} hover:text-white ${small ? 'px-3 py-1' : 'px-4 py-2'}`}
    >
        {iconUrl ? (
            <img src={iconUrl} alt={label} className="w-3 h-3 rounded-full" />
        ) : (
             <Globe size={14} /> 
        )}
        <span className={`font-['Space_Mono'] font-bold ${small ? 'text-[9px]' : 'text-[10px]'}`}>{label}</span>
    </a>
);

const RoundButton: React.FC<{ children: React.ReactNode, onClick: () => void, small?: boolean }> = ({ children, onClick, small }) => (
    <button 
        onClick={onClick}
        className={`${small ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-[#333] border border-[#444] shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center text-stone-400 hover:text-white active:scale-95 transition-all`}
    >
        {children}
    </button>
);

const FloatingGlitchElements = () => {
    return (
        <>
            <motion.div 
                className="absolute top-[15%] left-[10%] text-stone-600 font-['Space_Mono'] text-xs opacity-50"
                animate={{ opacity: [0.3, 0.6, 0.3], x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                <div>SYSTEM.INIT</div>
                <div className="text-[10px]">MEM: 64KB OK</div>
            </motion.div>
        </>
    )
}

export default App;
