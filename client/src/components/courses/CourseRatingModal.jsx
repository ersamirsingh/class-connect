import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle2, MessageSquare, Send, Award } from 'lucide-react';
import { reviewApi } from '../../api/models/review.api';

export function CourseRatingModal({ course, isOpen, onClose, onRatingSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !course) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a star rating between 1 and 5');
    setSubmitting(true);
    setError('');
    try {
      await reviewApi.addReview(course._id || course.id, rating, comment);
      setSuccess(true);
      if (onRatingSubmitted) onRatingSubmitted(rating);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-6 space-y-5 font-sans"
      >
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-manrope">Rate This Course</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your review and rating have been posted to the course page.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{course.title}</h4>
              <p className="text-xs text-slate-400">Select star rating & share your experience</p>
            </div>

            {/* Clickable Star Rating */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform duration-150 hover:scale-125 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-center font-extrabold text-xs text-amber-500">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Outstanding' : rating === 4 ? '⭐⭐⭐⭐ Great Course' : rating === 3 ? '⭐⭐⭐ Good' : rating === 2 ? '⭐⭐ Fair' : '⭐ Needs Improvement'}
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Review & Feedback</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like about the instructor, content, or projects? (Optional)"
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none h-24"
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-500 text-center">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-full shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Rating'}</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
