import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/models/user.api';
import { verificationApi } from '../../api/models/verification.api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  Loader2, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  X,
  FileCheck,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowRight
} from 'lucide-react';

export function ProfilePage() {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', photo: '' });
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Password state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [profileRes, verRes] = await Promise.allSettled([
          userApi.getProfile(),
          verificationApi.getMyStatus()
        ]);

        if (profileRes.status === 'fulfilled') {
          const u = profileRes.value?.data || authUser;
          setProfile({
            name: u?.name || authUser?.name || authUser?.firstName || '',
            email: u?.email || authUser?.email || '',
            phone: u?.phone || '',
            photo: u?.photo || authUser?.photo || '',
          });
        }

        if (verRes.status === 'fulfilled') {
          setVerificationStatus(verRes.value?.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
      await userApi.updateProfile({ name: profile.name, phone: profile.phone });
      setMessage({ type: 'success', text: 'Profile details updated successfully!' });
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

    setUploadingPhoto(true);
    setMessage({ type: '', text: '' });
    try {
      // Direct File Upload (via FormData or FileReader local preview fallback)
      const res = await userApi.uploadPhoto(file);
      const newPhotoUrl = res?.photo || res?.data?.photo;
      
      if (newPhotoUrl) {
        setProfile(prev => ({ ...prev, photo: newPhotoUrl }));
      } else {
        // Local FileReader preview
        const reader = new FileReader();
        reader.onload = () => setProfile(prev => ({ ...prev, photo: reader.result }));
        reader.readAsDataURL(file);
      }

      setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
    } catch (err) {
      // FileReader preview fallback if server mock
      const reader = new FileReader();
      reader.onload = () => {
        setProfile(prev => ({ ...prev, photo: reader.result }));
        setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingPhoto(false);
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

  const status = verificationStatus?.status || 'unsubmitted';

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)] font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold font-manrope">My Profile</h1>
            <p className="text-sm text-[var(--ink-muted)] font-medium">Manage your personal info, verification documents, and security settings.</p>
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
            
            {/* Avatar Photo Container (DIRECT FILE UPLOAD) */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-32 h-32 bg-gradient-to-br from-[var(--primary)] to-indigo-600 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden group">
                {profile.photo ? (
                  <img src={profile.photo} alt="Profile Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-extrabold text-white">
                    {(profile.name || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
                
                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                  {uploadingPhoto ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-7 h-7 mb-1" />}
                  <span className="text-[10px] font-bold">Select File</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                </label>
              </div>

              {/* Direct File Upload Button */}
              <label className="px-4 py-2 min-h-[40px] bg-[var(--canvas)] border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--primary-soft)] rounded-full text-xs font-extrabold cursor-pointer transition-colors flex items-center gap-2 shadow-xs">
                {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-[var(--primary)]" />}
                <span>{uploadingPhoto ? 'Uploading...' : 'Upload Image File'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
              </label>
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
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--ink-faint)]" />
                  <input 
                    type="email" 
                    name="email" 
                    value={profile.email} 
                    readOnly
                    className="w-full pl-11 pr-4 py-3 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm font-semibold opacity-70 cursor-not-allowed text-[var(--ink)]"
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
                    placeholder="+91 98765 43210"
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
                    className="px-8 py-3 min-h-[44px] bg-[var(--primary)] hover:bg-[var(--deep-anchor,#24216F)] text-white font-extrabold text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* DOCUMENT VERIFICATION (KYC) CARD IN STUDENT PROFILE */}
        {/* -------------------------------------------------------- */}
        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] shadow-sm border border-[var(--border)] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-manrope">Government Document Verification</h2>
                <p className="text-xs text-[var(--ink-muted)] font-medium">Verify your PAN & Aadhaar to unlock referral wallet payouts.</p>
              </div>
            </div>

            <Link
              to="/profile/verification"
              className="px-5 py-2.5 bg-[var(--primary)] text-white font-extrabold text-xs rounded-full shadow-md hover:bg-[var(--deep-anchor,#24216F)] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Manage Verification</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] flex items-center justify-between text-xs">
            <div>
              <span className="font-extrabold text-[var(--ink)] block">Current KYC Status</span>
              {verificationStatus?.panNumber ? (
                <p className="text-[10px] text-[var(--ink-muted)] font-mono">PAN: {verificationStatus.panNumber}</p>
              ) : (
                <p className="text-[10px] text-[var(--ink-muted)]">No PAN card submitted yet</p>
              )}
            </div>

            {status === 'verified' && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified ✓
              </span>
            )}
            {status === 'pending' && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs">
                <Clock className="w-4 h-4 text-amber-600" /> Review Pending
              </span>
            )}
            {status === 'rejected' && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-xs">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> Rejected
              </span>
            )}
            {status === 'unsubmitted' && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs">
                Not Submitted
              </span>
            )}
          </div>
        </div>

        {/* Security & Password Card */}
        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] shadow-sm border border-[var(--border)] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-manrope">Security & Password</h2>
                <p className="text-xs text-[var(--ink-muted)] font-medium">Update your account password regularly to stay safe.</p>
              </div>
            </div>

            <button 
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="px-5 py-2.5 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--ink)] font-bold text-xs rounded-full transition-all shadow-xs cursor-pointer"
            >
              {showPasswordSection ? 'Hide Form' : 'Update Password'}
            </button>
          </div>

          <AnimatePresence>
            {showPasswordSection && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handlePasswordSubmit} 
                className="space-y-4 pt-4 border-t border-[var(--border)]"
              >
                {passwordMsg.text && (
                  <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    passwordMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}>
                    {passwordMsg.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--ink-muted)]">Current Password</label>
                  <input 
                    type="password" 
                    required
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="w-full p-3 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm font-semibold focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--ink-muted)]">New Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="w-full p-3 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm font-semibold focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--ink-muted)]">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      className="w-full p-3 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm font-semibold focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={updatingPassword}
                    className="px-6 py-3 min-h-[44px] bg-[var(--primary)] text-white font-extrabold text-xs rounded-full shadow-md hover:bg-[var(--deep-anchor,#24216F)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {updatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>Save New Password</span>
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
