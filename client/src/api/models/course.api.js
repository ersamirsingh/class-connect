import api from '../axios';

export const courseApi = {
  getCourses: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/courses${query ? `?${query}` : ''}`);
    return response.data;
  },

  getCourseByIdOrSlug: async (idOrSlug) => {
    const response = await api.get(`/courses/${idOrSlug}`);
    return response.data;
  },

  getSuggestedCourses: async (limit = 6) => {
    const response = await api.get(`/courses/suggested?limit=${limit}`);
    return response.data;
  },

  getAllCoursesAdmin: async () => {
    const response = await api.get('/courses/admin/all');
    return response.data;
  },

  createCourse: async (data) => {
    const response = await api.post('/courses', data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  toggleSuggested: async (id) => {
    const response = await api.put(`/courses/toggle-suggested/${id}`);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  trackPreviewPlay: async (id, guestCount = 0) => {
    const response = await api.post(`/courses/${id}/preview/play`, { guestCount });
    return response.data;
  },
};
