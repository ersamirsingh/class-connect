import api from '../axios';

export const contentApi = {
  getPublicContent: async (page = 'home') => {
    const response = await api.get(`/content?page=${page}`);
    return response.data;
  },

  getContentByPage: async (page = 'home') => {
    const response = await api.get(`/content?page=${page}`);
    return response.data;
  },

  getAllContentAdmin: async () => {
    const response = await api.get('/content/admin/all');
    return response.data;
  },

  createContentBlock: async (data) => {
    const response = await api.post('/content/admin', data);
    return response.data;
  },

  updateContentBlock: async (id, data) => {
    const response = await api.put(`/content/admin/${id}`, data);
    return response.data;
  },

  deleteContentBlock: async (id) => {
    const response = await api.delete(`/content/admin/${id}`);
    return response.data;
  },
};
