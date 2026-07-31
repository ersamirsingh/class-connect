import React, { useState, useEffect } from 'react';
import { reviewApi } from '../../api/models/review.api';
import { useAuth } from '../../hooks/useAuth';
import { Star, MessageSquare, Trash2, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const CourseReviewsSection = ({ courseId }) => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewApi.getCourseReviews(courseId);
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchReviews();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      const res = await reviewApi.addReview(courseId, rating, comment);
      if (res.success) {
        setMessage({ type: 'success', text: 'Review published successfully!' });
        setComment('');
        fetchReviews();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Only enrolled students can post reviews.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const res = await reviewApi.deleteReview(id);
      if (res.success) {
        fetchReviews();
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6 pt-6 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1E1E2E] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#3730E0]" /> Course Reviews & Ratings
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Verified feedback from enrolled students.</p>
        </div>

        <div className="flex items-center gap-2 bg-[#F5A623]/10 px-4 py-2 rounded-2xl">
          <Star className="w-5 h-5 fill-[#F5A623] text-[#F5A623]" />
          <span className="font-black text-lg text-[#1E1E2E]">{avgRating}</span>
          <span className="text-xs font-bold text-slate-400">({reviews.length} reviews)</span>
        </div>
      </div>

      {/* Review Submission Form (For Enrolled Students) */}
      {user && user.role === 'student' && (
        <form onSubmit={handleSubmit} className="card-visual p-5 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Write a Review</label>
            {/* Interactive 5-Star Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'fill-[#F5A623] text-[#F5A623]' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your learning experience..."
            rows={3}
            required
            className="w-full p-3 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-medium text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3730E0]"
          />

          {message.text && (
            <div className={`text-xs font-semibold ${message.type === 'success' ? 'text-[#1FAE64]' : 'text-[#EF4444]'}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-visual btn-primary text-xs font-bold px-4 py-2"
            >
              {submitting ? 'Publishing...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 text-[#3730E0] animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-xs font-semibold text-slate-400">
          No reviews yet. Be the first enrolled student to leave a review!
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div key={rev._id} className="card-visual p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.student?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={rev.student?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#1E1E2E]">{rev.student?.name || 'Student'}</div>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating ? 'fill-[#F5A623] text-[#F5A623]' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="p-1.5 text-slate-400 hover:text-[#EF4444] transition-colors"
                    title="Delete Review (Admin Moderation)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-xs font-medium text-slate-600 pl-11">{rev.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
