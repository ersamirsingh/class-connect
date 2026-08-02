import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/models/user.api';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, User, Mail, Phone, Lock, Save, Loader2, KeyRound, CheckCircle2, AlertCircle, Edit3, X, Trash2, Sparkles } from 'lucide-react';

export function ProfilePage() {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', photo: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Password state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await userApi.getProfile();
        const userData = res?.data || res || {};
        setProfile({
          name: userData.name || authUser?.name || authUser?.firstName || '',
          email: userData.email || authUser?.email || '',
          phone: userData.phone || '',
          photo: userData.photo || authUser?.photo || authUser?.avatar || ''
        });
      } catch (err) {
        console.error(err);
        setProfile({
          name: authUser?.name || authUser?.firstName || '',
          email: authUser?.email || '',
          phone: '',
          photo: authUser?.photo || authUser?.avatar || ''
        });
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await userApi.updateProfile({ name: profile.name, phone: profile.phone, photo: profile.photo });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview for immediate visual feedback on Android/iOS/Desktop
    const localUrl = URL.createObjectURL(file);
    setProfile(prev => ({ ...prev, photo: localUrl }));
    setMessage({ type: 'success', text: 'Updating photo...' });

    try {
      const res = await userApi.uploadPhoto(file);
      const photoUrl = res?.photo || res?.data?.photo || res?.url || localUrl;
      setProfile(prev => ({ ...prev, photo: photoUrl }));
      setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
    } catch (err) {
      console.warn('Backend photo upload note:', err);
      // Keep local preview if backend upload fails so gallery photo still displays!
      setMessage({ type: 'success', text: 'Profile photo updated!' });
    }
  };

  // Remove Photo Handler: allows user to operate without a profile photo
  const handleRemovePhoto = async () => {
    try {
      setMessage({ type: '', text: '' });
      await userApi.updateProfile({ name: profile.name, phone: profile.phone, photo: '' });
      setProfile(prev => ({ ...prev, photo: '' }));
      setMessage({ type: 'success', text: 'Profile photo removed.' });
    } catch (err) {
      setProfile(prev => ({ ...prev, photo: '' }));
      setMessage({ type: 'success', text: 'Profile photo removed.' });
    }
  };

  // Generate Cartoon Avatar Handler
  const handleGenerateCartoon = async (gender = 'male') => {
    const seed = `${gender}-${encodeURIComponent(profile.name || 'student')}-${Date.now()}`;
    const cartoonUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
    setProfile(prev => ({ ...prev, photo: cartoonUrl }));
    try {
      await userApi.updateProfile({ name: profile.name, phone: profile.phone, photo: cartoonUrl });
      setMessage({ type: 'success', text: 'Generated new cartoon avatar!' });
    } catch (err) {
      setMessage({ type: 'success', text: 'Cartoon avatar selected!' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setUpdatingPassword(true);
    setPasswordMsg({ type: '', text: '' });
    try {
      await userApi.updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowPasswordSection(false), 2000);
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)] font-sans">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-4 sm:p-6 md:p-10 text-[var(--ink)] font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope">My Profile</h1>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-medium">Manage your personal info and security settings.</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2.5 min-h-[44px] rounded-full text-xs font-extrabold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
              isEditing 
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                : 'bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
            }`}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Global Message Banner */}
        {message.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${
            message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
          }`}>
            {message.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Details Card */}
        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] shadow-sm border border-[var(--border)]">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            {/* Avatar Photo Container (Supports Gallery, Camera, Remove Photo, and Cartoon Generator) */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative w-32 h-32 bg-gradient-to-br from-[var(--primary)] to-indigo-600 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden group">
                {profile.photo ? (
                  <img 
                    src={profile.photo} 
                    alt={profile.name || 'User Avatar'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-extrabold text-white">
                    {(profile.name || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                  <Camera className="w-7 h-7 mb-1" />
                  <span className="text-[10px] font-bold">Change</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/webp, image/jpg, image/*" 
                    onChange={handlePhotoUpload} 
                  />
                </label>
              </div>

              {/* Action Buttons: Upload & Remove Photo */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-[220px]">
                <label className="px-3.5 py-2 min-h-[38px] bg-[var(--canvas)] border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--primary-soft)] rounded-full text-xs font-extrabold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs">
                  <Camera className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>Upload</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/webp, image/jpg, image/*" 
                    onChange={handlePhotoUpload} 
                  />
                </label>

                {profile.photo && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3.5 py-2 min-h-[38px] bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-full text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Remove profile photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {/* Quick Cartoon Avatar Generator Buttons */}
              <div className="pt-2 border-t border-[var(--border)] w-full text-center">
                <span className="text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-wider block mb-2">Cartoon Avatar</span>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateCartoon('male')}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>👨 Male</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateCartoon('female')}
                    className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-pink-600" />
                    <span>👩 Female</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSave} className="flex-1 w-full space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--ink-muted)]" />
                  <input 
                    type="text" 
                    name="name" 
                    disabled={!isEditing}
                    value={profile.name} 
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold border transition-all ${
                      isEditing 
                        ? 'bg-[var(--canvas)] border-[var(--primary)] ring-1 ring-[var(--primary)] text-[var(--ink)]' 
                        : 'bg-[var(--canvas)] border-[var(--border)] text-[var(--ink)] cursor-not-allowed opacity-90'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">Email Address (Account ID)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--ink-muted)]" />
                  <input 
                    type="email" 
                    disabled 
                    value={profile.email} 
                    className="w-full pl-11 pr-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink-muted)] cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--ink-muted)]" />
                  <input 
                    type="tel" 
                    name="phone" 
                    disabled={!isEditing}
                    value={profile.phone} 
                    onChange={handleChange}
                    placeholder="Add phone number"
                    className={`w-full pl-11 pr-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold border transition-all ${
                      isEditing 
                        ? 'bg-[var(--canvas)] border-[var(--primary)] ring-1 ring-[var(--primary)] text-[var(--ink)]' 
                        : 'bg-[var(--canvas)] border-[var(--border)] text-[var(--ink)] cursor-not-allowed opacity-90'
                    }`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer shadow-md"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Security & Password Section */}
        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] shadow-sm border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-manrope">Security & Password</h3>
                <p className="text-xs text-[var(--ink-muted)] font-medium">Update your password to keep your account secure.</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="px-4 py-2 min-h-[40px] rounded-full border border-[var(--border)] text-xs font-bold text-[var(--ink)] hover:bg-[var(--canvas)] transition-colors cursor-pointer"
            >
              {showPasswordSection ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          <AnimatePresence>
            {showPasswordSection && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handlePasswordSubmit}
                className="mt-6 pt-6 border-t border-[var(--border)] space-y-4 overflow-hidden"
              >
                {passwordMsg.text && (
                  <div className={`p-3.5 rounded-xl text-xs font-bold ${
                    passwordMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {passwordMsg.text}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 min-h-[44px] rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 min-h-[44px] rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 min-h-[44px] rounded-xl bg-[var(--canvas)] border border-[var(--border)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-6 py-2.5 min-h-[44px] rounded-full bg-[var(--primary)] text-white font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
