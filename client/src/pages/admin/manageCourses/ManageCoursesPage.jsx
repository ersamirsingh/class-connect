import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import { courseApi } from '../../../api/models/course.api';
import { categoryApi } from '../../../api/models/category.api';
import { Plus, Edit, Trash2, X, Search, AlertCircle } from 'lucide-react';

export function ManageCoursesPage() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    thumbnail: '',
    lectures: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseRes, categoryRes] = await Promise.all([
        courseApi.getAllCoursesAdmin(),
        categoryApi.getAllCategoriesAdmin()
      ]);
      setCourses(courseRes.data?.courses || []);
      setCategories(categoryRes.data?.categories || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (course = null) => {
    setError('');
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title || '',
        description: course.description || '',
        price: course.price || '',
        category: course.category?._id || course.category || '',
        thumbnail: course.thumbnail || '',
        lectures: course.lectures ? JSON.stringify(course.lectures, null, 2) : '[]'
      });
    } else {
      setEditingCourse(null);
      setFormData({ title: '', description: '', price: '', category: '', thumbnail: '', lectures: '[]' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    
    try {
      let parsedLectures = [];
      try {
        parsedLectures = JSON.parse(formData.lectures);
      } catch(e) {
        throw new Error('Invalid JSON in lectures');
      }

      const payload = { ...formData, lectures: parsedLectures };

      if (editingCourse) {
        await courseApi.updateCourse(editingCourse._id, payload);
      } else {
        await courseApi.createCourse(payload);
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      setError(err.message || 'Error saving course');
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await courseApi.deleteCourse(courseToDelete._id);
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 bg-[var(--canvas)] min-h-screen text-[var(--ink)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{t('manageCourses') || 'Manage Courses'}</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-pill)] hover:bg-[var(--primary-soft)] transition-colors min-h-[44px]"
        >
          <Plus size={20} />
          <span>{t('addCourse') || 'Add Course'}</span>
        </button>
      </div>

      <div className="bg-[var(--surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={20} />
          <input 
            type="text"
            placeholder={t('searchCourses') || 'Search courses...'}
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
                  <th className="py-4 px-4 font-semibold">{t('title') || 'Title'}</th>
                  <th className="py-4 px-4 font-semibold">{t('category') || 'Category'}</th>
                  <th className="py-4 px-4 font-semibold">{t('price') || 'Price'}</th>
                  <th className="py-4 px-4 font-semibold">{t('status') || 'Status'}</th>
                  <th className="py-4 px-4 font-semibold text-right">{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map(course => (
                  <tr key={course._id} className="border-b border-[var(--border)] hover:bg-[var(--surface-raised)] transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium">{course.title}</div>
                    </td>
                    <td className="py-4 px-4 text-[var(--ink-muted)]">
                      {course.category?.name || 'Uncategorized'}
                    </td>
                    <td className="py-4 px-4">₹{course.price}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--success-soft)] text-[var(--success)]">
                        {course.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(course)} className="p-2 text-[var(--primary)] hover:bg-[var(--primary-soft)] rounded-md transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => confirmDelete(course)} className="p-2 text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-md transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-[var(--ink-muted)]">
                      {t('noCoursesFound') || 'No courses found.'}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface)] w-full max-w-2xl rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingCourse ? t('editCourse') || 'Edit Course' : t('addCourse') || 'Add Course'}</h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-[var(--surface-raised)] rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {error && (
                  <div className="mb-4 p-3 bg-[var(--danger-soft)] text-[var(--danger)] rounded-md flex items-center gap-2">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}
                
                <form id="course-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">{t('title') || 'Title'}</label>
                    <input 
                      type="text" required
                      value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full p-2 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium">{t('description') || 'Description'}</label>
                    <textarea 
                      required rows={3}
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full p-2 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">{t('price') || 'Price (₹)'}</label>
                      <input 
                        type="number" required
                        value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full p-2 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">{t('category') || 'Category'}</label>
                      <select 
                        required
                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full p-2 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                      >
                        <option value="">{t('selectCategory') || 'Select Category'}</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium">{t('thumbnailUrl') || 'Thumbnail URL'}</label>
                    <input 
                      type="url"
                      value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                      className="w-full p-2 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">{t('lecturesJson') || 'Lectures (JSON format)'}</label>
                    <textarea 
                      rows={5}
                      value={formData.lectures} onChange={e => setFormData({...formData, lectures: e.target.value})}
                      className="w-full p-2 border border-[var(--border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--primary)] font-mono text-sm"
                    />
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-[var(--border)] bg-[var(--surface-raised)] flex justify-end gap-4">
                <button 
                  type="button" onClick={handleCloseModal}
                  className="px-4 py-2 font-medium hover:text-[var(--ink-muted)] min-h-[44px]"
                >
                  {t('cancel') || 'Cancel'}
                </button>
                <button 
                  type="submit" form="course-form" disabled={formLoading}
                  className="px-6 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-pill)] hover:bg-[var(--primary-soft)] transition-colors min-h-[44px] disabled:opacity-50"
                >
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface)] w-full max-w-md rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-6"
            >
              <h2 className="text-xl font-bold mb-4">{t('confirmDelete') || 'Confirm Delete'}</h2>
              <p className="text-[var(--ink-muted)] mb-6">
                Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
              </p>
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
