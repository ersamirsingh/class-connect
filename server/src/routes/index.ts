import { Router } from 'express';
import { userRoute } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRoute);

export const appRouter = router;
