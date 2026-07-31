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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState('razorpay'); // 'razorpay' | 'stripe'
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await courseApi.getCourseByIdOrSlug(courseId);
        if (res.success && res.data) {
          setCourse(res.data);
        }
      } catch (err) {
        setError('Failed to fetch course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handlePayment = async () => {
    if (!course) return;

    try {
      setProcessing(true);
      setError('');

      // Step 1: Create Order backend call
      const orderRes = await paymentApi.createOrder(course._id, selectedGateway);

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Failed to initiate payment.');
      }

      const orderData = orderRes.data;

      // Step 2: Handle Gateway Checkout Verification
      if (selectedGateway === 'razorpay') {
        // Razorpay modal integration or test simulation
        if (window.Razorpay && orderData.keyId && !orderData.keyId.includes('mock')) {
          const options = {
            key: orderData.keyId,
            amount: orderData.amount * 100,
            currency: orderData.currency,
            name: 'ClassConnect',
            description: orderData.courseTitle,
            order_id: orderData.gatewayOrderId,
            handler: async (response) => {
              const verifyRes = await paymentApi.verifyPayment({
                gateway: 'razorpay',
                orderId: orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              if (verifyRes.success) {
                setSuccessOrder(verifyRes.order);
              }
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Dev / Test verification simulation
          const verifyRes = await paymentApi.verifyPayment({
            gateway: 'razorpay',
            orderId: orderData.orderId,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpayOrderId: orderData.gatewayOrderId,
            razorpaySignature: 'mock_valid_signature',
          });
          if (verifyRes.success) {
            setSuccessOrder(verifyRes.order);
          }
        }
      } else {
        // Stripe verification simulation / clientSecret flow
        const verifyRes = await paymentApi.verifyPayment({
          gateway: 'stripe',
          orderId: orderData.orderId,
          paymentIntentId: orderData.gatewayOrderId,
        });
        if (verifyRes.success) {
          setSuccessOrder(verifyRes.order);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment processing failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC]">
        <Loader2 className="w-10 h-10 text-[#3730E0] animate-spin mb-3" />
        <span className="text-xs font-bold text-slate-500">Preparing checkout...</span>
      </div>
    );
  }

  const priceToPay = course?.discountPrice || course?.price || 0;

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-4 sm:p-8 flex items-center justify-center">
      {/* Success Modal Overlay */}
      <AnimatePresence>
        {successOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-[#1FAE64]/10 text-[#1FAE64] mx-auto flex items-center justify-center ring-8 ring-[#1FAE64]/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#1FAE64]/10 text-[#1FAE64] text-xs font-black uppercase mb-2">
                  Payment Successful
                </span>
                <h2 className="text-2xl font-black text-[#1E1E2E]">Enrollment Confirmed! 🎉</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  You now have active access to <strong className="text-slate-800">{course?.title}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 font-medium space-y-1">
                <div>Receipt ID: <strong className="font-mono text-slate-800">{successOrder.receiptId}</strong></div>
                <div>Amount Paid: <strong className="text-[#1FAE64] font-black">${priceToPay}</strong></div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  to={`/receipt/${successOrder._id}`}
                  className="btn-visual border border-slate-200 text-slate-700 w-full text-xs font-bold"
                >
                  <Receipt className="w-4 h-4" /> Download Receipt
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
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-xs font-bold mb-2">
              <Lock className="w-4 h-4" /> 256-Bit Encrypted Checkout
            </div>
            <h1 className="text-2xl font-black text-[#1E1E2E]">Select Payment Gateway</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Choose your preferred payment method.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Visual Gateway Selection Cards */}
          <div className="space-y-4">
            {/* Razorpay Card Tile */}
            <div
              onClick={() => setSelectedGateway('razorpay')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedGateway === 'razorpay'
                  ? 'border-[#3730E0] bg-[#3730E0]/5 shadow-md'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#3730E0] text-white font-black text-xs flex items-center justify-center shadow-md">
                  RZP
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1E1E2E] flex items-center gap-2">
                    Razorpay <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF7A33]/10 text-[#FF7A33]">UPI / Netbanking</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">UPI, Google Pay, PhonePe, Cards & Netbanking</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'razorpay' ? 'border-[#3730E0] bg-[#3730E0]' : 'border-slate-300'}`}>
                {selectedGateway === 'razorpay' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </div>

            {/* Stripe Card Tile */}
            <div
              onClick={() => setSelectedGateway('stripe')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedGateway === 'stripe'
                  ? 'border-[#3730E0] bg-[#3730E0]/5 shadow-md'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF7A33] text-white font-black text-xs flex items-center justify-center shadow-md">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#1E1E2E] flex items-center gap-2">
                    Stripe Cards <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3730E0]/10 text-[#3730E0]">International</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">Visa, Mastercard, AMEX & International Credit Cards</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedGateway === 'stripe' ? 'border-[#3730E0] bg-[#3730E0]' : 'border-slate-300'}`}>
                {selectedGateway === 'stripe' && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="btn-visual btn-primary w-full text-sm font-black shadow-lg shadow-[#3730E0]/30 py-3.5 mt-4"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Order...
              </span>
            ) : (
              <>
                <span>Complete Payment (${priceToPay})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-5 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 space-y-4">
          <h3 className="font-black text-lg text-[#1E1E2E]">Order Summary</h3>

          {course && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                />
                <div>
                  <div className="text-xs font-extrabold text-[#1E1E2E] line-clamp-2">{course.title}</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">
                    {course.type === 'live' ? 'Live Class' : 'Recorded Course'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Course Price</span>
                  <span>${course.price}</span>
                </div>
                {course.discountPrice && (
                  <div className="flex justify-between text-[#1FAE64]">
                    <span>Special Discount</span>
                    <span>-${course.price - course.discountPrice}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-[#1E1E2E]">
                  <span>Total Amount</span>
                  <span className="text-[#3730E0]">${priceToPay}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
