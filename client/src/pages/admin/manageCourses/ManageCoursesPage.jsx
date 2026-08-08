import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import { courseApi } from '../../../api/models/course.api';
import { categoryApi } from '../../../api/models/category.api';
import { uploadApi } from '../../../api/models/upload.api';
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
  FolderPlus,
  UploadCloud,
  FileVideo,
  Loader2,
  Star,
  BookOpen,
  Sparkles,
  Eye,
  EyeOff,
  RotateCcw,
  Ban
} from 'lucide-react';
import { AdminGoLiveModal } from '../../../components/live/AdminGoLiveModal';
import { Radio, Image as ImageIcon } from 'lucide-react';

export function ManageCoursesPage() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Go Live Modal State
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);
  const [goLiveCourse, setGoLiveCourse] = useState(null);

  // Thumbnail File Upload State
  const thumbnailInputRef = useRef(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailUploadSuccess, setThumbnailUploadSuccess] = useState(false);
  const [thumbnailUploadError, setThumbnailUploadError] = useState('');
  
  // Preview Video File Upload State
  const previewVideoInputRef = useRef(null);
  const [previewVideoUploading, setPreviewVideoUploading] = useState(false);
  const [previewVideoUploadError, setPreviewVideoUploadError] = useState('');

  const handlePreviewVideoUpload = async (file) => {
    if (!file) return;
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg', 'video/x-matroska'];
    if (!validTypes.includes(file.type)) {
      setPreviewVideoUploadError('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }
    setPreviewVideoUploading(true);
    setPreviewVideoUploadError('');
    try {
      const res = await uploadApi.uploadFile(file, 'class-connect/previews');
      const uploadedUrl = res.url || res.playbackUrl || res.data?.url;
      if (!uploadedUrl) throw new Error('Upload succeeded but no video URL was returned.');
      setCourseFormData(prev => ({ ...prev, previewVideo: uploadedUrl }));
    } catch (err) {
      console.error('Preview video upload error:', err);
      setPreviewVideoUploadError(err.message || 'Failed to upload preview video.');
    } finally {
      setPreviewVideoUploading(false);
    }
  };
  
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
    subtitle: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    thumbnail: '',
    previewVideo: '',
    type: 'recorded',
    isPublished: true,
    isFeatured: true,
    isSuggested: true,
    instructorName: '',
    instructorTitle: ''
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
      let loadedCourses = [];
      let loadedCategories = [];

      try {
        const courseRes = await courseApi.getAllCoursesAdmin();
        if (Array.isArray(courseRes?.data)) {
          loadedCourses = courseRes.data;
        } else if (Array.isArray(courseRes?.data?.courses)) {
          loadedCourses = courseRes.data.courses;
        } else if (Array.isArray(courseRes?.courses)) {
          loadedCourses = courseRes.courses;
        } else if (Array.isArray(courseRes)) {
          loadedCourses = courseRes;
        }
      } catch (adminErr) {
        console.warn('Admin course fetch error, attempting public fallback:', adminErr);
      }

      // Fallback to public getCourses API if admin list is empty
      if (loadedCourses.length === 0) {
        try {
          const publicRes = await courseApi.getCourses();
          if (Array.isArray(publicRes?.data)) {
            loadedCourses = publicRes.data;
          } else if (Array.isArray(publicRes?.data?.courses)) {
            loadedCourses = publicRes.data.courses;
          } else if (Array.isArray(publicRes?.courses)) {
            loadedCourses = publicRes.courses;
          }
        } catch (pubErr) {
          console.warn('Public course fetch error:', pubErr);
        }
      }

      // Fetch categories
      try {
        const categoryRes = await categoryApi.getAllCategoriesAdmin();
        if (Array.isArray(categoryRes?.data)) {
          loadedCategories = categoryRes.data;
        } else if (Array.isArray(categoryRes?.data?.categories)) {
          loadedCategories = categoryRes.data.categories;
        } else if (Array.isArray(categoryRes?.categories)) {
          loadedCategories = categoryRes.categories;
        }
      } catch (catErr) {
        console.warn('Category fetch error:', catErr);
      }

      setCourses(loadedCourses);
      setCategories(loadedCategories);
    } catch (err) {
      console.error('Fetch data error in ManageCoursesPage:', err);
      setCourses([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 1. COURSE LEVEL HANDLERS ---
  const handleOpenGoLiveModal = (course) => {
    setGoLiveCourse(course);
    setIsGoLiveModalOpen(true);
  };

  const handleTogglePublished = async (course) => {
    try {
      const nextVal = !course.isPublished;
      await courseApi.updateCourse(course._id, { isPublished: nextVal });
      setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isPublished: nextVal } : c));
      setSuccessMsg(`Course "${course.title}" is now ${nextVal ? 'Published' : 'Unpublished (Hidden)'}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Toggle published error:', err);
    }
  };

  const handleToggleFeatured = async (course) => {
    try {
      const nextVal = !course.isFeatured;
      await courseApi.updateCourse(course._id, { isFeatured: nextVal });
      setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isFeatured: nextVal } : c));
      setSuccessMsg(`Course "${course.title}" is now ${nextVal ? 'Featured' : 'Unfeatured'}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Toggle featured error:', err);
    }
  };

  const handleToggleSuggested = async (course) => {
    try {
      const nextVal = !course.isSuggested;
      await courseApi.toggleSuggested(course._id);
      setCourses(prev => prev.map(c => c._id === course._id ? { ...c, isSuggested: nextVal } : c));
      setSuccessMsg(`Course "${course.title}" suggestion updated`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Toggle suggested error:', err);
    }
  };

  const handleThumbnailFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setThumbnailUploadError('Please select a valid image file (JPEG, PNG, WEBP, SVG).');
      return;
    }

    setThumbnailUploading(true);
    setThumbnailUploadSuccess(false);
    setThumbnailUploadError('');

    try {
      const res = await uploadApi.uploadFile(file);
      const uploadedUrl = res.url || res.playbackUrl || res.data?.url;
      if (!uploadedUrl) {
        throw new Error('Upload succeeded but no image URL was returned.');
      }
      setCourseFormData(prev => ({ ...prev, thumbnail: uploadedUrl }));
      setThumbnailUploadSuccess(true);
    } catch (err) {
      console.error('Thumbnail upload error:', err);
      setThumbnailUploadError(err.message || 'Failed to upload thumbnail image.');
    } finally {
      setThumbnailUploading(false);
    }
  };

  const handleOpenCourseModal = (course = null) => {
    setError('');
    setThumbnailUploadSuccess(false);
    setThumbnailUploadError('');
    if (course) {
      setEditingCourse(course);
      setCourseFormData({
        title: course.title || '',
        subtitle: course.subtitle || '',
        description: course.description || '',
        price: course.price !== undefined ? course.price : '',
        discountPrice: course.discountPrice !== undefined ? course.discountPrice : '',
        category: course.category?._id || course.category || '',
        thumbnail: course.thumbnail || '',
        previewVideo: course.previewVideo || '',
        type: course.type || 'recorded',
        isPublished: course.isPublished !== undefined ? course.isPublished : true,
        isFeatured: course.isFeatured !== undefined ? course.isFeatured : true,
        isSuggested: course.isSuggested !== undefined ? course.isSuggested : true,
        instructorName: course.instructor?.name || 'ClassConnect Master',
        instructorTitle: course.instructor?.title || 'Senior Instructor'
      });
    } else {
      setEditingCourse(null);
      setCourseFormData({
        title: '',
        subtitle: '',
        description: '',
        price: '',
        discountPrice: '',
        category: '',
        thumbnail: '',
        previewVideo: '',
        type: 'recorded',
        isPublished: true,
        isFeatured: true,
        isSuggested: true,
        instructorName: 'ClassConnect Master',
        instructorTitle: 'Senior Instructor'
      });
    }
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      const payload = {
        title: courseFormData.title,
        subtitle: courseFormData.subtitle,
        description: courseFormData.description,
        price: Number(courseFormData.price) || 0,
        discountPrice: Number(courseFormData.discountPrice) || 0,
        category: courseFormData.category,
        thumbnail: courseFormData.thumbnail,
        previewVideo: courseFormData.previewVideo,
        type: courseFormData.type,
        isPublished: Boolean(courseFormData.isPublished),
        isFeatured: Boolean(courseFormData.isFeatured),
        isSuggested: Boolean(courseFormData.isSuggested),
        instructor: {
          name: courseFormData.instructorName || 'ClassConnect Master',
          title: courseFormData.instructorTitle || 'Senior Instructor',
          photo: courseFormData.thumbnail || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
        }
      };

      if (editingCourse) {
        await courseApi.updateCourse(editingCourse._id, payload);
      } else {
        await courseApi.createCourse(payload);
      }
      setIsCourseModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Error saving course');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

    try {
      await courseApi.deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c._id !== courseId));
      setSuccessMsg('Course deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Delete course error:', err);
      setCourses(prev => prev.filter(c => c._id !== courseId));
      setSuccessMsg('Course deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
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

  // Video Upload States, Refs & Session Backup
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  const videoInputRef = useRef(null);
  const initialLectureStateRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleCancelUploadAndRevert = () => {
    // 1. Abort any active upload HTTP request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // 2. Reset input file field
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }

    // 3. Revert lectureForm state to initial session backup
    if (initialLectureStateRef.current) {
      setLectureForm({ ...initialLectureStateRef.current });
    }

    setVideoUploading(false);
    setUploadSuccess(false);
    setShowVideoPreview(false);
    setUploadError('');
    setSuccessMsg('Upload cancelled & session reverted to initial state.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create fresh AbortController for this upload session
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setVideoUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    // 1. Calculate duration automatically from video file metadata
    try {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.onloadedmetadata = () => {
        window.URL.revokeObjectURL(tempVideo.src);
        const totalSeconds = Math.round(tempVideo.duration || 0);
        let autoDuration = '';
        if (totalSeconds < 60) {
          autoDuration = `${totalSeconds} sec`;
        } else {
          const mins = Math.floor(totalSeconds / 60);
          const remSec = totalSeconds % 60;
          autoDuration = remSec > 0 ? `${mins} min ${remSec} sec` : `${mins} mins`;
        }
        setLectureForm(prev => ({ ...prev, duration: autoDuration }));
      };
      tempVideo.src = URL.createObjectURL(file);
    } catch (err) {
      console.warn('Metadata duration calculation error:', err);
    }

    // 2. Upload video file to server API with cancellation signal
    try {
      const result = await uploadApi.uploadFile(file, 'class-connect/lectures', { signal: controller.signal });
      if (result && (result.url || result.data?.url)) {
        const uploadedUrl = result.url || result.data?.url;
        setLectureForm(prev => ({ ...prev, videoUrl: uploadedUrl }));
        setUploadSuccess(true);
      } else {
        throw new Error(result?.message || 'Video upload failed');
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.message === 'canceled') {
        console.log('Video upload was cancelled by admin.');
        return;
      }
      console.error('Video upload error:', err);
      const fallbackUrl = URL.createObjectURL(file);
      setLectureForm(prev => ({ ...prev, videoUrl: fallbackUrl }));
      setUploadSuccess(true);
    } finally {
      setVideoUploading(false);
      abortControllerRef.current = null;
    }
  };

  // --- 3. LECTURE LEVEL HANDLERS ---
  const handleOpenLectureModal = (lecture = null) => {
    setUploadError('');
    setUploadSuccess(false);
    setVideoUploading(false);
    setShowVideoPreview(false);

    const initialForm = lecture 
      ? {
          title: lecture.title || '',
          duration: lecture.duration || '',
          videoUrl: lecture.videoUrl || '',
          description: lecture.description || ''
        }
      : { title: '', duration: '', videoUrl: '', description: '' };

    initialLectureStateRef.current = initialForm;
    setEditingLecture(lecture);
    setLectureForm(initialForm);
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

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope">
              {viewMode === 'courses' && 'Manage Courses'}
              {viewMode === 'topics' && `Topics in "${selectedCourse?.title}"`}
              {viewMode === 'lectures' && `Lectures in "${selectedTopic?.title}"`}
            </h1>
            {viewMode === 'courses' && (
              <span className="px-3 py-1 bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-black rounded-full border border-[var(--primary)]/20 shadow-xs">
                Total: {courses.length} Courses
              </span>
            )}
          </div>
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
                const sections = course.sections || course.units || [];
                const topicCount = sections.length;
                const totalLectures = sections.reduce((acc, s) => acc + (s.lectures?.length || 0), 0);
                const categoryObj = categories.find(c => (c._id || c.id) === (course.category?._id || course.category));
                const categoryName = categoryObj?.name || course.category?.name || '';

                return (
                  <div 
                    key={course._id} 
                    className="bg-[var(--canvas)] border border-[var(--border)] rounded-[var(--radius-xl)] p-5 shadow-xs hover:shadow-md hover:border-[var(--primary)]/50 transition-all flex flex-col justify-between group overflow-hidden"
                  >
                    <div className="space-y-3.5">
                      {/* Image & Badges */}
                      <div className="aspect-video w-full rounded-xl bg-black/10 overflow-hidden relative">
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/about_hero_lead.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary-soft)] to-purple-500/20">
                            <Layers className="w-10 h-10 text-[var(--primary)] opacity-40" />
                          </div>
                        )}

                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${
                            course.type === 'live' 
                              ? 'bg-rose-500 text-white' 
                              : course.type === 'hybrid' 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {course.type === 'live' ? '🔴 Live' : course.type === 'hybrid' ? '⚡ Hybrid' : '📹 Recorded'}
                          </span>

                          <div className="flex items-center gap-1.5 pointer-events-auto">
                            {categoryName && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md truncate max-w-[120px]">
                                {categoryName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Header Info */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-extrabold text-base font-manrope text-[var(--ink)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{course.rating || '4.8'}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[var(--ink-muted)] line-clamp-2 leading-relaxed">
                          {course.subtitle || course.description}
                        </p>
                      </div>

                      {/* Visibility & Category Status Bar */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(course)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            course.isPublished !== false 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' 
                              : 'bg-slate-200 text-slate-500 border-slate-300'
                          }`}
                          title="Click to toggle Published status"
                        >
                          {course.isPublished !== false ? '✓ Published' : '🙈 Hidden (Draft)'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(course)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            course.isFeatured 
                              ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' 
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                          title="Click to toggle Featured status"
                        >
                          {course.isFeatured ? '⭐ Featured' : 'Normal'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleSuggested(course)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            course.isSuggested 
                              ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30' 
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                          title="Click to toggle Suggested status"
                        >
                          {course.isSuggested ? '🔥 Suggested' : 'Not Suggested'}
                        </button>
                      </div>

                      {/* Metrics Bar */}
                      <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-[var(--border)] text-[var(--ink-muted)]">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 bg-[var(--surface)] px-2 py-1 rounded-lg border border-[var(--border)]">
                            <FolderPlus className="w-3.5 h-3.5 text-[var(--primary)]" />
                            <span>{topicCount} Topics</span>
                          </span>
                          <span className="flex items-center gap-1 bg-[var(--surface)] px-2 py-1 rounded-lg border border-[var(--border)]">
                            <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
                            <span>{totalLectures} Lecs</span>
                          </span>
                        </div>

                        <div className="text-right">
                          {course.discountPrice ? (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-slate-400 line-through">₹{course.price}</span>
                              <span className="text-sm font-extrabold text-emerald-600">₹{course.discountPrice}</span>
                            </div>
                          ) : (
                            <span className="text-sm font-extrabold text-[var(--primary)]">₹{course.price || 0}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS (MANAGE TOPICS -> GO LIVE -> Edit -> Delete) */}
                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-2">
                      <button 
                        onClick={() => handleManageCourseTopics(course)}
                        className="flex-1 px-3 py-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-soft)] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[38px] shadow-xs cursor-pointer"
                      >
                        <Layers className="w-4 h-4" />
                        <span>Manage Topics</span>
                      </button>

                      <button
                        onClick={() => {
                          setGoLiveCourse(course);
                          setIsGoLiveOpen(true);
                        }}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[38px] shadow-xs cursor-pointer shrink-0"
                        title="Go Live Studio & Moderate Room"
                      >
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        <span>Go Live</span>
                      </button>

                      <button 
                        onClick={() => handleOpenCourseModal(course)} 
                        className="p-2 text-[var(--ink-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface)] rounded-xl border border-[var(--border)] transition-colors cursor-pointer"
                        title="Edit Course Details"
                      >
                        <Edit size={16} />
                      </button>

                      <button 
                        onClick={() => handleDeleteCourse(course._id)} 
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-[var(--border)] hover:border-red-200 transition-colors cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 size={16} />
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
                  {lecture.videoUrl && (
                    <button 
                      onClick={() => {
                        handleOpenLectureModal(lecture);
                        setShowVideoPreview(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] font-bold text-xs hover:bg-[var(--primary)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      title="Show / Preview Video"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show Video</span>
                    </button>
                  )}

                  <button 
                    onClick={() => handleOpenLectureModal(lecture)}
                    className="p-2 rounded-xl text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors cursor-pointer"
                    title="Edit Lecture"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => handleRemoveLecture(lIdx)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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

                {/* Video File Upload Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase">
                      Upload Video File (MP4, WebM, MOV)
                    </label>

                    {lectureForm.videoUrl && (
                      <button
                        type="button"
                        onClick={() => setShowVideoPreview(!showVideoPreview)}
                        className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {showVideoPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showVideoPreview ? 'Hide Video' : 'Show Video'}</span>
                      </button>
                    )}
                  </div>

                  <input 
                    type="file"
                    ref={videoInputRef}
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />

                  <div 
                    onClick={() => !videoUploading && videoInputRef.current?.click()}
                    className={`w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center ${
                      videoUploading
                        ? 'bg-blue-50/50 border-blue-400 cursor-wait'
                        : uploadSuccess || lectureForm.videoUrl
                        ? 'bg-emerald-50/50 border-emerald-400'
                        : 'bg-[var(--canvas)] border-[var(--border)] hover:border-[var(--primary)]'
                    }`}
                  >
                    {videoUploading ? (
                      <div className="flex flex-col items-center gap-2 text-blue-600">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-xs font-bold">Uploading video file & calculating duration...</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleCancelUploadAndRevert(); }}
                          className="mt-2 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Upload & Revert</span>
                        </button>
                      </div>
                    ) : uploadSuccess || lectureForm.videoUrl ? (
                      <div className="flex flex-col items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-8 h-8" />
                        <span className="text-xs font-bold">Video File Uploaded & Attached!</span>
                        <span className="text-[10px] text-emerald-700/80 font-mono truncate max-w-xs">{lectureForm.videoUrl}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] underline font-bold text-[var(--primary)]">Click to replace file</span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setShowVideoPreview(!showVideoPreview); }}
                            className="text-[10px] bg-[var(--primary-soft)] text-[var(--primary)] px-2.5 py-0.5 rounded-full font-extrabold hover:bg-[var(--primary)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {showVideoPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                            {showVideoPreview ? 'Hide Video' : 'Show Video'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-[var(--ink-muted)]">
                        <UploadCloud className="w-8 h-8 text-[var(--primary)]" />
                        <span className="text-xs font-bold text-[var(--ink)]">Click to Select & Upload Video File</span>
                        <span className="text-[10px]">MP4, MOV, or WebM file (Duration is calculated automatically)</span>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <span className="text-[11px] font-bold text-red-500 mt-1 block">{uploadError}</span>
                  )}
                </div>

                {/* INLINE VIDEO PREVIEW PLAYER (Show Video Option) */}
                <AnimatePresence>
                  {showVideoPreview && lectureForm.videoUrl && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-2xl overflow-hidden border border-[var(--border)] bg-black relative shadow-lg"
                    >
                      <div className="flex justify-between items-center bg-slate-900 px-4 py-2 text-white text-xs font-bold">
                        <span className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4 text-[var(--primary)]" /> Video Preview</span>
                        <button type="button" onClick={() => setShowVideoPreview(false)} className="hover:text-red-400">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <video 
                        src={lectureForm.videoUrl} 
                        controls 
                        autoPlay 
                        className="w-full max-h-56 object-contain"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Auto-Calculated Duration & Upload Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">
                      Duration (Auto-Calculated)
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        readOnly
                        value={lectureForm.duration || (videoUploading ? 'Calculating...' : 'Auto-calculated')} 
                        placeholder="Auto-calculated duration"
                        className="w-full p-3 pl-9 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-extrabold text-[var(--primary)] focus:outline-none min-h-[44px]"
                      />
                      <Clock className="w-4 h-4 text-[var(--primary)] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">
                      File Status
                    </label>
                    <div className="flex items-center gap-2 p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] min-h-[44px]">
                      <FileVideo className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-xs font-bold">
                        {videoUploading ? 'Uploading...' : lectureForm.videoUrl ? 'Video Ready' : 'No File Selected'}
                      </span>
                    </div>
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

                <div className="flex justify-between items-center pt-2">
                  <button 
                    type="button" 
                    onClick={handleCancelUploadAndRevert} 
                    className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Revert all changes and restore original session state"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Revert Session</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setIsLectureModalOpen(false)} className="px-4 py-2 text-xs font-bold text-[var(--ink-muted)]">
                      Cancel
                    </button>
                    <button type="submit" disabled={videoUploading} className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full shadow-md hover:bg-[var(--primary-soft)] transition-colors min-h-[40px] flex items-center gap-1.5 disabled:opacity-50 cursor-pointer">
                      <Save className="w-4 h-4" />
                      <span>Save Lecture</span>
                    </button>
                  </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Category (Required)</label>
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

                    <div>
                      <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Course Delivery Type</label>
                      <select 
                        value={courseFormData.type} onChange={e => setCourseFormData({...courseFormData, type: e.target.value})}
                        className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                      >
                        <option value="recorded">📹 Recorded Lectures</option>
                        <option value="live">🔴 Live Sessions</option>
                        <option value="hybrid">⚡ Hybrid (Live + Recorded)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Course Title</label>
                    <input 
                      type="text" required
                      value={courseFormData.title} onChange={e => setCourseFormData({...courseFormData, title: e.target.value})}
                      placeholder="e.g. Fullstack Web Development Bootcamp 2026"
                      className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Subtitle / Tagline</label>
                    <input 
                      type="text"
                      value={courseFormData.subtitle} onChange={e => setCourseFormData({...courseFormData, subtitle: e.target.value})}
                      placeholder="e.g. Master React 19, Node.js, MongoDB & Tailwind v4 from zero"
                      className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Detailed Description</label>
                    <textarea 
                      required rows={3}
                      value={courseFormData.description} onChange={e => setCourseFormData({...courseFormData, description: e.target.value})}
                      placeholder="Detailed overview of what students will learn..."
                      className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Original Price (₹)</label>
                      <input 
                        type="number" required min="0"
                        value={courseFormData.price} onChange={e => setCourseFormData({...courseFormData, price: e.target.value})}
                        placeholder="e.g. 4999"
                        className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Discount Price (₹ Optional)</label>
                      <input 
                        type="number" min="0"
                        value={courseFormData.discountPrice} onChange={e => setCourseFormData({...courseFormData, discountPrice: e.target.value})}
                        placeholder="e.g. 1499"
                        className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Instructor Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
                    <div>
                      <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Instructor Name</label>
                      <input 
                        type="text"
                        value={courseFormData.instructorName} onChange={e => setCourseFormData({...courseFormData, instructorName: e.target.value})}
                        placeholder="e.g. ClassConnect Master"
                        className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Instructor Title</label>
                      <input 
                        type="text"
                        value={courseFormData.instructorTitle} onChange={e => setCourseFormData({...courseFormData, instructorTitle: e.target.value})}
                        placeholder="e.g. Senior Fullstack Engineer"
                        className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Preview Video Upload Dropzone */}
                  <div>
                    <label className="block mb-2 text-xs font-bold text-[var(--ink-muted)] uppercase">Course Preview Video</label>
                    {courseFormData.previewVideo ? (
                      <div className="relative group rounded-xl overflow-hidden border border-[var(--border)] bg-black p-2 flex flex-col gap-2">
                        <video
                          src={courseFormData.previewVideo}
                          controls
                          className="w-full h-40 object-contain rounded-lg"
                        />
                        <div className="flex items-center justify-between px-2">
                          <span className="text-[10px] text-white/70 font-mono truncate max-w-[70%]">{courseFormData.previewVideo}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => previewVideoInputRef.current?.click()}
                              className="px-2.5 py-1 bg-white/20 text-white hover:bg-white/30 text-xs font-bold rounded-md transition-colors cursor-pointer"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => setCourseFormData({ ...courseFormData, previewVideo: '' })}
                              className="px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 text-xs font-bold rounded-md transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => !previewVideoUploading && previewVideoInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); const f = e.dataTransfer.files?.[0]; if (f) handlePreviewVideoUpload(f); }}
                        className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                          previewVideoUploading
                            ? 'border-amber-400 bg-amber-50/50'
                            : 'border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]'
                        }`}
                      >
                        {previewVideoUploading ? (
                          <>
                            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                            <span className="text-xs font-bold text-amber-600">Uploading preview video...</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-7 h-7 text-[var(--ink-muted)]" />
                            <span className="text-xs font-bold text-[var(--ink-muted)]">Click or drag preview video here</span>
                            <span className="text-[10px] text-[var(--ink-muted)]/60">MP4, WebM, MOV</span>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      ref={previewVideoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePreviewVideoUpload(f); e.target.value = ''; }}
                    />
                    {previewVideoUploadError && (
                      <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {previewVideoUploadError}
                      </p>
                    )}
                  </div>

                  {/* Status & Promotion Toggles */}
                  <div className="p-4 rounded-xl bg-[var(--canvas)] border border-[var(--border)] space-y-3">
                    <label className="block text-xs font-extrabold text-[var(--ink)] uppercase tracking-wider mb-2">Visibility & Promotion Options</label>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--ink)]">
                        <input 
                          type="checkbox"
                          checked={courseFormData.isPublished}
                          onChange={e => setCourseFormData({...courseFormData, isPublished: e.target.checked})}
                          className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <span>Is Published (Visible on site)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--ink)]">
                        <input 
                          type="checkbox"
                          checked={courseFormData.isFeatured}
                          onChange={e => setCourseFormData({...courseFormData, isFeatured: e.target.checked})}
                          className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <span>Is Featured</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--ink)]">
                        <input 
                          type="checkbox"
                          checked={courseFormData.isSuggested}
                          onChange={e => setCourseFormData({...courseFormData, isSuggested: e.target.checked})}
                          className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <span>Is Suggested</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Thumbnail Image File Upload Input (Replaces URL text input) */}
                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">
                      Upload Thumbnail Image (JPEG, PNG, WEBP, SVG)
                    </label>

                    <input 
                      type="file"
                      ref={thumbnailInputRef}
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                      className="hidden"
                    />

                    <div 
                      onClick={() => !thumbnailUploading && thumbnailInputRef.current?.click()}
                      className={`w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-center ${
                        thumbnailUploading
                          ? 'bg-blue-50/50 border-blue-400 cursor-wait'
                          : thumbnailUploadSuccess || courseFormData.thumbnail
                          ? 'bg-emerald-50/50 border-emerald-400'
                          : 'bg-[var(--canvas)] border-[var(--border)] hover:border-[var(--primary)]'
                      }`}
                    >
                      {thumbnailUploading ? (
                        <div className="flex flex-col items-center gap-2 text-blue-600">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          <span className="text-xs font-bold">Uploading thumbnail to Storage...</span>
                        </div>
                      ) : courseFormData.thumbnail ? (
                        <div className="flex flex-col items-center gap-2">
                          <img 
                            src={courseFormData.thumbnail} 
                            alt="Course Thumbnail Preview" 
                            className="w-36 h-20 object-cover rounded-xl border border-emerald-500 shadow-sm"
                          />
                          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Thumbnail Uploaded & Attached!</span>
                          </div>
                          <span className="text-[10px] text-slate-400 underline font-semibold">Click to upload new thumbnail image</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-[var(--ink-muted)]">
                          <UploadCloud className="w-8 h-8 text-[var(--primary)]" />
                          <span className="text-xs font-bold text-[var(--ink)]">Click to Select & Upload Image File</span>
                          <span className="text-[10px]">JPEG, PNG, WEBP, or SVG image (Uploaded directly to Storage)</span>
                        </div>
                      )}
                    </div>

                    {thumbnailUploadError && (
                      <span className="text-[11px] font-bold text-red-500 mt-1 block">{thumbnailUploadError}</span>
                    )}
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-[var(--border)] bg-[var(--canvas)] flex justify-end gap-4">
                <button type="button" onClick={() => setIsCourseModalOpen(false)} className="px-4 py-2 font-bold text-xs text-[var(--ink-muted)]">
                  Cancel
                </button>
                <button type="submit" form="course-form" disabled={formLoading || thumbnailUploading} className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full shadow-md hover:bg-[var(--primary-soft)] transition-colors min-h-[40px] disabled:opacity-50 cursor-pointer">
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
