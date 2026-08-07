import React, { useState } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Building2, 
  Award, 
  CheckCircle2, 
  RotateCw,
  Quote,
} from 'lucide-react';
import { NumberTicker } from '../motion/NumberTicker';

export const StudentSuccessShowcase = () => {
  const [activeTab, setActiveTab] = useState('all');

  const studentSuccessData = [
    {
      id: 's1',
      name: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      previousRole: 'Junior Support Tech',
      newRole: 'Senior Full-Stack Engineer',
      company: 'Razorpay',
      companyLogo: '⚡',
      package: '₹22 LPA',
      hike: '210% Hike',
      track: 'Full-Stack Systems Architecture',
      quote: 'ClassConnect changed my life. Building microservices from scratch during the track helped me answer every deep system design question in my Razorpay interview.',
      category: 'fullstack',
    },
    {
      id: 's2',
      name: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      previousRole: 'Graphic Designer',
      newRole: 'Lead UI/UX Architect',
      company: 'CRED',
      companyLogo: '💳',
      package: '₹18.5 LPA',
      hike: '180% Hike',
      track: 'UI/UX Design Masterclass',
      quote: 'The design token and micro-interaction modules gave me a portfolio that instantly stood out. I went from freelance projects to leading design at CRED.',
      category: 'design',
    },
    {
      id: 's3',
      name: 'Rohan Verma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      previousRole: 'Data Entry Analyst',
      newRole: 'AI Systems Engineer',
      company: 'Swiggy',
      companyLogo: '🟠',
      package: '₹24 LPA',
      hike: '3.2x Jump',
      track: 'AI Engineering & LLM Integration',
      quote: 'Building RAG pipelines and vector search modules gave me hands-on proof of skill. The mentors were always available to unblock code issues.',
      category: 'ai',
    },
    {
      id: 's4',
      name: 'Sneha Gupta',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      previousRole: 'QA Tester',
      newRole: 'DevOps & Site Reliability Engineer',
      company: 'Zomato',
      companyLogo: '🔴',
      package: '₹19.2 LPA',
      hike: '195% Hike',
      track: 'Cloud DevOps & Kubernetes',
      quote: 'Deploying Kubernetes clusters and setting up CI/CD automation pipelines gave me direct production experience that hiring managers respected.',
      category: 'devops',
    },
    {
      id: 's5',
      name: 'Vikram Mehta',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      previousRole: 'Frontend Intern',
      newRole: 'React Systems Lead',
      company: 'Microsoft',
      companyLogo: '💻',
      package: '₹28 LPA',
      hike: '3.8x Jump',
      track: 'Full-Stack Systems Architecture',
      quote: 'The state management and web performance optimizations taught in the track are world-class. Verified certificate gave my application priority.',
      category: 'fullstack',
    },
    {
      id: 's6',
      name: 'Ananya Roy',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
      previousRole: 'College Graduate',
      newRole: 'Associate Product Architect',
      company: 'Atlassian',
      companyLogo: '🔹',
      package: '₹21 LPA',
      hike: 'Direct Placement',
      track: 'UI/UX Design Masterclass',
      quote: 'As a fresher, landing a product role at Atlassian felt impossible until I completed ClassConnect tracks. The practical capstone projects were key.',
      category: 'design',
    },
  ];

  const filteredData = activeTab === 'all'
    ? studentSuccessData
    : studentSuccessData.filter(s => s.category === activeTab);

  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
        <div>
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#C1FBD4]/10 text-[#C1FBD4] font-mono text-xs uppercase tracking-widest mb-3">
            INTERACTIVE SUCCESS GALLERY
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-light text-[#F7F7F5]">
            Hover to reveal <span className="text-[#C1FBD4] font-normal">career outcomes.</span>
          </h2>
        </div>
        <p className="font-body text-sm text-[#A1A1AA] max-w-md">
          Frameless graduate showcases. Hover over any student card to inspect full salary hike, track credentials, and testimonial details.
        </p>
      </div>

      {/* Telemetry Stat Cards Grid (Frameless) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="p-6 rounded-3xl bg-[#0B0B0D]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C1FBD4] mb-2">
            <Trophy className="w-4 h-4 text-[#C1FBD4]" />
            <span>PLACEMENT RATE</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-light text-[#F7F7F5] mb-1">
            <NumberTicker value={94.2} decimals={1} suffix="%" />
          </div>
          <p className="font-body text-xs text-[#A1A1AA]">
            Active completers placed within 6 months
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0B0B0D]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C1FBD4] mb-2">
            <TrendingUp className="w-4 h-4 text-[#C1FBD4]" />
            <span>AVG SALARY PACKAGE</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-light text-[#F7F7F5] mb-1">
            ₹<NumberTicker value={18.4} decimals={1} suffix=" LPA" />
          </div>
          <p className="font-body text-xs text-[#A1A1AA]">
            Average package achieved by placed engineering graduates
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0B0B0D]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C1FBD4] mb-2">
            <Building2 className="w-4 h-4 text-[#C1FBD4]" />
            <span>HIRING PARTNERS</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-light text-[#F7F7F5] mb-1">
            <NumberTicker value={120} suffix="+" />
          </div>
          <p className="font-body text-xs text-[#A1A1AA]">
            Top tech companies hiring ClassConnect graduates
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0B0B0D]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C1FBD4] mb-2">
            <Award className="w-4 h-4 text-[#C1FBD4]" />
            <span>AVG SALARY HIKE</span>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-light text-[#F7F7F5] mb-1">
            <NumberTicker value={210} suffix="%" />
          </div>
          <p className="font-body text-xs text-[#A1A1AA]">
            Average salary hike over previous role
          </p>
        </div>
      </div>

      {/* Domain Filter Pills */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 rounded-full font-mono text-xs transition-all ${
            activeTab === 'all'
              ? 'bg-[#C1FBD4] text-black font-semibold'
              : 'bg-[#0B0B0D] text-[#A1A1AA] hover:text-white'
          }`}
        >
          All Domains
        </button>
        <button
          onClick={() => setActiveTab('fullstack')}
          className={`px-5 py-2 rounded-full font-mono text-xs transition-all ${
            activeTab === 'fullstack'
              ? 'bg-[#C1FBD4] text-black font-semibold'
              : 'bg-[#0B0B0D] text-[#A1A1AA] hover:text-white'
          }`}
        >
          Full-Stack
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-5 py-2 rounded-full font-mono text-xs transition-all ${
            activeTab === 'ai'
              ? 'bg-[#C1FBD4] text-black font-semibold'
              : 'bg-[#0B0B0D] text-[#A1A1AA] hover:text-white'
          }`}
        >
          AI & LLMs
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`px-5 py-2 rounded-full font-mono text-xs transition-all ${
            activeTab === 'design'
              ? 'bg-[#C1FBD4] text-black font-semibold'
              : 'bg-[#0B0B0D] text-[#A1A1AA] hover:text-white'
          }`}
        >
          UI/UX Design
        </button>
        <button
          onClick={() => setActiveTab('devops')}
          className={`px-5 py-2 rounded-full font-mono text-xs transition-all ${
            activeTab === 'devops'
              ? 'bg-[#C1FBD4] text-black font-semibold'
              : 'bg-[#0B0B0D] text-[#A1A1AA] hover:text-white'
          }`}
        >
          DevOps & Cloud
        </button>
      </div>

      {/* 3D Flip Frameless Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredData.map((student) => (
          <div
            key={student.id}
            className="group h-[480px] w-full [perspective:1000px] cursor-pointer"
          >
            {/* Inner Flipping Wrapper */}
            <div className="relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              
              {/* FRONT SIDE (Frameless / Borderless) */}
              <div className="absolute inset-0 h-full w-full rounded-3xl overflow-hidden [backface-visibility:hidden]">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95" />

                <div className="absolute top-5 left-5">
                  <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-xs font-mono text-white flex items-center gap-1.5 shadow-lg">
                    <span>{student.companyLogo}</span>
                    <span className="font-semibold">{student.company}</span>
                  </span>
                </div>

                <div className="absolute top-5 right-5">
                  <span className="px-3 py-1.5 rounded-full bg-[#C1FBD4] text-black font-mono text-xs font-semibold shadow-lg">
                    {student.hike}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-light text-white flex items-center gap-1.5">
                      {student.name}
                      <CheckCircle2 className="w-4 h-4 text-[#C1FBD4]" />
                    </h3>
                    <span className="font-display text-xl font-normal text-[#C1FBD4]">
                      {student.package}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-[#A1A1AA]">
                    {student.newRole}
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-1.5 font-mono text-[10px] text-[#A1A1AA]/80 uppercase tracking-widest">
                    <RotateCw className="w-3 h-3 text-[#C1FBD4] animate-spin" style={{ animationDuration: '4s' }} />
                    <span>Hover to flip for full story</span>
                  </div>
                </div>
              </div>

              {/* BACK SIDE (Frameless / Borderless) */}
              <div className="absolute inset-0 h-full w-full rounded-3xl p-7 bg-[#0B0B0D] shadow-2xl flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <div>
                  <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/5">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-display text-lg font-medium text-white flex items-center gap-1.5">
                        {student.name}
                        <CheckCircle2 className="w-4 h-4 text-[#C1FBD4]" />
                      </h4>
                      <span className="font-mono text-xs text-[#C1FBD4]">
                        {student.companyLogo} Hired at {student.company}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141416] space-y-2 mb-6 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#A1A1AA]">
                      <span>Previous:</span>
                      <span className="line-through">{student.previousRole}</span>
                    </div>
                    <div className="flex items-center justify-between text-white font-medium">
                      <span>Placed As:</span>
                      <span className="text-[#C1FBD4]">{student.newRole}</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-white font-bold">{student.package}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                        {student.hike}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[#C1FBD4]">
                      <Quote className="w-4 h-4" />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#A1A1AA]">VERIFIED GRADUATE</span>
                    </div>
                    <p className="font-body text-xs text-[#F7F7F5] leading-relaxed italic">
                      "{student.quote}"
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-[#A1A1AA]">
                  <span>TRACK: {student.track}</span>
                  <span className="text-[#C1FBD4] font-medium">[VERIFIED CREDENTIAL]</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* High-Resolution SVG Hiring Company Logos Strip (Frameless) */}
      <div className="p-10 rounded-3xl bg-[#0B0B0D] text-center space-y-8">
        <span className="font-mono text-xs text-[#A1A1AA] uppercase tracking-widest block">
          OUR GRADUATES ARE EMPLOYED AT
        </span>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center justify-items-center">
          
          {/* 1. Razorpay Logo */}
          <div className="p-4 rounded-2xl bg-[#141416]/60 w-full flex items-center justify-center h-16 hover:bg-[#141416] transition-all">
            <svg className="h-6 w-auto" viewBox="0 0 120 32" fill="none">
              <path d="M18.8 3L4.2 28.5H11.5L18.8 15.5L22.2 21.5L29.5 8.5L18.8 3Z" fill="#0C2340"/>
              <path d="M18.8 3L11.5 15.5L18.8 28.5L29.5 8.5L18.8 3Z" fill="#0066FF"/>
              <text x="35" y="22" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="Manrope, sans-serif">Razorpay</text>
            </svg>
          </div>

          {/* 2. CRED Logo */}
          <div className="p-4 rounded-2xl bg-[#141416]/60 w-full flex items-center justify-center h-16 hover:bg-[#141416] transition-all">
            <svg className="h-6 w-auto" viewBox="0 0 100 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="#FFFFFF" strokeWidth="2.5"/>
              <path d="M10 10H22V22H10Z" stroke="#C1FBD4" strokeWidth="2.5"/>
              <text x="36" y="22" fill="#FFFFFF" fontSize="16" fontWeight="bold" letterSpacing="1.5" fontFamily="Manrope, sans-serif">CRED</text>
            </svg>
          </div>

          {/* 3. Swiggy Logo */}
          <div className="p-4 rounded-2xl bg-[#141416]/60 w-full flex items-center justify-center h-16 hover:bg-[#141416] transition-all">
            <svg className="h-6 w-auto" viewBox="0 0 110 32" fill="none">
              <path d="M14 2C7.37 2 2 7.37 2 14C2 22 14 30 14 30C14 30 26 22 26 14C26 7.37 20.63 2 14 2ZM14 18C11.79 18 10 16.21 10 14C10 11.79 11.79 10 14 10C16.21 10 18 11.79 18 14C18 16.21 16.21 18 14 18Z" fill="#FC8019"/>
              <text x="32" y="22" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="Manrope, sans-serif">SWIGGY</text>
            </svg>
          </div>

          {/* 4. Zomato Logo */}
          <div className="p-4 rounded-2xl bg-[#141416]/60 w-full flex items-center justify-center h-16 hover:bg-[#141416] transition-all">
            <svg className="h-6 w-auto" viewBox="0 0 110 32" fill="none">
              <rect x="2" y="4" width="24" height="24" rx="6" fill="#CB202D"/>
              <text x="8" y="22" fill="#FFFFFF" fontSize="15" fontWeight="900" fontFamily="Manrope, sans-serif">z</text>
              <text x="32" y="22" fill="#E23744" fontSize="18" fontWeight="900" fontStyle="italic" fontFamily="Manrope, sans-serif">zomato</text>
            </svg>
          </div>

          {/* 5. Microsoft Logo */}
          <div className="p-4 rounded-2xl bg-[#141416]/60 w-full flex items-center justify-center h-16 hover:bg-[#141416] transition-all">
            <svg className="h-6 w-auto" viewBox="0 0 130 32" fill="none">
              <rect x="2" y="4" width="10" height="10" fill="#F25022"/>
              <rect x="14" y="4" width="10" height="10" fill="#7FBA00"/>
              <rect x="2" y="16" width="10" height="10" fill="#00A4EF"/>
              <rect x="14" y="16" width="10" height="10" fill="#FFB900"/>
              <text x="32" y="22" fill="#FFFFFF" fontSize="15" fontWeight="600" fontFamily="Manrope, sans-serif">Microsoft</text>
            </svg>
          </div>

          {/* 6. Atlassian Logo */}
          <div className="p-4 rounded-2xl bg-[#141416]/60 w-full flex items-center justify-center h-16 hover:bg-[#141416] transition-all">
            <svg className="h-6 w-auto" viewBox="0 0 125 32" fill="none">
              <path d="M10.5 17.5L16 28L21.5 17.5L16 7L10.5 17.5Z" fill="#0052CC"/>
              <path d="M16 7L6 28H11.5L16 17.5L16 7Z" fill="#2684FF"/>
              <text x="28" y="22" fill="#FFFFFF" fontSize="14" fontWeight="bold" letterSpacing="1" fontFamily="Manrope, sans-serif">ATLASSIAN</text>
            </svg>
          </div>

          {/* 7. Google Logo */}
          <div className="p-4 rounded-2xl bg-[#141416]/60 w-full flex items-center justify-center h-16 hover:bg-[#141416] transition-all">
            <svg className="h-6 w-auto" viewBox="0 0 100 32" fill="none">
              <path fill="#4285F4" d="M16 16c0-.5-.04-1-.12-1.5H8v3h4.5c-.2 1-.7 1.8-1.5 2.4v2h2.4c1.4-1.3 2.2-3.2 2.2-5.9z"/>
              <path fill="#34A853" d="M8 24c2.2 0 4-.7 5.3-2l-2.4-2c-.7.5-1.6.8-2.9.8-2.2 0-4-1.5-4.7-3.5H.8v2.1C2.2 22.2 4.9 24 8 24z"/>
              <path fill="#FBBC05" d="M3.3 17.3c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6V12H.8C.3 13.1 0 14.5 0 16s.3 2.9.8 4l2.5-2.7z"/>
              <path fill="#EA4335" d="M8 11.2c1.2 0 2.3.4 3.1 1.2l2.3-2.3C12 8.7 10.2 8 8 8 4.9 8 2.2 9.8.8 12.6l2.5 1.9C4 12.6 5.8 11.2 8 11.2z"/>
              <text x="22" y="22" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="Manrope, sans-serif">Google</text>
            </svg>
          </div>

          {/* 8. Amazon Logo */}
          <div className="p-4 rounded-2xl bg-[#141416]/60 w-full flex items-center justify-center h-16 hover:bg-[#141416] transition-all">
            <svg className="h-6 w-auto" viewBox="0 0 110 32" fill="none">
              <text x="4" y="20" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="Manrope, sans-serif">amazon</text>
              <path d="M6 24C16 29 28 28 36 22" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M33 21L37 22L35 25" fill="#FF9900"/>
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StudentSuccessShowcase;
