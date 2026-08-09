import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle2, User, Mail, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { contentApi } from '../../api/models/content.api';

export function ContactSupportSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-80px' });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactCms, setContactCms] = useState(null);

  useEffect(() => {
    const fetchContactCms = async () => {
      try {
        const res = await contentApi.getPublicContent('contact');
        const blocks = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        const contactBlock = blocks.find(b => b.section === 'support-info');
        if (contactBlock) setContactCms(contactBlock);
      } catch (err) {
        console.warn('Failed to load contact CMS block:', err);
      }
    };
    fetchContactCms();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className="relative py-24 px-4 sm:px-8 bg-slate-50/60 dark:bg-[var(--canvas)] overflow-hidden min-h-[660px] flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Realistic 3D Telephone Handset physically connected to curly wire */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[420px]">
          
          {/* Scroll-Triggered Animated 3D Realistic Handset */}
          <motion.div
            initial={{ opacity: 0, y: -60, rotate: -10, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : { opacity: 0, y: -60, rotate: -10, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 20,
              delay: 0.2,
            }}
            whileHover={{ scale: 1.04, rotate: 2 }}
            className="relative z-20 cursor-pointer flex flex-col items-center"
          >
            {/* Ultra-realistic 3D Handset Graphic Body */}
            <div className="relative w-32 sm:w-36 h-[340px] sm:h-[390px] rounded-[55px] bg-gradient-to-b from-[#FF4D4D] via-[#FF334B] to-[#E60026] p-3.5 shadow-[0_30px_70px_rgba(230,0,38,0.45)] border-2 border-white/40 flex flex-col justify-between items-center overflow-hidden">
              
              {/* Glossy Reflection Overlay */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 via-white/10 to-transparent pointer-events-none rounded-t-[55px]" />
              <div className="absolute left-2 top-6 w-2.5 h-48 bg-white/30 rounded-full blur-[1px] pointer-events-none" />

              {/* Earpiece Concentric Spiral Cup */}
              <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gradient-to-br from-[#FF6666] via-[#FF334B] to-[#CC0020] border-4 border-white/50 shadow-[inset_0_4px_12px_rgba(0,0,0,0.35)] flex items-center justify-center relative z-10">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#B3001B] border-2 border-white/30 flex items-center justify-center shadow-inner">
                  {/* Concentric Mic Grille Rings */}
                  <div className="w-11 sm:w-14 h-11 sm:h-14 rounded-full border-2 border-red-400/40 flex items-center justify-center">
                    <div className="w-7 sm:w-9 h-7 sm:h-9 rounded-full border-2 border-red-400/50 flex items-center justify-center">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-red-950/80 shadow-inner" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Curved Slim Handset Grip Spine */}
              <div className="w-7 sm:w-8 h-24 sm:h-32 rounded-full bg-gradient-to-r from-[#FF4D4D] to-[#D90021] border border-white/30 shadow-inner flex items-center justify-center relative z-10">
                <div className="w-1.5 h-16 bg-white/25 rounded-full" />
              </div>

              {/* Mouthpiece Concentric Spiral Cup */}
              <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gradient-to-br from-[#FF6666] via-[#FF334B] to-[#CC0020] border-4 border-white/50 shadow-[inset_0_4px_12px_rgba(0,0,0,0.35)] flex items-center justify-center relative z-10">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#B3001B] border-2 border-white/30 flex items-center justify-center shadow-inner">
                  <div className="w-11 sm:w-14 h-11 sm:h-14 rounded-full border-2 border-red-400/40 flex items-center justify-center">
                    <div className="w-7 sm:w-9 h-7 sm:h-9 rounded-full border-2 border-red-400/50 flex items-center justify-center">
                      <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-red-950/80 shadow-inner" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Handset Cable Anchor Plug (Physically Connecting Handset to Wire!) */}
            <div className="w-5 h-6 bg-[#B3001B] rounded-b-md border-x border-b border-white/40 shadow-md -mt-1 relative z-10" />
          </motion.div>
        </div>

        {/* Right Column: Support Form with CRISP PURE WHITE Input Fill Boxes */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 sm:p-11 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-20">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Header */}
            <div className="mb-8 text-left">
              <h2 className="text-3xl sm:text-4xl font-black font-manrope text-[#FF334B] mb-2 tracking-tight">
                {isHindi ? 'मदद चाहिए?' : 'Need support?'}
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
                {isHindi 
                  ? 'यदि आपको आगे की सहायता की आवश्यकता है तो हमसे संपर्क करें।'
                  : 'Contact us if you need further assistance.'}
              </p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {isHindi ? 'संदेश प्राप्त हुआ!' : 'Request Received!'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {isHindi
                    ? 'धन्यवाद! हमारी सपोर्ट टीम 2 घंटे के भीतर आपसे संपर्क करेगी।'
                    : 'Thank you! Our support team will reach out to you within 2 hours.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  {isHindi ? 'दूसरा संदेश भेजें' : 'Send Another Message'}
                </button>
              </motion.div>
            ) : (
              /* Support Form with Pure Crisp White Inputs & High Contrast Dark Text */
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                {/* Field 1: Name and surname */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {isHindi ? 'नाम और उपनाम (Name and surname)' : 'Name and surname'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isHindi ? 'समीर सिंह' : 'Samir Singh'}
                      className="w-full min-h-[50px] pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF334B] font-medium text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Field 2: Email */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {isHindi ? 'ईमेल (Email)' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={isHindi ? 'name@example.com' : 'samir@example.com'}
                      className="w-full min-h-[50px] pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF334B] font-medium text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Field 3: Details of request */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {isHindi ? 'अनुरोध का विवरण (Details of your request)' : 'Please enter the details of your request.'}
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isHindi ? 'अपना संदेश यहाँ लिखें...' : 'How can our support team help you today?'}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF334B] font-medium text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button (Matching Reference Screenshot) */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-3.5 rounded-2xl bg-[#FF334B] text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_12px_28px_rgba(255,51,75,0.4)] hover:shadow-[0_16px_36px_rgba(255,51,75,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 min-h-[48px] cursor-pointer flex items-center gap-2"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>{isHindi ? 'सबमिट करें' : 'SUBMIT'}</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Realistic Coiled Spring Telephone Cable PHYSICALLY CONNECTED to Handset Plug! */}
      <div className="absolute bottom-0 inset-x-0 w-full h-24 pointer-events-none z-10 overflow-hidden">
        <svg 
          className="w-full h-full"
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="realisticWireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E60026" />
              <stop offset="50%" stopColor="#FF334B" />
              <stop offset="100%" stopColor="#FF4D4D" />
            </linearGradient>
          </defs>

          {/* Continuous Curly Spring Cable starting from telephone handset plug */}
          <motion.path
            d="M 215,0 C 215,20 180,50 200,65 C 220,80 240,40 260,65 C 280,85 300,45 320,65 C 340,85 360,45 380,65 T 440,65 T 500,65 T 560,65 T 620,65 T 680,65 T 740,65 T 800,65 T 860,65 T 920,65 T 980,65 T 1040,65 T 1100,65 T 1160,65 L 1200,65"
            stroke="url(#realisticWireGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </div>
    </section>
  );
}

export default ContactSupportSection;
