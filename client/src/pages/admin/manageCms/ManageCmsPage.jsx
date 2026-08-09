import React, { useState, useEffect, useRef } from 'react';
import { contentApi } from '../../../api/models/content.api';
import { courseApi } from '../../../api/models/course.api';
import { uploadApi } from '../../../api/models/upload.api';
import { categoryApi } from '../../../api/models/category.api';
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
  User,
  Building2,
  DollarSign,
  Calendar,
  ExternalLink,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

// Website Sections Definition for 1-Click Navigation
const CMS_SECTIONS = [
  { id: 'hero', name: 'Homepage Hero Banner', category: 'Header', icon: Layout, description: 'Headline, subtitle, hero background image & CTA button.' },
  { id: 'categories', name: 'Curated Skill Collections', category: 'Categories', icon: Layers, description: 'Manage card images, title, color & description for skill collection cards.' },
  { id: 'student-results', name: 'Batch Zero Real Results', category: 'Outcomes', icon: Award, description: 'Placement metric, CTC packages & graduate student cards.' },
  { id: 'featured_courses', name: 'Featured Masterclasses', category: 'Courses', icon: Sparkles, description: 'Select and order homepage featured courses.' },
  { id: 'live-classes', name: 'Live Classes & Workshops', category: 'Schedule', icon: Radio, description: 'Upcoming live sessions, hosts & workshop posters.' },
  { id: 'video-testimonials', name: 'Real Video Reviews', category: 'Social Proof', icon: Video, description: 'Student video testimonials with hike badges, video upload & cover image upload.' },
  { id: 'testimonial', name: 'Student Love Stories', category: 'Social Proof', icon: MessageSquare, description: 'Written student reviews, quotes & star ratings.' },
  { id: 'faqs', name: 'Frequently Asked Questions', category: 'Help', icon: HelpCircle, description: 'Q&A accordion list addressing common queries.' },
  { id: 'banner', name: 'Promotional Banners', category: 'Marketing', icon: ImageIcon, description: 'Custom promotional image banners & discount alerts.' },
  { id: 'hero-story', name: 'About Page Hero Story', category: 'About Page', icon: Layout, description: 'Main tagline, description & CTA link on /about page.' },
  { id: 'category-tiles', name: 'About Page Discipline Cards', category: 'About Page', icon: Layers, description: 'Discipline cards, course counts, tags & cover images on /about.' },
  { id: 'approach-stages', name: 'About Page 4-Stage System', category: 'About Page', icon: Sliders, description: '4 learning stages (Learn, Practice, Prove, Grow) with bullet lists.' },
  { id: 'why-tabs', name: 'About Page Interactive Tabs', category: 'About Page', icon: FolderOpen, description: 'Visual Lessons, Notes, Project, Certificate poster images.' },
  { id: 'support-info', name: 'Contact & Support Details', category: 'Footer & Support', icon: User, description: 'Support email, phone, working hours & response time.' },
  { id: 'links-and-copy', name: 'Footer Links & Social Media', category: 'Footer & Support', icon: ExternalLink, description: 'Tagline, copyright, social media links & legal links.' },
  { id: 'how-it-works', name: 'How ClassConnect Works', category: 'Homepage', icon: Sliders, description: '4 step workflow cards for learning progression.' },
  { id: 'stats-orbit', name: 'Scale & Orbit Statistics', category: 'Homepage', icon: Award, description: 'Statistics counters, average hike, rating & CTA image.' },
  { id: 'comparison-grid', name: 'Platform Comparison Grid', category: 'Homepage', icon: Check, description: 'Feature matrix comparing ClassConnect vs bootcamps vs YouTube.' },
  { id: 'constellation', name: 'Skill Constellation Nodes', category: 'Homepage', icon: Sparkles, description: 'Interactive skill nodes and mentor avatar thumbnails.' }
];

export const ManageCmsPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [courseSearch, setCourseSearch] = useState('');

  // Active Section Form Data State
  const [formData, setFormData] = useState({
    page: 'home',
    section: 'hero',
    title: '',
    subtitle: '',
    isActive: true,
    data: {}
  });

  // Media Upload Tracking State
  const [uploadingField, setUploadingField] = useState(null);
  const heroFileInputRef = useRef(null);

  const [cmsCategories, setCmsCategories] = useState([]);
  const [savingCatId, setSavingCatId] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [cmsRes, courseRes, catRes] = await Promise.all([
        contentApi.getAllContentAdmin(),
        courseApi.getAllCoursesAdmin(),
        categoryApi.getCategories()
      ]);

      const loadedBlocks = Array.isArray(cmsRes?.data) 
        ? cmsRes.data 
        : (cmsRes?.data?.blocks || (Array.isArray(cmsRes) ? cmsRes : []));
      setBlocks(loadedBlocks);

      const loadedCourses = Array.isArray(courseRes?.data) 
        ? courseRes.data 
        : (courseRes?.data?.courses || (Array.isArray(courseRes) ? courseRes : []));
      setCourses(loadedCourses);

      const loadedCats = Array.isArray(catRes?.data)
        ? catRes.data
        : (catRes?.data?.categories || (Array.isArray(catRes) ? catRes : []));
      setCmsCategories(loadedCats);

      // Select initial block data for 'hero'
      const dbHero = loadedBlocks.find(b => b.section === 'hero');
      if (dbHero) {
        setFormData(dbHero);
      } else {
        setFormData({
          page: 'home',
          section: 'hero',
          title: '',
          subtitle: '',
          isActive: true,
          data: { imageUrl: '', badge: '', ctaText: '', ctaLink: '' }
        });
      }
    } catch (err) {
      console.warn('Failed to load CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Switch Active Section Tab
  const handleSelectSection = (sectionId) => {
    setActiveSectionId(sectionId);
    const dbBlock = blocks.find(b => b.section === sectionId);

    if (dbBlock) {
      setFormData(dbBlock);
    } else {
      // Empty structured template
      setFormData({
        page: 'home',
        section: sectionId,
        title: '',
        subtitle: '',
        isActive: true,
        data: sectionId === 'featured_courses' ? { courseIds: [] } : { items: [] }
      });
    }
  };

  // Save Current Section Form Data
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const payload = {
      ...formData,
      page: formData.page || 'home',
      section: formData.section || activeSectionId,
      title: formData.title || currentSectionMeta.name,
      isActive: formData.isActive ?? true,
      order: formData.order || 1
    };

    try {
      let res;
      if (formData._id) {
        res = await contentApi.updateContentBlock(formData._id, payload);
        setMessage({ type: 'success', text: `Saved "${payload.title}" section content successfully!` });
      } else {
        res = await contentApi.createContentBlock(payload);
        const createdData = res?.data || res;
        if (createdData?._id) setFormData(createdData);
        setMessage({ type: 'success', text: `Published "${payload.title}" section live!` });
      }
      loadAllData();
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Save error:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to save changes.' });
    } finally {
      setSaving(false);
    }
  };

  // Upload Media Handler (Images or Video files)
  const handleUploadFile = async (file, targetPath, isVideo = false) => {
    if (!file) return;
    setUploadingField(targetPath);
    try {
      const res = await uploadApi.uploadFile(file, isVideo ? 'class-connect/cms-videos' : 'class-connect/cms');
      const url = res.url || res.playbackUrl || res.data?.url;
      if (!url) throw new Error('Upload succeeded but no URL was returned.');

      // Update nested property inside formData
      setFormData(prev => {
        const updated = JSON.parse(JSON.stringify(prev));
        const keys = targetPath.split('.');
        let curr = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!curr[keys[i]]) curr[keys[i]] = {};
          curr = curr[keys[i]];
        }
        curr[keys[keys.length - 1]] = url;
        return updated;
      });
      setMessage({ type: 'success', text: 'Media file uploaded to Bunny CDN! Click Save Section Changes to publish.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      alert(err.message || 'File upload failed.');
    } finally {
      setUploadingField(null);
    }
  };

  // Proxy BunnyCDN images through server to bypass hotlink protection on localhost
  const cdnImg = (url) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    if (url.includes('.b-cdn.net') && window.location.hostname === 'localhost') {
      return `/api/upload/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  // Toggle Featured Course
  const toggleFeaturedCourse = (courseId) => {
    const targetIdStr = String(courseId);
    const currentIds = (formData.data?.courseIds || []).map(id => String(id));
    const newIds = currentIds.includes(targetIdStr)
      ? currentIds.filter(id => id !== targetIdStr)
      : [...currentIds, targetIdStr];
    
    setFormData(prev => ({
      ...prev,
      data: { ...prev.data, courseIds: newIds }
    }));
  };

  // Category Management Handlers for Curated Skill Collections
  const handleUpdateCategoryField = (index, field, value) => {
    setCmsCategories(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSaveCategory = async (cat) => {
    setSavingCatId(cat._id);
    try {
      await categoryApi.updateCategory(cat._id, cat);
      setMessage({ type: 'success', text: `Updated "${cat.name}" category card!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update category.');
    } finally {
      setSavingCatId(null);
    }
  };

  const handleAddCategory = async () => {
    const newName = prompt('Enter new category name for skill collection:');
    if (!newName || !newName.trim()) return;
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    try {
      const res = await categoryApi.createCategory({
        name: newName.trim(),
        slug,
        description: 'High-income visual skill track',
        color: '#4338F2',
        coverImage: '',
        isActive: true,
      });
      const createdCat = res.data?.category || res.data || res;
      setCmsCategories(prev => [...prev, createdCat]);
      setMessage({ type: 'success', text: `Created skill card "${newName}"!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      alert(err.message || 'Failed to create category.');
    }
  };

  const handleDeleteCategory = async (catId, index) => {
    if (!window.confirm('Are you sure you want to remove this skill card from the platform?')) return;
    try {
      if (catId) {
        await categoryApi.deleteCategory(catId);
      }
      setCmsCategories(prev => prev.filter((_, i) => i !== index));
      setMessage({ type: 'success', text: 'Category card deleted successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete category.');
    }
  };

  const handleUploadCategoryCover = async (file, index) => {
    if (!file) return;
    setUploadingField(`cat-${index}`);
    try {
      const res = await uploadApi.uploadFile(file, 'class-connect/categories');
      const url = res.url || res.data?.url;
      if (!url) throw new Error('Upload failed');
      handleUpdateCategoryField(index, 'coverImage', url);
      const catToUpdate = cmsCategories[index];
      if (catToUpdate && catToUpdate._id) {
        await categoryApi.updateCategory(catToUpdate._id, { ...catToUpdate, coverImage: url });
      }
      setMessage({ type: 'success', text: `Uploaded and saved cover image for "${cmsCategories[index]?.name || 'Category'}"!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      alert(err.message || 'Upload failed.');
    } finally {
      setUploadingField(null);
    }
  };

  // List Items Handlers (Students, Workshops, Video Reviews, FAQs, Testimonials)
  const handleAddItem = (defaultItem) => {
    const isStudents = activeSectionId === 'student-results';
    const key = isStudents ? 'students' : 'items';
    const currentItems = formData.data?.[key] || [];
    const newItems = [...currentItems, { id: `item-${Date.now()}`, ...defaultItem }];
    
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [key]: newItems
      }
    }));
  };

  const handleUpdateItem = (index, field, value) => {
    const isStudents = activeSectionId === 'student-results';
    const key = isStudents ? 'students' : 'items';
    const currentItems = JSON.parse(JSON.stringify(formData.data?.[key] || []));
    if (!currentItems[index]) return;
    
    currentItems[index][field] = value;
    
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [key]: currentItems
      }
    }));
  };

  const handleDeleteItem = (index) => {
    const isStudents = activeSectionId === 'student-results';
    const key = isStudents ? 'students' : 'items';
    const currentItems = [...(formData.data?.[key] || [])];
    currentItems.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [key]: currentItems
      }
    }));
  };

  const currentSectionMeta = CMS_SECTIONS.find(s => s.id === activeSectionId) || CMS_SECTIONS[0];
  const SectionIcon = currentSectionMeta.icon;

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[var(--canvas)] min-h-screen text-[var(--ink)] font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-extrabold mb-2">
            <Layout className="w-4 h-4" /> Dynamic Website CMS Manager
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-manrope">Manage Homepage Content</h1>
          <p className="text-xs md:text-sm text-[var(--ink-muted)] font-medium">Create and edit section headings, upload cover images, attach video reviews, and publish to live site.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full hover:bg-[var(--deep-anchor,#24216F)] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 min-h-[44px] shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Publish "{formData.title || currentSectionMeta.name}"</span>
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
              const dbBlock = blocks.find(b => b.section === sec.id);

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
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        dbBlock?.isActive 
                          ? (isSelected ? 'bg-emerald-400 text-slate-900' : 'bg-emerald-100 text-emerald-700')
                          : (isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700')
                      }`}>
                        {dbBlock ? (dbBlock.isActive ? 'Active' : 'Hidden') : 'Not Created'}
                      </span>
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
                <p className="text-xs text-[var(--ink-muted)] font-medium">Edit headlines, upload images, attach video reviews, and publish.</p>
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
                  placeholder="Heading title..."
                  className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold uppercase text-[var(--ink-muted)]">Section Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Short subtitle description..."
                  className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm font-semibold focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            {/* DYNAMIC SECTION EDITORS */}

            {/* 0. CURATED SKILL COLLECTIONS (CATEGORIES) EDITOR */}
            {activeSectionId === 'categories' && (
              <div className="space-y-6 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                      Curated Skill Collection Cards ({cmsCategories.length} Categories)
                    </label>
                    <span className="text-[10px] text-[var(--primary)] font-bold">Manage images, titles, colors & descriptions live</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-extrabold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill Track</span>
                  </button>
                </div>

                <div className="space-y-5">
                  {cmsCategories.map((cat, idx) => (
                    <div key={cat._id || idx} className="p-5 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold font-mono text-[var(--primary)]">
                          Category #{idx + 1}: {cat.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateCategoryField(idx, 'isActive', !(cat.isActive !== false))}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${cat.isActive !== false ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                          >
                            {cat.isActive !== false ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveCategory(cat)}
                            disabled={savingCatId === cat._id}
                            className="px-3 py-1 bg-[var(--primary)] text-white text-[11px] font-extrabold rounded-lg hover:bg-[var(--deep-anchor,#24216F)] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {savingCatId === cat._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            <span>Save</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat._id, idx)}
                            className="p-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors cursor-pointer"
                            title="Delete Category Card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Category Card Cover Image Upload Dropzone */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[var(--ink-muted)] mb-1">
                          Category Card Cover Image (Bunny Storage)
                        </label>
                        {cat.coverImage ? (
                          <div className="relative group rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--canvas)] h-32">
                            <img src={cdnImg(cat.coverImage)} alt={cat.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <label className="px-3 py-1.5 bg-white text-slate-900 text-[10px] font-extrabold rounded-lg cursor-pointer">
                                Replace Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleUploadCategoryCover(f, idx);
                                    e.target.value = '';
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleUpdateCategoryField(idx, 'coverImage', '')}
                                className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-extrabold rounded-lg cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full h-24 border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-[var(--surface)] p-2">
                            {uploadingField === `cat-${idx}` ? (
                              <><Loader2 className="w-5 h-5 text-amber-500 animate-spin" /><span className="text-[10px] font-bold text-amber-600">Uploading to Bunny...</span></>
                            ) : (
                              <><UploadCloud className="w-5 h-5 text-[var(--primary)]" /><span className="text-[10px] font-bold text-[var(--ink-muted)]">Upload Category Card Image</span></>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleUploadCategoryCover(f, idx);
                                e.target.value = '';
                              }}
                            />
                          </label>
                        )}
                      </div>

                      {/* Category Name, Color Accent & Description */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[var(--ink-muted)] mb-1">Category Title</label>
                          <input
                            type="text"
                            placeholder="Category Name"
                            value={cat.name || ''}
                            onChange={(e) => handleUpdateCategoryField(idx, 'name', e.target.value)}
                            className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[var(--ink-muted)] mb-1">Hex Color Accent</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={cat.color || '#4338F2'}
                              onChange={(e) => handleUpdateCategoryField(idx, 'color', e.target.value)}
                              className="w-8 h-8 rounded-lg border border-[var(--border)] cursor-pointer"
                            />
                            <input
                              type="text"
                              placeholder="#4338F2"
                              value={cat.color || ''}
                              onChange={(e) => handleUpdateCategoryField(idx, 'color', e.target.value)}
                              className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[var(--ink-muted)] mb-1">Card Subtitle / Description</label>
                        <input
                          type="text"
                          placeholder="Short tagline description..."
                          value={cat.description || ''}
                          onChange={(e) => handleUpdateCategoryField(idx, 'description', e.target.value)}
                          className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 border border-[var(--border)] rounded-2xl p-3 bg-[var(--canvas)]">
                  {courses
                    .filter(c => c.title.toLowerCase().includes(courseSearch.toLowerCase()))
                    .map(c => {
                      const isSelected = (formData.data?.courseIds || []).map(id => String(id)).includes(String(c._id));
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
                    <label className="block mb-1 text-xs font-bold uppercase text-[var(--ink-muted)]">Headline Metric</label>
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

                {/* Student Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                      Graduate Student Outcome Cards ({(formData.data?.students || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddItem({ name: '', role: '', company: '', packageCTC: '', review: '' })}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-extrabold hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Student Card</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.data?.students || []).map((student, idx) => (
                      <div key={student.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                          <span className="text-xs font-bold text-[var(--primary)] font-mono">Student #{idx + 1}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateItem(idx, 'isActive', !(student.isActive !== false))}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${student.isActive !== false ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                            >
                              {student.isActive !== false ? 'Active' : 'Hidden'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(idx)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Student Photo Upload */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--ink-muted)] mb-1">Student Photo</label>
                          {student.avatarUrl ? (
                            <div className="flex items-center gap-3">
                              <img src={cdnImg(student.avatarUrl)} alt="Student" className="w-16 h-16 rounded-xl object-cover border border-[var(--border)]" />
                              <div className="flex gap-2">
                                <label className="px-2.5 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[10px] font-extrabold rounded-lg cursor-pointer hover:bg-[var(--primary)] hover:text-white transition-colors">
                                  Replace
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadFile(f, `data.students.${idx}.avatarUrl`); e.target.value = ''; }} />
                                </label>
                                <button type="button" onClick={() => handleUpdateItem(idx, 'avatarUrl', '')} className="px-2.5 py-1.5 bg-red-100 text-red-600 text-[10px] font-extrabold rounded-lg hover:bg-red-600 hover:text-white transition-colors cursor-pointer">Remove</button>
                              </div>
                            </div>
                          ) : (
                            <label className="w-full h-20 border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-[var(--surface)]">
                              {uploadingField === `data.students.${idx}.avatarUrl` ? (
                                <><Loader2 className="w-5 h-5 text-amber-500 animate-spin" /><span className="text-[10px] font-bold text-amber-600">Uploading...</span></>
                              ) : (
                                <><UploadCloud className="w-5 h-5 text-[var(--ink-muted)]" /><span className="text-[10px] font-bold text-[var(--ink-muted)]">Upload Student Photo</span></>
                              )}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadFile(f, `data.students.${idx}.avatarUrl`); e.target.value = ''; }} />
                            </label>
                          )}
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
                    Scheduled Live Workshops ({(formData.data?.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ title: '', host: '', status: 'LIVE NOW', actionText: 'Join Room' })}
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
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'isActive', !(item.isActive !== false))}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${item.isActive !== false ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                          >
                            {item.isActive !== false ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Workshop Banner Image Upload */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[var(--ink-muted)] mb-1">Workshop Banner Image</label>
                        {item.image ? (
                          <div className="relative group rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--canvas)]">
                            <img src={cdnImg(item.image)} alt="Workshop Banner" className="w-full h-28 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <label className="px-3 py-1.5 bg-white text-slate-900 text-[10px] font-extrabold rounded-lg cursor-pointer">
                                Replace
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadFile(f, `data.items.${idx}.image`); e.target.value = ''; }} />
                              </label>
                              <button type="button" onClick={() => handleUpdateItem(idx, 'image', '')} className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-extrabold rounded-lg cursor-pointer">Remove</button>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full h-24 border-2 border-dashed border-[var(--border)] hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-[var(--surface)]">
                            {uploadingField === `data.items.${idx}.image` ? (
                              <><Loader2 className="w-5 h-5 text-amber-500 animate-spin" /><span className="text-[10px] font-bold text-amber-600">Uploading...</span></>
                            ) : (
                              <><UploadCloud className="w-5 h-5 text-indigo-600" /><span className="text-[10px] font-bold text-[var(--ink-muted)]">Upload Workshop Banner</span></>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadFile(f, `data.items.${idx}.image`); e.target.value = ''; }} />
                          </label>
                        )}
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Status (e.g. LIVE NOW, Tomorrow • 6 PM)"
                          value={item.status || ''}
                          onChange={(e) => handleUpdateItem(idx, 'status', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Action Button Text (e.g. Join Room)"
                          value={item.actionText || ''}
                          onChange={(e) => handleUpdateItem(idx, 'actionText', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. REAL VIDEO REVIEWS EDITOR (DIRECT FILE UPLOAD FOR BOTH VIDEO & POSTER COVER IMAGE) */}
            {activeSectionId === 'video-testimonials' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Student Video Reviews ({(formData.data?.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ studentName: '', role: '', hikeStat: '', quote: '', videoUrl: '', posterUrl: '' })}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-extrabold hover:bg-purple-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Video Review</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(formData.data?.items || []).map((item, idx) => (
                    <div key={item.id || idx} className="p-5 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-4">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-purple-600 font-mono">Video Review #{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'isActive', !(item.isActive !== false))}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${item.isActive !== false ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                          >
                            {item.isActive !== false ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                          placeholder="Outcome Stat (e.g. 50% Salary Increase)"
                          value={item.hikeStat || ''}
                          onChange={(e) => handleUpdateItem(idx, 'hikeStat', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Student video quote summary..."
                        value={item.quote || ''}
                        onChange={(e) => handleUpdateItem(idx, 'quote', e.target.value)}
                        className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-medium"
                      />

                      {/* Video File Upload Dropzone & Poster Image Upload Dropzone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Video File Upload */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--ink-muted)] mb-1">
                            1. Video File Upload
                          </label>
                          {item.videoUrl ? (
                            <div className="p-2 rounded-xl bg-black border border-[var(--border)] space-y-2">
                              <video src={cdnImg(item.videoUrl)} controls className="w-full h-24 object-contain rounded-lg" />
                              <button
                                type="button"
                                onClick={() => handleUpdateItem(idx, 'videoUrl', '')}
                                className="w-full py-1 bg-red-600 text-white text-[10px] font-extrabold rounded-md hover:bg-red-700 transition-colors"
                              >
                                Replace Video
                              </button>
                            </div>
                          ) : (
                            <label className="w-full h-24 border-2 border-dashed border-[var(--border)] hover:border-purple-500 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-[var(--surface)] p-2">
                              <Video className="w-5 h-5 text-purple-600" />
                              <span className="text-[11px] font-bold text-[var(--ink-muted)]">Upload Video File</span>
                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadFile(f, `data.items.${idx}.videoUrl`, true);
                                }}
                              />
                            </label>
                          )}
                        </div>

                        {/* Poster Cover Image Upload */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[var(--ink-muted)] mb-1">
                            2. Video Cover Poster Upload
                          </label>
                          {item.posterUrl ? (
                            <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                              <img src={cdnImg(item.posterUrl)} alt="Cover" className="w-full h-24 object-cover rounded-lg" />
                              <button
                                type="button"
                                onClick={() => handleUpdateItem(idx, 'posterUrl', '')}
                                className="w-full py-1 bg-red-600 text-white text-[10px] font-extrabold rounded-md hover:bg-red-700 transition-colors"
                              >
                                Replace Cover
                              </button>
                            </div>
                          ) : (
                            <label className="w-full h-24 border-2 border-dashed border-[var(--border)] hover:border-purple-500 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-[var(--surface)] p-2">
                              <UploadCloud className="w-5 h-5 text-purple-600" />
                              <span className="text-[11px] font-bold text-[var(--ink-muted)]">Upload Poster Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadFile(f, `data.items.${idx}.posterUrl`, false);
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
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
                    Frequently Asked Questions ({(formData.data?.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ question: '', answer: '' })}
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
                        <span className="text-xs font-bold text-amber-600 font-mono">Q&A #{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'isActive', !(faq.isActive !== false))}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${faq.isActive !== false ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                          >
                            {faq.isActive !== false ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

            {/* 6. STUDENT LOVE STORIES / TESTIMONIALS EDITOR */}
            {activeSectionId === 'testimonial' && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-[var(--ink)] tracking-wider">
                    Student Love Stories ({(formData.data?.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem({ name: '', role: '', quote: '', avatar: '', rating: 5 })}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-extrabold hover:bg-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Story</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.data?.items || []).map((item, idx) => (
                    <div key={item.id || idx} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="text-xs font-bold text-rose-600 font-mono">Story #{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'isActive', !(item.isActive !== false))}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-colors ${item.isActive !== false ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                          >
                            {item.isActive !== false ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Student Avatar Photo Upload */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[var(--ink-muted)] mb-1">Student Photo</label>
                        {item.avatar ? (
                          <div className="flex items-center gap-3">
                            <img src={cdnImg(item.avatar)} alt="Student" className="w-16 h-16 rounded-xl object-cover border border-[var(--border)]" />
                            <div className="flex gap-2">
                              <label className="px-2.5 py-1.5 bg-[var(--primary-soft)] text-[var(--primary)] text-[10px] font-extrabold rounded-lg cursor-pointer hover:bg-[var(--primary)] hover:text-white transition-colors">
                                Replace
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadFile(f, `data.items.${idx}.avatar`); e.target.value = ''; }} />
                              </label>
                              <button type="button" onClick={() => handleUpdateItem(idx, 'avatar', '')} className="px-2.5 py-1.5 bg-red-100 text-red-600 text-[10px] font-extrabold rounded-lg hover:bg-red-600 hover:text-white transition-colors cursor-pointer">Remove</button>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full h-20 border-2 border-dashed border-[var(--border)] hover:border-rose-500 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-[var(--surface)]">
                            {uploadingField === `data.items.${idx}.avatar` ? (
                              <><Loader2 className="w-5 h-5 text-amber-500 animate-spin" /><span className="text-[10px] font-bold text-amber-600">Uploading...</span></>
                            ) : (
                              <><UploadCloud className="w-5 h-5 text-rose-600" /><span className="text-[10px] font-bold text-[var(--ink-muted)]">Upload Student Photo</span></>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadFile(f, `data.items.${idx}.avatar`); e.target.value = ''; }} />
                          </label>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Student Name"
                          value={item.name || ''}
                          onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Role (e.g. Frontend Engineer @ Swiggy)"
                          value={item.role || ''}
                          onChange={(e) => handleUpdateItem(idx, 'role', e.target.value)}
                          className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Student's testimonial quote..."
                        value={item.quote || ''}
                        onChange={(e) => handleUpdateItem(idx, 'quote', e.target.value)}
                        className="w-full p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-medium"
                      />

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[var(--ink-muted)] mb-1">Rating (1-5)</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleUpdateItem(idx, 'rating', star)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                                star <= (item.rating || 5) ? 'bg-amber-400 text-white' : 'bg-[var(--surface)] text-[var(--ink-muted)] border border-[var(--border)]'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GENERIC HERO / BANNER IMAGE DROPZONE */}
            {(activeSectionId === 'hero' || activeSectionId === 'banner') && (
              <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--ink-muted)] mb-2">Section Image / Banner</label>
                  {formData.data?.imageUrl ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--canvas)]">
                      <img src={cdnImg(formData.data.imageUrl)} alt="Banner" className="w-full h-44 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
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
                      onClick={() => !uploadingField && heroFileInputRef.current?.click()}
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
                    ref={heroFileInputRef}
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
                Status: {formData.isActive ? 'Active' : 'Hidden'}
              </span>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full hover:bg-[var(--deep-anchor,#24216F)] transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 min-h-[44px]"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Publish Section</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
