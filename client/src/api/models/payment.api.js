import api from '../axios';

export const paymentApi = {
  createOrder: async (courseId, gateway) => {
    const response = await api.post('/payment/create-order', { courseId, gateway });
    return response.data;
  },

  verifyPayment: async (payload) => {
    const response = await api.post('/payment/verify', payload);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/payment/history');
    return response.data;
  },

  getReceipt: async (orderId) => {
    const response = await api.get(`/payment/receipt/${orderId}`);
    return response.data;
  },
};
