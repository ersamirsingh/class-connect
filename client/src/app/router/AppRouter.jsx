import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { StudentLayout } from '../../layouts/StudentLayout';
import { AdminLayout } from '../../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { HomePage } from '../../pages/landing/HomePage';
import { AboutPage } from '../../pages/landing/AboutPage';
import { CategoryListPage } from '../../pages/categories/CategoryListPage';
import { CourseListPage } from '../../pages/courses/CourseListPage';
import { CourseDetailPage } from '../../pages/courses/CourseDetailPage';

import { LoginPage } from '../../pages/auth/LoginPage';
import { SignupPage } from '../../pages/auth/SignupPage';
import { ForgotPasswordPage } from '../../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../../pages/auth/ResetPasswordPage';

import { StudentDashboard } from '../../pages/dashboard/StudentDashboard';
import { AdminDashboard } from '../../pages/dashboard/AdminDashboard';
import { ProfilePage } from '../../pages/profile/ProfilePage';

import { CheckoutPage } from '../../pages/checkout/CheckoutPage';
import { PaymentHistoryPage } from '../../pages/checkout/PaymentHistoryPage';
import { ReceiptViewPage } from '../../pages/checkout/ReceiptViewPage';

import { ManageCmsPage } from '../../pages/admin/manageCms/ManageCmsPage';
import { ManageCategoriesPage } from '../../pages/admin/manageCategories/ManageCategoriesPage';
import { ManageCoursesPage } from '../../pages/admin/manageCourses/ManageCoursesPage';
import { ROLES } from '../../constants/roles';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/categories" element={<CategoryListPage />} />
      <Route path="/courses" element={<CourseListPage />} />
      <Route path="/courses/:idOrSlug" element={<CourseDetailPage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
        <Route path="/checkout/:courseId" element={<CheckoutPage />} />
        <Route path="/receipt/:orderId" element={<ReceiptViewPage />} />
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payments" element={<PaymentHistoryPage />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/cms" element={<ManageCmsPage />} />
          <Route path="/admin/categories" element={<ManageCategoriesPage />} />
          <Route path="/admin/courses" element={<ManageCoursesPage />} />
          <Route path="/admin/admins" element={<AdminDashboard />} />
          <Route path="/admin/payments" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
