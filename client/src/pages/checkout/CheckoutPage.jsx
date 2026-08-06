import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useParams, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { paymentApi } from '../../api/models/payment.api';
import { ShieldCheck, CreditCard, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { SAMPLE_COURSES } from '../../data/sampleData';

export function CheckoutPage() {
  const { courseId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, pending, verifying, success, failed

  useEffect(() => {
    async function load() {
      try {
        const res = await courseApi.getCourseByIdOrSlug(courseId);
        const loaded = res?.data?.course || res?.data || res;
        setCourse(loaded || SAMPLE_COURSES[0]);
      } catch (err) {
        console.warn('Using fallback course for checkout:', err);
        setCourse(SAMPLE_COURSES[0]);
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
      const orderData = orderRes.data || orderRes;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_sample', 
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ClassConnect',
        description: `Enrollment: ${course.title}`,
        order_id: orderData.orderId || orderData.id,
        handler: async function (response) {
          try {
            // High priority state: Verifying payment with backend server
            setStatus('verifying');
            await paymentApi.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            setStatus('success');
            setTimeout(() => navigate('/dashboard'), 2500);
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
          color: '#FF2A2A'
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
        alert('Razorpay Gateway initializing...');
        setStatus('failed');
        setProcessing(false);
      }

    } catch (err) {
      console.error(err);
      setStatus('failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center text-[#C1FBD4] font-mono text-sm">
        Initializing secure checkout...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white font-mono">
        Course not found
      </div>
    );
  }

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 text-white font-mono">
        <div className="bg-[#0B0B0D] p-10 rounded-3xl border border-white/10 text-center max-w-md w-full space-y-4">
          <Loader2 className="w-10 h-10 text-[#FF2A2A] animate-spin mx-auto" />
          <h2 className="font-display text-2xl font-light">Verifying payment...</h2>
          <p className="text-xs text-[#A1A1AA]">
            Communicating with backend server and Razorpay gateway. Please do not refresh.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 text-white font-mono">
        <div className="bg-[#0B0B0D] p-10 rounded-3xl border border-[#C1FBD4]/40 text-center max-w-md w-full space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#C1FBD4] mx-auto" />
          <h2 className="font-display text-2xl font-light text-white">Payment Verified</h2>
          <p className="text-xs text-[#A1A1AA]">
            Course enrollment confirmed. Redirecting to your learning dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#F7F7F5] font-body selection:bg-[#C1FBD4] selection:text-black py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C1FBD4]/10 border border-[#C1FBD4]/30 text-[#C1FBD4] font-mono text-xs uppercase tracking-widest mb-3">
            SECURE CHECKOUT
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-white">
            Confirm Enrollment
          </h1>
        </div>

        {/* Course Summary Box */}
        <div className="p-8 rounded-3xl bg-[#0B0B0D] border border-white/10 space-y-6">
          <div className="flex items-start justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="font-mono text-[10px] text-[#C1FBD4] uppercase tracking-widest block mb-1">
                {course.category?.name || 'TECHNICAL TRACK'}
              </span>
              <h2 className="font-display text-2xl font-light text-white">
                {course.title}
              </h2>
            </div>
            <div className="text-right">
              <span className="font-display text-3xl font-normal text-white">
                ₹{course.price?.toLocaleString('en-IN') || 4999}
              </span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs text-[#A1A1AA]">
            <div className="flex items-center justify-between">
              <span>Lifetime Course Access</span>
              <span className="text-white">Included</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Verifiable Digital Certificate</span>
              <span className="text-white">Included</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Razorpay 256-bit SSL Security</span>
              <span className="text-[#C1FBD4]">Verified</span>
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full py-4 rounded-full bg-[#FF2A2A] hover:bg-[#FF4D3D] text-white font-mono text-sm uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,42,42,0.4)]"
          >
            {processing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{course.price?.toLocaleString('en-IN') || 4999} with Razorpay</span>
              </>
            )}
          </button>
        </div>

        <p className="text-center font-mono text-xs text-[#71717A]">
          By confirming, you agree to our Terms of Service & Cancellation Policy.
        </p>

      </div>
    </div>
  );
}

export default CheckoutPage;
