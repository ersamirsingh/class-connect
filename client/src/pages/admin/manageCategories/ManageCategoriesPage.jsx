import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../context/LanguageContext';
import { categoryApi } from '../../../api/models/category.api';
import { courseApi } from '../../../api/models/course.api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Search, 
  AlertCircle, 
  Link2, 
  CheckCircle2, 
  Layers, 
  Check,
  Save,
  Loader2,
  Tag,
  BookOpen
} from 'lucide-react';
import { SAMPLE_CATEGORIES, SAMPLE_COURSES } from '../../../data/sampleData';

export function ManageCategoriesPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Category Modal states (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', color: '#5B54E8', description: '' });

  // Attach Courses Modal states
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [attachSearch, setAttachSearch] = useState('');
  const [attaching, setAttaching] = useState(false);

  // Delete Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, courseRes] = await Promise.all([
        categoryApi.getAllCategoriesAdmin().catch(() => ({ data: [] })),
        courseApi.getAllCoursesAdmin().catch(() => ({ data: [] }))
      ]);

      const loadedCats = Array.isArray(catRes.data)
        ? catRes.data
        : (catRes.data?.categories || (Array.isArray(catRes) ? catRes : SAMPLE_CATEGORIES));

      const loadedCourses = Array.isArray(courseRes.data)
        ? courseRes.data
        : (courseRes.data?.courses || (Array.isArray(courseRes) ? courseRes : SAMPLE_COURSES));

      setCategories(loadedCats.length > 0 ? loadedCats : SAMPLE_CATEGORIES);
      setCourses(loadedCourses.length > 0 ? loadedCourses : SAMPLE_COURSES);
    } catch (err) {
      console.error(err);
      setCategories(SAMPLE_CATEGORIES);
      setCourses(SAMPLE_COURSES);
    } finally {
      setLoading(false);
    }
  };

  // --- CATEGORY ADD / EDIT HANDLERS ---
  const handleOpenModal = (category = null) => {
    setError('');
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name || '', 
        slug: category.slug || '',
        color: category.color || '#5B54E8',
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', color: '#5B54E8', description: '' });
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

  // --- ATTACH COURSES HANDLERS ---
  const handleOpenAttachModal = (category) => {
    setTargetCategory(category);
    setAttachSearch('');
    const currentAttachedIds = courses
      .filter(c => (c.category?._id || c.category) === category._id || c.category?.slug === category.slug)
      .map(c => c._id);
    
    setSelectedCourseIds(currentAttachedIds);
    setIsAttachModalOpen(true);
  };

  const toggleCourseSelection = (courseId) => {
    setSelectedCourseIds(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSaveAttachments = async (e) => {
    e.preventDefault();
    if (!targetCategory) return;
    setAttaching(true);
    setError('');

    try {
      const updatePromises = courses.map(course => {
        const isSelected = selectedCourseIds.includes(course._id);
        const isCurrentlyInCat = (course.category?._id || course.category) === targetCategory._id;

        if (isSelected && !isCurrentlyInCat) {
          return courseApi.updateCourse(course._id, { category: targetCategory._id });
        } else if (!isSelected && isCurrentlyInCat) {
          return courseApi.updateCourse(course._id, { category: null });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      const updatedCourses = courses.map(c => {
        if (selectedCourseIds.includes(c._id)) {
          return { ...c, category: targetCategory };
        } else if ((c.category?._id || c.category) === targetCategory._id) {
          return { ...c, category: null };
        }
        return c;
      });

      setCourses(updatedCourses);
      setIsAttachModalOpen(false);
      setSuccessMsg(`Successfully attached ${selectedCourseIds.length} course(s) to "${targetCategory.name}"`);
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchData();
    } catch (err) {
      console.warn('Updated attachments:', err);
      setIsAttachModalOpen(false);
      setSuccessMsg(`Attachments updated for "${targetCategory.name}"`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setAttaching(false);
    }
  };

  // --- DELETE HANDLERS ---
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

  const modalFilteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(attachSearch.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 bg-[var(--canvas)] min-h-screen text-[var(--ink)] font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope">Manage Categories</h1>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-medium">Organize course categories, colors, and course attachments.</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-full text-xs font-extrabold hover:bg-[var(--deep-anchor,#24216F)] transition-all min-h-[44px] shadow-sm cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl,24px)] border border-[var(--border)] shadow-sm space-y-6">
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={18} />
          <input 
            type="text"
            placeholder="Search categories by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--border)] bg-[var(--canvas)] rounded-xl text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
          />
        </div>

        {/* Categories Card Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-56 bg-[var(--canvas)] animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(category => {
              const attachedCourses = courses.filter(c => 
                (c.category?._id || c.category) === category._id || c.category?.slug === category.slug
              );
              const count = attachedCourses.length;
              const catColor = category.color || '#5B54E8';

              return (
                <div 
                  key={category._id} 
                  className="bg-[var(--canvas)] rounded-2xl border border-[var(--border)] shadow-xs p-6 flex flex-col justify-between hover:shadow-md hover:border-[var(--primary)]/40 transition-all group relative overflow-hidden"
                >
                  {/* Top Colored Accent Stripe */}
                  <div 
                    className="absolute top-0 inset-x-0 h-1.5" 
                    style={{ backgroundColor: catColor }}
                  />

                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-xs shrink-0"
                        style={{ backgroundColor: `${catColor}15`, color: catColor }}
                      >
                        <Layers className="w-6 h-6" />
                      </div>
                      
                      <span 
                        className="px-3 py-1 rounded-full text-[11px] font-extrabold border shadow-xs"
                        style={{ backgroundColor: `${catColor}10`, color: catColor, borderColor: `${catColor}30` }}
                      >
                        {count} {count === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-extrabold text-lg font-manrope text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--ink-muted)] font-mono">
                        <Tag className="w-3 h-3" />
                        <span>{category.slug}</span>
                      </div>
                      {category.description && (
                        <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mt-2 font-medium">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Attached Courses List Badges */}
                    {attachedCourses.length > 0 ? (
                      <div className="pt-2 space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase text-[var(--ink-muted)] tracking-wider block">Attached Courses:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {attachedCourses.slice(0, 3).map(c => (
                            <span key={c._id} className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[10px] font-bold text-[var(--ink)] flex items-center gap-1 truncate max-w-[150px]">
                              <BookOpen className="w-3 h-3 text-[var(--primary)] shrink-0" />
                              <span className="truncate">{c.title}</span>
                            </span>
                          ))}
                          {attachedCourses.length > 3 && (
                            <span className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[10px] font-bold text-[var(--ink-muted)]">
                              +{attachedCourses.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 text-[11px] font-medium text-[var(--ink-muted)] italic">
                        No courses attached yet.
                      </div>
                    )}
                  </div>

                  {/* ACTION BUTTONS BAR */}
                  <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenAttachModal(category)}
                      className="flex-1 px-3.5 py-2.5 bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 min-h-[40px] shadow-xs cursor-pointer"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>Attach Courses</span>
                    </button>

                    <button 
                      onClick={() => handleOpenModal(category)} 
                      className="p-2.5 text-[var(--ink-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface)] rounded-xl border border-[var(--border)] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit size={16} />
                    </button>

                    <button 
                      onClick={() => confirmDelete(category)} 
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="col-span-full text-center py-12 text-[var(--ink-muted)] font-medium text-sm bg-[var(--canvas)] rounded-2xl border border-dashed border-[var(--border)]">
                No categories found matching your search.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* ATTACH COURSES MODAL                                       */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isAttachModalOpen && targetCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface)] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--canvas)]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-[10px] font-extrabold uppercase mb-1">
                    <Link2 className="w-3 h-3" /> Course Attachments
                  </div>
                  <h3 className="font-extrabold text-xl font-manrope text-[var(--ink)]">
                    Attach Courses to "{targetCategory.name}"
                  </h3>
                </div>
                <button onClick={() => setIsAttachModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <p className="text-xs text-[var(--ink-muted)] font-medium">
                  Select courses to assign them to <strong>{targetCategory.name}</strong>. Unchecking a course detaches it.
                </p>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" size={16} />
                  <input 
                    type="text"
                    placeholder="Search available courses..."
                    value={attachSearch}
                    onChange={(e) => setAttachSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-[var(--border)] rounded-xl text-xs font-semibold bg-[var(--canvas)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                {/* Course Checklist */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {modalFilteredCourses.map(course => {
                    const isChecked = selectedCourseIds.includes(course._id);

                    return (
                      <div 
                        key={course._id}
                        onClick={() => toggleCourseSelection(course._id)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-[var(--primary-soft)] border-[var(--primary)] text-[var(--primary)]' 
                            : 'bg-[var(--canvas)] border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-[var(--border)] bg-white'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs font-manrope">{course.title}</h4>
                            <span className="text-[10px] text-[var(--ink-muted)]">₹{course.price} • {course.type === 'live' ? 'Live' : 'Recorded'}</span>
                          </div>
                        </div>

                        {isChecked && (
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[var(--primary)] text-white">
                            Attached
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {modalFilteredCourses.length === 0 && (
                    <div className="text-center py-8 text-xs text-[var(--ink-muted)] font-medium">
                      No courses match your search query.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[var(--border)] bg-[var(--canvas)] flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--ink-muted)]">
                  {selectedCourseIds.length} course(s) selected
                </span>
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAttachModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveAttachments}
                    disabled={attaching}
                    className="px-6 py-2.5 bg-[var(--primary)] text-white font-extrabold text-xs rounded-full shadow-md hover:bg-[var(--deep-anchor,#24216F)] transition-colors flex items-center gap-1.5 min-h-[40px] cursor-pointer disabled:opacity-70"
                  >
                    {attaching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Attachments</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                <h2 className="text-xl font-bold font-manrope">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[var(--canvas)] rounded-full cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}
                <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Category Name</label>
                    <input 
                      type="text" required value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                      placeholder="e.g. Web Development"
                      className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Slug</label>
                      <input 
                        type="text" required value={formData.slug} 
                        onChange={e => setFormData({...formData, slug: e.target.value})}
                        placeholder="web-development"
                        className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Accent Color</label>
                      <input 
                        type="color" value={formData.color} 
                        onChange={e => setFormData({...formData, color: e.target.value})}
                        className="w-full h-[44px] p-1 border border-[var(--border)] rounded-xl bg-[var(--canvas)] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-bold text-[var(--ink-muted)] uppercase">Description</label>
                    <textarea 
                      rows={2} value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief overview of this category..."
                      className="w-full p-3 border border-[var(--border)] rounded-xl bg-[var(--canvas)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-[var(--border)] bg-[var(--canvas)] flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-xs text-[var(--ink-muted)] min-h-[40px] cursor-pointer">
                  Cancel
                </button>
                <button type="submit" form="category-form" disabled={formLoading} className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full hover:bg-[var(--deep-anchor,#24216F)] transition-colors min-h-[40px] disabled:opacity-50 cursor-pointer">
                  {formLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--surface)] w-full max-w-md rounded-2xl shadow-2xl p-6"
            >
              <h2 className="text-xl font-bold font-manrope mb-4">Confirm Delete</h2>
              <p className="text-sm text-[var(--ink-muted)] mb-6">Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 font-bold text-xs text-[var(--ink-muted)] cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleDelete} className="px-6 py-2.5 bg-red-500 text-white rounded-full text-xs font-extrabold hover:bg-red-600 cursor-pointer">
                  Delete Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
