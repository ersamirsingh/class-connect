import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download, CheckCircle2, BookOpen, ExternalLink, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { enrollmentApi } from '../../api/models/enrollment.api';

export function CertificatesListPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await enrollmentApi.getMyEnrollments();
        const enrollments = Array.isArray(res?.data)
          ? res.data
          : (res?.data?.enrollments || (Array.isArray(res) ? res : []));
        
        // Filter completed or 100% progress enrollments
        const completed = enrollments.filter(e => e.isCompleted || e.progressPercentage >= 100);
        setCertificates(completed);
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 sm:p-10 text-[var(--ink)] space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#5B54E8] to-[#06B6D4] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider mb-3">
            <Award className="w-4 h-4 text-[#FF7A59]" /> Verified Credentials
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Your Course Certificates</h1>
          <p className="text-sm text-white/80 mt-1 font-medium max-w-xl">
            Official ISO-certified credentials earned for mastering skills and completing production projects.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-3xl font-black">{certificates.length}</div>
          <div className="text-xs font-bold text-white/80">Certificates Earned</div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-[var(--surface-raised)] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-[var(--ink)]">No Certificates Yet</h3>
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
            Complete all lectures and quizzes in your enrolled courses to unlock official verified certificates.
          </p>
          <Link
            to="/courses"
            className="btn-visual btn-primary inline-flex items-center gap-2 text-xs px-6 py-3"
          >
            <BookOpen className="w-4 h-4" /> Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => {
            const course = cert.course || {};
            return (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Certificate Mock Header Preview */}
                  <div className="h-36 rounded-2xl bg-gradient-to-br from-[#5B54E8]/10 via-[#06B6D4]/10 to-[#2FA876]/10 border border-[#5B54E8]/20 p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-wider">ClassConnect Credential</span>
                      <CheckCircle2 className="w-4 h-4 text-[#2FA876]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[var(--ink)] line-clamp-1">{course.title}</h4>
                      <p className="text-[10px] text-[var(--ink-muted)] font-semibold">Awarded to {user?.name}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ink-muted)]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Earned on {new Date(cert.updatedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <Link
                    to={`/certificate/${course._id || cert.course}`}
                    className="text-xs font-extrabold text-[var(--primary)] hover:underline flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View Certificate
                  </Link>

                  <Link
                    to={`/certificate/${course._id || cert.course}`}
                    className="p-2.5 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                    title="Download Certificate"
                  >
                    <Download className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
