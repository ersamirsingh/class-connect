import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, EyeOff, Eye, Search, Filter, ShieldCheck } from 'lucide-react';
import api from '../../../api/axios';

export function ManageReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews/admin/all').catch(() => ({
          data: {
            data: [
              { _id: '1', userName: 'Rahul Sharma', userPhoto: '', courseTitle: 'Full Stack Web Dev', rating: 5, comment: 'The live interactive projects and 1-on-1 TA support helped me clear my Google interview!', isApproved: true, createdAt: '2026-07-28' },
              { _id: '2', userName: 'Priya Patel', userPhoto: '', courseTitle: 'Data Science & Analytics', rating: 4, comment: 'Great visualization cards and structured modules.', isApproved: true, createdAt: '2026-07-29' },
              { _id: '3', userName: 'Amit Kumar', userPhoto: '', courseTitle: 'AI & Machine Learning', rating: 5, comment: 'Awesome real-world datasets and certificate verification!', isApproved: false, createdAt: '2026-07-30' },
            ]
          }
        }));

        const list = res.data?.data || res.data || [];
        setReviews(list);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const toggleApproval = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === id ? { ...r, isApproved: !r.isApproved } : r))
    );
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch = r.userName?.toLowerCase().includes(search.toLowerCase()) || r.courseTitle?.toLowerCase().includes(search.toLowerCase()) || r.comment?.toLowerCase().includes(search.toLowerCase());
    if (statusFilter === 'approved') return matchesSearch && r.isApproved;
    if (statusFilter === 'pending') return matchesSearch && !r.isApproved;
    return matchesSearch;
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 bg-[var(--canvas)] min-h-screen text-[var(--ink)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B54E8]/10 text-[#5B54E8] text-xs font-black mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Moderation Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Student Reviews Moderation</h1>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center shadow-xs">
            <div className="text-lg font-black text-[#5B54E8]">{reviews.length}</div>
            <div className="text-[10px] font-bold text-[var(--ink-muted)]">Total Reviews</div>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center shadow-xs">
            <div className="text-lg font-black text-[#E8A23D]">{reviews.filter((r) => !r.isApproved).length}</div>
            <div className="text-[10px] font-bold text-[var(--ink-muted)]">Pending Review</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews, student or course..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B54E8]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'approved', label: 'Published' },
            { id: 'pending', label: 'Pending Moderation' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#5B54E8] text-white shadow-xs'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-muted)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-[var(--surface-raised)] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface)] border border-[var(--border)] rounded-3xl text-xs font-semibold text-[var(--ink-muted)]">
          No reviews found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <motion.div
              key={rev._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#5B54E8] text-white font-black text-sm flex items-center justify-center">
                      {rev.userName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[var(--ink)]">{rev.userName}</h4>
                      <p className="text-[10px] font-semibold text-[#5B54E8]">{rev.courseTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-[#E8A23D]/10 px-2.5 py-1 rounded-full text-xs font-black text-[#E8A23D]">
                    <span>{rev.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-[#E8A23D]" />
                  </div>
                </div>

                <p className="text-xs text-[var(--ink-muted)] font-medium leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400">Submitted {rev.createdAt}</span>

                <button
                  onClick={() => toggleApproval(rev._id)}
                  className={`btn-visual text-xs px-4 py-2 flex items-center gap-1.5 rounded-xl ${
                    rev.isApproved
                      ? 'bg-[#2FA876]/10 text-[#2FA876] hover:bg-[#2FA876]/20'
                      : 'bg-[#E8A23D]/10 text-[#E8A23D] hover:bg-[#E8A23D]/20'
                  }`}
                >
                  {rev.isApproved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Published (Click to Hide)
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" /> Approve & Publish
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
