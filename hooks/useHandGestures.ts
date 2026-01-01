import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

export type GestureType = 'NONE' | 'SWIPE_LEFT' | 'SWIPE_RIGHT' | 'SWIPE_UP' | 'OPEN_PALM' | 'CLOSED_FIST';

interface HandGestureHook {
  gesture: GestureType;
  isLoaded: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useHandGestures = (): HandGestureHook => {
  const [gesture, setGesture] = useState<GestureType>('NONE');
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  
  // Logic Refs (to avoid re-renders)
  const lastGestureTime = useRef<number>(0);
  const historyRef = useRef<{x: number, y: number, time: number}[]>([]);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });

      startWebcam();
    };

    init();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject as MediaStream;
         stream.getTracks().forEach(track => track.stop());
      }
      cancelAnimationFrame(frameIdRef.current);
    };
  }, []);

  const startWebcam = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240, facingMode: "user" } 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener('loadeddata', predictWebcam);
      setIsLoaded(true);
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const predictWebcam = () => {
    if (!handLandmarkerRef.current || !videoRef.current) return;

    const nowInMs = Date.now();
    const results = handLandmarkerRef.current.detectForVideo(videoRef.current, nowInMs);

    if (results.landmarks && results.landmarks.length > 0) {
      processLandmarks(results.landmarks[0], nowInMs);
    } else {
        // Reset history if hand lost
       historyRef.current = [];
    }

    frameIdRef.current = requestAnimationFrame(predictWebcam);
  };

  const processLandmarks = (landmarks: any[], time: number) => {
    // 1. Extract Key Points
    // 0 = wrist, 8 = index tip, 12 = middle tip, 4 = thumb tip
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    // 2. Add to history for Swipe Detection (using Wrist for stability)
    historyRef.current.push({ x: wrist.x, y: wrist.y, time });
    if (historyRef.current.length > 10) historyRef.current.shift();

    // 3. Cooldown check
    if (time - lastGestureTime.current < 800) return; // 800ms cooldown between gestures

    // --- GESTURE LOGIC ---

    // A. Detect Swipes (Dynamic)
    if (historyRef.current.length >= 5) {
        const start = historyRef.current[0];
        const end = historyRef.current[historyRef.current.length - 1];
        const diffX = start.x - end.x; // Camera is mirrored usually? Let's assume standard.
        // Actually, for front camera: moving hand RIGHT (viewer's right) usually decreases X (0 is left, 1 is right? No, usually 0 left).
        // Let's rely on movement delta.
        // Moving hand Left (Screen Left) -> x decreases.
        // Moving hand Right (Screen Right) -> x increases.
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        
        // Swipe Threshold
        const SWIPE_THRESHOLD = 0.15; // 15% of screen width movement

        if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal Swipe
            if (deltaX < 0) {
                // Moving Left (in camera coords). 
                // Note: Webcams are often mirrored. If mirrored, moving hand RIGHT (physically) moves image LEFT.
                // We will trigger 'SWIPE_RIGHT' (Next) for this vector to feel natural if mirrored.
                trigger('SWIPE_RIGHT'); 
                return;
            } else {
                trigger('SWIPE_LEFT'); // Prev
                return;
            }
        }

        if (deltaY < -SWIPE_THRESHOLD && Math.abs(deltaY) > Math.abs(deltaX)) {
            // Moving UP (y decreases as you go up in canvas coords)
            trigger('SWIPE_UP');
            return;
        }
    }

    // B. Detect Static Poses (Open/Closed)
    // Simple heuristic: Distance between Wrist(0) and Middle Finger Tip(12)
    const handSize = Math.sqrt(Math.pow(indexTip.x - wrist.x, 2) + Math.pow(indexTip.y - wrist.y, 2)); // Use index as reference for scale
    
    // Check if fingers are extended (Open Palm)
    // If tips are far from wrist relative to hand scale
    const tips = [indexTip, middleTip, ringTip, pinkyTip];
    const avgTipDist = tips.reduce((acc, tip) => {
        return acc + Math.sqrt(Math.pow(tip.x - wrist.x, 2) + Math.pow(tip.y - wrist.y, 2));
    }, 0) / 4;

    // Check if fingers are curled (Fist)
    // Tips close to wrist (or palm center 9)
    const isFist = avgTipDist < 0.2; // Threshold needs tuning based on Z-depth, but relative heuristic works okay
    const isOpen = avgTipDist > 0.4; 

    // Additional check: Thumb position for "Open"
    // Open Palm usually has all fingers spread.
    
    if (isOpen) {
        trigger('OPEN_PALM');
    } else if (isFist) {
        trigger('CLOSED_FIST');
    }
  };

  const trigger = (g: GestureType) => {
    setGesture(g);
    lastGestureTime.current = Date.now();
    
    // Reset gesture state after a short delay so UI can react
    setTimeout(() => setGesture('NONE'), 1000);
  };

  return { gesture, isLoaded, videoRef };
};