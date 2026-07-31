import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mockstripe123';
const stripeInstance = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27.acacia' as any,
});

export class StripeService {
  static async createPaymentIntent(amount: number, currency: string, receiptId: string) {
    if (process.env.STRIPE_SECRET_KEY) {
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: Math.round(amount * 100), // cents
        currency: (currency || 'usd').toLowerCase(),
        metadata: { receiptId },
      });

      return {
        gatewayOrderId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      };
    }

    // Mock fallback for test environment
    const mockId = `pi_stripe_mock_${Date.now()}`;
    return {
      gatewayOrderId: mockId,
      clientSecret: `${mockId}_secret_test`,
      amount: Math.round(amount * 100),
      currency: (currency || 'usd').toLowerCase(),
    };
  }

  static verifyWebhook(rawBody: Buffer, signature: string): Stripe.Event | null {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
      return null;
    }
    return stripeInstance.webhooks.constructEvent(rawBody, signature, webhookSecret);
  }
}
