import api from '../axios';

export const enrollmentApi = {
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my');
    return response.data;
  },

  markComplete: async (courseId, lectureId) => {
    const response = await api.post('/enrollments/progress/complete', { courseId, lectureId });
    return response.data;
  },

  getCertificate: async (courseId) => {
    const response = await api.get(`/enrollments/certificate/${courseId}`);
    return response.data;
  },

  getUnlockStatus: async (courseId) => {
    const response = await api.get(`/enrollments/unlock-status/${courseId}`);
    return response.data;
  },

  getLecturePlayback: async (courseId, lectureId) => {
    const response = await api.get(`/enrollments/playback/${courseId}/${lectureId}`);
    return response.data;
  },
};
