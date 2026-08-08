import React, { useState, useEffect, useRef } from 'react';
import { contentApi } from '../../../api/models/content.api';
import { courseApi } from '../../../api/models/course.api';
import { uploadApi } from '../../../api/models/upload.api';
import { 
  Layout, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Image as ImageIcon,
  Layers,
  X,
  Loader2,
  Search,
  Check,
  UploadCloud,
  Video,
  HelpCircle,
  MessageSquare,
  Award,
  Radio,
  Sliders,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  User,
  Building2,
  DollarSign,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Website Sections Definition for 1-Click Access
const CMS_SECTIONS = [
  { id: 'hero', name: 'Homepage Hero', category: 'Header', icon: Layout, description: 'Main headline, subtitle, hero image & CTA button.' },
  { id: 'featured_courses', name: 'Featured Courses', category: 'Courses', icon: Sparkles, description: 'Select and order courses shown on the homepage.' },
  { id: 'student-results', name: 'Batch Zero Results', category: 'Outcomes', icon: Award, description: 'Graduate metrics, CTC packages & student success stories.' },
  { id: 'live-classes', name: 'Live Workshops', category: 'Schedule', icon: Radio, description: 'Upcoming live sessions, masterclasses & posters.' },
  { id: 'video-testimonials', name: 'Video Reviews', category: 'Social Proof', icon: Video, description: 'Student video testimonials & salary hike badges.' },
  { id: 'testimonial', name: 'Student Love Stories', category: 'Social Proof', icon: MessageSquare, description: 'Written student reviews, quotes & star ratings.' },
  { id: 'faqs', name: 'FAQs & Q&A', category: 'Help', icon: HelpCircle, description: 'Accordion Question & Answer list.' },
  { id: 'banner', name: 'Promotional Banners', category: 'Marketing', icon: ImageIcon, description: 'Custom announcement banners & discount alerts.' }
];

export const ManageCmsPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [courseSearch, setCourseSearch] = useState('');

  // Active Section Data State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    isActive: true,
    page: 'home',
    section: 'hero',
    order: 1,
    data: {}
  });

  // Media Upload State
  const [uploadingField, setUploadingField] = useState(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [cmsRes, courseRes] = await Promise.all([
        contentApi.getAllContentAdmin(),
        courseApi.getAllCoursesAdmin()
      ]);

      const loadedBlocks = Array.isArray(cmsRes?.data) 
        ? cmsRes.data 
        : (cmsRes?.data?.blocks || (Array.isArray(cmsRes) ? cmsRes : []));
      setBlocks(loadedBlocks);

      const loadedCourses = Array.isArray(courseRes?.data) 
        ? courseRes.data 
        : (courseRes?.data?.courses || (Array.isArray(courseRes) ? courseRes : []));
      setCourses(loadedCourses);

      // Select initial block data for 'hero'
      const initialHero = loadedBlocks.find(b => b.section === 'hero') || {
        page: 'home',
        section: 'hero',
        title: 'Master New Skills With Visual Learning',
        subtitle: 'Interactive video lessons, live classes, and expert guidance designed for visual thinkers.',
        isActive: true,
        order: 1,
        data: { imageUrl: '', ctaText: 'Explore Courses', ctaLink: '/courses', badge: 'Visual-First Platform' }
      };
      setFormData(initialHero);
    } catch (err) {
      console.warn('Failed to load CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Switch Active Section Tab
  const handleSelectSection = (sectionId) => {
    setActiveSectionId(sectionId);
    const existing = blocks.find(b => b.section === sectionId);

    if (existing) {
      setFormData(existing);
    } else {
      // Default fallbacks for new section
      const defaults = {
        'hero': { title: 'Master New Skills With Visual Learning', subtitle: 'Interactive video lessons & live classes', data: { imageUrl: '', ctaText: 'Explore Courses', ctaLink: '/courses' } },
        'featured_courses': { title: 'Featured courses', subtitle: 'Hand-picked by our experts', data: { courseIds: [] } },
        'student-results': { title: 'Real Results from Batch Zero', subtitle: '100% of graduates secured paid opportunities', data: { headlineMetric: '100% Placed', ctcStat: '₹16.2 LPA CTC', students: [] } },
        'live-classes': { title: 'Live Classes & Workshops', subtitle: 'Join live interactive sessions', data: { items: [] } },
        'video-testimonials': { title: 'Real Video Reviews', subtitle: 'Video feedback directly from our learners', data: { items: [] } },
        'testimonial': { title: 'Loved by Visual Learners Worldwide', subtitle: 'Student feedback and reviews', data: { items: [] } },
        'faqs': { title: 'Frequently Asked Questions', subtitle: 'Common questions about ClassConnect', data: { items: [] } },
        'banner': { title: 'Special Announcement', subtitle: 'Promotional discount banner', data: { imageUrl: '', ctaText: 'Claim Discount', ctaLink: '/courses' } }
      };

      const def = defaults[sectionId] || { title: 'New Section', subtitle: '', data: {} };
      setFormData({
        page: 'home',
        section: sectionId,
        title: def.title,
        subtitle: def.subtitle,
        isActive: true,
        order: blocks.length + 1,
        data: def.data
      });
    }
  };

  // Save Current Section Form Data
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (formData._id) {
        await contentApi.updateContentBlock(formData._id, formData);
        setMessage({ type: 'success', text: `Saved "${formData.title}" content successfully!` });
      } else {
        const created = await contentApi.createContentBlock(formData);
        if (created?.data) setFormData(created.data);
        setMessage({ type: 'success', text: `Created & published "${formData.title}" section!` });
      }
      loadAllData();
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Save error:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  // Generic Media File Uploader Handler
  const handleUploadFile = async (file, targetPath, isVideo = false) => {
    if (!file) return;
    setUploadingField(targetPath);
    try {
      const res = await uploadApi.uploadFile(file, isVideo ? 'class-connect/cms-videos' : 'class-connect/cms');
      const url = res.url || res.playbackUrl || res.data?.url;
      if (!url) throw new Error('Upload succeeded but no URL was returned.');

      // Update nested path in formData
      setFormData(prev => {
        const keys = targetPath.split('.');
        const updated = { ...prev };
        let curr = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!curr[keys[i]]) curr[keys[i]] = {};
          curr[keys[i]] = { ...curr[keys[i]] };
          curr = curr[keys[i]];
        }
        curr[keys[keys.length - 1]] = url;
        return updated;
      });
    } catch (err) {
      alert(err.message || 'Failed to upload media file.');
    } finally {
      setUploadingField(null);
    }
  };

  // Toggle Featured Course
  const toggleFeaturedCourse = (courseId) => {
    const currentIds = formData.data?.courseIds || [];
    const newIds = currentIds.includes(courseId)
      ? currentIds.filter(id => id !== courseId)
      : [...currentIds, courseId];
    
    setFormData(prev => ({
      ...prev,
      data: { ...prev.data, courseIds: newIds }
    }));
  };

  // Generic List Items Handlers (for Students, Workshops, Video Reviews, FAQs)
  const handleAddItem = (defaultItem) => {
    const currentItems = formData.data?.items || formData.data?.students || [];
    const isStudents = activeSectionId === 'student-results';
    const newItems = [...currentItems, { id: `item-${Date.now()}`, ...defaultItem }];
    
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [isStudents ? 'students' : 'items']: newItems
      }
    }));
  };

  const handleUpdateItem = (index, field, value) => {
    const isStudents = activeSectionId === 'student-results';
    const currentItems = [...(formData.data?.items || formData.data?.students || [])];
    if (!currentItems[index]) return;
    
    currentItems[index] = { ...currentItems[index], [field]: value };
    
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [isStudents ? 'students' : 'items']: currentItems
      }
    }));
  };

  const handleDeleteItem = (index) => {
    const isStudents = activeSectionId === 'student-results';
    const currentItems = [...(formData.data?.items || formData.data?.students || [])];
    currentItems.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [isStudents ? 'students' : 'items']: currentItems
      }
    }));
  };

  const currentSectionMeta = CMS_SECTIONS.find(s => s.id === activeSectionId) || CMS_SECTIONS[0];
  const SectionIcon = currentSectionMeta.icon;

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[var(--canvas)] min-h-screen text-[var(--ink)] font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-extrabold mb-2">
            <Layout className="w-4 h-4" /> Website CMS Manager
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-manrope">Content Management Control Center</h1>
          <p className="text-xs md:text-sm text-[var(--ink-muted)] font-medium">Click any website section on the left to edit its headlines, images, reviews, and FAQs live.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full hover:bg-[var(--deep-anchor,#24216F)] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 min-h-[44px] shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save "{formData.title || currentSectionMeta.name}"</span>
        </button>
      </div>

      {/* Alert Banner */}
      {message.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border shadow-xs ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ type: '', text: '' })} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN 2-COLUMN CMS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR: 1-CLICK SECTION SELECTOR */}
        <div className="lg:col-span-4 bg-[var(--surface)] p-4 md:p-6 rounded-3xl border border-[var(--border)] shadow-xs space-y-3">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-[var(--border)]">
            <span className="text-xs font-extrabold uppercase text-[var(--ink-muted)] tracking-wider">Website Sections</span>
            <span className="text-[10px] font-mono font-bold text-[var(--primary)] bg-[var(--primary-soft)] px-2 py-0.5 rounded-full">{CMS_SECTIONS.length} Modules</span>
          </div>

          <div className="space-y-2">
            {CMS_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isSelected = activeSectionId === sec.id;
              const hasBlock = blocks.some(b => b.section === sec.id && b.isActive);

              return (
                <button
                  key={sec.id}
                  onClick={() => handleSelectSection(sec.id)}
                  className={`w-full p-3.5 rounded-2xl flex items-start gap-3 text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[var(--primary)] text-white shadow-md' 
                      : 'bg-[var(--canvas)] hover:bg-[var(--primary-soft)] text-[var(--ink)] border border-[var(--border)]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[var(--surface)] text-[var(--primary)]'
                  }`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-xs truncate">{sec.name}</span>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${hasBlock ? (isSelected ? 'bg-emerald-300' : 'bg-emerald-500') : 'bg-amber-400'}`} />
                    </div>
                    <p className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-white/80' : 'text-[var(--ink-muted)]'}`}>
                      {sec.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT MAIN EDITOR WORKSPACE */}
        <div className="lg:col-span-8 bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-xs space-y-6">
          
          {/* Section Header & Active Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
                <SectionIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold font-manrope">{currentSectionMeta.name}</h2>
                <p className="text-xs text-[var(--ink-muted)] font-medium">Edit headlines, media assets & list items for this section.</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-[var(--canvas)] rounded-xl border border-[var(--border)] text-xs font-bold shrink-0">
              <input
                type="checkbox"
                checked={formData.isActive ?? true}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--primary)]"
              />
              <span>{formData.isActive ? '✅ Visible on Website' : '⚠️ Section Hidden'}</span>
            </label>
          </div>

          {/* MAIN EDIT FORM */}
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Section Title & Subtitle */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-bold uppercase text-[var(--ink-muted)]">Section Heading / Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Real Results from Batch Zero"
                  className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold uppercase text-[var(--ink-muted)]">Section Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Short tagline or descriptive overview..."
                  className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm font-semibold focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            {/* DYNAMIC SECTION SPECIFIC EDITORS */}

            {/* 1. FEATURED COURSES SELECTOR */}
            {activeSectionId === 'featured_courses' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Select Courses for Homepage Showcase ({(formData.data?.courseIds || []).length} Selected)
                  </label>
                  <span className="text-[10px] text-[var(--primary)] font-bold">Check to display on home page</span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={16} />
                  <input
                    type="text"
                    placeholder="Search courses by name..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 border border-[var(--border)] rounded-2xl p-3 bg-[var(--canvas)]">
                  {courses
                    .filter(c => c.title.toLowerCase().includes(courseSearch.toLowerCase()))
                    .map(c => {
                      const isSelected = (formData.data?.courseIds || []).includes(c._id);
                      return (
                        <div
                          key={c._id}
                          onClick={() => toggleFeaturedCourse(c._id)}
                          className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-[var(--primary-soft)] border border-[var(--primary)] text-[var(--primary)] font-bold shadow-xs' 
                              : 'bg-[var(--surface)] hover:bg-[var(--primary-soft)]/50 border border-[var(--border)] text-[var(--ink)]'
                          }`}
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-xs truncate">{c.title}</span>
                          </div>
                          <span className="text-xs font-mono font-bold">₹{c.price}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 2. BATCH ZERO RESULTS EDITOR */}
            {activeSectionId === 'student-results' && (
              <div className="space-y-6 pt-4 border-t border-[var(--border)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-bold uppercase text-[var(--ink-muted)]">Headline Outcome Metric</label>
                    <input
                      type="text"
                      value={formData.data?.headlineMetric || ''}
                      onChange={(e) => setFormData({ ...formData, data: { ...formData.data, headlineMetric: e.target.value } })}
                      placeholder="e.g. 100% of graduates secured paid opportunities"
                      className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-bold uppercase text-[var(--ink-muted)]">CTC / Salary Stat</label>
                    <input
                      type="text"
                      value={formData.data?.ctcStat || ''}
                      onChange={(e) => setFormData({ ...formData, data: { ...formData.data, ctcStat: e.target.value } })}
                      placeholder="e.g. ₹16.2 LPA Combined CTC"
                      className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Student Graduate Cards List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                      Graduate Student Cards ({(formData.data?.students || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddItem({
                        name: 'New Graduate',
                        role: 'Software Engineer',
                        company: 'Tech Company',
                        packageCTC: '₹18.0 LPA Package',
                        review: 'ClassConnect transformed my career with real-world projects!',
                        skills: ['React 19', 'Node.js']
                      })}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-extrabold hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Student Graduate</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.data?.students || []).map((student, idx) => (
                      <div key={student.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                          <span className="text-xs font-bold text-[var(--primary)] font-mono">Student #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Student Name"
                            value={student.name || ''}
                            onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                            className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="Role / Title"
                            value={student.role || ''}
                            onChange={(e) => handleUpdateItem(idx, 'role', e.target.value)}
                            className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="Company & Package CTC"
                            value={student.packageCTC || ''}
                            onChange={(e) => handleUpdateItem(idx, 'packageCTC', e.target.value)}
                            className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                          />
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Review quote..."
                          value={student.review || ''}
                          onChange={(e) => handleUpdateItem(idx, 'review', e.target.value)}
                          className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. WORKSHOPS & LIVE CLASSES EDITOR */}
            {activeSectionId === 'live-classes' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Scheduled Live Masterclasses & Workshops
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({
                      status: 'LIVE NOW',
                      isLiveNow: true,
                      title: 'New Masterclass',
                      host: 'Senior Instructor',
                      registered: '200+ registered',
                      actionText: 'Join Room',
                      actionLink: '/courses'
                    })}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-extrabold hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Workshop</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.data?.items || []).map((item, idx) => (
                    <div key={item.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-indigo-600 font-mono">Workshop #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Workshop Title"
                          value={item.title || ''}
                          onChange={(e) => handleUpdateItem(idx, 'title', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Host Instructor Name"
                          value={item.host || ''}
                          onChange={(e) => handleUpdateItem(idx, 'host', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. REAL VIDEO REVIEWS EDITOR */}
            {activeSectionId === 'video-testimonials' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Student Video Reviews
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({
                      studentName: 'Student Name',
                      role: 'Software Engineer',
                      courseName: 'Full-Stack Architecture',
                      hikeStat: '50% Salary Increase',
                      quote: 'ClassConnect transformed my technical understanding!',
                      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                    })}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-extrabold hover:bg-purple-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Video Review</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.data?.items || []).map((item, idx) => (
                    <div key={item.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-purple-600 font-mono">Video Review #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Student Name"
                          value={item.studentName || ''}
                          onChange={(e) => handleUpdateItem(idx, 'studentName', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Hike / Outcome Stat (e.g. 100% Placement)"
                          value={item.hikeStat || ''}
                          onChange={(e) => handleUpdateItem(idx, 'hikeStat', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Video Stream URL (e.g. MP4 or Bunny Stream URL)"
                        value={item.videoUrl || ''}
                        onChange={(e) => handleUpdateItem(idx, 'videoUrl', e.target.value)}
                        className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. FAQS & Q&A EDITOR */}
            {activeSectionId === 'faqs' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Accordion FAQ Q&A Items ({(formData.data?.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({
                      question: 'New Question?',
                      answer: 'Detailed answer response...'
                    })}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-extrabold hover:bg-amber-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.data?.items || []).map((faq, idx) => (
                    <div key={faq.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-amber-600 font-mono">Q&A Item #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Question title..."
                        value={faq.question || ''}
                        onChange={(e) => handleUpdateItem(idx, 'question', e.target.value)}
                        className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-extrabold"
                      />

                      <textarea
                        rows={2}
                        placeholder="Detailed answer text..."
                        value={faq.answer || ''}
                        onChange={(e) => handleUpdateItem(idx, 'answer', e.target.value)}
                        className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GENERIC HERO / BANNER IMAGE DROPZONE */}
            {(activeSectionId === 'hero' || activeSectionId === 'banner') && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--ink-muted)] mb-2">Section Media / Image Banner</label>
                  {formData.data?.imageUrl ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--canvas)]">
                      <img src={formData.data.imageUrl} alt="Banner" className="w-full h-44 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 bg-white text-slate-900 text-xs font-extrabold rounded-lg cursor-pointer"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, data: { ...formData.data, imageUrl: '' } })}
                          className="px-3.5 py-2 bg-red-600 text-white text-xs font-extrabold rounded-lg cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => !uploadingField && fileInputRef.current?.click()}
                      className="w-full h-36 border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)]/50 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      {uploadingField === 'data.imageUrl' ? (
                        <>
                          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                          <span className="text-xs font-bold text-amber-600">Uploading banner image...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-[var(--ink-muted)]" />
                          <span className="text-xs font-bold text-[var(--ink-muted)]">Click or drag banner image</span>
                          <span className="text-[10px] text-[var(--ink-muted)]/60">JPEG, PNG, WEBP, SVG</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadFile(f, 'data.imageUrl'); e.target.value = ''; }}
                  />
                </div>
              </div>
            )}

            {/* SAVE BUTTON FOOTER */}
            <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--ink-muted)]">
                Status: {formData.isActive ? 'Active on Site' : 'Hidden'}
              </span>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full hover:bg-[var(--deep-anchor,#24216F)] transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 min-h-[44px]"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Section Changes</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
