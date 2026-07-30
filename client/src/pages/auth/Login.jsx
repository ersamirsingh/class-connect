import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../app/router/routeRegistry';
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login({ email, name: email.split('@')[0] });
      navigate(ROUTES.HOME);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@classconnect.io');
    setPassword('demo1234');
    login({ email: 'demo@classconnect.io', name: 'Demo User' });
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="relative w-full max-w-md">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="card bg-base-100/90 backdrop-blur-xl border border-base-300 shadow-2xl rounded-3xl">
          <div className="card-body p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-1">
                <LogIn className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Welcome Back</h2>
              <p className="text-xs text-base-content/60">
                Sign in to manage your Class Connect dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control space-y-1">
                <label className="label py-1">
                  <span className="label-text font-medium text-xs">Email Address</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-base-content/40" />
                  <input
                    type="email"
                    placeholder="user@example.com"
                    className="input input-bordered w-full pl-10 text-sm focus:input-primary transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-control space-y-1">
                <label className="label py-1">
                  <span className="label-text font-medium text-xs">Password</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-base-content/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-10 text-sm focus:input-primary transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-base-content/40 hover:text-base-content"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full shadow-lg shadow-primary/25 mt-2">
                Sign In
              </button>
            </form>

            <div className="divider text-xs text-base-content/40 uppercase tracking-widest my-2">Or</div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn btn-outline btn-block border-base-300 hover:bg-base-200 text-xs font-semibold gap-2"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Fill Demo Credentials & Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
