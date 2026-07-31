import crypto from 'crypto';
import Razorpay from 'razorpay';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey123';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'mocksecret123';

const razorpayInstance = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

export class RazorpayService {
  static async createOrder(amount: number, currency: string, receiptId: string) {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const options = {
        amount: Math.round(amount * 100), // amount in paise
        currency: currency || 'INR',
        receipt: receiptId,
      };
      const order = await razorpayInstance.orders.create(options);
      return {
        gatewayOrderId: order.id,
        keyId: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
      };
    }

    // Mock fallback for test environment
    const mockId = `order_rzp_mock_${Date.now()}`;
    return {
      gatewayOrderId: mockId,
      keyId: razorpayKeyId,
      amount: Math.round(amount * 100),
      currency: currency || 'INR',
    };
  }

  static verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      // Dev mode automatically verifies
      return true;
    }

    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(body.toString())
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature);
    const signatureBuffer = Buffer.from(signature);

    if (expectedBuffer.length !== signatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  }
}
