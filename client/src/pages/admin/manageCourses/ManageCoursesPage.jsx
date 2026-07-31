import React, { useState, useEffect } from 'react';
import { courseApi } from '../../../api/models/course.api';
import { categoryApi } from '../../../api/models/category.api';
import { BookOpen, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Save, Video, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseRes, catRes] = await Promise.all([
        courseApi.getAllCoursesAdmin(),
        categoryApi.getCategories(),
      ]);
      if (courseRes.success) setCourses(courseRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load courses.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await courseApi.deleteCourse(id);
      setMessage({ type: 'success', text: 'Course deleted.' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete course.' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      if (editingCourse._id) {
        await courseApi.updateCourse(editingCourse._id, editingCourse);
        setMessage({ type: 'success', text: 'Course updated successfully!' });
      } else {
        await courseApi.createCourse(editingCourse);
        setMessage({ type: 'success', text: 'New course created!' });
      }
      setEditingCourse(null);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save course.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-xs font-bold mb-2">
            <BookOpen className="w-4 h-4" /> Course Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1E2E]">Manage Courses</h1>
          <p className="text-xs text-slate-500 font-medium">Create, edit, and publish live and recorded visual courses.</p>
        </div>

        <button
          onClick={() =>
            setEditingCourse({
              title: '',
              subtitle: '',
              description: '',
              category: categories[0]?._id || '',
              type: 'recorded',
              price: 49,
              discountPrice: 29,
              thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
              previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
              isPublished: true,
            })
          }
          className="btn-visual btn-primary text-xs"
        >
          <Plus className="w-4 h-4" /> Add New Course
        </button>
      </div>

      {/* Alert */}
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

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="card-visual overflow-hidden flex flex-col justify-between">
            <div className="relative h-44 bg-slate-100">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${
                    course.type === 'live' ? 'bg-[#FF7A33]' : 'bg-[#3730E0]'
                  }`}
                >
                  {course.type === 'live' ? '⚡ Live Class' : '📹 Recorded'}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#1E1E2E]">{course.title}</h3>
                <p className="text-xs font-medium text-slate-500 line-clamp-2 mt-1">{course.subtitle}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-sm font-black text-[#3730E0]">${course.discountPrice || course.price}</div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCourse({ ...course })}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#3730E0] hover:bg-slate-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#EF4444] hover:bg-slate-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 sm:p-8 rounded-3xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-[#1E1E2E]">
              {editingCourse._id ? 'Edit Course' : 'Create Course'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingCourse.subtitle || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingCourse.category?._id || editingCourse.category}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={editingCourse.type}
                    onChange={(e) => setEditingCourse({ ...editingCourse, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="recorded">Recorded</option>
                    <option value="live">Live Class</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount Price ($)</label>
                  <input
                    type="number"
                    value={editingCourse.discountPrice || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, discountPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  value={editingCourse.thumbnail}
                  onChange={(e) => setEditingCourse({ ...editingCourse, thumbnail: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-3 py-2 bg-[#F7F8FC] border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-visual btn-primary text-xs">
                  <Save className="w-4 h-4" /> Save Course
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
