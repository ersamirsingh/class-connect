import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import { categoryApi } from '../../../api/models/category.api';
import { Plus, Edit, Trash2, X, Search, AlertCircle } from 'lucide-react';

export function ManageCategoriesPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAllCategoriesAdmin();
      setCategories(res.data?.categories || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    setError('');
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name || '', slug: category.slug || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory._id, formData);
      } else {
        await categoryApi.createCategory(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Error saving category');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await categoryApi.deleteCategory(categoryToDelete._id);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchData();
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 bg-[var(--canvas)] min-h-screen text-[var(--ink)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{t('manageCategories') || 'Manage Categories'}</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-pill)] hover:bg-[var(--primary-soft)] transition-colors min-h-[44px]"
        >
          <Plus size={20} />
          <span>{t('addCategory') || 'Add Category'}</span>
        </button>
      </div>

      <div className="bg-[var(--surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={20} />
          <input 
            type="text"
            placeholder={t('searchCategories') || 'Search categories...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-[var(--surface-raised)] animate-pulse rounded" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--ink-muted)]">
                  <th className="py-4 px-4 font-semibold">{t('name') || 'Name'}</th>
                  <th className="py-4 px-4 font-semibold">{t('slug') || 'Slug'}</th>
                  <th className="py-4 px-4 font-semibold text-right">{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map(category => (
                  <tr key={category._id} className="border-b border-[var(--border)] hover:bg-[var(--surface-raised)] transition-colors">
                    <td className="py-4 px-4 font-medium">{category.name}</td>
                    <td className="py-4 px-4 text-[var(--ink-muted)]">{category.slug}</td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(category)} className="p-2 text-[var(--primary)] hover:bg-[var(--primary-soft)] rounded-md transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => confirmDelete(category)} className="p-2 text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-md transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-[var(--ink-muted)]">
                      {t('noCategoriesFound') || 'No categories found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface)] w-full max-w-md rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingCategory ? (t('editCategory') || 'Edit Category') : (t('addCategory') || 'Add Category')}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[var(--surface-raised)] rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-[var(--danger-soft)] text-[var(--danger)] rounded-md flex items-center gap-2">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}
                <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">{t('name') || 'Name'}</label>
                    <input 
                      type="text" required value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">{t('slug') || 'Slug'}</label>
                    <input 
                      type="text" required value={formData.slug} 
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                      className="w-full p-2 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-[var(--border)] bg-[var(--surface-raised)] flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium hover:text-[var(--ink-muted)] min-h-[44px]">
                  {t('cancel') || 'Cancel'}
                </button>
                <button type="submit" form="category-form" disabled={formLoading} className="px-6 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-pill)] hover:bg-[var(--primary-soft)] transition-colors min-h-[44px] disabled:opacity-50">
                  {formLoading ? (t('saving') || 'Saving...') : (t('save') || 'Save')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface)] w-full max-w-md rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-6"
            >
              <h2 className="text-xl font-bold mb-4">{t('confirmDelete') || 'Confirm Delete'}</h2>
              <p className="text-[var(--ink-muted)] mb-6">Are you sure you want to delete "{categoryToDelete?.name}"?</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 font-medium min-h-[44px]">
                  {t('cancel') || 'Cancel'}
                </button>
                <button onClick={handleDelete} className="px-6 py-2 bg-[var(--danger)] text-white rounded-[var(--radius-pill)] hover:bg-[var(--danger-soft)] min-h-[44px]">
                  {t('delete') || 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
