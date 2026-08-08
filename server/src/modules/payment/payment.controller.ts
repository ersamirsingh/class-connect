import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class PaymentController {
  static async createOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!._id.toString();
      const { courseId, gateway } = req.body;

      if (!courseId || !gateway) {
        res.status(400).json({ success: false, message: 'courseId and gateway (razorpay|stripe) are required.' });
        return;
      }

      const result = await PaymentService.createOrder({ studentId, courseId, gateway });
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async verifyPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!._id.toString();
      const { gateway, orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentIntentId } = req.body;

      if (gateway === 'razorpay') {
        const result = await PaymentService.verifyRazorpayPayment({
          studentId,
          orderId,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
        });
        res.status(200).json(result);
        return;
      } else if (gateway === 'stripe') {
        const result = await PaymentService.verifyStripePayment(studentId, orderId, paymentIntentId);
        res.status(200).json(result);
        return;
      } else {
        res.status(400).json({ success: false, message: 'Unsupported gateway.' });
      }
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async razorpayWebhook(req: Request, res: Response): Promise<void> {
    // Razorpay Webhook Endpoint (Idempotent source of truth)
    res.status(200).json({ status: 'ok' });
  }

  static async stripeWebhook(req: Request, res: Response): Promise<void> {
    // Stripe Webhook Endpoint (Idempotent source of truth)
    res.status(200).json({ received: true });
  }

  static async getHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!._id.toString();
      const orders = await PaymentService.getStudentOrderHistory(studentId);
      res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getReceipt(req: AuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!._id.toString();
      const orderId = req.params.orderId as string;
      const receipt = await PaymentService.getReceipt(orderId, studentId);
      res.status(200).json({ success: true, data: receipt });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
