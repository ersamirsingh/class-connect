import api from '../axios';

export const adminApi = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAdmins: async () => {
    const response = await api.get('/admin/admins');
    return response.data;
  },

  createAdmin: async (payload) => {
    const response = await api.post('/admin/admins', payload);
    return response.data;
  },

  deactivateAdmin: async (id) => {
    const response = await api.put(`/admin/admins/${id}/deactivate`);
    return response.data;
  },

  getStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.put(`/admin/users/${id}/toggle-status`);
    return response.data;
  },

  getPayments: async (status = 'all') => {
    const response = await api.get(`/admin/payments${status !== 'all' ? `?status=${status}` : ''}`);
    return response.data;
  },

  refundOrder: async (id) => {
    const response = await api.put(`/admin/payments/${id}/refund`);
    return response.data;
  },
};
