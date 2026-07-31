import React, { useState, useEffect } from 'react';
import { categoryApi } from '../../../api/models/category.api';
import { uploadApi } from '../../../api/models/upload.api';
import { Layers, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Save, Code, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getAllCategoriesAdmin();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load categories.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryApi.deleteCategory(id);
      setMessage({ type: 'success', text: 'Category deleted.' });
      fetchCategories();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete category.' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      if (editingCategory._id) {
        await categoryApi.updateCategory(editingCategory._id, editingCategory);
        setMessage({ type: 'success', text: 'Category updated!' });
      } else {
        await categoryApi.createCategory(editingCategory);
        setMessage({ type: 'success', text: 'New category created!' });
      }
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Save failed.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold mb-2">
            <Layers className="w-4 h-4" /> Category Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">Manage Course Categories</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Create and organize visual course topics and color tokens.</p>
        </div>

        <button
          onClick={() =>
            setEditingCategory({
              name: '',
              icon: 'Code',
              color: '#6366F1',
              description: '',
              isActive: true,
            })
          }
          className="btn-visual btn-primary text-xs"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Alert */}
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
        </div>
      )}

      {/* Category List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat._id} className="card-visual p-6 space-y-4 relative">
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md"
                style={{ backgroundColor: cat.color || '#6366F1' }}
              >
                <Code className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingCategory({ ...cat })}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#6366F1] hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#EF4444] hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white">{cat.name}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black text-[#0F172A] dark:text-white">
              {editingCategory._id ? 'Edit Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Color Code (Hex)</label>
                <input
                  type="text"
                  value={editingCategory.color}
                  onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Description</label>
                <input
                  type="text"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white"
                />
              </div>

              {/* Cloudinary Category Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Category Cover Image (Cloudinary File Upload)
                </label>
                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  {editingCategory.coverImage ? (
                    <img src={editingCategory.coverImage} alt="Cover Preview" className="w-12 h-12 object-cover rounded-xl border border-slate-300" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="btn-visual btn-primary text-xs px-3 py-1.5 cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{editingCategory.coverImage ? 'Change Cover' : 'Upload Cover to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          try {
                            const res = await uploadApi.uploadFile(file, 'class-connect/categories');
                            if (res.success && res.url) {
                              setEditingCategory((prev) => ({ ...prev, coverImage: res.url }));
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
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-visual btn-primary text-xs">
                  <Save className="w-4 h-4" /> Save Category
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
