import React, { useState, useEffect } from 'react';
import { contentApi } from '../../../api/models/content.api';
import { courseApi } from '../../../api/models/course.api';
import { 
  Layout, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Image as ImageIcon,
  ExternalLink,
  Layers,
  X,
  Loader2,
  Search,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ManageCmsPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'featured'
  const [courseSearch, setCourseSearch] = useState('');

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const res = await contentApi.getAllContentAdmin();
      const loaded = Array.isArray(res?.data) 
        ? res.data 
        : (res?.data?.blocks || (Array.isArray(res) ? res : []));
      setBlocks(loaded);
    } catch (err) {
      console.warn(err);
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await courseApi.getAllCoursesAdmin();
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.courses || (Array.isArray(res) ? res : []));
      setCourses(list);
    } catch (err) {
      console.warn('Failed to load courses for CMS picker:', err);
    }
  };

  useEffect(() => {
    fetchBlocks();
    fetchCourses();
  }, []);

  const handleToggleActive = async (block) => {
    try {
      const res = await contentApi.updateContentBlock(block._id, { isActive: !block.isActive });
      if (res.success || res.data) {
        setMessage({ type: 'success', text: `Block status updated!` });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        fetchBlocks();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update block status.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content block?')) return;
    try {
      const res = await contentApi.deleteContentBlock(id);
      if (res.success || res.data) {
        setMessage({ type: 'success', text: 'Content block deleted.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        fetchBlocks();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete block.' });
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingBlock) return;
    setSaving(true);

    try {
      if (editingBlock._id) {
        await contentApi.updateContentBlock(editingBlock._id, editingBlock);
        setMessage({ type: 'success', text: 'Content block updated successfully!' });
      } else {
        await contentApi.createContentBlock(editingBlock);
        setMessage({ type: 'success', text: 'New content block created!' });
      }
      setEditingBlock(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchBlocks();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save block.' });
    } finally {
      setSaving(false);
    }
  };

  // Helper to toggle course selection in featured_courses block
  const handleToggleCourseSelect = (courseId) => {
    if (!editingBlock) return;
    const currentIds = editingBlock.data?.courseIds || [];
    let updatedIds = [];
    if (currentIds.includes(courseId)) {
      updatedIds = currentIds.filter(id => id !== courseId);
    } else {
      updatedIds = [...currentIds, courseId];
    }
    setEditingBlock({
      ...editingBlock,
      data: { ...editingBlock.data, courseIds: updatedIds }
    });
  };

  // Helper to move course order
  const handleMoveCourseOrder = (index, direction) => {
    if (!editingBlock) return;
    const currentIds = [...(editingBlock.data?.courseIds || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentIds.length) return;

    const temp = currentIds[index];
    currentIds[index] = currentIds[targetIndex];
    currentIds[targetIndex] = temp;

    setEditingBlock({
      ...editingBlock,
      data: { ...editingBlock.data, courseIds: currentIds }
    });
  };

  const featuredBlock = blocks.find(b => b.page === 'home' && b.section === 'featured_courses');

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[var(--canvas)] min-h-screen text-[var(--ink)] font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-extrabold mb-2">
            <Layout className="w-4 h-4" /> Live Content Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope">Manage Homepage & CMS</h1>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-medium">Edit live banners, section titles, images, and curated homepage courses.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() =>
              setEditingBlock({
                page: 'home',
                section: 'student-results',
                title: 'Real Results from Batch Zero',
                subtitle: '100% of graduates secured paid industry opportunities',
                data: {
                  headlineMetric: '100% of graduates* secured paid industry opportunities.',
                  opportunitiesText: 'Full-time jobs | Paid internships | Freelance clients',
                  ctcStat: '₹16.2 LPA Combined CTC',
                  footnote: '*Out of all the students who completed the program and actively pursued paid opportunities from ClassConnect',
                  students: [
                    {
                      id: 'student-1',
                      name: 'Aarav Sharma',
                      role: 'Full-Stack Developer',
                      company: 'TechCorp India',
                      packageCTC: '₹18.5 LPA Package',
                      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                      rating: 5,
                      review: 'ClassConnect transformed my career. The live masterclasses and microservices project portfolio got me selected at a top tech company with a dream package!',
                      skills: ['React 19', 'Node.js', 'System Design']
                    }
                  ]
                },
                order: blocks.length + 1,
                isActive: true,
              })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-full text-xs font-extrabold hover:bg-emerald-700 transition-all min-h-[40px] shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Batch Results</span>
          </button>

          <button
            onClick={() =>
              setEditingBlock({
                page: 'home',
                section: 'live_classes_workshops',
                title: 'Live Interactive Masterclasses & Workshops',
                subtitle: 'Join live sessions with industry veterans this week',
                data: {
                  workshops: [
                    {
                      id: 'ws-1',
                      title: 'Build Microservices Architecture with Node.js & Docker',
                      date: 'Tomorrow, 7:00 PM IST',
                      mentor: 'Dr. Samir Singh',
                      topic: 'Backend Engineering',
                      link: '/courses'
                    }
                  ]
                },
                order: blocks.length + 1,
                isActive: true,
              })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 text-white rounded-full text-xs font-extrabold hover:bg-rose-700 transition-all min-h-[40px] shadow-sm cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Live Workshops</span>
          </button>

          <button
            onClick={() =>
              setEditingBlock({
                page: 'home',
                section: 'faqs',
                title: 'Frequently Asked Questions',
                subtitle: 'Everything you need to know about our courses and certification',
                data: {
                  faqs: [
                    { question: 'Do I get lifetime access?', answer: 'Yes, full lifetime access including future updates.' },
                    { question: 'Is certificate verifiable?', answer: 'Yes, every certificate has a unique 90%+ completion hash code.' }
                  ]
                },
                order: blocks.length + 1,
                isActive: true,
              })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 text-white rounded-full text-xs font-extrabold hover:bg-amber-700 transition-all min-h-[40px] shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>FAQs Block</span>
          </button>

          <button
            onClick={() =>
              setEditingBlock({
                page: 'home',
                section: 'banner',
                title: 'New Content Section',
                subtitle: 'Custom block subtitle',
                data: { imageUrl: '', ctaText: 'Explore Courses', ctaLink: '/courses' },
                order: blocks.length + 1,
                isActive: true,
              })
            }
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-full text-xs font-extrabold hover:bg-[var(--deep-anchor,#24216F)] transition-all min-h-[40px] shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[var(--border)] pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
            activeTab === 'all' ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink-muted)] hover:bg-[var(--surface)]'
          }`}
        >
          All CMS Blocks ({blocks.length})
        </button>
        <button
          onClick={() => setActiveTab('featured')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'featured' ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink-muted)] hover:bg-[var(--surface)]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Featured Courses Tab</span>
        </button>
      </div>

      {/* Alert Message */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 border ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* FEATURED COURSES DEDICATED TAB VIEW */}
      {activeTab === 'featured' && (
        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl,24px)] border border-[var(--border)] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div>
              <h2 className="text-xl font-extrabold font-manrope">Admin-Curated Homepage Courses</h2>
              <p className="text-xs text-[var(--ink-muted)] font-medium">Select and order the exact courses displayed on the homepage Featured section.</p>
            </div>

            <button
              onClick={() => {
                if (featuredBlock) {
                  setEditingBlock({ ...featuredBlock });
                } else {
                  setEditingBlock({
                    page: 'home',
                    section: 'featured_courses',
                    title: 'Featured courses',
                    subtitle: 'Hand-picked by our experts, these courses represent the best of what ClassConnect has to offer.',
                    data: { courseIds: [] },
                    order: 3,
                    isActive: true
                  });
                }
              }}
              className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-full text-xs font-extrabold hover:bg-[var(--deep-anchor,#24216F)] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              <span>{featuredBlock ? 'Edit Featured Courses Selection' : 'Create Featured Courses Block'}</span>
            </button>
          </div>

          {featuredBlock ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)]">
                <div>
                  <span className="text-xs font-bold text-[var(--ink-muted)]">Block Status</span>
                  <div className="text-sm font-extrabold text-[var(--ink)] mt-0.5">
                    {featuredBlock.isActive ? '✅ Active on Homepage' : '⚠️ Hidden / Inactive'}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[var(--ink-muted)]">Selected Courses</span>
                  <div className="text-sm font-extrabold text-[var(--primary)] mt-0.5">
                    {(featuredBlock.data?.courses || []).length} Courses Curated
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(featuredBlock.data?.courses || []).map((course, index) => (
                  <div key={course._id || index} className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-black flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm truncate">{course.title}</h4>
                      <p className="text-xs text-[var(--ink-muted)]">₹{course.price} • {course.category?.name || 'Category'}</p>
                    </div>
                  </div>
                ))}

                {(featuredBlock.data?.courses || []).length === 0 && (
                  <div className="col-span-full py-10 text-center text-xs font-bold text-[var(--ink-muted)] bg-[var(--canvas)] rounded-2xl border border-dashed border-[var(--border)]">
                    No courses currently selected in the Featured block. Click "Edit Featured Courses Selection" to pick courses.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-sm font-bold text-[var(--ink-muted)] bg-[var(--canvas)] rounded-2xl border border-dashed border-[var(--border)]">
              No `featured_courses` CMS block initialized yet. Click above to create one.
            </div>
          )}
        </div>
      )}

      {/* Content Blocks Grid */}
      {activeTab === 'all' && (
        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl,24px)] border border-[var(--border)] shadow-sm space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-[var(--canvas)] animate-pulse rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blocks.map((block) => (
                <div 
                  key={block._id} 
                  className="bg-[var(--canvas)] rounded-2xl border border-[var(--border)] shadow-xs p-6 flex flex-col justify-between hover:shadow-md hover:border-[var(--primary)]/40 transition-all group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Top Bar: Section Badge + Status Actions */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-[10px] font-black uppercase tracking-wider">
                        {block.page} / {block.section}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleActive(block)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer ${
                            block.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                          }`}
                          title="Toggle Visibility"
                        >
                          {block.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{block.isActive ? 'Active' : 'Hidden'}</span>
                        </button>

                        <button
                          onClick={() => setEditingBlock({ ...block })}
                          className="p-2 text-[var(--ink-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface)] rounded-xl border border-[var(--border)] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                          title="Edit Block"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(block._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                          title="Delete Block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="font-extrabold text-base font-manrope text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                        {block.title}
                      </h3>
                      {block.subtitle && (
                        <p className="text-xs text-[var(--ink-muted)] font-medium mt-1 line-clamp-2">
                          {block.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Featured Courses Details if featured_courses section */}
                    {block.section === 'featured_courses' ? (
                      <div className="p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] text-xs space-y-1">
                        <span className="font-bold text-[var(--primary)]">Curated Courses:</span>
                        <div className="font-medium text-[var(--ink-muted)]">
                          {(block.data?.courses || []).length > 0 
                            ? (block.data.courses.map(c => c.title).join(', '))
                            : 'No courses selected.'}
                        </div>
                      </div>
                    ) : block.data?.imageUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-[var(--border)] aspect-video bg-black/5">
                        <img
                          src={block.data.imageUrl}
                          alt={block.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[var(--border)] p-4 flex flex-col items-center justify-center text-[var(--ink-muted)] bg-[var(--surface)] text-xs font-medium">
                        <ImageIcon className="w-6 h-6 mb-1 text-[var(--ink-muted)]" />
                        <span>No image preview</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {blocks.length === 0 && (
                <div className="col-span-full text-center py-12 text-[var(--ink-muted)] font-medium text-sm bg-[var(--canvas)] rounded-2xl border border-dashed border-[var(--border)]">
                  No CMS content blocks found. Click "Add Content Block" above to create one.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal Editor */}
      <AnimatePresence>
        {editingBlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[var(--surface)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--canvas)]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[var(--primary)] tracking-wider">
                    {editingBlock.section === 'featured_courses' ? 'Featured Courses Editor' : 'CMS Block Editor'}
                  </span>
                  <h3 className="text-xl font-extrabold font-manrope text-[var(--ink)]">
                    {editingBlock.section === 'featured_courses' 
                      ? 'Curate Homepage Featured Courses' 
                      : (editingBlock._id ? 'Edit Content Block' : 'Create New Content Block')}
                  </h3>
                </div>
                <button onClick={() => setEditingBlock(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveEdit} className="p-6 space-y-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase mb-1">Page Target</label>
                    <input
                      type="text"
                      value={editingBlock.page}
                      onChange={(e) => setEditingBlock({ ...editingBlock, page: e.target.value })}
                      placeholder="e.g. home, about, categories"
                      required
                      className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase mb-1">Section Name</label>
                    <input
                      type="text"
                      value={editingBlock.section}
                      onChange={(e) => setEditingBlock({ ...editingBlock, section: e.target.value })}
                      placeholder="e.g. hero, banner, featured_courses"
                      required
                      className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase mb-1">Title Header</label>
                  <input
                    type="text"
                    value={editingBlock.title}
                    onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                    required
                    className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase mb-1">Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={editingBlock.subtitle || ''}
                    onChange={(e) => setEditingBlock({ ...editingBlock, subtitle: e.target.value })}
                    placeholder="Short overview text..."
                    className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold focus:outline-none focus:border-[var(--primary)] resize-none"
                  />
                </div>

                {/* SPECIAL FEATURED COURSES PICKER */}
                {editingBlock.section === 'featured_courses' ? (
                  <div className="space-y-4 pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase text-[var(--primary)] tracking-wider">
                        Curated Course Selection & Display Order
                      </label>
                      <span className="text-xs font-bold text-[var(--ink-muted)]">
                        {(editingBlock.data?.courseIds || []).length} Selected
                      </span>
                    </div>

                    {/* Ordered List of Selected Courses with Drag/Reorder buttons */}
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-[var(--canvas)] p-3 rounded-xl border border-[var(--border)]">
                      <span className="text-[11px] font-bold text-[var(--ink-muted)] uppercase block mb-1">
                        Current Display Order (First to Last):
                      </span>
                      {(editingBlock.data?.courseIds || []).map((cId, idx) => {
                        const courseObj = courses.find(c => c._id === cId);
                        return (
                          <div key={cId} className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs">
                            <div className="flex items-center gap-2 font-bold truncate">
                              <span className="w-5 h-5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-[10px] font-black flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="truncate">{courseObj?.title || cId}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleMoveCourseOrder(idx, -1)}
                                disabled={idx === 0}
                                className="p-1 rounded hover:bg-[var(--canvas)] disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveCourseOrder(idx, 1)}
                                disabled={idx === (editingBlock.data?.courseIds || []).length - 1}
                                className="p-1 rounded hover:bg-[var(--canvas)] disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleCourseSelect(cId)}
                                className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer"
                                title="Remove"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {(editingBlock.data?.courseIds || []).length === 0 && (
                        <div className="text-center py-4 text-xs font-bold text-[var(--ink-muted)]">
                          No courses selected. Select from available courses below.
                        </div>
                      )}
                    </div>

                    {/* Available Courses Multi-select List with Search */}
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={courseSearch}
                          onChange={(e) => setCourseSearch(e.target.value)}
                          placeholder="Search available courses by title..."
                          className="w-full pl-9 pr-3 py-2 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold focus:outline-none"
                        />
                        <Search className="w-4 h-4 text-[var(--ink-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>

                      <div className="max-h-48 overflow-y-auto bg-[var(--canvas)] p-3 rounded-xl border border-[var(--border)] space-y-1">
                        {courses
                          .filter(c => c.title?.toLowerCase().includes(courseSearch.toLowerCase()))
                          .map((c) => {
                            const isSelected = (editingBlock.data?.courseIds || []).includes(c._id);
                            return (
                              <div
                                key={c._id}
                                onClick={() => handleToggleCourseSelect(c._id)}
                                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors text-xs font-semibold ${
                                  isSelected ? 'bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/30' : 'hover:bg-[var(--surface)]'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'border-slate-300'}`}>
                                    {isSelected && <Check className="w-3 h-3" />}
                                  </div>
                                  <span className="truncate">{c.title}</span>
                                </div>
                                <span className="text-[10px] opacity-75 font-mono">₹{c.price}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editingBlock.data?.imageUrl || ''}
                        onChange={(e) =>
                          setEditingBlock({
                            ...editingBlock,
                            data: { ...editingBlock.data, imageUrl: e.target.value },
                          })
                        }
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold focus:outline-none focus:border-[var(--primary)]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase mb-1">CTA Button Text</label>
                        <input
                          type="text"
                          value={editingBlock.data?.ctaText || ''}
                          onChange={(e) =>
                            setEditingBlock({
                              ...editingBlock,
                              data: { ...editingBlock.data, ctaText: e.target.value },
                            })
                          }
                          placeholder="e.g. Explore Courses"
                          className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase mb-1">CTA Link Path</label>
                        <input
                          type="text"
                          value={editingBlock.data?.ctaLink || ''}
                          onChange={(e) =>
                            setEditingBlock({
                              ...editingBlock,
                              data: { ...editingBlock.data, ctaLink: e.target.value },
                            })
                          }
                          placeholder="e.g. /courses"
                          className="w-full p-3 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs font-semibold focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setEditingBlock(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full hover:bg-[var(--deep-anchor,#24216F)] transition-colors min-h-[40px] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
