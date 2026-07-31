import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/models/admin.api';
import { Users, CheckCircle2, AlertCircle, Loader2, Archive, Check } from 'lucide-react';

export const ManageUsersPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1FAE64]/10 text-[#1FAE64] text-xs font-bold mb-2">
          <Users className="w-4 h-4" /> Student Management
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E1E2E]">Student Directory</h1>
        <p className="text-xs text-slate-500 font-medium">Manage student status (active vs archived). No permanent deletion.</p>
      </div>

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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#3730E0] animate-spin mb-3" />
          <span className="text-xs font-bold text-slate-500">Loading student directory...</span>
        </div>
      ) : students.length === 0 ? (
        <div className="card-visual p-8 text-center text-xs font-bold text-slate-400">
          No registered students found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div key={student._id} className="card-visual p-5 space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={student.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#3730E0]"
                />
                <div className="truncate">
                  <h3 className="font-extrabold text-sm text-[#1E1E2E] truncate">{student.name}</h3>
                  <div className="text-xs text-slate-500 font-medium truncate">{student.email}</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                    Enrolled Courses: <strong className="text-[#3730E0]">{student.enrolledCount || 0}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    student.isActive ? 'bg-[#1FAE64]/10 text-[#1FAE64]' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {student.isActive ? 'Active' : 'Archived'}
                </span>

                <button
                  onClick={() => handleToggleStatus(student._id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    student.isActive
                      ? 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700'
                      : 'bg-[#1FAE64]/10 text-[#1FAE64] hover:bg-[#1FAE64]/20'
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
