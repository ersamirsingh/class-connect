import { Router } from 'express';
import { userRoute } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';
import { contentRouter } from '../modules/content/content.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRoute);
router.use('/users', userRoute);
router.use('/content', contentRouter);

export const appRouter = router;
