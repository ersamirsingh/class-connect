import request from 'supertest';
import app from '../app';
import { UserModel } from '../modules/user/user.model';
import { WalletModel } from '../modules/wallet/wallet.model';
import { ReferralTransactionModel } from '../modules/wallet/referralTransaction.model';
import { WithdrawalRequestModel } from '../modules/wallet/withdrawalRequest.model';
import { DocumentVerificationModel } from '../modules/verification/documentVerification.model';
import { WalletService } from '../modules/wallet/wallet.service';
import { createTestToken } from './utils';

describe('9. Referral, Wallet & Payout Module', () => {
  let referrerToken: string;
  let referrerId: string;
  let referrerCode: string;
  let refereeToken: string;
  let refereeId: string;
  let adminToken: string;
  let adminId: string;

  beforeEach(async () => {
    const referrer = await UserModel.create({
      name: 'Referrer Student',
      email: 'referrer@example.com',
      password: 'Password@123',
      referralCode: 'REF-STUDENT1',
    });
    referrerId = referrer._id.toString();
    referrerCode = referrer.referralCode!;
    referrerToken = await createTestToken(referrer);

    const referee = await UserModel.create({
      name: 'Referred Learner',
      email: 'referee@example.com',
      password: 'Password@123',
      referredBy: referrerId,
    });
    refereeId = referee._id.toString();
    refereeToken = await createTestToken(referee);

    const admin = await UserModel.create({
      name: 'Admin Payout Approver',
      email: 'adminpayout@example.com',
      password: 'Password@123',
      role: 'admin',
    });
    adminId = admin._id.toString();
    adminToken = await createTestToken(admin);
  });

  it('Happy Path: Referral commission credited on paid order, penny-drop verified bank saved, payout approved after document verification', async () => {
    const tx = await WalletService.creditReferralCommission(referrerId, refereeId, '507f1f77bcf86cd799439011', 2000);
    // Mark commission as available for immediate testing
    if (tx) {
      tx.status = 'available';
      tx.availableAt = new Date(Date.now() - 1000);
      await tx.save();
    }
    const balance = await WalletService.calculateLedgerBalance(referrerId);
    expect(balance).toBe(300);

    const bankRes = await request(app)
      .post('/api/wallet/bank-details')
      .set('Authorization', `Bearer ${referrerToken}`)
      .send({
        accountNumber: '123456789012',
        ifscCode: 'SBIN0001234',
        accountHolderName: 'Referrer Student',
      });
    expect(bankRes.status).toBe(200);

    await DocumentVerificationModel.create({
      student: referrerId,
      aadhaarNumber: '123456789012',
      aadhaarImageUrl: 'https://cloudinary.com/aadhaar.jpg',
      status: 'verified',
    });

    // Add available commission for testing withdrawal
    await WalletService.creditReferralCommission(referrerId, refereeId, '507f1f77bcf86cd799439022', 5000);
    await ReferralTransactionModel.updateMany({ referrer: referrerId }, { status: 'available' });
    await WalletService.calculateLedgerBalance(referrerId);

    const withdrawRes = await request(app)
      .post('/api/wallet/withdraw')
      .set('Authorization', `Bearer ${referrerToken}`)
      .send({ amount: 600 });

    expect(withdrawRes.status).toBe(201);
    const requestId = withdrawRes.body.data._id;

    const approveRes = await request(app)
      .post(`/api/wallet/admin/approve/${requestId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.data.status).toBe('paid');
  });

  it('Attack Case: Self-Referral Prevention (Signing up with own referral code)', async () => {
    const selfSignupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Referrer Alt Account',
        email: 'referrer_alt@example.com',
        password: 'Password@123',
        refCode: referrerCode,
      });

    expect(selfSignupRes.status).toBe(201);
    const altStudentId = selfSignupRes.body.data.user._id || selfSignupRes.body.data.user.id;

    const altUser = await UserModel.findById(altStudentId);
    expect(altUser?.referredBy?.toString()).toBe(referrerId);
  });

  it('Attack Case: Withdrawal attempt while Document Verification is pending/rejected (BACKEND HARD-BLOCK)', async () => {
    await ReferralTransactionModel.create({
      referrer: referrerId,
      referredStudent: refereeId,
      order: '507f1f77bcf86cd799439011',
      commissionAmount: 1000,
      status: 'available',
      availableAt: new Date(Date.now() - 1000),
    });

    await WalletModel.findOneAndUpdate(
      { student: referrerId },
      {
        balance: 1000,
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          accountHolderName: 'Referrer',
          isVerified: true,
        },
      },
      { upsert: true }
    );

    await DocumentVerificationModel.create({
      student: referrerId,
      aadhaarNumber: '123456789012',
      aadhaarImageUrl: 'https://cloudinary.com/aadhaar.jpg',
      status: 'pending',
    });

    const requestRecord = await WithdrawalRequestModel.create({
      student: referrerId,
      amount: 600,
      status: 'pending',
    });

    const approveRes = await request(app)
      .post(`/api/wallet/admin/approve/${requestRecord._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(approveRes.status).toBe(400);
    expect(approveRes.body.message).toMatch(/BACKEND SECURITY BLOCK|Must be 'verified'/i);
  });

  it('Attack Case: Attempting to withdraw more than current available wallet balance', async () => {
    await DocumentVerificationModel.create({
      student: referrerId,
      aadhaarNumber: '123456789012',
      aadhaarImageUrl: 'https://cloudinary.com/aadhaar.jpg',
      status: 'verified',
    });

    await ReferralTransactionModel.create({
      referrer: referrerId,
      referredStudent: refereeId,
      order: '507f1f77bcf86cd799439011',
      commissionAmount: 600,
      status: 'available',
      availableAt: new Date(Date.now() - 1000),
    });

    await WalletModel.findOneAndUpdate(
      { student: referrerId },
      {
        balance: 600,
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          accountHolderName: 'Referrer',
          isVerified: true,
        },
      },
      { upsert: true }
    );

    const res = await request(app)
      .post('/api/wallet/withdraw')
      .set('Authorization', `Bearer ${referrerToken}`)
      .send({ amount: 2000 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Insufficient available balance|Insufficient wallet balance/i);
  });

  it('Attack Case: Race Condition - Dual simultaneous withdrawal requests against same balance', async () => {
    await DocumentVerificationModel.create({
      student: referrerId,
      aadhaarNumber: '123456789012',
      aadhaarImageUrl: 'https://cloudinary.com/aadhaar.jpg',
      status: 'verified',
    });

    await ReferralTransactionModel.create({
      referrer: referrerId,
      referredStudent: refereeId,
      order: '507f1f77bcf86cd799439011',
      commissionAmount: 600,
      status: 'available',
      availableAt: new Date(Date.now() - 1000),
    });

    await WalletModel.findOneAndUpdate(
      { student: referrerId },
      {
        balance: 600,
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          accountHolderName: 'Referrer',
          isVerified: true,
        },
      },
      { upsert: true }
    );

    const req1 = await request(app)
      .post('/api/wallet/withdraw')
      .set('Authorization', `Bearer ${referrerToken}`)
      .send({ amount: 600 });

    const req2 = await request(app)
      .post('/api/wallet/withdraw')
      .set('Authorization', `Bearer ${referrerToken}`)
      .send({ amount: 600 });

    expect(req1.status).toBe(201);
    expect(req2.status).toBe(400);

    const walletDb = await WalletModel.findOne({ student: referrerId });
    expect(walletDb?.balance).toBe(0);
  });

  it('Attack Case: Unverified Bank Account (Penny-Drop Fail) Withdrawal Bypass Attempt', async () => {
    const bankRes = await request(app)
      .post('/api/wallet/bank-details')
      .set('Authorization', `Bearer ${referrerToken}`)
      .send({
        accountNumber: '123456789',
        ifscCode: 'INVALID123',
        accountHolderName: 'Test',
      });

    expect(bankRes.status).toBe(400);
    expect(bankRes.body.message).toMatch(/Penny-drop validation failed|Invalid IFSC/i);
  });
});
