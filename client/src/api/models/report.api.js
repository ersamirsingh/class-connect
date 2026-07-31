import api from '../axios';

export const reportApi = {
  submitReport: async (formData) => {
    const response = await api.post('/report', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyReports: async () => {
    const response = await api.get('/report/my');
    return response.data;
  },

  getAllReportsAdmin: async (status = 'all') => {
    const response = await api.get(`/report${status !== 'all' ? `?status=${status}` : ''}`);
    return response.data;
  },

  updateStatus: async (id, status, adminNote = '') => {
    const response = await api.put(`/report/${id}/status`, { status, adminNote });
    return response.data;
  },
};
