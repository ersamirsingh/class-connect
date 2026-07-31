import { Router } from 'express';
import { userRoute } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';
import { contentRouter } from '../modules/content/content.route';
import { categoryRouter } from '../modules/category/category.route';
import { courseRouter } from '../modules/course/course.route';
import { paymentRouter } from '../modules/payment/payment.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRoute);
router.use('/users', userRoute);
router.use('/content', contentRouter);
router.use('/categories', categoryRouter);
router.use('/courses', courseRouter);
router.use('/payment', paymentRouter);

export const appRouter = router;
