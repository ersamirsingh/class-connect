import api from '../axios';

export const verificationApi = {
  submitVerification: async (data) => {
    const res = await api.post('/verification/submit', data);
    return res.data;
  },
  getMyStatus: async () => {
    const res = await api.get('/verification/my-status');
    return res.data;
  },
  getAdminQueue: async (statusFilter = 'all') => {
    const res = await api.get(`/verification/admin/queue?status=${statusFilter}`);
    return res.data;
  },
  reviewVerification: async (id, action, reason = '') => {
    const res = await api.post(`/verification/admin/review/${id}`, { action, reason });
    return res.data;
  },
};
