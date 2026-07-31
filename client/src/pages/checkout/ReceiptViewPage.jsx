import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { paymentApi } from '../../api/models/payment.api';
import { Receipt, Printer, CheckCircle2, GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';

export const ReceiptViewPage = () => {
  const { orderId } = useParams();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        const res = await paymentApi.getReceipt(orderId);
        if (res.success && res.data) {
          setReceipt(res.data);
        }
      } catch (err) {
        console.error('Failed to load receipt:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC]">
        <Loader2 className="w-10 h-10 text-[#3730E0] animate-spin mb-3" />
        <span className="text-xs font-bold text-slate-500">Generating receipt...</span>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC]">
        <h2 className="text-xl font-bold text-[#1E1E2E]">Receipt Not Found</h2>
        <Link to="/payments" className="btn-visual btn-primary text-xs mt-4">
          Back to Payments
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-100 space-y-6">
        {/* Printable Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3730E0] flex items-center justify-center text-white font-black text-2xl shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl text-[#1E1E2E]">
                Class<span className="text-[#FF7A33]">Connect</span>
              </h1>
              <span className="text-xs font-bold text-slate-400">Official Payment Receipt</span>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 text-xs font-bold"
          >
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
        </div>

        {/* Status Banner */}
        <div className="p-4 rounded-2xl bg-[#1FAE64]/10 border border-[#1FAE64]/20 text-[#1FAE64] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <CheckCircle2 className="w-5 h-5" /> Payment Status: PAID
          </div>
          <span className="text-xs font-mono font-bold">{receipt.receiptId}</span>
        </div>

        {/* Receipt Grid Info */}
        <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600">
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Billed To</div>
            <div className="font-extrabold text-slate-800 text-sm mt-0.5">{receipt.student?.name}</div>
            <div>{receipt.student?.email}</div>
          </div>
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Payment Details</div>
            <div>Gateway: <strong className="capitalize text-slate-800">{receipt.gateway}</strong></div>
            <div>Date: {new Date(receipt.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Item Table */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FC] border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Course Item</th>
                <th className="p-3.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr>
                <td className="p-3.5 font-bold">{receipt.course?.title || 'ClassConnect Masterclass'}</td>
                <td className="p-3.5 text-right font-black text-[#3730E0]">${receipt.amount} {receipt.currency}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-4 flex justify-between items-center text-xs font-medium text-slate-500 border-t border-slate-100">
          <Link to="/payments" className="font-bold text-[#3730E0] flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Payments
          </Link>
          <div>Thank you for learning with ClassConnect!</div>
        </div>
      </div>
    </div>
  );
};
