import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { paymentApi } from '../../api/models/payment.api';
import { FileText, ArrowRight, CreditCard } from 'lucide-react';

export function PaymentHistoryPage() {
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await paymentApi.getHistory();
        setHistory(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) return <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[var(--aura-peach)] text-[var(--energy-accent)] rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold font-['Manrope']">{t('payment_history') || 'Payment History'}</h1>
        </div>

        {history.length === 0 ? (
          <div className="bg-[var(--surface)] p-12 rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] border border-[var(--border)] text-center">
            <FileText className="w-12 h-12 text-[var(--ink-faint)] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
            <p className="text-[var(--ink-muted)] mb-6">When you purchase a course, your receipts will appear here.</p>
            <Link to="/courses" className="inline-block px-6 py-3 min-h-[44px] bg-[var(--primary)] text-white font-medium rounded-[var(--radius-pill)] hover:bg-[var(--deep-anchor)] transition-colors">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((order) => (
              <div key={order.id} className="bg-[var(--surface)] p-5 md:p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${order.status === 'success' || order.status === 'completed' ? 'bg-green-100 text-[var(--success)]' : 'bg-yellow-100 text-[var(--energy-accent)]'}`}>
                      {order.status?.toUpperCase() || 'COMPLETED'}
                    </span>
                    <span className="text-sm text-[var(--ink-muted)]">{new Date(order.date || order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{order.courseName || order.course?.title || 'Course Name'}</h3>
                  <p className="text-sm text-[var(--ink-muted)] font-mono">Order #{order.orderId || order.id}</p>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto gap-6 mt-4 md:mt-0">
                  <div className="text-xl font-bold font-['Manrope']">
                    ${order.amount}
                  </div>
                  <Link 
                    to={`/receipt/${order.orderId || order.id}`}
                    className="flex items-center gap-2 text-[var(--primary)] font-medium hover:underline p-2 min-h-[44px]"
                  >
                    View Receipt <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
