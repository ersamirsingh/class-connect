import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import { courseApi } from '../../../api/models/course.api';
import { categoryApi } from '../../../api/models/category.api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Search, 
  AlertCircle, 
  Layers, 
  ChevronRight, 
  PlayCircle, 
  ArrowLeft, 
  Video, 
  Clock, 
  FileText, 
  Save, 
  CheckCircle2,
  FolderPlus
} from 'lucide-react';
import { SAMPLE_COURSES } from '../../../data/sampleData';

export function ManageCoursesPage() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Navigation Flow States: 'courses' | 'topics' | 'lectures'
  const [viewMode, setViewMode] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Modal states for Basic Info / Deletion / Edit Lecture
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null); // null for new, object for edit
  const [lectureForm, setLectureForm] = useState({
    title: '',
    duration: '',
    videoUrl: '',
    description: ''
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'course'|'topic'|'lecture', data, index }

  // Course Form state
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    thumbnail: '',
    type: 'recorded'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseRes, categoryRes] = await Promise.all([
        courseApi.getAllCoursesAdmin().catch(() => ({ data: [] })),
        categoryApi.getAllCategoriesAdmin().catch(() => ({ data: [] }))
      ]);
      const loadedCourses = Array.isArray(courseRes.data)
        ? courseRes.data
        : (courseRes.data?.courses || (Array.isArray(courseRes) ? courseRes : SAMPLE_COURSES));
      const loadedCategories = Array.isArray(categoryRes.data)
        ? categoryRes.data
        : (categoryRes.data?.categories || (Array.isArray(categoryRes) ? categoryRes : []));

      setCourses(loadedCourses.length > 0 ? loadedCourses : SAMPLE_COURSES);
      setCategories(loadedCategories);
    } catch (err) {
      console.error(err);
      setCourses(SAMPLE_COURSES);
    } finally {
      setLoading(false);
    }
  };

  // --- 1. COURSE LEVEL HANDLERS ---
  const handleOpenCourseModal = (course = null) => {
    setError('');
    if (course) {
      setEditingCourse(course);
      setCourseFormData({
        title: course.title || '',
        description: course.description || '',
        price: course.price || '',
        category: course.category?._id || course.category || '',
        thumbnail: course.thumbnail || '',
        type: course.type || 'recorded'
      });
    } else {
      setEditingCourse(null);
      setCourseFormData({ title: '', description: '', price: '', category: '', thumbnail: '', type: 'recorded' });
    }
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      if (editingCourse) {
        await courseApi.updateCourse(editingCourse._id, courseFormData);
      } else {
        await courseApi.createCourse(courseFormData);
      }
      setIsCourseModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Error saving course');
    } finally {
      setFormLoading(false);
    }
  };

  // Navigate to Manage Topics for a course
  const handleManageCourseTopics = (course) => {
    setSelectedCourse(course);
    setSelectedTopic(null);
    setViewMode('topics');
  };

  // --- 2. TOPIC LEVEL HANDLERS ---
  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !selectedCourse) return;

    const existingSections = selectedCourse.sections || selectedCourse.units || [];
    const newTopic = {
      _id: `topic-${Date.now()}`,
      title: newTopicTitle.trim(),
      lectures: []
    };

    const updatedSections = [...existingSections, newTopic];
    const updatedCourse = { ...selectedCourse, sections: updatedSections };

    setSelectedCourse(updatedCourse);
    setNewTopicTitle('');
    setIsTopicModalOpen(false);

    try {
      await courseApi.updateCourse(selectedCourse._id, { sections: updatedSections });
      setSuccessMsg('Topic added successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.warn('Updated local state:', err);
    }
  };

  const handleRemoveTopic = async (topicIndex) => {
    if (!selectedCourse) return;
    const existingSections = selectedCourse.sections || selectedCourse.units || [];
    const updatedSections = existingSections.filter((_, idx) => idx !== topicIndex);

    const updatedCourse = { ...selectedCourse, sections: updatedSections };
    setSelectedCourse(updatedCourse);

    try {
      await courseApi.updateCourse(selectedCourse._id, { sections: updatedSections });
      setSuccessMsg('Topic removed successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.warn('Updated local state:', err);
    }
  };

  // Navigate to Manage Lectures for a topic
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setViewMode('lectures');
  };

  // --- 3. LECTURE LEVEL HANDLERS ---
  const handleOpenLectureModal = (lecture = null) => {
    if (lecture) {
      setEditingLecture(lecture);
      setLectureForm({
        title: lecture.title || '',
        duration: lecture.duration || '',
        videoUrl: lecture.videoUrl || '',
        description: lecture.description || ''
      });
    } else {
      setEditingLecture(null);
      setLectureForm({ title: '', duration: '10:00', videoUrl: '', description: '' });
    }
    setIsLectureModalOpen(true);
  };

  const handleSaveLecture = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedTopic) return;

    const sections = [...(selectedCourse.sections || selectedCourse.units || [])];
    const topicIdx = sections.findIndex(s => (s._id || s.title) === (selectedTopic._id || selectedTopic.title));

    if (topicIdx === -1) return;

    const currentLectures = sections[topicIdx].lectures || [];
    let updatedLectures = [];

    if (editingLecture) {
      // Edit existing lecture
      updatedLectures = currentLectures.map(l => 
        (l._id || l.title) === (editingLecture._id || editingLecture.title)
          ? { ...l, ...lectureForm }
          : l
      );
    } else {
      // Add new lecture
      const newLec = {
        _id: `lec-${Date.now()}`,
        ...lectureForm
      };
      updatedLectures = [...currentLectures, newLec];
    }

    sections[topicIdx] = { ...sections[topicIdx], lectures: updatedLectures };
    const updatedCourse = { ...selectedCourse, sections };

    setSelectedCourse(updatedCourse);
    setSelectedTopic(sections[topicIdx]);
    setIsLectureModalOpen(false);

    try {
      await courseApi.updateCourse(selectedCourse._id, { sections });
      setSuccessMsg('Lecture saved successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.warn('Updated local state:', err);
    }
  };

  const handleRemoveLecture = async (lectureIndex) => {
    if (!selectedCourse || !selectedTopic) return;

    const sections = [...(selectedCourse.sections || selectedCourse.units || [])];
    const topicIdx = sections.findIndex(s => (s._id || s.title) === (selectedTopic._id || selectedTopic.title));

    if (topicIdx === -1) return;

    const updatedLectures = (sections[topicIdx].lectures || []).filter((_, idx) => idx !== lectureIndex);
    sections[topicIdx] = { ...sections[topicIdx], lectures: updatedLectures };

    const updatedCourse = { ...selectedCourse, sections };

    setSelectedCourse(updatedCourse);
    setSelectedTopic(sections[topicIdx]);

    try {
      await courseApi.updateCourse(selectedCourse._id, { sections });
      setSuccessMsg('Lecture removed successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.warn('Updated local state:', err);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[var(--canvas)] min-h-screen text-[var(--ink)] font-sans">
      
      {/* BREADCRUMB & FLOW HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border)] pb-6">
        <div>
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--ink-muted)] mb-2">
            <button 
              onClick={() => { setViewMode('courses'); setSelectedCourse(null); setSelectedTopic(null); }}
              className={`hover:text-[var(--primary)] ${viewMode === 'courses' ? 'text-[var(--primary)]' : ''}`}
            >
              Courses
            </button>

            {selectedCourse && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <button 
                  onClick={() => { setViewMode('topics'); setSelectedTopic(null); }}
                  className={`hover:text-[var(--primary)] ${viewMode === 'topics' ? 'text-[var(--primary)]' : ''}`}
                >
                  {selectedCourse.title}
                </button>
              </>
            )}

            {selectedTopic && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[var(--primary)]">{selectedTopic.title}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope">
            {viewMode === 'courses' && 'Manage Courses'}
            {viewMode === 'topics' && `Topics in "${selectedCourse?.title}"`}
            {viewMode === 'lectures' && `Lectures in "${selectedTopic?.title}"`}
          </h1>
        </div>

        {/* Action Button based on View Mode */}
        <div className="flex items-center gap-3">
          {viewMode !== 'courses' && (
            <button
              onClick={() => {
                if (viewMode === 'lectures') setViewMode('topics');
                else if (viewMode === 'topics') setViewMode('courses');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] rounded-full text-xs font-bold hover:bg-[var(--canvas)] min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {viewMode === 'courses' && (
            <button 
              onClick={() => handleOpenCourseModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-full text-xs font-extrabold hover:bg-[var(--primary-soft)] transition-colors min-h-[44px] shadow-sm"
            >
              <Plus size={18} />
              <span>Add New Course</span>
            </button>
          )}

          {viewMode === 'topics' && (
            <button 
              onClick={() => setIsTopicModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-full text-xs font-extrabold hover:bg-[var(--primary-soft)] transition-colors min-h-[44px] shadow-sm"
            >
              <FolderPlus size={18} />
              <span>Add Topic</span>
            </button>
          )}

          {viewMode === 'lectures' && (
            <button 
              onClick={() => handleOpenLectureModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-full text-xs font-extrabold hover:bg-[var(--primary-soft)] transition-colors min-h-[44px] shadow-sm"
            >
              <Plus size={18} />
              <span>Add Lecture</span>
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. COURSES VIEW MODE (Show All Courses + "Manage" Button) */}
      {/* ========================================================= */}
      {viewMode === 'courses' && (
        <div className="bg-[var(--surface)] p-6 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={18} />
            <input 
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-xl text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-[var(--canvas)] animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => {
                const topicCount = (course.sections || course.units || []).length;
                
                return (
                  <div key={course._id} className="bg-[var(--canvas)] border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs flex flex-col justify-between hover:border-[var(--primary)]/50 transition-all group">
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded-xl bg-black/10 overflow-hidden relative">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary-soft)] to-[var(--aura-violet)]">
                            <Layers className="w-10 h-10 text-[var(--primary)] opacity-40" />
                          </div>
                        )}
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-white/90 backdrop-blur-md text-[var(--ink)] shadow-xs">
                          {course.type === 'live' ? '🔴 Live' : 'Recorded'}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base font-manrope text-[var(--ink)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mt-1">
                          {course.subtitle || course.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-[var(--border)]">
                        <span className="text-[var(--primary)]">₹{course.price}</span>
                        <span className="text-[var(--ink-muted)]">{topicCount} Topics</span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS (MANAGE -> Edit -> Archive) */}
                    <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center gap-2">
                      <button 
                        onClick={() => handleManageCourseTopics(course)}
                        className="flex-1 px-3 py-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-soft)] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 min-h-[38px]"
                      >
                        <Layers className="w-4 h-4" />
                        <span>Manage Topics</span>
                      </button>

                      <button 
                        onClick={() => handleOpenCourseModal(course)} 
                        className="p-2 text-[var(--ink-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface)] rounded-xl border border-[var(--border)] transition-colors"
                        title="Edit Basic Info"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TOPICS VIEW MODE (Show All Topics -> Click to view Lecs) */}
      {/* ========================================================= */}
      {viewMode === 'topics' && selectedCourse && (
        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold font-manrope">Topics & Curriculum Modules</h2>
              <p className="text-xs text-[var(--ink-muted)] font-medium">Click any topic card to manage its lectures.</p>
            </div>
            <button 
              onClick={() => setIsTopicModalOpen(true)}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-full text-xs font-bold hover:bg-[var(--primary-soft)] transition-colors flex items-center gap-1.5 min-h-[38px]"
            >
              <Plus className="w-4 h-4" /> Add Topic
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(selectedCourse.sections || selectedCourse.units || []).map((topic, tIdx) => {
              const lectureCount = (topic.lectures || []).length;

              return (
                <div 
                  key={topic._id || tIdx}
                  className="p-5 rounded-[var(--radius-lg)] bg-[var(--canvas)] border border-[var(--border)] hover:border-[var(--primary)] transition-all flex items-center justify-between gap-4 group cursor-pointer"
                  onClick={() => handleSelectTopic(topic)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-black text-sm shrink-0">
                      T{tIdx + 1}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm font-manrope text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                        {topic.title}
                      </h4>
                      <span className="text-xs font-semibold text-[var(--ink-muted)]">
                        {lectureCount} Lectures inside
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleRemoveTopic(tIdx); }}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove Topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-[var(--ink-muted)] group-hover:text-[var(--primary)] transition-colors" />
                  </div>
                </div>
              );
            })}

            {(selectedCourse.sections || selectedCourse.units || []).length === 0 && (
              <div className="col-span-2 text-center py-12 bg-[var(--canvas)] rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] text-[var(--ink-muted)] font-medium text-sm">
                No topics added yet. Click "Add Topic" to create the first unit.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. LECTURES VIEW MODE (Add / Remove / Edit Lectures)     */}
      {/* ========================================================= */}
      {viewMode === 'lectures' && selectedTopic && (
        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold font-manrope">Lectures in "{selectedTopic.title}"</h2>
              <p className="text-xs text-[var(--ink-muted)] font-medium">Add, edit video links, or remove lectures inside this topic.</p>
            </div>
            <button 
              onClick={() => handleOpenLectureModal()}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-full text-xs font-bold hover:bg-[var(--primary-soft)] transition-colors flex items-center gap-1.5 min-h-[38px]"
            >
              <Plus className="w-4 h-4" /> Add New Lecture
            </button>
          </div>

          <div className="space-y-3">
            {(selectedTopic.lectures || []).map((lecture, lIdx) => (
              <div key={lecture._id || lIdx} className="p-4 rounded-[var(--radius-lg)] bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <PlayCircle className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--ink)]">{lecture.title || `Lecture ${lIdx + 1}`}</h4>
                    <div className="flex items-center gap-3 text-xs text-[var(--ink-muted)] mt-0.5">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lecture.duration || '10 mins'}</span>
                      {lecture.videoUrl && <span className="text-[var(--primary)] flex items-center gap-1"><Video className="w-3 h-3" /> Video Attached</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenLectureModal(lecture)}
                    className="p-2 rounded-xl text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors"
                    title="Edit Lecture"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => handleRemoveLecture(lIdx)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove Lecture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {(selectedTopic.lectures || []).length === 0 && (
              <div className="text-center py-12 bg-[var(--canvas)] rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] text-[var(--ink-muted)] font-medium text-sm">
                No lectures inside this topic yet. Click "Add New Lecture" to attach video content.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS SECTION                                            */}
      {/* ========================================================= */}

      {/* 1. Add / Edit Topic Modal */}
      <AnimatePresence>
        {isTopicModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--surface)] w-full max-w-md rounded-[var(--radius-xl)] shadow-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
                <h3 className="font-extrabold text-lg text-[var(--ink)]">Add Topic to "{selectedCourse?.title}"</h3>
                <button onClick={() => setIsTopicModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTopic} className="space-y-4">
                <div>
                  <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Topic Title</label>
                  <input 
                    type="text" 
                    required 
                    value={newTopicTitle} 
                    onChange={e => setNewTopicTitle(e.target.value)}
                    placeholder="e.g. Unit 1: Foundations & Setup"
                    className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsTopicModalOpen(false)} className="px-4 py-2 text-xs font-bold text-[var(--ink-muted)]">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full shadow-md hover:bg-[var(--primary-soft)] transition-colors min-h-[40px]">
                    Create Topic
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Add / Edit Lecture Modal */}
      <AnimatePresence>
        {isLectureModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--surface)] w-full max-w-lg rounded-[var(--radius-xl)] shadow-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-4">
                <h3 className="font-extrabold text-lg text-[var(--ink)]">
                  {editingLecture ? 'Edit Lecture' : 'Add New Lecture'}
                </h3>
                <button onClick={() => setIsLectureModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveLecture} className="space-y-4">
                <div>
                  <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Lecture Title</label>
                  <input 
                    type="text" 
                    required 
                    value={lectureForm.title} 
                    onChange={e => setLectureForm({ ...lectureForm, title: e.target.value })}
                    placeholder="e.g. Lecture 1: Architecture & Overview"
                    className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Duration</label>
                    <input 
                      type="text" 
                      value={lectureForm.duration} 
                      onChange={e => setLectureForm({ ...lectureForm, duration: e.target.value })}
                      placeholder="e.g. 15:30"
                      className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Video Stream URL</label>
                    <input 
                      type="url" 
                      value={lectureForm.videoUrl} 
                      onChange={e => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                      placeholder="https://cloudinary.com/demo.m3u8"
                      className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Description & Notes</label>
                  <textarea 
                    rows={3} 
                    value={lectureForm.description} 
                    onChange={e => setLectureForm({ ...lectureForm, description: e.target.value })}
                    placeholder="Provide overview or downloadable links..."
                    className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsLectureModalOpen(false)} className="px-4 py-2 text-xs font-bold text-[var(--ink-muted)]">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full shadow-md hover:bg-[var(--primary-soft)] transition-colors min-h-[40px] flex items-center gap-1.5">
                    <Save className="w-4 h-4" />
                    <span>Save Lecture</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Basic Course Info Modal */}
      <AnimatePresence>
        {isCourseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--surface)] w-full max-w-2xl rounded-[var(--radius-xl)] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                <h2 className="text-xl font-bold font-manrope">{editingCourse ? 'Edit Course Basic Info' : 'Add New Course'}</h2>
                <button onClick={() => setIsCourseModalOpen(false)} className="p-2 hover:bg-[var(--canvas)] rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}
                
                <form id="course-form" onSubmit={handleSaveCourse} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Course Title</label>
                    <input 
                      type="text" required
                      value={courseFormData.title} onChange={e => setCourseFormData({...courseFormData, title: e.target.value})}
                      className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Description</label>
                    <textarea 
                      required rows={3}
                      value={courseFormData.description} onChange={e => setCourseFormData({...courseFormData, description: e.target.value})}
                      className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Price (₹)</label>
                      <input 
                        type="number" required
                        value={courseFormData.price} onChange={e => setCourseFormData({...courseFormData, price: e.target.value})}
                        className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Category</label>
                      <select 
                        required
                        value={courseFormData.category} onChange={e => setCourseFormData({...courseFormData, category: e.target.value})}
                        className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Thumbnail Image URL</label>
                    <input 
                      type="url"
                      value={courseFormData.thumbnail} onChange={e => setCourseFormData({...courseFormData, thumbnail: e.target.value})}
                      className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-[var(--border)] bg-[var(--canvas)] flex justify-end gap-4">
                <button type="button" onClick={() => setIsCourseModalOpen(false)} className="px-4 py-2 font-bold text-xs text-[var(--ink-muted)]">
                  Cancel
                </button>
                <button type="submit" form="course-form" disabled={formLoading} className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full shadow-md hover:bg-[var(--primary-soft)] transition-colors min-h-[40px] disabled:opacity-50">
                  {formLoading ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
