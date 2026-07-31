import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/models/user.api';
import { motion } from 'framer-motion';
import { Camera, User, Mail, Phone, Lock, Save, Loader2 } from 'lucide-react';

export function ProfilePage() {
  const { t } = useLanguage();
  const { user: authUser, login } = useAuth(); // Assuming login updates auth state context
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await userApi.getProfile();
        setProfile({
          name: res?.data?.name || authUser?.firstName || '',
          email: res?.data?.email || authUser?.email || '',
          phone: res?.data?.phone || ''
        });
      } catch (err) {
        console.error(err);
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
      await userApi.updateProfile({ name: profile.name, phone: profile.phone });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await userApi.uploadPhoto(file);
      setMessage({ type: 'success', text: 'Photo updated' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload photo' });
    }
  };

  if (loading) return <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-['Manrope'] mb-8">{t('my_profile') || 'My Profile'}</h1>

        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] border border-[var(--border)] mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 bg-[var(--aura-violet)] rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                <User className="w-12 h-12 text-[var(--primary)] opacity-50" />
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
              <span className="text-sm font-medium text-[var(--primary)] cursor-pointer hover:underline relative">
                Change Photo
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handlePhotoUpload} />
              </span>
            </div>

            <form onSubmit={handleSave} className="flex-1 w-full space-y-5">
              {message.text && (
                <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-[var(--success)]'}`}>
                  {message.text}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--ink-muted)]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink-faint)]" />
                  <input 
                    type="text" name="name" value={profile.name} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] rounded-[var(--radius-lg)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--ink-muted)]">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink-faint)]" />
                  <input 
                    type="email" name="email" value={profile.email} readOnly
                    className="w-full pl-10 pr-4 py-3 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] rounded-[var(--radius-lg)] opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--ink-muted)]">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink-faint)]" />
                  <input 
                    type="tel" name="phone" value={profile.phone} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] rounded-[var(--radius-lg)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-shadow"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" disabled={saving}
                  className="px-6 py-3 min-h-[44px] bg-[var(--primary)] text-white font-medium rounded-[var(--radius-pill)] hover:bg-[var(--deep-anchor)] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] border border-[var(--border)]">
          <h2 className="text-xl font-bold font-['Manrope'] mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[var(--primary)]" />
            Security
          </h2>
          <p className="text-[var(--ink-muted)] mb-4">Update your password to keep your account secure.</p>
          <button className="px-6 py-3 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] text-[var(--ink)] font-medium rounded-[var(--radius-pill)] hover:bg-white hover:border-[var(--primary)] transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
