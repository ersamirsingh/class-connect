import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Send, Mail, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Header Section */}
        <div className="bg-gradient-to-r from-[#5B51D8] to-[#3B82F6] rounded-3xl p-8 sm:p-10 mb-12 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-2">
              Stay Informed
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Subscribe to ClassConnect Digest</h3>
            <p className="text-xs text-white/80 mt-1 font-medium">Get weekly tech roadmaps, free masterclasses, and course discount alerts.</p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2">
            {subscribed ? (
              <div className="bg-white/20 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Subscribed Successfully!
              </div>
            ) : (
              <>
                <div className="relative w-full sm:w-72">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
                  />
                  <Mail className="w-4 h-4 text-white/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#FF6B00] hover:bg-[#E56000] text-white text-xs font-bold rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </form>
        </div>

        {/* Multi-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#5B51D8] flex items-center justify-center text-white font-black text-xl shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-black text-2xl text-white tracking-tight">
                Class<span className="text-[#FF6B00]">Connect</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm font-medium leading-relaxed">
              India's premier visual-first tech education platform powering career acceleration through live masterclasses, doubt-solving mentorship, and real-world industrial projects.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-[#10B981]">
              <ShieldCheck className="w-4 h-4" /> ISO 9001:2026 Certified EdTech
            </div>
          </div>

          {/* Courses Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] mb-4">Popular Programs</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-400">
              <li><Link to="/courses?cat=web-dev" className="hover:text-white transition-colors">Full Stack Web Dev</Link></li>
              <li><Link to="/courses?cat=data-science" className="hover:text-white transition-colors">Data Science & Analytics</Link></li>
              <li><Link to="/courses?cat=ai-ml" className="hover:text-white transition-colors">AI & Machine Learning</Link></li>
              <li><Link to="/courses?cat=cyber" className="hover:text-white transition-colors">Cyber Security Masterclass</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors font-bold text-[#5B51D8]">Browse All Courses →</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B51D8] mb-4">Company & Support</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About ClassConnect</Link></li>
              <li><Link to="/report-problem" className="hover:text-white transition-colors">Report a Problem</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Create Free Account</Link></li>
            </ul>
          </div>

          {/* Community Socials */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-4">Community</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>Discord Community</span></a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>YouTube Channel</span></a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>LinkedIn Updates</span></a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>GitHub Organization</span></a></li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimers & Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-medium gap-4">
          <div>&copy; {new Date().getFullYear()} ClassConnect Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Refund Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
