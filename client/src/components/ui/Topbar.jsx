import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useResolvedTheme } from '../../hooks/useResolvedTheme';
import { ROUTES } from '../../app/router/routeRegistry';
import { Sun, Moon, LogIn, LogOut, User, GraduationCap } from 'lucide-react';

export const Topbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useResolvedTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-base-100/80 border-b border-base-300/60 px-4 md:px-8 py-2 transition-all">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="p-2 bg-gradient-to-tr from-primary to-accent rounded-xl text-primary-content shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-base-content to-base-content/80 bg-clip-text">
            Class<span className="text-primary">Connect</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle btn-sm hover:bg-base-200"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-warning" />
            ) : (
              <Moon className="w-4 h-4 text-base-content/80" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-base-200 border border-base-300 text-xs font-medium">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>{user.name || user.email}</span>
              </div>
              <Link to={ROUTES.LOGOUT} className="btn btn-sm btn-ghost text-error hover:bg-error/10 gap-1.5">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Link>
            </div>
          ) : (
            <Link to={ROUTES.LOGIN} className="btn btn-sm btn-primary gap-1.5 shadow-sm">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
