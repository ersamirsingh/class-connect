import React, { useState, useEffect } from 'react';
import { contentApi } from '../../../api/models/content.api';
import { courseApi } from '../../../api/models/course.api';
import { uploadApi } from '../../../api/models/upload.api';
import { Layout, Plus, Edit2, Trash2, Eye, EyeOff, Save, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon, BookOpen, Star, X, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export const ManageCmsPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'suggestions'

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const res = await contentApi.getAllContentAdmin();
      if (res.success && res.data) {
        setBlocks(res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch CMS content blocks.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await courseApi.getAllCoursesAdmin();
      if (res.success && res.data) {
        setCourses(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  useEffect(() => {
    fetchBlocks();
    fetchCourses();
  }, []);

  const handleToggleActive = async (block) => {
    try {
      const res = await contentApi.updateContentBlock(block._id, { isActive: !block.isActive });
      if (res.success) {
        setMessage({ type: 'success', text: `Block status updated!` });
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
      if (res.success) {
        setMessage({ type: 'success', text: 'Content block deleted.' });
        fetchBlocks();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete block.' });
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingBlock) return;

    try {
      if (editingBlock._id) {
        await contentApi.updateContentBlock(editingBlock._id, editingBlock);
        setMessage({ type: 'success', text: 'Content block updated successfully!' });
      } else {
        await contentApi.createContentBlock(editingBlock);
        setMessage({ type: 'success', text: 'New content block created!' });
      }
      setEditingBlock(null);
      fetchBlocks();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save block.' });
    }
  };

  const handleToggleSuggested = async (courseId) => {
    try {
      const res = await courseApi.toggleSuggested(courseId);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        fetchCourses();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to toggle course suggestion.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold mb-2">
            <Layout className="w-4 h-4" /> Dynamic CMS Editor
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">Manage Homepage & CMS</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Edit content blocks, hero banners, and manage course suggestions.</p>
        </div>

        {activeTab === 'content' && (
          <button
            onClick={() =>
              setEditingBlock({
                page: 'home',
                section: 'banner',
                title: 'New Visual Banner',
                subtitle: 'Short descriptive subtitle',
                data: { imageUrl: '', ctaText: 'Explore', ctaLink: '/courses' },
                order: blocks.length + 1,
                isActive: true,
              })
            }
            className="btn-visual btn-primary text-xs"
          >
            <Plus className="w-4 h-4" /> Add Content Block
          </button>
        )}
      </div>

      {/* Tabs: Content Blocks | Course Suggestions */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'content'
              ? 'bg-[#6366F1] text-white shadow-md'
              : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Layout className="w-4 h-4" /> Content Blocks
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'suggestions'
              ? 'bg-[#6366F1] text-white shadow-md'
              : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Course Suggestions
        </button>
      </div>

      {/* Alert Message */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]'
              : 'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto p-1 rounded-lg hover:bg-black/10 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TAB: Content Blocks */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blocks.map((block) => (
            <div key={block._id} className="card-visual p-6 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-black uppercase">
                  {block.page} / {block.section}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(block)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                      block.isActive ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {block.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {block.isActive ? 'Active' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => setEditingBlock({ ...block })}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#6366F1] hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(block._id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#EF4444] hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-extrabold text-lg text-[#0F172A] dark:text-white">{block.title}</h3>
              {block.subtitle && <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{block.subtitle}</p>}

              {block.data?.imageUrl && (
                <img
                  src={block.data.imageUrl}
                  alt={block.title}
                  className="w-full h-36 object-cover rounded-2xl border border-slate-100 dark:border-slate-800"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB: Course Suggestions Manager */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="card-visual p-5 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white">Manage Course Suggestions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Toggle courses to appear in the "Suggested Courses" section on the homepage. When RAG is implemented, this will be replaced by AI-powered recommendations.
              </p>
            </div>
            <div className="text-xs font-extrabold text-[#6366F1]">
              {courses.filter((c) => c.isSuggested).length} Selected
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className={`card-visual p-4 space-y-3 relative cursor-pointer transition-all ${
                  course.isSuggested ? 'ring-2 ring-[#6366F1] shadow-lg' : ''
                }`}
                onClick={() => handleToggleSuggested(course._id)}
              >
                {/* Suggested Badge */}
                {course.isSuggested && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300'}
                    alt={course.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-[#0F172A] dark:text-white line-clamp-2 leading-snug">{course.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400">
                      <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                      <span>{course.rating || 4.8}</span>
                      <span>·</span>
                      <span>{course.category?.name || 'General'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black text-[#6366F1]">₹{course.discountPrice || course.price}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    course.isSuggested
                      ? 'bg-[#6366F1]/10 text-[#6366F1]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {course.isSuggested ? '✓ Suggested' : 'Not Suggested'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Editor (Content Blocks) */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-3xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-[#0F172A] dark:text-white">
              {editingBlock._id ? 'Edit Content Block' : 'Create Content Block'}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Page</label>
                  <input
                    type="text"
                    value={editingBlock.page}
                    onChange={(e) => setEditingBlock({ ...editingBlock, page: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Section</label>
                  <input
                    type="text"
                    value={editingBlock.section}
                    onChange={(e) => setEditingBlock({ ...editingBlock, section: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Title</label>
                <input
                  type="text"
                  value={editingBlock.title}
                  onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingBlock.subtitle || ''}
                  onChange={(e) => setEditingBlock({ ...editingBlock, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                />
              </div>

              {/* Cloudinary Section Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Section Banner Image (Cloudinary File Upload)
                </label>
                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  {editingBlock.data?.imageUrl ? (
                    <img src={editingBlock.data.imageUrl} alt="Banner Preview" className="w-14 h-14 object-cover rounded-xl border border-slate-300" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="btn-visual btn-primary text-xs px-4 py-2 cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      <span>{editingBlock.data?.imageUrl ? 'Change Image (Cloudinary)' : 'Upload Banner Image to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          try {
                            const res = await uploadApi.uploadFile(file, 'class-connect/cms');
                            if (res.success && res.url) {
                              setEditingBlock((prev) => ({
                                ...prev,
                                data: { ...prev.data, imageUrl: res.url },
                              }));
                            }
                          } catch (err) {
                            console.error('Upload failed:', err);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBlock(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-visual btn-primary text-xs">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
