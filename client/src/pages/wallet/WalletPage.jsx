import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Building2, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  IndianRupee,
  Share2,
  Users
} from 'lucide-react';
import { walletApi } from '../../api/models/wallet.api';
import { useAuth } from '../../hooks/useAuth';

export function WalletPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  const [bankForm, setBankForm] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
  });
  const [submittingBank, setSubmittingBank] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await walletApi.getStudentWallet();
      setData(res.data);
      if (res.data?.wallet?.bankDetails) {
        setBankForm({
          accountNumber: res.data.wallet.bankDetails.accountNumber || '',
          ifscCode: res.data.wallet.bankDetails.ifscCode || '',
          accountHolderName: res.data.wallet.bankDetails.accountHolderName || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const referralCode = user?.referralCode || 'REF-CLASS1';
  const referralUrl = `${window.location.origin}/signup?ref=${referralCode}`;

  const copyReferralUrl = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      setSubmittingBank(true);
      await walletApi.saveBankDetails(bankForm);
      setMsg({ type: 'success', text: 'Bank account verified via penny-drop check!' });
      await loadData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setSubmittingBank(false);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      setSubmittingWithdraw(true);
      await walletApi.requestWithdrawal(Number(withdrawAmount));
      setMsg({ type: 'success', text: 'Withdrawal request submitted for Admin approval.' });
      setWithdrawAmount('');
      await loadData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-[var(--ink)]">
          <div className="w-6 h-6 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <span className="font-bold text-sm">Loading referral wallet...</span>
        </div>
      </div>
    );
  }

  const wallet = data?.wallet || { balance: 0 };
  const referrals = data?.referrals || [];
  const withdrawals = data?.withdrawals || [];

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-4 sm:p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-black uppercase text-[var(--primary)] tracking-widest">Earnings & Affiliates</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-manrope text-[var(--ink)]">Referral Wallet & Payouts</h1>
          </div>

          <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-4 py-2 rounded-full shadow-sm">
            <Wallet className="w-5 h-5 text-[var(--primary)]" />
            <span className="text-xs font-bold text-[var(--ink-muted)]">Available Balance:</span>
            <span className="text-lg font-black text-[var(--primary)] font-mono">₹{wallet.balance}</span>
          </div>
        </div>

        {/* System Message Alerts */}
        {msg.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* TOP ROW: REFERRAL LINK CARD & BALANCE WITHDRAWAL CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Share Referral Link */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-gradient-to-br from-[var(--primary)] to-[var(--deep-anchor,#24216F)] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-md">
                <Users className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold font-manrope">Earn 15% Referral Commission</h3>
                <p className="text-xs text-indigo-100 mt-0.5">Share your link. Earn instantly when friends complete a course purchase!</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-indigo-200 block">Your Unique Referral Link</label>
              <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md p-2 pl-4 rounded-2xl border border-white/20">
                <span className="text-xs font-mono font-semibold text-white truncate flex-1">{referralUrl}</span>
                <button
                  onClick={copyReferralUrl}
                  className="px-4 py-2 bg-white text-[var(--primary)] text-xs font-extrabold rounded-xl hover:bg-amber-300 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/15">
              <span className="font-semibold text-indigo-200">Code: <strong className="font-mono text-white">{referralCode}</strong></span>
              <span className="font-semibold text-indigo-200">Total Referrals: <strong className="text-amber-300">{referrals.length}</strong></span>
            </div>
          </motion.div>

          {/* Card 2: Request Withdrawal Form */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-5 bg-[var(--surface)] p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-extrabold text-base font-manrope text-[var(--ink)]">Request Withdrawal</h3>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Min ₹500</span>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[var(--ink-muted)] block mb-1">Amount to Withdraw (₹)</label>
                  <input
                    type="number"
                    min="500"
                    placeholder="e.g. 1000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] font-mono text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingWithdraw || wallet.balance < 500}
                  className="w-full py-3 bg-[var(--primary)] text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-[var(--deep-anchor,#24216F)] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>{submittingWithdraw ? 'Submitting...' : 'Submit Withdrawal Request'}</span>
                </button>
              </form>
            </div>

            <p className="text-[10px] text-[var(--ink-muted)] mt-4 font-medium">
              Note: Withdrawals require Admin approval and verified PAN/Aadhaar documents.
            </p>
          </motion.div>

        </div>

        {/* BANK DETAILS FORM SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--surface)] p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-lg space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-[var(--primary)]" />
              <div>
                <h3 className="font-extrabold text-lg text-[var(--ink)] font-manrope">Bank Account for Payouts</h3>
                <p className="text-xs text-[var(--ink-muted)] font-medium">Verified via Penny-Drop check before processing withdrawals.</p>
              </div>
            </div>

            {wallet.bankDetails?.isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Penny-Drop Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">
                <Clock className="w-4 h-4 text-amber-600" /> Verification Pending
              </span>
            )}
          </div>

          <form onSubmit={handleBankSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--ink-muted)] block mb-1">Account Holder Name</label>
              <input
                type="text"
                placeholder="Full Name as in Bank"
                value={bankForm.accountHolderName}
                onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-xs font-bold focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--ink-muted)] block mb-1">Bank Account Number</label>
              <input
                type="text"
                placeholder="e.g. 918273645012"
                value={bankForm.accountNumber}
                onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] font-mono text-xs focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--ink-muted)] block mb-1">IFSC Code</label>
              <input
                type="text"
                placeholder="e.g. SBIN0001234"
                value={bankForm.ifscCode}
                onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] font-mono text-xs uppercase focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={submittingBank}
                className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-[var(--deep-anchor,#24216F)] transition-colors cursor-pointer disabled:opacity-50"
              >
                {submittingBank ? 'Verifying...' : 'Save & Verify Bank Account'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* TABLES: REFERRAL TRANSACTIONS & WITHDRAWAL HISTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Referrals History */}
          <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-md space-y-4">
            <h3 className="font-extrabold text-base font-manrope text-[var(--ink)]">Referral Earnings History</h3>
            
            {referrals.length === 0 ? (
              <p className="text-xs text-[var(--ink-muted)] font-medium">No referral earnings yet. Share your code to start earning!</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {referrals.map((tx) => (
                  <div key={tx._id} className="p-3 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-extrabold text-[var(--ink)]">{tx.referredStudent?.name || 'Referred Learner'}</p>
                      <p className="text-[10px] text-[var(--ink-muted)] font-mono">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="font-extrabold font-mono text-emerald-600 text-sm">+₹{tx.commissionAmount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Withdrawals History */}
          <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-md space-y-4">
            <h3 className="font-extrabold text-base font-manrope text-[var(--ink)]">Withdrawal Requests</h3>

            {withdrawals.length === 0 ? (
              <p className="text-xs text-[var(--ink-muted)] font-medium">No withdrawal requests submitted yet.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {withdrawals.map((req) => (
                  <div key={req._id} className="p-3 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold font-mono text-sm text-[var(--ink)]">₹{req.amount}</span>
                      <p className="text-[10px] text-[var(--ink-muted)] font-mono">{new Date(req.requestedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      req.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
