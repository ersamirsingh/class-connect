import React, { useState, useEffect } from 'react';
import { courseApi } from '../../../api/models/course.api';
import { categoryApi } from '../../../api/models/category.api';
import { uploadApi } from '../../../api/models/upload.api';
import { adminApi } from '../../../api/models/admin.api';
import { BookOpen, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Save, Video, Radio, Sparkles, Upload, Loader2, Users, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingStudentsCourse, setViewingStudentsCourse] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

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

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (field === 'thumbnail') setUploadingThumbnail(true);
      if (field === 'previewVideo') setUploadingVideo(true);

      const res = await uploadApi.uploadFile(file, `class-connect/courses/${field}`);
      if (res.success && res.url) {
        setEditingCourse((prev) => ({ ...prev, [field]: res.url }));
        setMessage({ type: 'success', text: `${field === 'thumbnail' ? 'Thumbnail' : 'Video'} uploaded to Cloudinary!` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Cloudinary upload failed. Check file size.' });
    } finally {
      if (field === 'thumbnail') setUploadingThumbnail(false);
      if (field === 'previewVideo') setUploadingVideo(false);
    }
  };

  const calcSavingsPct = (price, discountPrice) => {
    if (!price || !discountPrice || price <= discountPrice) return null;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const handleViewStudents = async (course) => {
    try {
      setViewingStudentsCourse(course);
      setLoadingStudents(true);
      const res = await adminApi.getCourseStudents(course._id);
      if (res.success && res.data) {
        setCourseStudents(res.data);
      }
    } catch (err) {
      console.error('Failed to load course students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold mb-2">
            <BookOpen className="w-4 h-4" /> Course Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">Manage All Courses & Enrolled Students</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Create courses, manage media, and view enrolled students per course.</p>
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
              thumbnail: '',
              coverImage: '',
              previewVideo: '',
              sections: [],
              isPublished: true,
              isFeatured: true,
              isSuggested: false,
            })
          }
          className="btn-visual btn-primary text-xs"
        >
          <Plus className="w-4 h-4" /> Create Course
        </button>
      </div>

      {/* Alert Notification */}
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

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const savingsPct = calcSavingsPct(course.price, course.discountPrice);
          return (
            <div key={course._id} className="card-visual overflow-hidden flex flex-col justify-between group">
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${
                      course.type === 'live' ? 'bg-[#06B6D4]' : 'bg-[#6366F1]'
                    }`}
                  >
                    {course.type === 'live' ? '⚡ Live Class' : '📹 Recorded'}
                  </span>
                  {savingsPct && (
                    <span className="px-2.5 py-1 rounded-full bg-[#EF4444] text-[10px] font-black uppercase text-white shadow-md">
                      {savingsPct}% OFF
                    </span>
                  )}
                </div>
                {course.isSuggested && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#6366F1]/90 text-[10px] font-black uppercase text-white shadow-md backdrop-blur-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Suggested
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white">{course.title}</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{course.subtitle}</p>
                </div>

                {/* View Enrolled Students Section Button */}
                <button
                  onClick={() => handleViewStudents(course)}
                  className="w-full py-2 px-3 rounded-xl bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1]/20 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Users className="w-4 h-4 text-[#6366F1]" />
                  <span>Enrolled Students Section</span>
                </button>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-black text-[#6366F1]">${course.discountPrice || course.price}</span>
                    {course.discountPrice && course.discountPrice < course.price && (
                      <span className="text-xs text-slate-400 line-through ml-2">${course.price}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingCourse({ ...course })}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#6366F1] hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#EF4444] hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrolled Students Modal */}
      {viewingStudentsCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-800 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black text-[#6366F1] uppercase tracking-wider">Course Student Directory</span>
                <h3 className="text-lg font-black text-[#0F172A] dark:text-white line-clamp-1">{viewingStudentsCourse.title}</h3>
              </div>
              <button
                onClick={() => setViewingStudentsCourse(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            {loadingStudents ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#6366F1] animate-spin mb-2" />
                <span className="text-xs font-bold text-slate-400">Fetching enrolled students...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {courseStudents.length > 0 ? (
                  courseStudents.map((item, i) => {
                    const student = item.student || item;
                    return (
                      <div
                        key={item._id || i}
                        className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={
                              student.photo ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Student')}&background=6366F1&color=fff`
                            }
                            alt={student.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'Student')}&background=6366F1&color=fff`;
                            }}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6366F1] shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-extrabold text-[#0F172A] dark:text-white truncate">
                              {student.name || 'Student'}
                            </h4>
                            <p className="text-[11px] font-bold text-[#6366F1] truncate">{student.email}</p>
                            {student.phone && (
                              <p className="text-[10px] font-medium text-slate-400 truncate">Phone: {student.phone}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[9px] font-black uppercase">
                            Active
                          </span>
                          {item.enrolledAt && (
                            <p className="text-[10px] font-bold text-slate-400 mt-1">
                              {new Date(item.enrolledAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 space-y-2">
                    <Users className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300">No Enrolled Students Found</h4>
                    <p className="text-[11px] text-slate-400 font-medium">No active student enrollments for this course yet.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-3xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black text-[#0F172A] dark:text-white">
              {editingCourse._id ? 'Edit Course' : 'Create Course'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingCourse.subtitle || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Category</label>
                  <select
                    value={editingCourse.category?._id || editingCourse.category}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Type</label>
                  <select
                    value={editingCourse.type}
                    onChange={(e) => setEditingCourse({ ...editingCourse, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white"
                  >
                    <option value="recorded">Recorded</option>
                    <option value="live">Live Class</option>
                  </select>
                </div>
              </div>

              {/* Price & Discount Settings */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Discount Price ($)
                    {calcSavingsPct(editingCourse.price, editingCourse.discountPrice) && (
                      <span className="ml-2 text-[#EF4444] font-black">
                        ({calcSavingsPct(editingCourse.price, editingCourse.discountPrice)}% OFF)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    value={editingCourse.discountPrice || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, discountPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              {/* Thumbnail with Pure Cloudinary File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Course Thumbnail (Cloudinary File Upload)
                </label>
                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  {editingCourse.thumbnail ? (
                    <img src={editingCourse.thumbnail} alt="Thumbnail Preview" className="w-14 h-14 object-cover rounded-xl border border-slate-300" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="btn-visual btn-primary text-xs px-4 py-2 cursor-pointer inline-flex items-center gap-1.5">
                      {uploadingThumbnail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{editingCourse.thumbnail ? 'Change Image (Cloudinary)' : 'Upload Thumbnail to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'thumbnail')}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Uploaded directly to Cloudinary media storage.</p>
                  </div>
                </div>
              </div>

              {/* Course Cover Image with Pure Cloudinary File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Course Cover Banner (Cloudinary File Upload)
                </label>
                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  {editingCourse.coverImage ? (
                    <img src={editingCourse.coverImage} alt="Cover Preview" className="w-14 h-14 object-cover rounded-xl border border-slate-300" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
                      No Cover
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="btn-visual btn-secondary text-xs px-4 py-2 cursor-pointer inline-flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-[#10B981]" />
                      <span>{editingCourse.coverImage ? 'Change Cover (Cloudinary)' : 'Upload Cover to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'coverImage')}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">HD Banner image stored in Cloudinary.</p>
                  </div>
                </div>
              </div>

              {/* Preview Video with Pure Cloudinary File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Main Demo / Lecture Video (Cloudinary File Upload)
                </label>
                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  <div className="w-14 h-14 rounded-xl bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center font-bold">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <label className="btn-visual btn-primary text-xs px-4 py-2 cursor-pointer inline-flex items-center gap-1.5">
                      {uploadingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{editingCourse.previewVideo ? 'Replace Video (Cloudinary)' : 'Upload Video File to Cloudinary'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'previewVideo')}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">MP4 / WebM video files streamed via Cloudinary CDN.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Description</label>
                <textarea
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCourse.isSuggested || false}
                    onChange={(e) => setEditingCourse({ ...editingCourse, isSuggested: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" /> Mark as Suggested
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
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
