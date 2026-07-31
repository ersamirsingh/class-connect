import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { enrollmentApi } from '../../api/models/enrollment.api';
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  FileText,
  Award,
  ArrowLeft,
  Loader2,
  Download,
  BookOpen,
  Check,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Pause,
  Play,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const VideoWatermark = () => {
  const { user } = useAuth();
  const [pos, setPos] = useState({ x: 10, y: 10 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPos({
        x: Math.random() * 60 + 5,
        y: Math.random() * 60 + 10,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <div
      className="absolute pointer-events-none z-20 transition-all duration-[3000ms] ease-linear"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <div className="text-white/15 text-xs font-bold whitespace-nowrap select-none" style={{ textShadow: '0 0 2px rgba(255,255,255,0.1)' }}>
        {user.email}
      </div>
    </div>
  );
};

export const VideoPlayerPage = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum');

  // Player state
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const controlsTimeout = useRef(null);

  // Screenshot prevention
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Block PrintScreen, Ctrl+Shift+S, Ctrl+P, etc.
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) ||
        (e.ctrlKey && (e.key === 'p' || e.key === 'P')) ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  useEffect(() => {
    const initLearningRoom = async () => {
      try {
        setLoading(true);
        const courseRes = await courseApi.getCourseByIdOrSlug(courseId);

        if (courseRes.success && courseRes.data) {
          setCourse(courseRes.data);
          const firstLec = courseRes.data.sections?.[0]?.lectures?.[0];
          if (firstLec) setActiveLecture(firstLec);

          try {
            const enrollRes = await enrollmentApi.getMyEnrollments();
            if (enrollRes.success && enrollRes.data) {
              const targetId = courseRes.data._id.toString();
              const myCourseEnrollment = enrollRes.data.find(
                (e) => (e.course?._id || e.course)?.toString() === targetId || e.course?.slug === courseId
              );
              if (myCourseEnrollment?.completedLectures) {
                setCompletedLectures(myCourseEnrollment.completedLectures);
              }
            }
          } catch (eErr) {
            console.log('Enrollments check skipped for learning room:', eErr);
          }
        }
      } catch (err) {
        console.error('Failed to initialize learning room:', err);
      } finally {
        setLoading(false);
      }
    };
    initLearningRoom();
  }, [courseId]);

  // Reset player when lecture changes
  useEffect(() => {
    if (videoRef.current && activeLecture?.videoUrl) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setCurrentTime(0);
    }
  }, [activeLecture]);

  const handleMarkComplete = async () => {
    if (!activeLecture || !course) return;
    try {
      setMarking(true);
      const lecId = activeLecture._id || activeLecture.title;
      await enrollmentApi.markComplete(course._id, lecId);
      if (!completedLectures.includes(lecId)) {
        setCompletedLectures((prev) => [...prev, lecId]);
      }
    } catch (err) {
      console.error('Failed to mark complete:', err);
    } finally {
      setMarking(false);
    }
  };

  // Player controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * duration;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changeSpeed = (rate) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
    }
  };

  // Navigate to next/prev lecture
  const allLectures = course?.sections?.flatMap((s) => s.lectures) || [];
  const currentIndex = allLectures.findIndex((l) => (l._id || l.title) === (activeLecture?._id || activeLecture?.title));

  const goNext = () => {
    if (currentIndex < allLectures.length - 1) setActiveLecture(allLectures[currentIndex + 1]);
  };
  const goPrev = () => {
    if (currentIndex > 0) setActiveLecture(allLectures[currentIndex - 1]);
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090D16]">
        <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mb-3" />
        <span className="text-xs font-bold text-slate-400">Loading learning room...</span>
      </div>
    );
  }

  const isCurrentCompleted =
    activeLecture && completedLectures.includes(activeLecture._id || activeLecture.title);

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col select-none" onContextMenu={(e) => e.preventDefault()}>
      {/* Top Learning Room Header */}
      <header className="bg-[#111827] border-b border-slate-800 px-6 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg line-clamp-1">{course?.title}</h1>
            <span className="text-xs text-slate-400 font-medium">
              Lecture {currentIndex + 1} of {allLectures.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentIndex > 0 && (
            <button onClick={goPrev} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Previous Lecture">
              <SkipBack className="w-4 h-4" />
            </button>
          )}
          {currentIndex < allLectures.length - 1 && (
            <button onClick={goNext} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Next Lecture">
              <SkipForward className="w-4 h-4" />
            </button>
          )}
          {course && (
            <Link
              to={`/certificate/${course._id}`}
              className="btn-visual bg-[#10B981] text-white hover:bg-[#10B981]/90 text-xs font-extrabold px-4 py-2"
            >
              <Award className="w-4 h-4" /> Certificate
            </Link>
          )}
        </div>
      </header>

      {/* Main Classroom Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Player Area */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
          {/* Custom Video Player */}
          <div
            ref={playerRef}
            className="rounded-3xl overflow-hidden shadow-2xl relative bg-black group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowControls(false)}
          >
            {activeLecture?.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={activeLecture.videoUrl}
                  className="w-full h-80 sm:h-[480px] object-contain bg-black cursor-pointer"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePlay}
                  onDoubleClick={toggleFullscreen}
                />

                <VideoWatermark />

                {/* Center Play/Pause Overlay */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#6366F1]/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer z-10"
                  >
                    <Play className="w-10 h-10 fill-white ml-1" />
                  </button>
                )}

                {/* Bottom Controls Bar */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-10 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                  {/* Progress Bar */}
                  <div
                    className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/progress"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-[#6366F1] rounded-full relative"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={togglePlay} className="text-white hover:text-[#6366F1] transition-colors">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button onClick={() => skipTime(-10)} className="text-white/70 hover:text-white text-[10px] font-bold">-10s</button>
                      <button onClick={() => skipTime(10)} className="text-white/70 hover:text-white text-[10px] font-bold">+10s</button>

                      <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 accent-[#6366F1] cursor-pointer"
                      />

                      <span className="text-[11px] font-bold text-white/60 tabular-nums">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 relative">
                      {/* Playback Speed */}
                      <div className="relative">
                        <button
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                          className="text-[11px] font-extrabold text-white/70 hover:text-white px-2 py-1 rounded-lg bg-white/10 flex items-center gap-1"
                        >
                          <Settings className="w-3 h-3" /> {playbackRate}x
                        </button>
                        {showSpeedMenu && (
                          <div className="absolute bottom-full right-0 mb-2 bg-[#111827] border border-slate-700 rounded-xl p-1 shadow-xl z-20">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
                              <button
                                key={r}
                                onClick={() => changeSpeed(r)}
                                className={`block w-full px-3 py-1.5 text-[11px] font-bold rounded-lg text-left ${playbackRate === r ? 'bg-[#6366F1] text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                              >
                                {r}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors">
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-80 sm:h-[480px] flex items-center justify-center text-slate-500 font-bold">
                Select a lecture to start playing
              </div>
            )}
          </div>

          {/* Active Lecture Control Card */}
          <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#06B6D4] uppercase">Now Playing</div>
              <h2 className="text-xl font-black text-white mt-0.5">{activeLecture?.title || 'Lecture Video'}</h2>
              <span className="text-xs font-medium text-slate-400">Duration: {activeLecture?.duration || '10 mins'}</span>
            </div>

            <button
              onClick={handleMarkComplete}
              disabled={marking || isCurrentCompleted}
              className={`btn-visual text-xs font-extrabold px-6 py-3 shadow-lg ${
                isCurrentCompleted
                  ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                  : 'btn-primary'
              }`}
            >
              {isCurrentCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> Completed
                </>
              ) : marking ? (
                <span>Marking...</span>
              ) : (
                <>
                  <Check className="w-5 h-5" /> Mark as Completed
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar Curriculum & Resources */}
        <div className="w-full lg:w-96 bg-[#111827] border-l border-slate-800 flex flex-col shrink-0">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'curriculum'
                  ? 'border-b-2 border-[#6366F1] text-[#6366F1]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'resources'
                  ? 'border-b-2 border-[#6366F1] text-[#6366F1]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Resources
            </button>
          </div>

          {/* Curriculum List */}
          {activeTab === 'curriculum' ? (
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {course?.sections?.map((sec, sIdx) => (
                <div key={sec._id || sIdx} className="space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {sec.title}
                  </div>
                  <div className="space-y-1.5">
                    {sec.lectures?.map((lec, lIdx) => {
                      const isSelected = (activeLecture?._id || activeLecture?.title) === (lec._id || lec.title);
                      const isDone = completedLectures.includes(lec._id || lec.title);
                      return (
                        <div
                          key={lec._id || lIdx}
                          onClick={() => setActiveLecture(lec)}
                          className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-[#6366F1] text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-[#06B6D4] shrink-0" />
                            )}
                            <span className="line-clamp-1">{lec.title}</span>
                          </div>
                          <span className="text-[10px] opacity-70">{lec.duration || '10m'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Resources Tab */
            <div className="p-4 space-y-3 flex-1">
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/20 text-[#06B6D4] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Course CheatSheet.pdf</div>
                    <div className="text-[10px] text-slate-400">2.4 MB • PDF Document</div>
                  </div>
                </div>
                <button className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
