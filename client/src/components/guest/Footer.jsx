import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#1E1E2E] text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#3730E0] flex items-center justify-center text-white font-black text-xl shadow-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-white">
              Class<span className="text-[#FF7A33]">Connect</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 max-w-sm font-medium">
            Visual-first ed-tech platform built for intuitive learning, live interactive sessions, and skill mastery.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold text-[#1FAE64]">
            <ShieldCheck className="w-4 h-4" /> 100% Certified Learning
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF7A33] mb-3">Explore</h4>
          <ul className="space-y-2 text-xs font-medium text-slate-300">
            <li><Link to="/courses" className="hover:text-white transition-colors">All Courses</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/signup" className="hover:text-white transition-colors">Join as Student</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#3730E0] mb-3">Popular Topics</h4>
          <ul className="space-y-2 text-xs font-medium text-slate-300">
            <li><span className="hover:text-white cursor-pointer">Web Development</span></li>
            <li><span className="hover:text-white cursor-pointer">UI/UX Design</span></li>
            <li><span className="hover:text-white cursor-pointer">Data Science</span></li>
            <li><span className="hover:text-white cursor-pointer">Mobile Apps</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
        <div>&copy; {new Date().getFullYear()} ClassConnect. Visual Learning Hub.</div>
        <div className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-[#EF4444] fill-[#EF4444]" /> for visual learners everywhere.
        </div>
      </div>
    </footer>
  );
};
