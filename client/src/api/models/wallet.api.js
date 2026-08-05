import api from '../axios';

export const walletApi = {
  getStudentWallet: async () => {
    const res = await api.get('/wallet/my-wallet');
    return res.data;
  },
  saveBankDetails: async (data) => {
    const res = await api.post('/wallet/bank-details', data);
    return res.data;
  },
  requestWithdrawal: async (amount) => {
    const res = await api.post('/wallet/withdraw', { amount });
    return res.data;
  },
  getAdminQueue: async (statusFilter = 'all') => {
    const res = await api.get(`/wallet/admin/queue?status=${statusFilter}`);
    return res.data;
  },
  approveWithdrawal: async (requestId) => {
    const res = await api.post(`/wallet/admin/approve/${requestId}`);
    return res.data;
  },
  rejectWithdrawal: async (requestId, reason) => {
    const res = await api.post(`/wallet/admin/reject/${requestId}`, { reason });
    return res.data;
  },
};
