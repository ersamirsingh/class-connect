import React from 'react';
import { useLocation } from 'react-router-dom';
import { Topbar } from '../components/ui/Topbar';
import { Sidebar } from '../components/ui/Sidebar';
import { ROUTES } from '../app/router/routeRegistry';

export const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === ROUTES.HOME;

  return (
    <div className="relative min-h-screen flex flex-col bg-base-200 overflow-hidden font-sans">
      {/* Background Glass Glow Orbs */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/3 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <Topbar />

      <div className="flex flex-1 relative z-10">
        {!isHomePage && <Sidebar />}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto flex items-center justify-center min-h-[calc(100vh-65px)]">
          {children}
        </main>
      </div>
    </div>
  );
};
