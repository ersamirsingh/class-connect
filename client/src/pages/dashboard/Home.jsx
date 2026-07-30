import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, Database, Zap } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card backdrop-blur-2xl bg-base-100/40 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 text-center relative overflow-hidden transition-all hover:scale-[1.01]">
        {/* Accent top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Class Connect</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Hello, <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">{user ? (user.name || user.email) : 'Team'}!</span> 👋
          </h1>

          <p className="text-base-content/70 text-base md:text-lg max-w-md mx-auto leading-relaxed font-light">
            Welcome to your simple & clean modular fullstack environment.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <div className="badge badge-lg gap-2 py-3.5 px-4 bg-base-100/60 backdrop-blur-md border border-base-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <Database className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium">MongoDB Ready</span>
            </div>
            <div className="badge badge-lg gap-2 py-3.5 px-4 bg-base-100/60 backdrop-blur-md border border-base-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <Zap className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium">Redis Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
