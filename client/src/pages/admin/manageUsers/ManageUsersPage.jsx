import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/models/admin.api';
import { Users, CheckCircle2, AlertCircle, Loader2, Archive, Check, Search } from 'lucide-react';

export const ManageUsersPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStudents();
      if (res.success && res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load students.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleStatus = async (studentId) => {
    try {
      const res = await adminApi.toggleUserStatus(studentId);
      if (res.success) {
        setMessage({ type: 'success', text: 'Student account status updated.' });
        fetchStudents();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update student status.' });
    }
  };

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold mb-2">
            <Users className="w-4 h-4" /> Student Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">Student Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manage student status (active vs archived). No permanent deletion.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mb-3" />
          <span className="text-xs font-bold text-slate-500">Loading student directory...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-visual p-8 text-center text-xs font-bold text-slate-400">
          {searchQuery ? 'No students match your search.' : 'No registered students found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <div key={student._id} className="card-visual p-5 space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-3">
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
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#6366F1]"
                />
                <div className="truncate">
                  <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-white truncate">{student.name}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{student.email}</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                    Enrolled Courses: <strong className="text-[#6366F1]">{student.enrolledCount || 0}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    student.isActive ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {student.isActive ? 'Active' : 'Archived'}
                </span>

                <button
                  onClick={() => handleToggleStatus(student._id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    student.isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-700'
                      : 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                  }`}
                >
                  {student.isActive ? 'Archive Account' : 'Activate Account'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
