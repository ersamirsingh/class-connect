import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { reviewApi } from '../../api/models/review.api';

export function CourseReviewsSection({ courseId, reviews = [], onReviewAdded }) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a rating');
    setSubmitting(true);
    setError('');
    try {
      await reviewApi.addReview(courseId, rating, comment);
      setRating(0);
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <section>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {t('courses.reviews', 'Reviews')}
        </h3>
        {reviews.length > 0 && (
          <span className="chip chip-primary">
            <Star className="w-3 h-3 fill-current" />
            {averageRating} ({reviews.length})
          </span>
        )}
      </div>

      {/* Add review form */}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="card p-5 mb-6">
          <p className="text-sm font-semibold text-[var(--ink)] mb-3">Rate this course</p>

          {/* Star rating */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform duration-150 hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 transition-colors duration-150 ${
                    star <= (hoverRating || rating)
                      ? 'text-[var(--warning)] fill-[var(--warning)]'
                      : 'text-[var(--border-strong)]'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="input resize-none mb-3"
            rows={3}
          />

          {error && (
            <p className="text-sm text-[var(--danger)] mb-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="btn btn-primary text-sm gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? t('common.loading', 'Submitting...') : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-10">
          <MessageSquare className="w-10 h-10 mx-auto text-[var(--ink-faint)] mb-3" />
          <p className="text-sm text-[var(--ink-muted)]">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review._id || i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] flex items-center justify-center
                    text-sm font-bold text-[var(--primary)]">
                    {review.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-semibold text-[var(--ink)]">
                    {review.user?.name || 'Anonymous'}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= review.rating
                          ? 'text-[var(--warning)] fill-[var(--warning)]'
                          : 'text-[var(--border-strong)]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                  {review.comment}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
