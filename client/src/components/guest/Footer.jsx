import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Globe, Play, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)]">
      <div className="page-container py-12 md:py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center
                shadow-[var(--shadow-primary)] group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[var(--ink)]"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
                ClassConnect
              </span>
            </Link>
            <p className="text-sm text-[var(--ink-muted)] max-w-xs leading-relaxed mb-6">
              {t('hero.subtitle', 'India\'s most visual learning platform. Master real-world skills with expert-led courses.')}
            </p>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[var(--canvas)] flex items-center justify-center
                  text-[var(--ink-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)]
                  transition-all duration-200">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[var(--canvas)] flex items-center justify-center
                  text-[var(--ink-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)]
                  transition-all duration-200">
                <Play className="w-4 h-4" />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[var(--canvas)] flex items-center justify-center
                  text-[var(--ink-muted)] hover:text-[var(--success)] hover:bg-[var(--success-soft)]
                  transition-all duration-200">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-[var(--ink)] mb-4 uppercase tracking-wider">
              {t('common.explore', 'Explore')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/courses" className="text-sm text-[var(--ink-muted)] hover:text-[var(--primary)] transition-colors">
                  {t('nav.courses')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-[var(--ink-muted)] hover:text-[var(--primary)] transition-colors">
                  {t('nav.categories')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-[var(--ink-muted)] hover:text-[var(--primary)] transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-[var(--ink)] mb-4 uppercase tracking-wider">
              {t('footer.support', 'Support')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/login" className="text-sm text-[var(--ink-muted)] hover:text-[var(--primary)] transition-colors">
                  {t('nav.login')}
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-[var(--ink-muted)] hover:text-[var(--primary)] transition-colors">
                  {t('nav.signup')}
                </Link>
              </li>
              <li>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[var(--ink-muted)] hover:text-[var(--primary)] transition-colors">
                  {t('cta.whatsapp', 'Chat on WhatsApp')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border)] my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--ink-faint)]">
            © {year} ClassConnect. All rights reserved.
          </p>
          <p className="text-xs text-[var(--ink-faint)] flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[var(--accent)] fill-[var(--accent)]" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
