import { Router } from 'express';
import { userRoute } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';
import { contentRouter } from '../modules/content/content.route';
import { categoryRouter } from '../modules/category/category.route';
import { courseRouter } from '../modules/course/course.route';
import { paymentRouter } from '../modules/payment/payment.route';
import { enrollmentRouter } from '../modules/enrollment/enrollment.route';
import { reportRouter } from '../modules/report/report.route';
import { adminRouter } from '../modules/admin/admin.route';
import { notificationRouter } from '../modules/notification/notification.route';
import { reviewRouter } from '../modules/review/review.route';
import { uploadRouter } from '../modules/upload/upload.route';
import { walletRouter } from '../modules/wallet/wallet.routes';
import { verificationRouter } from '../modules/verification/documentVerification.routes';
import { liveRouter } from '../modules/live/liveModeration.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRoute);
router.use('/users', userRoute);
router.use('/content', contentRouter);
router.use('/categories', categoryRouter);
router.use('/courses', courseRouter);
router.use('/payment', paymentRouter);
router.use('/enrollments', enrollmentRouter);
router.use('/report', reportRouter);
router.use('/admin', adminRouter);
router.use('/notifications', notificationRouter);
router.use('/reviews', reviewRouter);
router.use('/upload', uploadRouter);
router.use('/wallet', walletRouter);
router.use('/verification', verificationRouter);
router.use('/live', liveRouter);

export const appRouter = router;
