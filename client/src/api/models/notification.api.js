import api from '../axios';

export const notificationApi = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  broadcastLiveAlert: async (data) => {
    const response = await api.post('/notifications/broadcast-live', data);
    return response.data;
  },

  scheduleLiveAlert: async (data) => {
    const response = await api.post('/notifications/schedule-live', data);
    return response.data;
  },
};
