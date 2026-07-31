import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/models/admin.api';
import { ShieldAlert, UserPlus, CheckCircle2, AlertCircle, Loader2, UserX, X, Lock } from 'lucide-react';

export const ManageAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAdmins();
      if (res.success && res.data) {
        setAdmins(res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load admin list.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });
      const res = await adminApi.createAdmin(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'New admin account created successfully.' });
        setShowModal(false);
        setFormData({ name: '', email: '', password: '', phone: '' });
        fetchAdmins();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (adminId) => {
    if (!window.confirm('Are you sure you want to deactivate this admin account?')) return;

    try {
      setMessage({ type: '', text: '' });
      const res = await adminApi.deactivateAdmin(adminId);
      if (res.success) {
        setMessage({ type: 'success', text: 'Admin account deactivated.' });
        fetchAdmins();
      }
    } catch (err) {
      // Displays safeguard message if trying to remove last active admin
      setMessage({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A33]/10 text-[#FF7A33] text-xs font-bold mb-2">
            <ShieldAlert className="w-4 h-4" /> Admin Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1E2E]">Manage Admin Accounts</h1>
          <p className="text-xs text-slate-500 font-medium">Create and manage admin team members with built-in safeguards.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-visual btn-primary text-xs font-black px-4 py-2.5 shadow-md self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Create New Admin
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-[#1FAE64]/10 border border-[#1FAE64]/20 text-[#1FAE64]'
              : 'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Admin List Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#3730E0] animate-spin mb-3" />
          <span className="text-xs font-bold text-slate-500">Loading admin accounts...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {admins.map((admin) => (
            <div key={admin._id} className="card-visual p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={admin.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={admin.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FF7A33]"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-[#1E1E2E]">{admin.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">{admin.email}</div>
                  <div className="mt-1 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#3730E0]/10 text-[#3730E0]">
                    {admin.isActive ? 'Active Admin' : 'Deactivated'}
                  </div>
                </div>
              </div>

              {admin.isActive && (
                <button
                  onClick={() => handleDeactivate(admin._id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                  title="Deactivate Admin Account"
                >
                  <UserX className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-black text-xl text-[#1E1E2E] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#FF7A33]" /> Create Admin Account
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3730E0]"
                  placeholder="Admin Name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3730E0]"
                  placeholder="admin@classconnect.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#3730E0]"
                  placeholder="Min 6 characters"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-visual border border-slate-200 text-slate-700 w-full text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-visual btn-primary w-full text-xs font-black shadow-md"
                >
                  {submitting ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
