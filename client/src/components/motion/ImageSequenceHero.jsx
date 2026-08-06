import React, { useEffect, useRef, useState } from 'react';
import { ShimmerButton } from './ShimmerButton';

const TOTAL_FRAMES = 240;
const SLIDING_WINDOW_RADIUS = 20;

export const ImageSequenceHero = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textBeatRef = useRef(null);
  const textBeatContentRef = useRef(null);
  const progressBarRef = useRef(null);
  const diagnosticRef = useRef(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Non-React state refs to prevent re-renders on scroll
  const imagesCacheRef = useRef(new Map());
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const activeBeatRef = useRef(-1);

  // Get frame URL for 1-based index
  const getFrameUrl = (index) => {
    const padIndex = String(Math.min(TOTAL_FRAMES, Math.max(1, index))).padStart(3, '0');
    return `/hero-frames/ezgif-frame-${padIndex}.jpg`;
  };

  useEffect(() => {
    // Media feature checks
    const checkMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const checkMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

    setIsReducedMotion(checkMotion);
    setIsMobile(checkMobile);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Frame loading manager (Immediate poster + sliding window + coarse background fill)
  useEffect(() => {
    let isCancelled = false;

    const loadSingleFrame = (frameIndex) => {
      if (imagesCacheRef.current.has(frameIndex)) {
        return Promise.resolve(imagesCacheRef.current.get(frameIndex));
      }
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameUrl(frameIndex);
        img.onload = () => {
          if (!isCancelled) {
            imagesCacheRef.current.set(frameIndex, img);
            setLoadedCount(imagesCacheRef.current.size);
            resolve(img);
          }
        };
        img.onerror = () => resolve(null);
      });
    };

    // 1. Immediately load poster frame 001
    loadSingleFrame(1);

    // 2. Coarse milestone preload (every 6th frame) for instant seek coverage
    const coarseFrames = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += 6) {
      coarseFrames.push(i);
    }

    const loadCoarseFrames = async () => {
      for (const frame of coarseFrames) {
        if (isCancelled) break;
        await loadSingleFrame(frame);
      }
    };

    loadCoarseFrames();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Sliding window loader based on target frame
  const loadSlidingWindow = (centerFrame) => {
    const min = Math.max(1, centerFrame - SLIDING_WINDOW_RADIUS);
    const max = Math.min(TOTAL_FRAMES, centerFrame + SLIDING_WINDOW_RADIUS);

    for (let i = min; i <= max; i++) {
      if (!imagesCacheRef.current.has(i)) {
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          imagesCacheRef.current.set(i, img);
          setLoadedCount(imagesCacheRef.current.size);
        };
      }
    }
  };

  // Canvas render & animation loop
  useEffect(() => {
    if (isReducedMotion || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Draw frame with object-fit: cover logic
    const drawFrame = (frameNum) => {
      let img = imagesCacheRef.current.get(frameNum);
      
      // Fallback to nearest loaded frame if current frame is not cached yet
      if (!img) {
        let fallbackFrame = frameNum;
        for (let diff = 1; diff < TOTAL_FRAMES; diff++) {
          if (imagesCacheRef.current.has(frameNum - diff)) {
            fallbackFrame = frameNum - diff;
            break;
          }
          if (imagesCacheRef.current.has(frameNum + diff)) {
            fallbackFrame = frameNum + diff;
            break;
          }
        }
        img = imagesCacheRef.current.get(fallbackFrame);
      }

      if (!img || !ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;

      const scale = Math.max(cw / iw, ch / ih);
      const x = (cw - iw * scale) / 2;
      const y = (ch - ih * scale) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, iw * scale, ih * scale);
    };

    // Text Beats Data
    const storyBeats = [
      { start: 0.0, end: 0.28, text: "Learning, re-engineered.", sub: "Built for speed, depth, and mastery." },
      { start: 0.35, end: 0.65, text: "Choose your momentum.", sub: "Industry-proven tracks designed by top engineers." },
      { start: 0.72, end: 1.0, text: "Start what changes everything.", sub: "Unlock your full potential today." }
    ];

    const renderLoop = () => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        
        if (totalScrollable > 0) {
          // Calculate scrollProgress strictly within container bounds [0, 1]
          const scrollProgress = Math.min(1, Math.max(0, -rect.top / totalScrollable));
          const calculatedTarget = Math.round(1 + scrollProgress * (TOTAL_FRAMES - 1));
          targetFrameRef.current = calculatedTarget;

          // Preload sliding window around calculated target
          loadSlidingWindow(calculatedTarget);

          // Update progress line directly in DOM
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${(scrollProgress * 100).toFixed(1)}%`;
          }

          // Story beat update
          let currentBeat = -1;
          for (let i = 0; i < storyBeats.length; i++) {
            if (scrollProgress >= storyBeats[i].start && scrollProgress <= storyBeats[i].end) {
              currentBeat = i;
              break;
            }
          }

          if (textBeatRef.current && textBeatContentRef.current) {
            if (currentBeat !== -1) {
              const beat = storyBeats[currentBeat];
              if (activeBeatRef.current !== currentBeat) {
                activeBeatRef.current = currentBeat;
                textBeatContentRef.current.innerHTML = `
                  <h2 class="font-display text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#F7F7F5] drop-shadow-lg">
                    ${beat.text}
                  </h2>
                  <p class="font-body mt-3 text-base sm:text-xl text-[#A8A8AE] font-normal">
                    ${beat.sub}
                  </p>
                `;
              }
              textBeatRef.current.style.opacity = '1';
              textBeatRef.current.style.transform = 'translateY(0px)';
            } else {
              activeBeatRef.current = -1;
              textBeatRef.current.style.opacity = '0';
              textBeatRef.current.style.transform = 'translateY(16px)';
            }
          }
        }
      }

      // Responsive interpolation toward target frame
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.45;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      drawFrame(frameToDraw);

      // Dev diagnostic DOM update
      if (diagnosticRef.current && import.meta.env.DEV) {
        diagnosticRef.current.innerText = `DEV DIAGNOSTIC | Frame: ${frameToDraw}/${TOTAL_FRAMES} | Target: ${targetFrameRef.current} | Cached: ${imagesCacheRef.current.size}/${TOTAL_FRAMES}`;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animId);
    };
  }, [isReducedMotion, isMobile]);

  // Reduced Motion / Mobile Fallback
  if (isReducedMotion || isMobile) {
    return (
      <section className="relative min-h-[85vh] w-full flex flex-col justify-center items-center bg-[#050505] px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-redline-glow pointer-events-none opacity-60" />
        
        <div className="absolute inset-0 opacity-40 z-0">
          <img
            src="/hero-frames/ezgif-frame-001.jpg"
            alt="Redline Hero Poster"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-20">
          <span className="inline-block px-3 py-1 rounded-full bg-[#9F1018]/30 border border-[#FF2A2A]/40 text-[#FF4D3D] font-mono text-xs uppercase tracking-widest">
            Redline Learning System
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-light text-[#F7F7F5] leading-tight">
            Learning, <span className="text-[#FF2A2A] font-normal">re-engineered.</span>
          </h1>
          <p className="font-body text-lg sm:text-xl text-[#A8A8AE] max-w-2xl mx-auto">
            Choose your momentum with industry-proven learning tracks designed by top engineers.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <ShimmerButton href="/courses">
              Explore Courses →
            </ShimmerButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[400vh] w-full bg-[#050505]">
      {/* Pinned Sticky Viewport Window */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Canvas Element */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />

        {/* Ambient Dark Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/70 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80 pointer-events-none z-10" />

        {/* Story Text Beat Overlay */}
        <div
          ref={textBeatRef}
          className="absolute z-20 max-w-3xl px-6 text-center transition-all duration-300 pointer-events-none"
          style={{ opacity: 0, transform: 'translateY(16px)' }}
        >
          <div ref={textBeatContentRef} />
        </div>

        {/* Top Header Badging */}
        <div className="absolute top-28 sm:top-32 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B0B0D]/80 border border-white/10 backdrop-blur-md text-xs font-mono text-[#A8A8AE]">
            <span className="w-2 h-2 rounded-full bg-[#FF2A2A] animate-pulse" />
            REDLINE OPERATING SYSTEM
          </span>
        </div>

        {/* Scroll Progress Line Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#A8A8AE]/80">
            Scroll to explore
          </span>
          <div className="w-36 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#9F1018] via-[#FF2A2A] to-[#FF4D3D] w-0 transition-all duration-75"
            />
          </div>
        </div>

        {/* Dev-Only Diagnostic Bar */}
        {import.meta.env.DEV && (
          <div
            ref={diagnosticRef}
            className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded bg-black/90 border border-red-500/50 text-[11px] font-mono text-red-400 pointer-events-none shadow-lg"
          >
            DEV DIAGNOSTIC | Initializing...
          </div>
        )}
      </div>
    </section>
  );
};
