import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../app/router/routeRegistry';
import { Home, LogIn, LogOut, LayoutDashboard } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: ROUTES.HOME, icon: Home },
    { label: 'Login', path: ROUTES.LOGIN, icon: LogIn },
    { label: 'Logout', path: ROUTES.LOGOUT, icon: LogOut },
  ];

  return (
    <aside className="w-60 bg-base-100/50 backdrop-blur-md border-r border-base-300/60 hidden md:block min-h-[calc(100vh-61px)] p-4">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-base-content/40">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Navigation</span>
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-content shadow-md shadow-primary/20'
                        : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
};
