import React, { useState, useEffect } from 'react';
import { contentApi } from '../../../api/models/content.api';
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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ManageCmsPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  useEffect(() => {
    fetchBlocks();
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

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[var(--canvas)] min-h-screen text-[var(--ink)] font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-extrabold mb-2">
            <Layout className="w-4 h-4" /> Live Content Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope">Manage Homepage & CMS</h1>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-medium">Edit live banners, section titles, images, and CTAs in real-time.</p>
        </div>

        <button
          onClick={() =>
            setEditingBlock({
              page: 'home',
              section: 'banner',
              title: 'New Visual Banner',
              subtitle: 'Short descriptive subtitle',
              data: { imageUrl: '', ctaText: 'Explore Courses', ctaLink: '/courses' },
              order: blocks.length + 1,
              isActive: true,
            })
          }
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-full text-xs font-extrabold hover:bg-[var(--deep-anchor,#24216F)] transition-all min-h-[44px] shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Content Block</span>
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

      {/* Content Blocks Grid */}
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

                  {/* Image Preview */}
                  {block.data?.imageUrl ? (
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

                  {/* CTA Link Preview */}
                  {block.data?.ctaText && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--primary)] pt-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>CTA: {block.data.ctaText} ({block.data.ctaLink || '#'})</span>
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

      {/* Modal Editor */}
      <AnimatePresence>
        {editingBlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[var(--surface)] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--canvas)]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[var(--primary)] tracking-wider">CMS Block Editor</span>
                  <h3 className="text-xl font-extrabold font-manrope text-[var(--ink)]">
                    {editingBlock._id ? 'Edit Content Block' : 'Create New Content Block'}
                  </h3>
                </div>
                <button onClick={() => setEditingBlock(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveEdit} className="p-6 space-y-4 overflow-y-auto flex-1">
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
                      placeholder="e.g. hero, banner, testimonial"
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
