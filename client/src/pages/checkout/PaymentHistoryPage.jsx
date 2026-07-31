import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentApi } from '../../api/models/payment.api';
import { Receipt, CheckCircle2, Clock, XCircle, ArrowRight, Loader2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export const PaymentHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await paymentApi.getHistory();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch payment history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5A623]/10 text-[#F5A623] text-xs font-bold mb-2">
          <DollarSign className="w-4 h-4" /> Order History
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1E1E2E]">My Payments & Receipts</h1>
        <p className="text-xs text-slate-500 font-medium">Track your course purchases and download receipts.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#3730E0] animate-spin mb-3" />
          <span className="text-xs font-bold text-slate-500">Loading order history...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl p-8 border border-slate-100 space-y-3">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No payment history found</h3>
          <p className="text-xs text-slate-500 font-medium">When you enroll in courses, your order records will appear here.</p>
          <Link to="/courses" className="btn-visual btn-primary text-xs mt-2 inline-flex">
            Browse Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-visual p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={order.course?.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                  alt={order.course?.title}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
                />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-400 uppercase">
                    Receipt #{order.receiptId} • {order.gateway}
                  </div>
                  <h3 className="font-extrabold text-base text-[#1E1E2E]">{order.course?.title || 'ClassConnect Course'}</h3>
                  <div className="text-xs font-bold text-[#3730E0]">${order.amount} {order.currency}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                {order.status === 'success' ? (
                  <span className="px-3 py-1 rounded-full bg-[#1FAE64]/10 text-[#1FAE64] text-xs font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                ) : order.status === 'pending' ? (
                  <span className="px-3 py-1 rounded-full bg-[#F5A623]/10 text-[#F5A623] text-xs font-extrabold flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Processing...
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-xs font-extrabold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Failed
                  </span>
                )}

                {order.status === 'success' && (
                  <Link
                    to={`/receipt/${order._id}`}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-[#3730E0]/10 hover:text-[#3730E0] transition-colors"
                    title="View Receipt"
                  >
                    <Receipt className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
