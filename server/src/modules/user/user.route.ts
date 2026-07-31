import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticateUser } from '../../middlewares/auth.middleware';
import { uploadSingleImage } from '../../middlewares/upload.middleware';

const router = Router();

// Profile endpoints (Authenticated)
router.get('/profile', authenticateUser, UserController.getProfile);
router.put('/profile', authenticateUser, UserController.updateProfile);
router.post('/profile/photo', authenticateUser, uploadSingleImage, UserController.uploadPhoto);

// Admin / System endpoints
router.post('/', UserController.createUser);
router.get('/', UserController.getUsers);

export const userRoute = router;
