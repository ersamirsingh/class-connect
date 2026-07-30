import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { Home } from '../../pages/dashboard/Home';
import { Login } from '../../pages/auth/Login';
import { Logout } from '../../pages/auth/Logout';
import { ROUTES } from './routeRegistry';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.LOGOUT} element={<Logout />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};
