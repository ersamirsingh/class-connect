import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../app/router/routeRegistry';
import { LogOut, ArrowLeft } from 'lucide-react';

export const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="card w-full max-w-sm bg-base-100/90 backdrop-blur-xl border border-base-300 shadow-2xl rounded-3xl text-center">
        <div className="card-body p-8 items-center space-y-3">
          <div className="p-4 bg-error/10 text-error rounded-full animate-bounce">
            <LogOut className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Logged Out</h2>
          <p className="text-xs text-base-content/60 leading-relaxed">
            You have been safely signed out of Class Connect.
          </p>

          <div className="pt-4 w-full">
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="btn btn-primary w-full shadow-md gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
