import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateUser } from '../../middlewares/auth.middleware';
import { authRateLimiter } from '../../middlewares/rateLimiter.middleware';

const router = Router();

// Apply Rate Limiter to all auth endpoints
// router.use(authRateLimiter);

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.put('/update-password', authenticateUser, AuthController.updatePassword);
router.get('/me', authenticateUser, AuthController.getMe);
router.post('/logout', AuthController.logout);

export const authRouter = router;
