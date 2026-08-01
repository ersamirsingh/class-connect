import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, CheckCircle2, ShieldCheck, FileText, Download, Building2 } from 'lucide-react';

export function PaymentReceiptModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const amountPaid = order.amount || order.price || 49;
  const baseAmount = Math.round(amountPaid / 1.18);
  const gstAmount = amountPaid - baseAmount;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans print:p-0 print:bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:w-full print:rounded-none"
        >
          {/* Top Bar (Hidden when printing) */}
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 print:hidden">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--primary)]" />
              <h3 className="font-extrabold text-lg text-slate-900 font-manrope">Payment Receipt & Invoice</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-sm cursor-pointer hover:bg-[var(--deep-anchor,#24216F)]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Printable Invoice Slip Content */}
          <div className="p-6 sm:p-8 space-y-6 text-slate-900">
            {/* Header / Business Info */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-black text-xs">
                    CC
                  </div>
                  <span className="font-extrabold text-lg text-[var(--primary)]">ClassConnect Inc.</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">100 EdTech Plaza, Tech Park</p>
                <p className="text-[11px] text-slate-500 font-medium">GSTIN: 23AAAAA0000A1Z5</p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase mb-1">
                  <CheckCircle2 className="w-3 h-3" /> Paid In Full
                </span>
                <p className="text-xs font-mono font-bold text-slate-700">Receipt #{order._id || order.id || `RCPT-${Date.now()}`}</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Billed To Customer */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Billed To Customer</span>
              <p className="font-extrabold text-slate-900">{order.user?.name || order.studentName || 'Learner'}</p>
              <p className="text-slate-500 font-medium">{order.user?.email || order.studentEmail || 'learner@classconnect.com'}</p>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-500 uppercase font-black text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Course Item Description</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3">
                      <p className="font-extrabold text-slate-900">{order.course?.title || order.courseTitle || 'Masterclass Enrollment'}</p>
                      <span className="text-[10px] text-slate-500 font-mono">Lifetime Access & Certificate Included</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">₹{baseAmount}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">18% GST (CGST 9% + SGST 9%)</td>
                    <td className="p-3 text-right font-mono font-medium text-slate-600">₹{gstAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div className="flex justify-between items-center bg-[var(--primary-soft)] p-4 rounded-xl text-slate-900 border border-[var(--primary)]/30">
              <div>
                <span className="text-[10px] font-black uppercase text-[var(--primary)] block">Total Paid</span>
                <span className="text-xs text-slate-600 font-semibold">Payment via {order.paymentProvider || 'Razorpay / Credit Card'}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[var(--primary)] font-manrope">₹{amountPaid}</span>
              </div>
            </div>

            {/* Footer Verification */}
            <div className="text-center pt-2 text-[10px] text-slate-400 font-semibold border-t border-slate-100 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Computer Generated Official Payment Receipt. No Signature Required.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
