import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticateUser } from '../../middlewares/auth.middleware';

const router = Router();

// Order & Payment endpoints
router.post('/create-order', authenticateUser, PaymentController.createOrder);
router.post('/verify', authenticateUser, PaymentController.verifyPayment);
router.get('/history', authenticateUser, PaymentController.getHistory);
router.get('/receipt/:orderId', authenticateUser, PaymentController.getReceipt);

// Gateway Webhooks
router.post('/webhook/razorpay', PaymentController.razorpayWebhook);
router.post('/webhook/stripe', PaymentController.stripeWebhook);

export const paymentRouter = router;
