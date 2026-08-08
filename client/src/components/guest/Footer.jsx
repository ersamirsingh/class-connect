import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Globe, Play, MessageCircle, ShieldCheck, FileText, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B132B] text-white border-t border-indigo-900/50">
      <div className="max-w-[var(--max-width)] mx-auto px-6 lg:px-[var(--space-page)] py-8 md:py-10">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8.5 h-8.5 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white font-manrope">
                ClassConnect
              </span>
            </Link>
            <p className="text-xs text-indigo-200/80 max-w-sm leading-relaxed font-normal">
              {t('hero.subtitle', "India's most visual learning platform. Master real-world skills with expert-led courses in Hindi & English.")}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 text-indigo-200 hover:text-white hover:bg-indigo-600 transition-all flex items-center justify-center"
                title="Instagram"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 text-indigo-200 hover:text-white hover:bg-red-600 transition-all flex items-center justify-center"
                title="YouTube"
              >
                <Play className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 text-indigo-200 hover:text-white hover:bg-emerald-600 transition-all flex items-center justify-center"
                title="WhatsApp Support"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-manrope">
              {t('common.explore', 'Explore')}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-indigo-200/80">
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  {t('nav.courses', 'Courses')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  {t('nav.categories', 'Categories')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {t('nav.about', 'About Us')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages Column */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-manrope">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs font-medium text-indigo-200/80">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-manrope">
              {t('footer.support', 'Support')}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-indigo-200/80">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  {t('nav.login', 'Log In')}
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  {t('nav.signup', 'Sign Up')}
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-indigo-900/60 my-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-indigo-300/80 font-medium">
          <p>© {year} ClassConnect. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in India
          </p>
        </div>

      </div>
    </footer>
  );
}
