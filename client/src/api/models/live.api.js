import api from '../axios';

export const liveApi = {
  getChatHistory: async (liveSessionId) => {
    const res = await api.get(`/live/session/${liveSessionId}/messages`);
    return res.data;
  },
  getSessionRoster: async (liveSessionId) => {
    const res = await api.get(`/live/session/${liveSessionId}/roster`);
    return res.data;
  },
  suspendStudent: async (liveSessionId, payload) => {
    const res = await api.post(`/live/session/${liveSessionId}/suspend`, payload);
    return res.data;
  },
  restoreStudent: async (liveSessionId, studentId) => {
    const res = await api.post(`/live/session/${liveSessionId}/restore`, { studentId });
    return res.data;
  },
};
