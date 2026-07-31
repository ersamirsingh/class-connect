import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/models/admin.api';
import { DollarSign, CheckCircle2, Clock, XCircle, Loader2, RotateCcw, AlertCircle } from 'lucide-react';

export const ManagePaymentsPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPayments(filterStatus);
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load payments.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleRefund = async (orderId) => {
    if (!window.confirm('Trigger manual refund and revoke course access for this order?')) return;

    try {
      const res = await adminApi.refundOrder(orderId);
      if (res.success) {
        setMessage({ type: 'success', text: 'Order marked refunded & enrollment updated.' });
        fetchOrders();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to trigger refund.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold mb-2">
          <DollarSign className="w-4 h-4" /> Financial Oversight
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">Sales & Payment Oversight</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monitor Razorpay and Stripe transactions and issue manual refunds.</p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {['all', 'success', 'pending', 'failed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all shrink-0 ${
              filterStatus === st
                ? 'bg-[#6366F1] text-white shadow-md'
                : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]'
              : 'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mb-3" />
          <span className="text-xs font-bold text-slate-500">Loading order records...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="card-visual p-8 text-center text-xs font-bold text-slate-400">
          No orders found under this status filter.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card-visual p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={order.course?.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                  alt={order.course?.title}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    Receipt #{order.receiptId} • {order.gateway}
                  </div>
                  <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-white">{order.course?.title || 'Course Purchase'}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Student: <strong className="text-slate-800 dark:text-slate-200">{order.student?.name}</strong> ({order.student?.email})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-right">
                  <div className="font-black text-sm text-[#6366F1]">${order.amount} {order.currency}</div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase mt-0.5 ${
                      order.status === 'success'
                        ? 'bg-[#10B981]/10 text-[#10B981]'
                        : order.status === 'pending'
                        ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                        : 'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {order.status === 'success' && (
                  <button
                    onClick={() => handleRefund(order._id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                    title="Refund Order"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
