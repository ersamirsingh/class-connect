import React, { useState, useEffect } from 'react';
import { reportApi } from '../../api/models/report.api';
import {
  Flag,
  Video,
  CreditCard,
  LogIn,
  HelpCircle,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  X,
  Send,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { id: 'video', label: 'Video Issue', icon: Video, color: '#3730E0' },
  { id: 'payment', label: 'Payment Issue', icon: CreditCard, color: '#FF7A33' },
  { id: 'login', label: 'Login Issue', icon: LogIn, color: '#1FAE64' },
  { id: 'other', label: 'Other Problem', icon: HelpCircle, color: '#9333EA' },
];

export const ReportProblemPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('video');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      const res = await reportApi.getMyReports();
      if (res.success && res.data) {
        setMyReports(res.data);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (files.length + selected.length > 3) {
      setMessage({ type: 'error', text: 'Maximum 3 image attachments allowed.' });
      return;
    }

    const updatedFiles = [...files, ...selected];
    setFiles(updatedFiles);

    const previews = updatedFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setFilePreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setMessage({ type: 'error', text: 'Please enter a description of the problem.' });
      return;
    }

    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      const formData = new FormData();
      formData.append('category', selectedCategory);
      formData.append('description', description);

      files.forEach((file) => {
        formData.append('images', file);
      });

      const res = await reportApi.submitReport(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Problem ticket submitted successfully!' });
        setDescription('');
        setFiles([]);
        setFilePreviews([]);
        fetchMyReports();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit report.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-xs font-extrabold mb-2">
          <Flag className="w-4 h-4" /> Support & Tickets
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E1E2E]">Report a Problem</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Submit a problem ticket and track resolution from support.</p>
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
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Submission Form Card */}
      <div className="card-visual p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Visual Icon-Tab Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Problem Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl cursor-pointer border-2 transition-all text-center flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-[#3730E0] bg-[#3730E0]/10 text-[#3730E0] shadow-sm'
                        : 'border-slate-100 bg-[#F7F8FC] text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: cat.color }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold">{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Describe the Issue
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what happened or what went wrong..."
              rows={4}
              required
              className="w-full p-4 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-medium text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3730E0] focus:bg-white transition-all"
            />
          </div>

          {/* Image Attachments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Attach Images (Up to 3 photos)
            </label>

            <div className="flex flex-wrap items-center gap-4">
              {filePreviews.map((preview, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                  <img src={preview} alt="Attachment" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {files.length < 3 && (
                <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#3730E0] bg-[#F7F8FC] flex flex-col items-center justify-center text-slate-400 hover:text-[#3730E0] cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">Attach</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-visual btn-primary w-full text-xs font-extrabold shadow-lg shadow-[#3730E0]/25"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting Ticket...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Problem Report
              </>
            )}
          </button>
        </form>
      </div>

      {/* Ticket History */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[#1E1E2E] flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#3730E0]" /> My Submitted Tickets
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-[#3730E0] animate-spin mb-2" />
            <span className="text-xs font-bold text-slate-500">Loading tickets...</span>
          </div>
        ) : myReports.length === 0 ? (
          <div className="card-visual p-6 text-center text-xs font-semibold text-slate-500">
            You have not submitted any problem tickets yet.
          </div>
        ) : (
          <div className="space-y-3">
            {myReports.map((ticket) => (
              <div key={ticket._id} className="card-visual p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-[10px] font-extrabold uppercase">
                    Category: {ticket.category}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 ${
                      ticket.status === 'resolved'
                        ? 'bg-[#1FAE64]/10 text-[#1FAE64]'
                        : ticket.status === 'in-progress'
                        ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]'
                        : 'bg-[#F5A623]/10 text-[#F5A623]'
                    }`}
                  >
                    {ticket.status === 'resolved' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {ticket.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-700">{ticket.description}</p>

                {ticket.images && ticket.images.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    {ticket.images.map((img, i) => (
                      <img key={i} src={img} alt="Attachment" className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
