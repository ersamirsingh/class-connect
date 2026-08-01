import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle2, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function ContactSupportSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-80px' });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
      className="relative py-24 px-4 sm:px-8 bg-[var(--canvas)] overflow-hidden min-h-[640px] flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Floating 3D Telephone Handset & Coiled Wire (Exact Reference Image Style) */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[380px]">
          
          {/* Floating 3D Vintage Phone Handset in UI Accent Colors */}
          <motion.div
            initial={{ opacity: 0, y: -70, rotate: -15, scale: 0.85 }}
            animate={isInView ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : { opacity: 0, y: -70, rotate: -15, scale: 0.85 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 18,
              delay: 0.2,
            }}
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="relative z-20 cursor-pointer"
          >
            {/* 3D Handset Graphic Body */}
            <div className="w-28 sm:w-36 h-[320px] sm:h-[380px] rounded-[60px] bg-gradient-to-b from-[#FF6B35] via-[#FF5E7E] to-[#E62E5C] p-4 shadow-[0_25px_60px_rgba(255,107,53,0.45)] border-4 border-white/30 flex flex-col justify-between items-center relative overflow-hidden">
              
              {/* Earpiece Spiral Ring */}
              <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-gradient-to-br from-[#FF8C5E] to-[#E62E5C] border-4 border-white/40 shadow-inner flex items-center justify-center">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white/40 animate-ping opacity-75" />
                </div>
              </div>

              {/* Handset Spine Handle */}
              <div className="w-6 sm:w-8 h-24 sm:h-32 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white/90">
                <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-white animate-pulse" />
              </div>

              {/* Mouthpiece Spiral Ring */}
              <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-gradient-to-br from-[#FF8C5E] to-[#E62E5C] border-4 border-white/40 shadow-inner flex items-center justify-center">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white/40" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Contact Support Form (Matching Reference Screenshot) */}
        <div className="lg:col-span-7 bg-[var(--surface)] p-8 sm:p-10 rounded-[32px] border-2 border-[var(--border)] shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-20">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Header */}
            <div className="mb-8 text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-[var(--accent)] mb-2">
                {isHindi ? 'मदद चाहिए?' : 'Need support?'}
              </h2>
              <p className="text-sm sm:text-base text-[var(--ink-muted)] font-medium">
                {isHindi 
                  ? 'यदि आपको आगे की सहायता की आवश्यकता है तो हमसे संपर्क करें।'
                  : 'Contact us if you need further assistance.'}
              </p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800 text-center"
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
                  className="mt-6 px-6 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs"
                >
                  {isHindi ? 'दूसरा संदेश भेजें' : 'Send Another Message'}
                </button>
              </motion.div>
            ) : (
              /* Contact Form Matching Reference Screenshot */
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                {/* Field 1: Name and surname */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                    {isHindi ? 'नाम और उपनाम (Name and surname)' : 'Name and surname'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[var(--ink-faint)] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isHindi ? 'समीर सिंह' : 'Samir Singh'}
                      className="w-full min-h-[50px] pl-11 pr-4 py-3 rounded-2xl bg-orange-500/5 dark:bg-slate-900 border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-medium text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Field 2: Email */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                    {isHindi ? 'ईमेल (Email)' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--ink-faint)] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={isHindi ? 'name@example.com' : 'samir@example.com'}
                      className="w-full min-h-[50px] pl-11 pr-4 py-3 rounded-2xl bg-orange-500/5 dark:bg-slate-900 border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-medium text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Field 3: Details of request */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                    {isHindi ? 'अनुरोध का विवरण (Details of your request)' : 'Please enter the details of your request.'}
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-[var(--ink-faint)] absolute left-4 top-4" />
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={isHindi ? 'अपना संदेश यहाँ लिखें...' : 'How can our support team help you today?'}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-orange-500/5 dark:bg-slate-900 border border-[var(--border)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-medium text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button (Matching Reference Screenshot) */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-9 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#E62E5C] text-white font-extrabold text-sm tracking-wider uppercase shadow-[0_12px_28px_rgba(255,107,53,0.4)] hover:shadow-[0_16px_36px_rgba(255,107,53,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 min-h-[48px] cursor-pointer flex items-center gap-2"
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

      {/* Animated Spiral Coiled Telephone Wire along Section Bottom (Exact Reference Style) */}
      <div className="absolute bottom-0 inset-x-0 w-full h-16 pointer-events-none z-10 overflow-hidden">
        <svg 
          className="w-full h-full"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="telephoneWireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="50%" stopColor="#FF5E7E" />
              <stop offset="100%" stopColor="#E62E5C" />
            </linearGradient>
          </defs>

          <motion.path
            d="M 0,30 Q 15,10 30,30 T 60,30 T 90,30 T 120,30 T 150,30 T 180,30 T 210,30 T 240,30 T 270,30 T 300,30 T 330,30 T 360,30 T 390,30 T 420,30 T 450,30 T 480,30 T 510,30 T 540,30 T 570,30 T 600,30 T 630,30 T 660,30 T 690,30 T 720,30 T 750,30 T 780,30 T 810,30 T 840,30 T 870,30 T 900,30 T 930,30 T 960,30 T 990,30 T 1020,30 T 1050,30 T 1080,30 T 1110,30 T 1140,30 T 1170,30 L 1200,30"
            stroke="url(#telephoneWireGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </div>
    </section>
  );
}

export default ContactSupportSection;
