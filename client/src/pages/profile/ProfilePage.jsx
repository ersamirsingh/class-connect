import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/models/user.api';
import {
  User,
  Mail,
  Phone,
  Camera,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  BookOpen,
  Award,
  Calendar,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    photo: user?.photo || '',
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      setMessage({ type: '', text: '' });
      const res = await userApi.uploadPhoto(file);
      if (res.success && res.photo) {
        const updated = { ...user, photo: res.photo };
        updateUserProfile(updated);
        setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to upload image. Please try again.',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setMessage({ type: '', text: '' });
      const res = await userApi.updateProfile(formData);
      if (res.success && res.data) {
        updateUserProfile(res.data);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile details saved successfully!' });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header Notification Banner */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-[#1FAE64]/10 border border-[#1FAE64]/20 text-[#1FAE64]'
                : 'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1FAE64]" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-[#EF4444]" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Visual Profile Card */}
      <div className="card-visual overflow-hidden">
        {/* Top Decorative Banner */}
        <div className="h-36 bg-gradient-to-r from-[#3730E0] via-[#2B24C7] to-[#FF7A33] relative p-6 flex justify-between items-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-[#1FAE64]" /> Active Member
          </div>

          {!isEditing && (
            <button
              onClick={() => {
                setFormData({
                  name: user?.name || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  photo: user?.photo || '',
                });
                setIsEditing(true);
              }}
              className="btn-visual bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>

        {/* Profile Content Body */}
        <div className="px-6 pb-8 pt-0 relative">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-6 gap-4">
            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
              <img
                src={
                  user?.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff`
                }
                alt={user?.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff`;
                }}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
              />

              {/* Upload Overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-3xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                {uploadingPhoto ? (
                  <Loader2 className="w-7 h-7 animate-spin text-[#FF7A33]" />
                ) : (
                  <>
                    <Camera className="w-7 h-7 mb-1 text-[#FF7A33]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
                  </>
                )}
              </div>
            </div>

            {/* Role Badge */}
            <div className="text-center sm:text-right">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-xs font-black uppercase tracking-wider">
                {user?.role || 'Student'} Account
              </span>
            </div>
          </div>

          {/* User Information Display vs Edit Form */}
          {!isEditing ? (
            <div className="space-y-6">
              {/* Name & Basic Info */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E2E]">{user?.name}</h1>
                <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#3730E0]" /> {user?.email}
                </p>
              </div>

              {/* Contact & Status Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3730E0]/10 text-[#3730E0] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Phone</div>
                    <div className="text-xs font-bold text-slate-800">{user?.phone || 'Not specified'}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF7A33]/10 text-[#FF7A33] flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Enrolled Courses</div>
                    <div className="text-xs font-bold text-slate-800">0 Active Courses</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1FAE64]/10 text-[#1FAE64] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Joined</div>
                    <div className="text-xs font-bold text-slate-800">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Profile Form */
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <h3 className="text-lg font-bold text-[#1E1E2E] flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#3730E0]" /> Edit Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#3730E0]" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-semibold text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3730E0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#3730E0]" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-semibold text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3730E0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#FF7A33]" /> Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                  className="w-full px-4 py-2.5 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-semibold text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#FF7A33]"
                />
              </div>

              {/* Profile Picture Image URL Input (Fallback for when photo is not uploaded) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#3730E0]" /> Profile Picture Image URL (Fallback if not uploaded)
                </label>
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-semibold text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3730E0]"
                />
                <p className="text-[10px] font-medium text-slate-400 mt-1">
                  If you haven't uploaded a photo file, paste any image URL here to use as your avatar.
                </p>
              </div>

              {/* Save / Cancel Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-visual btn-primary text-xs"
                >
                  {savingProfile ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
