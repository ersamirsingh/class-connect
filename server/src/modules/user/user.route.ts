import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

router.post('/', UserController.createUser);
router.get('/', UserController.getUsers);

export const userRoute = router;
