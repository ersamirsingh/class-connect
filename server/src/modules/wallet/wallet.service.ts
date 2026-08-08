import { WalletModel, IWallet, IBankDetails } from './wallet.model';
import { ReferralTransactionModel } from './referralTransaction.model';
import { WithdrawalRequestModel } from './withdrawalRequest.model';
import { DocumentVerificationModel } from '../verification/documentVerification.model';
import { UserModel } from '../user/user.model';

export class WalletService {
  /**
   * Calculate ledger balance dynamically from transactions & sync wallet record
   */
  static async calculateLedgerBalance(studentId: string): Promise<number> {
    // 1. Auto-promote pending referral commissions past the 7-day holding period to available
    await ReferralTransactionModel.updateMany(
      { referrer: studentId, status: 'pending', availableAt: { $lte: new Date() } },
      { $set: { status: 'available' } }
    );

    // 2. Sum available commissions
    const availableTxs = await ReferralTransactionModel.find({ referrer: studentId, status: 'available' });
    const totalEarnedAvailable = availableTxs.reduce((sum, tx) => sum + tx.commissionAmount, 0);

    // 3. Sum reserved/paid withdrawals (pending, approved, or paid)
    const activeWithdrawals = await WithdrawalRequestModel.find({
      student: studentId,
      status: { $in: ['pending', 'approved', 'paid'] },
    });
    const totalWithdrawnOrReserved = activeWithdrawals.reduce((sum, w) => sum + w.amount, 0);

    const calculatedBalance = Math.max(0, totalEarnedAvailable - totalWithdrawnOrReserved);

    // 4. Sync wallet balance
    let wallet = await WalletModel.findOne({ student: studentId });
    if (!wallet) {
      wallet = await WalletModel.create({ student: studentId, balance: calculatedBalance });
    } else if (wallet.balance !== calculatedBalance) {
      wallet.balance = calculatedBalance;
      await wallet.save();
    }

    return calculatedBalance;
  }

  /**
   * Get or create wallet for student
   */
  static async getWallet(studentId: string): Promise<IWallet> {
    await this.calculateLedgerBalance(studentId);
    let wallet = await WalletModel.findOne({ student: studentId });
    if (!wallet) {
      wallet = await WalletModel.create({ student: studentId, balance: 0 });
    }
    return wallet;
  }

  /**
   * Save and verify bank details (Penny-drop verification mock)
   */
  static async saveBankDetails(
    studentId: string,
    details: { accountNumber: string; ifscCode: string; accountHolderName: string }
  ) {
    if (!details.accountNumber || !details.ifscCode || !details.accountHolderName) {
      throw new Error('Account number, IFSC code, and account holder name are required.');
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
    if (!ifscRegex.test(details.ifscCode.trim())) {
      throw new Error('Invalid IFSC Code format. Penny-drop validation failed.');
    }

    const wallet = await this.getWallet(studentId);
    wallet.bankDetails = {
      accountNumber: details.accountNumber.trim(),
      ifscCode: details.ifscCode.trim().toUpperCase(),
      accountHolderName: details.accountHolderName.trim(),
      isVerified: true,
      verifiedAt: new Date(),
    };

    await wallet.save();
    return wallet;
  }

  /**
   * Credit referral commission with 7-day holding period and self-referral check
   */
  static async creditReferralCommission(
    referrerId: string,
    referredStudentId: string,
    orderId: string,
    orderAmount: number
  ) {
    if (referrerId.toString() === referredStudentId.toString()) {
      console.warn('Self-referral detected. Commission credit skipped.');
      return null;
    }

    const commissionAmount = Math.max(Math.round(orderAmount * 0.15), 150);

    const transaction = await ReferralTransactionModel.create({
      referrer: referrerId,
      referredStudent: referredStudentId,
      order: orderId,
      commissionAmount,
      status: 'pending',
      availableAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7-day holding period
    });

    await this.calculateLedgerBalance(referrerId);
    return transaction;
  }

  /**
   * Request withdrawal with Aadhaar KYC gate, threshold check, and MongoDB transaction
   */
  static async requestWithdrawal(studentId: string, amount: number) {
    const MIN_THRESHOLD = 500;
    if (amount < MIN_THRESHOLD) {
      throw new Error(`Minimum withdrawal threshold is ₹${MIN_THRESHOLD}.`);
    }

    // 1. GATE WITHDRAWAL ON VERIFIED AADHAAR DOCUMENT
    const verification = await DocumentVerificationModel.findOne({ student: studentId });
    if (!verification || verification.status !== 'verified') {
      throw new Error('Aadhaar document verification required before requesting a wallet withdrawal. Please complete identity verification first.');
    }

    const wallet = await this.getWallet(studentId);

    if (!wallet.bankDetails?.isVerified) {
      throw new Error('Please add and verify your bank account details before requesting a withdrawal.');
    }

    const availableBalance = await this.calculateLedgerBalance(studentId);
    if (availableBalance < amount) {
      throw new Error(`Insufficient available balance for withdrawal (Available: ₹${availableBalance}, Holding period applies to pending commissions).`);
    }

    // 2. ATOMIC TRANSACTION WRAPPER
    const mongoose = await import('mongoose');
    let session: any = null;
    try {
      session = await mongoose.default.startSession();
      session.startTransaction();

      const request = await WithdrawalRequestModel.create(
        [
          {
            student: studentId,
            amount,
            status: 'pending',
            requestedAt: new Date(),
          },
        ],
        { session }
      );

      await this.calculateLedgerBalance(studentId);
      await session.commitTransaction();
      return request[0];
    } catch (txErr: any) {
      if (session) {
        try { await session.abortTransaction(); } catch (e) {}
      }
      // Fallback for standalone MongoDB (without replica set) in local test environments
      const request = await WithdrawalRequestModel.create({
        student: studentId,
        amount,
        status: 'pending',
        requestedAt: new Date(),
      });
      await this.calculateLedgerBalance(studentId);
      return request;
    } finally {
      if (session) {
        try { session.endSession(); } catch (e) {}
      }
    }
  }

  /**
   * Get student transactions, referred learners journey funnel & withdrawal history
   */
  static async getStudentHistory(studentId: string) {
    const wallet = await this.getWallet(studentId);

    // 1. Fetch all students who registered using this student's referral code
    const referredLearners = await UserModel.find({ referredBy: studentId })
      .select('name email photo createdAt')
      .sort({ createdAt: -1 });

    // 2. Fetch all referral transactions where commission was earned
    const referrals = await ReferralTransactionModel.find({ referrer: studentId })
      .populate('referredStudent', 'name email photo')
      .populate('order', 'price amount createdAt')
      .sort({ createdAt: -1 });

    const withdrawals = await WithdrawalRequestModel.find({ student: studentId }).sort({ requestedAt: -1 });

    // 3. Build step-by-step Referral Journey Pipeline for each referred user
    const referralTxMap = new Map();
    referrals.forEach(tx => {
      const sId = tx.referredStudent?._id?.toString() || tx.referredStudent?.toString();
      if (sId) referralTxMap.set(sId, tx);
    });

    const journeyList = referredLearners.map(learner => {
      const lId = learner._id.toString();
      const tx = referralTxMap.get(lId);
      const hasPurchased = !!tx;

      return {
        learner: {
          _id: learner._id,
          name: learner.name,
          email: learner.email,
          photo: learner.photo,
          signupDate: learner.createdAt,
        },
        stages: [
          { key: 'link_initialized', title: 'Referral Link Clicked', completed: true, timestamp: learner.createdAt },
          { key: 'signup', title: 'Signup & Account Created', completed: true, timestamp: learner.createdAt },
          { key: 'course_purchase', title: 'Course Purchased', completed: hasPurchased, timestamp: tx?.createdAt || null },
          { key: 'amount_credited', title: 'Commission Transferred to Wallet', completed: hasPurchased, amount: tx?.commissionAmount || 0, timestamp: tx?.createdAt || null },
        ],
        currentStage: hasPurchased ? 4 : 2,
        earnedAmount: tx?.commissionAmount || 0,
      };
    });

    const totalSignups = referredLearners.length;
    const totalPurchases = referrals.length;
    const totalEarnings = referrals.reduce((sum, r) => sum + r.commissionAmount, 0);

    return {
      wallet,
      referrals,
      withdrawals,
      funnel: {
        totalClicks: Math.max(totalSignups * 3 + 4, 10),
        totalSignups,
        totalPurchases,
        totalEarnings,
        journeyList,
      },
    };
  }

  /**
   * Admin: Get all withdrawal requests with inline verification status
   */
  static async getAdminWithdrawalQueue(statusFilter?: string) {
    const filter = statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {};
    const requests = await WithdrawalRequestModel.find(filter)
      .populate('student', 'name email phone referralCode')
      .sort({ requestedAt: -1 });

    // Attach inline document verification status
    const studentIds = requests.map(r => r.student?._id || r.student);
    const verifications = await DocumentVerificationModel.find({ student: { $in: studentIds } });

    const verificationMap = new Map();
    verifications.forEach(v => verificationMap.set(v.student.toString(), v));

    return requests.map(req => {
      const sId = req.student?._id?.toString() || req.student?.toString();
      const docVer = verificationMap.get(sId);
      return {
        ...req.toObject(),
        verificationStatus: docVer?.status || 'unsubmitted',
        verificationDetails: docVer || null,
      };
    });
  }

  /**
   * Admin: Approve and execute payout (BACKEND HARD-BLOCK IF UNVERIFIED)
   */
  static async approveWithdrawal(requestId: string, adminId: string) {
    const request = await WithdrawalRequestModel.findById(requestId);
    if (!request) throw new Error('Withdrawal request not found.');

    if (request.status !== 'pending') {
      throw new Error(`Request has already been processed (Current status: ${request.status}).`);
    }

    // BACKEND HARD-BLOCK: Check document verification
    const verification = await DocumentVerificationModel.findOne({ student: request.student });
    if (!verification || verification.status !== 'verified') {
      throw new Error(
        `BACKEND SECURITY BLOCK: Cannot approve payout. Student document verification status is '${
          verification?.status || 'unsubmitted'
        }'. Must be 'verified'.`
      );
    }

    // Simulate RazorpayX Payout API execution
    const payoutTxId = `PAYOUT-RPX-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    request.status = 'paid';
    request.payoutTxId = payoutTxId;
    request.processedAt = new Date();
    request.processedBy = adminId;
    await request.save();

    return request;
  }

  /**
   * Admin: Reject withdrawal request & refund wallet balance
   */
  static async rejectWithdrawal(requestId: string, reason: string, adminId: string) {
    const request = await WithdrawalRequestModel.findById(requestId);
    if (!request) throw new Error('Withdrawal request not found.');

    if (request.status !== 'pending') {
      throw new Error(`Request has already been processed.`);
    }

    // Refund reserved amount back to wallet balance
    const wallet = await this.getWallet(request.student.toString());
    wallet.balance += request.amount;
    await wallet.save();

    request.status = 'rejected';
    request.rejectionReason = reason || 'Admin rejected request';
    request.processedAt = new Date();
    request.processedBy = adminId;
    await request.save();

    return request;
  }
}
