import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentApi } from '../../api/models/payment.api';
import { Printer, ChevronLeft, CheckCircle } from 'lucide-react';

export function ReceiptViewPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await paymentApi.getReceipt(orderId);
        setReceipt(res?.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)]">Loading...</div>;
  if (!receipt) return <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)]">Receipt not found</div>;

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)] print:bg-white print:p-0">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--ink-muted)] hover:text-[var(--ink)] p-2 min-h-[44px]">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-pill)] hover:bg-[var(--canvas)] transition-colors">
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
        </div>

        <div className="bg-[var(--surface)] p-10 md:p-14 rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] border border-[var(--border)] print:shadow-none print:border-none print:rounded-none">
          
          <div className="flex justify-between items-start mb-12 pb-8 border-b border-[var(--border)]">
            <div>
              <h1 className="text-3xl font-black font-['Manrope'] text-[var(--primary)] mb-1 tracking-tight">LUMINOUS OS</h1>
              <p className="text-[var(--ink-muted)] text-sm">Receipt for your purchase</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[var(--success)] font-bold justify-end mb-1">
                <CheckCircle className="w-5 h-5" /> PAID
              </div>
              <p className="text-sm text-[var(--ink-muted)] font-mono">#{receipt.orderId || orderId}</p>
              <p className="text-sm text-[var(--ink-muted)]">{new Date(receipt.date || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-sm font-bold text-[var(--ink-muted)] uppercase tracking-wider mb-4">Billed To</h3>
            <p className="font-medium text-lg">{receipt.customerName || 'Student Name'}</p>
            <p className="text-[var(--ink-muted)]">{receipt.customerEmail || 'student@example.com'}</p>
          </div>

          <table className="w-full mb-10 text-left">
            <thead>
              <tr className="border-b-2 border-[var(--border)] text-sm text-[var(--ink-muted)] uppercase tracking-wider">
                <th className="pb-3 font-bold">Item Description</th>
                <th className="pb-3 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--border)]">
                <td className="py-5 font-medium">{receipt.courseName || 'Course Enrollment'}</td>
                <td className="py-5 text-right font-mono">${receipt.amount}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-[var(--ink-muted)]">
                <span>Subtotal</span>
                <span className="font-mono">${receipt.amount}</span>
              </div>
              <div className="flex justify-between text-[var(--ink-muted)] border-b border-[var(--border)] pb-3">
                <span>Tax (0%)</span>
                <span className="font-mono">$0.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold font-['Manrope'] pt-2">
                <span>Total</span>
                <span className="text-[var(--primary)] font-mono">${receipt.amount}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center text-[var(--ink-muted)] text-sm print:mt-32">
            <p>Thank you for learning with Luminous OS.</p>
            <p>If you have any questions, contact support@luminous.com</p>
          </div>

        </div>
      </div>
    </div>
  );
}
