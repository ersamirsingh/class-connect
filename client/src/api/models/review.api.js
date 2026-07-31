import api from '../axios';

export const reviewApi = {
  addReview: async (courseId, rating, comment) => {
    const response = await api.post('/reviews', { courseId, rating, comment });
    return response.data;
  },

  getCourseReviews: async (courseId) => {
    const response = await api.get(`/reviews/course/${courseId}`);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};
