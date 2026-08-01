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
  PictureInPicture2,
  Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_FALLBACK_VIDEO = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
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

  useEffect(() => {
    const targetSrc = src || DEFAULT_FALLBACK_VIDEO;
    setVideoSrc(targetSrc);
    setHasError(false);
    setIsPlaying(false);
  }, [src]);

  // Handle Video Error & Fallback to reliable stream
  const handleVideoError = () => {
    if (hasError) return;
    console.warn('Video load error. Switching to HTML5 fallback stream.');
    setHasError(true);
    setVideoSrc(DEFAULT_FALLBACK_VIDEO);
  };

  // Toggle Play / Pause synchronously
  const togglePlay = (e) => {
    if (e) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Playback error:', err);
            handleVideoError();
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

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

  // Skip 10 Seconds
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

  // Toggle Picture-in-Picture
  const togglePiP = async (e) => {
    e.stopPropagation();
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Format Seconds to MM:SS
  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec)) return '00:00';
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
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
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        onError={handleVideoError}
        crossOrigin="anonymous"
        preload="metadata"
        playsInline
        className="w-full h-full object-contain"
      />

      {/* Fallback Banner */}
      {hasError && (
        <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md z-30">
          ⚡ Auto-switched to reliable HTML5 video stream
        </div>
      )}

      {/* Overlay Play/Pause Big Center Button */}
      <AnimatePresence>
        {(!isPlaying || showControls) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/25 hover:bg-[var(--primary)] text-white backdrop-blur-md flex items-center justify-center transition-all shadow-2xl z-20 cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Custom Control Toolbar Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2 text-white"
          >
            {/* Timeline Progress Slider */}
            <div className="relative w-full flex items-center group/slider">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[var(--primary,#5B54E8)] focus:outline-none"
              />
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between gap-2 pt-1">
              
              {/* Left Controls: Play, Rewind, Forward, Volume, Time */}
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="hover:text-[var(--primary)] transition-colors cursor-pointer p-1">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <button onClick={(e) => skipTime(e, -10)} className="hover:text-[var(--primary)] transition-colors cursor-pointer p-1" title="Rewind 10s">
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>

                <button onClick={(e) => skipTime(e, 10)} className="hover:text-[var(--primary)] transition-colors cursor-pointer p-1" title="Forward 10s">
                  <RotateCw className="w-4.5 h-4.5" />
                </button>

                {/* Volume slider */}
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

              {/* Right Controls: Speed Menu, Quality Menu, PiP, Fullscreen */}
              <div className="flex items-center gap-2 relative">

                {/* Speed Dropdown Trigger */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); setShowQualityMenu(false); }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Playback Speed"
                  >
                    <Gauge className="w-3.5 h-3.5" />
                    <span>{playbackSpeed === 1.0 ? '1.0x' : `${playbackSpeed}x`}</span>
                  </button>

                  <AnimatePresence>
                    {showSpeedMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-10 right-0 w-36 rounded-xl bg-slate-900/95 border border-white/20 backdrop-blur-md p-1 shadow-2xl z-50 text-xs"
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

                {/* Quality Dropdown Trigger */}
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowQualityMenu(!showQualityMenu); setShowSpeedMenu(false); }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Video Quality"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{selectedQuality.split(' ')[0]}</span>
                  </button>

                  <AnimatePresence>
                    {showQualityMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-10 right-0 w-44 rounded-xl bg-slate-900/95 border border-white/20 backdrop-blur-md p-1 shadow-2xl z-50 text-xs"
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

                {/* Picture in Picture */}
                <button onClick={togglePiP} className="hover:text-[var(--primary)] transition-colors cursor-pointer p-1" title="Picture-in-Picture">
                  <PictureInPicture2 className="w-4.5 h-4.5" />
                </button>

                {/* Fullscreen */}
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
