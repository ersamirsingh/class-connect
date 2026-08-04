import { Request, Response } from 'express';
import { WalletService } from './wallet.service';

export class WalletController {
  static async getStudentWallet(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user.id;
      const data = await WalletService.getStudentHistory(studentId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async saveBankDetails(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user.id;
      const { accountNumber, ifscCode, accountHolderName } = req.body;
      const wallet = await WalletService.saveBankDetails(studentId, { accountNumber, ifscCode, accountHolderName });
      res.status(200).json({ success: true, message: 'Bank details saved and verified via penny-drop check.', data: wallet });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async requestWithdrawal(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user.id;
      const { amount } = req.body;
      const request = await WalletService.requestWithdrawal(studentId, Number(amount));
      res.status(201).json({ success: true, message: 'Withdrawal request submitted successfully.', data: request });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getAdminWithdrawalQueue(req: Request, res: Response): Promise<void> {
    try {
      const statusFilter = req.query.status as string;
      const queue = await WalletService.getAdminWithdrawalQueue(statusFilter);
      res.status(200).json({ success: true, data: queue });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async approveWithdrawal(req: Request, res: Response): Promise<void> {
    try {
      const adminId = (req as any).user.id || (req as any).user._id;
      const requestId = String(req.params.requestId);
      const request = await WalletService.approveWithdrawal(requestId, adminId);
      res.status(200).json({ success: true, message: 'Withdrawal approved & payout dispatched via RazorpayX.', data: request });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async rejectWithdrawal(req: Request, res: Response): Promise<void> {
    try {
      const adminId = (req as any).user.id || (req as any).user._id;
      const requestId = String(req.params.requestId);
      const { reason } = req.body;
      const request = await WalletService.rejectWithdrawal(requestId, reason, adminId);
      res.status(200).json({ success: true, message: 'Withdrawal request rejected and amount refunded to wallet.', data: request });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
