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

import { CourseExplorePage } from '../../pages/learning/CourseExplorePage';
import { VideoPlayerPage } from '../../pages/learning/VideoPlayerPage';
import { CertificatePage } from '../../pages/learning/CertificatePage';
import { CertificatesListPage } from '../../pages/learning/CertificatesListPage';

import { ReportProblemPage } from '../../pages/report/ReportProblemPage';
import { NotificationsPage } from '../../pages/notifications/NotificationsPage';

import { WalletPage } from '../../pages/wallet/WalletPage';
import { DocumentVerificationPage } from '../../pages/profile/DocumentVerificationPage';

import { ManageReportsPage } from '../../pages/admin/manageReports/ManageReportsPage';
import { ManageAdminsPage } from '../../pages/admin/manageAdmins/ManageAdminsPage';
import { ManageUsersPage } from '../../pages/admin/manageUsers/ManageUsersPage';
import { ManagePaymentsPage } from '../../pages/admin/managePayments/ManagePaymentsPage';
import { ManageCmsPage } from '../../pages/admin/manageCms/ManageCmsPage';
import { ManageCategoriesPage } from '../../pages/admin/manageCategories/ManageCategoriesPage';
import { ManageCoursesPage } from '../../pages/admin/manageCourses/ManageCoursesPage';
import { ManageReviewsPage } from '../../pages/admin/manageReviews/ManageReviewsPage';
import { AdminWithdrawalsPage } from '../../pages/admin/withdrawals/AdminWithdrawalsPage';
import { AdminVerificationsPage } from '../../pages/admin/verifications/AdminVerificationsPage';

import { ROLES } from '../../constants/roles';

export const AppRouter = () => {
  return (
    <Routes>
      {/* PART 1: Public Guest Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/categories" element={<CategoryListPage />} />
      <Route path="/category/:id" element={<CategoryListPage />} />
      <Route path="/courses" element={<CourseListPage />} />
      <Route path="/courses/:idOrSlug" element={<CourseDetailPage />} />
      <Route path="/course/:idOrSlug" element={<CourseDetailPage />} />
      <Route path="/report" element={<ReportProblemPage />} />
      <Route path="/report-problem" element={<ReportProblemPage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.ADMIN]} />}>
        <Route path="/checkout/:courseId" element={<CheckoutPage />} />
        <Route path="/checkout/:courseId/confirmation" element={<ReceiptViewPage />} />
        <Route path="/receipt/:orderId" element={<ReceiptViewPage />} />
        <Route path="/course/:courseId/explore" element={<CourseExplorePage />} />
        <Route path="/courses/:courseId/explore" element={<CourseExplorePage />} />
        <Route path="/learning/:courseId" element={<VideoPlayerPage />} />
        <Route path="/course/:courseId/lecture/:lectureId" element={<VideoPlayerPage />} />
        <Route path="/certificate/:courseId" element={<CertificatePage />} />
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/verification" element={<DocumentVerificationPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/payments" element={<PaymentHistoryPage />} />
          <Route path="/certificates" element={<CertificatesListPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* PART 2: Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/cms" element={<ManageCmsPage />} />
          <Route path="/admin/categories" element={<ManageCategoriesPage />} />
          <Route path="/admin/courses" element={<ManageCoursesPage />} />
          <Route path="/admin/students" element={<ManageUsersPage />} />
          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/admins" element={<ManageAdminsPage />} />
          <Route path="/admin/withdrawals" element={<AdminWithdrawalsPage />} />
          <Route path="/admin/verifications" element={<AdminVerificationsPage />} />
          <Route path="/admin/payments" element={<ManagePaymentsPage />} />
          <Route path="/admin/reports" element={<ManageReportsPage />} />
          <Route path="/admin/reviews" element={<ManageReviewsPage />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
