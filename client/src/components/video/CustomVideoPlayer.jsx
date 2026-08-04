import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  Check, 
  Gauge,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const DEFAULT_FALLBACK_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';
const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
const QUALITY_OPTIONS = ['Auto (1080p)', '720p HD', '480p SD', '360p Data Saver'];

export function CustomVideoPlayer({ 
  src, 
  title = 'Course Video Lesson',
  onEnded,
  poster = ''
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const { user } = useAuth();

  const [videoSrc, setVideoSrc] = useState(src || DEFAULT_FALLBACK_VIDEO);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [selectedQuality, setSelectedQuality] = useState('Auto (1080p)');
  
  // Controls & Dropdown States
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const hideControlsTimer = useRef(null);

  const userEmail = user?.email || 'student@classconnect.com';

  useEffect(() => {
    const targetSrc = src || DEFAULT_FALLBACK_VIDEO;
    setVideoSrc(targetSrc);
    setHasError(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  // Handle Video Error Fallback
  const handleVideoError = () => {
    if (hasError) return;
    console.warn('Primary stream failed. Switching to guaranteed fallback video.');
    setHasError(true);
    setVideoSrc(DEFAULT_FALLBACK_VIDEO);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  // Toggle Play / Pause
  const togglePlay = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const promise = video.play();
      if (promise !== undefined) {
        promise.then(() => setIsPlaying(true)).catch(handleVideoError);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Sync state on HTML5 native play/pause events
  const handleNativePlay = () => setIsPlaying(true);
  const handleNativePause = () => setIsPlaying(false);

  // Time Updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  // Seek Timeline
  const handleSeek = (e) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Skip 10 Seconds Forward / Backward
  const skipTime = (e, seconds) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newTime = Math.min(
        Math.max(videoRef.current.currentTime + seconds, 0),
        duration || 1000
      );
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Change Speed
  const handleSpeedChange = (e, speed) => {
    e.stopPropagation();
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  // Change Volume
  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  // Format Seconds to MM:SS or HH:MM:SS
  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec) || timeInSec <= 0) return '00:00';
    const hours = Math.floor(timeInSec / 3600);
    const minutes = Math.floor((timeInSec % 3600) / 60);
    const seconds = Math.floor(timeInSec % 60);

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Auto hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group select-none flex items-center justify-center font-sans"
    >
      {/* HTML5 VIDEO ELEMENT */}
      <video
        ref={videoRef}
        key={videoSrc}
        poster={poster}
        onPlay={handleNativePlay}
        onPause={handleNativePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        onError={handleVideoError}
        preload="auto"
        playsInline
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={DEFAULT_FALLBACK_VIDEO} type="video/mp4" />
      </video>

      {/* DYNAMIC FLOATING EMAIL TEXT WATERMARK (Plain text only, clearly visible, no box) */}
      {isPlaying && (
        <motion.div
          animate={{
            x: ['10%', '65%', '20%', '75%', '10%'],
            y: ['15%', '70%', '30%', '65%', '15%'],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute z-20 pointer-events-none select-none text-white/70 font-mono text-xs font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {userEmail}
        </motion.div>
      )}

      {/* Center Play Button Overlay */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[var(--primary)] text-white shadow-2xl z-20 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Play Video"
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* CUSTOM CONTROL TOOLBAR OVERLAY AT THE BOTTOM */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-2 text-white"
          >
            {/* Timeline Progress Slider */}
            <div className="relative w-full flex items-center group/slider">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                style={{
                  background: `linear-gradient(to right, #3B82F6 ${duration > 0 ? (currentTime / duration) * 100 : 0}%, rgba(255, 255, 255, 0.25) ${duration > 0 ? (currentTime / duration) * 100 : 0}%)`
                }}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
              />
            </div>

            {/* Bottom Controls Toolbar Bar */}
            <div className="flex items-center justify-between gap-2 pt-1">
              
              {/* Left Controls: Play/Pause, Rewind 10s, Forward 10s, Volume, Time */}
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="hover:text-[var(--primary)] transition-colors cursor-pointer p-1">
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button onClick={(e) => skipTime(e, -10)} className="hover:text-[var(--primary)] transition-colors cursor-pointer p-1" title="Rewind 10s">
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>

                <button onClick={(e) => skipTime(e, 10)} className="hover:text-[var(--primary)] transition-colors cursor-pointer p-1" title="Forward 10s">
                  <RotateCw className="w-4.5 h-4.5" />
                </button>

                {/* Volume Slider & Mute Toggle */}
                <div className="flex items-center gap-1.5 group/vol">
                  <button onClick={toggleMute} className="hover:text-[var(--primary)] transition-colors cursor-pointer p-1">
                    {isMuted || volume === 0 ? <VolumeX className="w-4.5 h-4.5 text-red-400" /> : <Volume2 className="w-4.5 h-4.5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                <span className="text-xs font-mono font-semibold text-white/80">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls: Playback Speed, Quality Settings, Fullscreen */}
              <div className="flex items-center gap-2 relative">

                {/* Speed Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); setShowQualityMenu(false); }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Playback Speed"
                  >
                    <Gauge className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>{playbackSpeed === 1.0 ? '1.0x' : `${playbackSpeed}x`}</span>
                  </button>

                  <AnimatePresence>
                    {showSpeedMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-10 right-0 w-36 rounded-xl bg-slate-900/95 border border-white/20 backdrop-blur-md p-1 shadow-2xl z-50 text-xs text-white"
                      >
                        <div className="px-2 py-1 text-[10px] font-black uppercase text-white/50 border-b border-white/10 mb-1">
                          Speed Options
                        </div>
                        {SPEED_OPTIONS.map((speed) => (
                          <button
                            key={speed}
                            onClick={(e) => handleSpeedChange(e, speed)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                              playbackSpeed === speed ? 'bg-[var(--primary)] text-white font-bold' : 'hover:bg-white/10 text-white/80'
                            }`}
                          >
                            <span>{speed === 1.0 ? 'Normal (1.0x)' : `${speed}x`}</span>
                            {playbackSpeed === speed && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Stream Quality Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowQualityMenu(!showQualityMenu); setShowSpeedMenu(false); }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Stream Quality"
                  >
                    <Settings className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span className="hidden sm:inline">{selectedQuality.split(' ')[0]}</span>
                  </button>

                  <AnimatePresence>
                    {showQualityMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-10 right-0 w-44 rounded-xl bg-slate-900/95 border border-white/20 backdrop-blur-md p-1 shadow-2xl z-50 text-xs text-white"
                      >
                        <div className="px-2 py-1 text-[10px] font-black uppercase text-white/50 border-b border-white/10 mb-1">
                          Stream Quality
                        </div>
                        {QUALITY_OPTIONS.map((q) => (
                          <button
                            key={q}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuality(q);
                              setShowQualityMenu(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                              selectedQuality === q ? 'bg-[var(--primary)] text-white font-bold' : 'hover:bg-white/10 text-white/80'
                            }`}
                          >
                            <span>{q}</span>
                            {selectedQuality === q && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fullscreen Button */}
                <button onClick={toggleFullscreen} className="hover:text-[var(--primary)] transition-colors cursor-pointer p-1" title="Fullscreen">
                  {isFullscreen ? <Minimize className="w-4.5 h-4.5" /> : <Maximize className="w-4.5 h-4.5" />}
                </button>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
