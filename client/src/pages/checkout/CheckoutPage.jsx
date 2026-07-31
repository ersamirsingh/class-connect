import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useParams, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { paymentApi } from '../../api/models/payment.api';
import { ShieldCheck, CreditCard, Lock, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function CheckoutPage() {
  const { courseId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, pending, success, failed

  useEffect(() => {
    async function load() {
      try {
        const res = await courseApi.getCourseByIdOrSlug(courseId);
        setCourse(res?.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  const handlePay = async () => {
    setProcessing(true);
    setStatus('pending');
    try {
      const orderRes = await paymentApi.createOrder(courseId, 'razorpay');
      const orderData = orderRes.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || 'YOUR_KEY', 
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Luminous OS',
        description: `Purchase: ${course.title}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            await paymentApi.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            setStatus('success');
            setTimeout(() => navigate('/dashboard'), 3000);
          } catch (err) {
            setStatus('failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#4338F2'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            setStatus('idle');
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert('Razorpay SDK not loaded');
        setStatus('failed');
      }

    } catch (err) {
      console.error(err);
      setStatus('failed');
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)]">Loading...</div>;
  if (!course) return <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)]">Course not found</div>;

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-6 text-[var(--ink)]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-[var(--surface)] p-10 rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] border border-[var(--border)] text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-[var(--success)]/10 text-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-['Manrope'] mb-2">Payment Successful!</h2>
          <p className="text-[var(--ink-muted)] mb-8">You are now enrolled in <strong>{course.title}</strong>. Redirecting to your dashboard...</p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--primary)]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)] flex justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Course Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold font-['Manrope'] mb-2">Checkout</h1>
          <p className="text-[var(--ink-muted)]">Complete your purchase to start learning.</p>
          
          <div className="bg-[var(--surface)] p-4 rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] border border-[var(--border)] flex gap-4 mt-6">
            <div className="w-32 aspect-video bg-[var(--canvas)] rounded-[var(--radius-lg)] overflow-hidden shrink-0">
              {course.thumbnail && <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-bold line-clamp-2 mb-1">{course.title}</h3>
              <p className="text-sm text-[var(--ink-muted)] line-clamp-1">{course.instructor?.name || 'Instructor'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-[var(--ink-muted)]">
              <ShieldCheck className="w-5 h-5 text-[var(--success)]" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--ink-muted)]">
              <Lock className="w-5 h-5 text-[var(--primary-soft)]" />
              <span>Secure Encrypted Payment</span>
            </div>
          </div>
        </div>

        {/* Order Summary & Pay */}
        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] border border-[var(--border)]">
          <h2 className="text-xl font-bold font-['Manrope'] mb-6">Order Summary</h2>
          
          <div className="space-y-4 border-b border-[var(--border)] pb-6 mb-6">
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">Original Price</span>
              <span className="font-medium">${course.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">Discount</span>
              <span className="font-medium text-[var(--success)]">-$0.00</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-bold">Total</span>
            <span className="text-3xl font-bold font-['Manrope'] text-[var(--primary)]">${course.price}</span>
          </div>

          {status === 'failed' && (
            <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium">
              Payment failed or was cancelled. Please try again.
            </div>
          )}

          <button 
            onClick={handlePay}
            disabled={processing}
            className="w-full py-4 min-h-[44px] bg-[var(--primary)] text-white font-bold rounded-[var(--radius-pill)] hover:bg-[var(--deep-anchor)] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 text-lg shadow-md"
          >
            {processing ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
          
          <p className="text-xs text-center text-[var(--ink-muted)] mt-4">
            By completing this purchase you agree to our Terms of Service.
          </p>
        </div>

      </div>
    </div>
  );
}
