import { Router } from 'express';
import { WalletController } from './wallet.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// Student Routes
router.get('/my-wallet', authenticateUser, WalletController.getStudentWallet);
router.post('/bank-details', authenticateUser, WalletController.saveBankDetails);
router.post('/withdraw', authenticateUser, WalletController.requestWithdrawal);

// Admin Queue & Payout Routes
router.get('/admin/queue', authenticateUser, authorizeRoles('admin'), WalletController.getAdminWithdrawalQueue);
router.post('/admin/approve/:requestId', authenticateUser, authorizeRoles('admin'), WalletController.approveWithdrawal);
router.post('/admin/reject/:requestId', authenticateUser, authorizeRoles('admin'), WalletController.rejectWithdrawal);

export const walletRouter = router;
