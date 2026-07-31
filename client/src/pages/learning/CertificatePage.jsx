import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useParams } from 'react-router-dom';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { Download, Share2, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export function CertificatePage() {
  const { courseId } = useParams();
  const { t } = useLanguage();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCert() {
      try {
        const res = await enrollmentApi.getCertificate(courseId);
        setCertificate(res?.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCert();
  }, [courseId]);

  if (loading) return <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)]">Loading...</div>;

  if (!certificate) return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col items-center justify-center p-6">
      <Award className="w-16 h-16 text-[var(--ink-muted)] mb-4" />
      <h2 className="text-xl font-bold mb-2">Certificate Not Available</h2>
      <p className="text-[var(--ink-muted)] text-center">You may need to complete the course first.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-['Manrope'] text-[var(--ink)]">Your Certificate</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 min-h-[44px] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-pill)] flex items-center gap-2 hover:bg-[var(--canvas)] transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="px-4 py-2 min-h-[44px] bg-[var(--primary)] text-white rounded-[var(--radius-pill)] flex items-center gap-2 hover:bg-[var(--deep-anchor)] transition-colors">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl aspect-[1.414/1] bg-[var(--surface)] p-12 shadow-[var(--shadow-card)] border-8 border-[var(--primary)] rounded-lg relative overflow-hidden flex flex-col items-center justify-center text-center"
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--aura-peach)] rounded-br-full opacity-50" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--aura-blue)] rounded-tl-full opacity-50" />
        
        <Award className="w-20 h-20 text-[var(--energy-accent)] mb-6 z-10" />
        <h2 className="text-4xl font-black font-['Manrope'] tracking-widest text-[var(--deep-anchor)] uppercase mb-2 z-10">Certificate of Completion</h2>
        <p className="text-lg text-[var(--ink-muted)] mb-8 z-10">This is to certify that</p>
        <h3 className="text-5xl font-serif text-[var(--primary)] mb-8 z-10 border-b-2 border-[var(--border)] pb-2 px-10">{certificate.studentName}</h3>
        <p className="text-lg text-[var(--ink-muted)] mb-4 z-10">has successfully completed the course</p>
        <h4 className="text-3xl font-bold font-['Manrope'] text-[var(--ink)] mb-12 z-10">{certificate.courseTitle}</h4>
        
        <div className="flex justify-between w-full max-w-2xl mt-auto z-10 pt-8 border-t border-[var(--border)]">
          <div className="text-left">
            <p className="font-bold text-[var(--ink)]">{new Date(certificate.date).toLocaleDateString()}</p>
            <p className="text-sm text-[var(--ink-muted)] uppercase tracking-wider">Date</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-[var(--ink)] signature-font italic text-xl">Luminous OS</p>
            <p className="text-sm text-[var(--ink-muted)] uppercase tracking-wider">Instructor</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
