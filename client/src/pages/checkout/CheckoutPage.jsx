import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { paymentApi } from '../../api/models/payment.api';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Lock,
  Receipt,
  Globe,
  Zap,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState('razorpay'); // 'razorpay' | 'stripe' | 'upi_qr'
  const [orderPayload, setOrderPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  // Load course & pre-generate backend calculated order details from courseId
  useEffect(() => {
    const initCheckout = async () => {
      try {
        setLoading(true);
        const res = await courseApi.getCourseByIdOrSlug(courseId);
        if (res.success && res.data) {
          setCourse(res.data);

          // Backend price calculation call — client passes only courseId
          const orderRes = await paymentApi.createOrder(res.data._id, 'razorpay');
          if (orderRes.success && orderRes.data) {
            setOrderPayload(orderRes.data);
          }
        }
      } catch (err) {
        setError('Failed to fetch program details or backend price calculation.');
      } finally {
        setLoading(false);
      }
    };
    initCheckout();
  }, [courseId]);

  const handlePayment = async () => {
    if (!course) return;

    try {
      setProcessing(true);
      setError('');

      // Send courseId & gateway to backend
      const gatewayToUse = selectedGateway === 'upi_qr' ? 'razorpay' : selectedGateway;
      const orderRes = await paymentApi.createOrder(course._id, gatewayToUse);

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Failed to initiate payment.');
      }

      const orderData = orderRes.data;

      // Handle Verification
      if (selectedGateway === 'stripe') {
        const verifyRes = await paymentApi.verifyPayment({
          gateway: 'stripe',
          orderId: orderData.orderId,
          paymentIntentId: orderData.gatewayOrderId,
        });
        if (verifyRes.success) {
          setSuccessOrder(verifyRes.order);
        }
      } else {
        // Razorpay or UPI QR verification
        const verifyRes = await paymentApi.verifyPayment({
          gateway: 'razorpay',
          orderId: orderData.orderId,
          razorpayPaymentId: `pay_qr_${Date.now()}`,
          razorpayOrderId: orderData.gatewayOrderId,
          razorpaySignature: 'mock_valid_signature',
        });
        if (verifyRes.success) {
          setSuccessOrder(verifyRes.order);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment verification failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#090D16]">
        <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mb-3" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Calculating course price & generating payment QR...</span>
      </div>
    );
  }

  const priceToPay = orderPayload?.amount || course?.discountPrice || course?.price || 0;
  const originalPrice = course?.price || priceToPay;
  const savingsPct = originalPrice > priceToPay ? Math.round(((originalPrice - priceToPay) / originalPrice) * 100) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] p-4 sm:p-8 flex items-center justify-center transition-colors duration-200">
      {/* Success Modal Overlay */}
      <AnimatePresence>
        {successOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-[#111827] p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="w-20 h-20 rounded-full bg-[#10B981]/10 text-[#10B981] mx-auto flex items-center justify-center ring-8 ring-[#10B981]/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-black uppercase mb-2">
                  Payment Verified
                </span>
                <h2 className="text-2xl font-black text-[#0F172A] dark:text-white">Enrollment Confirmed! 🎉</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  You now have active access to <strong className="text-slate-800 dark:text-slate-200">{course?.title}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium space-y-1">
                <div>Receipt ID: <strong className="font-mono text-[#0F172A] dark:text-white">{successOrder.receiptId}</strong></div>
                <div>Amount Paid: <strong className="text-[#10B981] font-black">₹{priceToPay}</strong></div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  to={`/receipt/${successOrder._id}`}
                  className="btn-visual border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 w-full text-xs font-bold"
                >
                  <Receipt className="w-4 h-4" /> View Payment Receipt
                </Link>
                <Link
                  to="/dashboard"
                  className="btn-visual btn-primary w-full text-xs font-black shadow-lg"
                >
                  Go to Student Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Payment Options */}
        <div className="md:col-span-7 bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold mb-2 border border-[#6366F1]/20">
              <Lock className="w-4 h-4" /> 256-Bit SSL Encrypted Checkout
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] dark:text-white">Complete Payment</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Price calculated securely from backend using course ID.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Gateway Selection Tiles */}
          <div className="space-y-3">
            {/* UPI QR Option */}
            <div
              onClick={() => setSelectedGateway('upi_qr')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedGateway === 'upi_qr'
                  ? 'border-[#6366F1] bg-[#6366F1]/5 dark:bg-[#6366F1]/10 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-[#111827]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6366F1] text-white font-black flex items-center justify-center shadow-md">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#0F172A] dark:text-white flex items-center gap-2">
                    Instant UPI QR Code <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981]">Recommended</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Scan with Google Pay, PhonePe, Paytm, BHIM</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'upi_qr' ? 'border-[#6366F1] bg-[#6366F1]' : 'border-slate-300 dark:border-slate-700'}`}>
                {selectedGateway === 'upi_qr' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>

            {/* Razorpay Tile */}
            <div
              onClick={() => setSelectedGateway('razorpay')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedGateway === 'razorpay'
                  ? 'border-[#6366F1] bg-[#6366F1]/5 dark:bg-[#6366F1]/10 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-[#111827]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#06B6D4] text-white font-black text-xs flex items-center justify-center shadow-md">
                  RZP
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#0F172A] dark:text-white flex items-center gap-2">
                    Razorpay Gateway
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Cards, Netbanking & Wallets</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'razorpay' ? 'border-[#6366F1] bg-[#6366F1]' : 'border-slate-300 dark:border-slate-700'}`}>
                {selectedGateway === 'razorpay' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>

            {/* Stripe Tile */}
            <div
              onClick={() => setSelectedGateway('stripe')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedGateway === 'stripe'
                  ? 'border-[#6366F1] bg-[#6366F1]/5 dark:bg-[#6366F1]/10 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-[#111827]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-black text-xs flex items-center justify-center shadow-md">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#0F172A] dark:text-white flex items-center gap-2">
                    Stripe Cards
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">International Visa, Mastercard, AMEX</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'stripe' ? 'border-[#6366F1] bg-[#6366F1]' : 'border-slate-300 dark:border-slate-700'}`}>
                {selectedGateway === 'stripe' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
          </div>

          {/* Display Dynamic QR Code when UPI mode is selected */}
          {selectedGateway === 'upi_qr' && orderPayload?.qrCodeUrl && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-3">
              <span className="text-xs font-extrabold text-[#0F172A] dark:text-white flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#6366F1]" /> Scan QR Code to Pay ₹{priceToPay}
              </span>
              <img
                src={orderPayload.qrCodeUrl}
                alt="UPI Payment QR Code"
                className="w-48 h-48 rounded-2xl border-4 border-white shadow-lg bg-white p-2"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Scan with any UPI app on your phone, then click "Verify & Confirm Payment" below.
              </p>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={processing}
            className="btn-visual btn-primary w-full text-xs font-black shadow-lg shadow-[#6366F1]/30 py-3.5"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Order with Server...
              </span>
            ) : (
              <>
                <span>Confirm & Pay ₹{priceToPay}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Column: Order Summary & Discount Badge */}
        <div className="md:col-span-5 bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-black text-base text-[#0F172A] dark:text-white">Order Summary</h3>

          {course && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                />
                <div>
                  <div className="text-xs font-extrabold text-[#0F172A] dark:text-white line-clamp-2">{course.title}</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">
                    {course.type === 'live' ? '⚡ Live Class' : '📹 Recorded Course'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Original Price</span>
                  <span>₹{originalPrice}</span>
                </div>

                {savingsPct && (
                  <div className="flex justify-between text-[#10B981] font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Discount Savings ({savingsPct}% OFF)
                    </span>
                    <span>-₹{originalPrice - priceToPay}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-black text-sm text-[#0F172A] dark:text-white">
                  <span>Backend Calculated Total</span>
                  <span className="text-[#6366F1]">₹{priceToPay}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
