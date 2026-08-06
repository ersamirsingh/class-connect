import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Globe, Play, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#050505] border-t border-white/10 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-redline-glow opacity-40 blur-[100px] -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-9 h-9 rounded-full bg-[#FF2A2A] flex items-center justify-center shadow-[0_0_20px_rgba(255,42,42,0.5)] group-hover:scale-105 transition-transform">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-display text-xl font-medium tracking-tight text-[#F7F7F5]">
                ClassConnect <span className="text-[#FF2A2A]">Redline</span>
              </span>
            </Link>
            <p className="font-body text-sm text-[#A8A8AE] max-w-xs leading-relaxed mb-6">
              {t('hero.subtitle', 'A bold, cinematic learning system. Master real-world engineering skills with industry-proven tracks.')}
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0B0B0D] border border-white/10 flex items-center justify-center text-[#A8A8AE] hover:text-[#FF2A2A] hover:border-[#FF2A2A]/40 transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0B0B0D] border border-white/10 flex items-center justify-center text-[#A8A8AE] hover:text-[#FF2A2A] hover:border-[#FF2A2A]/40 transition-all duration-200"
              >
                <Play className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#0B0B0D] border border-white/10 flex items-center justify-center text-[#A8A8AE] hover:text-[#FF2A2A] hover:border-[#FF2A2A]/40 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-[#F7F7F5] mb-4 uppercase tracking-widest">
              {t('common.explore', 'Explore')}
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link to="/courses" className="text-[#A8A8AE] hover:text-[#FF2A2A] transition-colors">
                  {t('nav.courses')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-[#A8A8AE] hover:text-[#FF2A2A] transition-colors">
                  {t('nav.categories')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#A8A8AE] hover:text-[#FF2A2A] transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-[#F7F7F5] mb-4 uppercase tracking-widest">
              {t('footer.legal', 'Legal')}
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link to="/privacy-policy" className="text-[#A8A8AE] hover:text-[#FF2A2A] transition-colors">
                  {t('legal.privacy_title', 'Privacy Policy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#A8A8AE] hover:text-[#FF2A2A] transition-colors">
                  {t('legal.terms_title', 'Terms & Conditions')}
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-[#A8A8AE] hover:text-[#FF2A2A] transition-colors">
                  {t('legal.refund_title', 'Cancellation & Refund')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-[#F7F7F5] mb-4 uppercase tracking-widest">
              {t('footer.support', 'Support')}
            </h4>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link to="/login" className="text-[#A8A8AE] hover:text-[#FF2A2A] transition-colors">
                  {t('nav.login')}
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-[#A8A8AE] hover:text-[#FF2A2A] transition-colors">
                  {t('nav.signup')}
                </Link>
              </li>
              <li>
                <Link to="/report-problem" className="text-[#A8A8AE] hover:text-[#FF2A2A] transition-colors">
                  {t('footer.report', 'Report Problem')}
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FF4D3D] hover:text-[#FF2A2A] font-mono text-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {t('cta.whatsapp', 'Chat on WhatsApp')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#66666E]">
          <p>© {year} ClassConnect Redline Learning System. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-[#FF2A2A] fill-[#FF2A2A]" /> for high-momentum learners
          </p>
        </div>
      </div>
    </footer>
  );
}
