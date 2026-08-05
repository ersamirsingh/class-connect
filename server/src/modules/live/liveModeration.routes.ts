import { Router } from 'express';
import { LiveModerationController } from './liveModeration.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// Public / Enrolled Student endpoints
router.get('/session/:liveSessionId/messages', authenticateUser, LiveModerationController.getChatHistory);

// Admin Moderation endpoints
router.get('/session/:liveSessionId/roster', authenticateUser, authorizeRoles('admin'), LiveModerationController.getSessionRoster);
router.post('/session/:liveSessionId/suspend', authenticateUser, authorizeRoles('admin'), LiveModerationController.suspendStudent);
router.post('/session/:liveSessionId/restore', authenticateUser, authorizeRoles('admin'), LiveModerationController.restoreStudent);

export const liveRouter = router;
