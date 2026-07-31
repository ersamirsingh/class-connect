import React, { useState, useEffect } from 'react';
import { contentApi } from '../../../api/models/content.api';
import { Layout, Plus, Edit2, Trash2, Eye, EyeOff, Save, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const ManageCmsPage = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  useEffect(() => {
    fetchBlocks();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-xs font-bold mb-2">
            <Layout className="w-4 h-4" /> Dynamic CMS Editor
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1E2E]">Manage Homepage & CMS</h1>
          <p className="text-xs text-slate-500 font-medium">Edit hero banners, CTAs, and testimonials live in real-time.</p>
        </div>

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
      </div>

      {/* Alert Message */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-[#1FAE64]/10 border border-[#1FAE64]/20 text-[#1FAE64]'
              : 'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Content Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blocks.map((block) => (
          <div key={block._id} className="card-visual p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-[10px] font-black uppercase">
                {block.page} / {block.section}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(block)}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                    block.isActive ? 'bg-[#1FAE64]/10 text-[#1FAE64]' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {block.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {block.isActive ? 'Active' : 'Hidden'}
                </button>
                <button
                  onClick={() => setEditingBlock({ ...block })}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#3730E0] hover:bg-slate-50"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(block._id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#EF4444] hover:bg-slate-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-extrabold text-lg text-[#1E1E2E]">{block.title}</h3>
            {block.subtitle && <p className="text-xs font-medium text-slate-500">{block.subtitle}</p>}

            {/* Thumbnail Preview */}
            {block.data?.imageUrl && (
              <img
                src={block.data.imageUrl}
                alt={block.title}
                className="w-full h-36 object-cover rounded-2xl border border-slate-100"
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal Editor */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 sm:p-8 rounded-3xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-[#1E1E2E]">
              {editingBlock._id ? 'Edit Content Block' : 'Create Content Block'}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Page</label>
                  <input
                    type="text"
                    value={editingBlock.page}
                    onChange={(e) => setEditingBlock({ ...editingBlock, page: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={editingBlock.section}
                    onChange={(e) => setEditingBlock({ ...editingBlock, section: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingBlock.title}
                  onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingBlock.subtitle || ''}
                  onChange={(e) => setEditingBlock({ ...editingBlock, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingBlock.data?.imageUrl || ''}
                  onChange={(e) =>
                    setEditingBlock({
                      ...editingBlock,
                      data: { ...editingBlock.data, imageUrl: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBlock(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200"
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
