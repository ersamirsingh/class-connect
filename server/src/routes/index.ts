import { Router } from 'express';
import { userRoute } from '../modules/user/user.route';

const router = Router();

router.use('/users', userRoute);

export const appRouter = router;
