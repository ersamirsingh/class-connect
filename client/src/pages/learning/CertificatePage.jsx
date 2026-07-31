import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { Award, Printer, ShieldCheck, GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';

export const CertificatePage = () => {
  const { courseId } = useParams();

  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCert = async () => {
      try {
        setLoading(true);
        const res = await enrollmentApi.getCertificate(courseId);
        if (res.success && res.data) {
          setCertData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Certificate not available yet.');
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC]">
        <Loader2 className="w-10 h-10 text-[#3730E0] animate-spin mb-3" />
        <span className="text-xs font-bold text-slate-500">Generating certificate...</span>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC] p-4 text-center">
        <Award className="w-16 h-16 text-[#F5A623] mb-4" />
        <h2 className="text-2xl font-black text-[#1E1E2E]">Certificate Locked</h2>
        <p className="text-xs text-slate-500 font-medium max-w-sm mt-1 mb-6">
          {error || 'Complete all course lectures to unlock your official certificate.'}
        </p>
        <Link to={`/learning/${courseId}`} className="btn-visual btn-primary text-xs">
          Return to Classroom
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-4 sm:p-8 flex flex-col items-center justify-center space-y-6">
      {/* Top Actions */}
      <div className="max-w-4xl w-full flex justify-between items-center">
        <Link to="/dashboard" className="text-xs font-bold text-[#3730E0] flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-visual btn-primary text-xs font-extrabold shadow-md"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Certificate Print Paper Frame */}
      <div className="max-w-4xl w-full bg-white p-8 sm:p-14 rounded-3xl shadow-2xl border-8 border-[#3730E0] text-center space-y-8 relative overflow-hidden">
        {/* Decorative Gold Ribbon Badge */}
        <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-gradient-to-br from-[#F5A623] to-[#FF7A33] text-white flex flex-col items-center justify-center shadow-xl">
          <Award className="w-8 h-8" />
          <span className="text-[9px] font-black uppercase tracking-widest mt-0.5">Verified</span>
        </div>

        {/* Brand Header */}
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#3730E0] flex items-center justify-center text-white font-black text-2xl shadow-lg">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-3xl text-[#1E1E2E]">
            Class<span className="text-[#FF7A33]">Connect</span>
          </span>
        </div>

        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[#3730E0]">Certificate of Completion</div>
          <p className="text-xs text-slate-500 font-medium mt-1">This is to proudly certify that</p>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1E1E2E] my-4 decoration-[#FF7A33] underline">
            {certData.studentName}
          </h1>
          <p className="text-xs text-slate-600 font-medium max-w-lg mx-auto leading-relaxed">
            has successfully completed all required visual modules, projects, and practical assessments for
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3730E0] mt-3">
            {certData.courseTitle}
          </h2>
        </div>

        {/* Footer Signatures */}
        <div className="pt-10 border-t border-slate-200 grid grid-cols-2 gap-8 max-w-2xl mx-auto items-end">
          <div>
            <div className="font-serif italic text-lg text-slate-800">{certData.instructorName}</div>
            <div className="text-xs font-bold text-slate-400 uppercase mt-1">Course Instructor</div>
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-slate-700">{certData.certificateId}</div>
            <div className="text-xs font-bold text-slate-400 uppercase mt-1">
              Issued {new Date(certData.issuedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
