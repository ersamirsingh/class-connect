import { DocumentVerificationModel, IDocumentVerification } from './documentVerification.model';

export class DocumentVerificationService {
  /**
   * Submit or update student document verification details
   */
  static async submitVerification(
    studentId: string,
    payload: { panNumber: string; panImageUrl: string; aadhaarImageUrl?: string }
  ): Promise<IDocumentVerification> {
    if (!payload.panNumber || !payload.panImageUrl) {
      throw new Error('PAN number and PAN document image are required.');
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    if (!panRegex.test(payload.panNumber.trim())) {
      throw new Error('Invalid PAN number format (e.g. ABCDE1234F).');
    }

    let verification = await DocumentVerificationModel.findOne({ student: studentId });
    if (verification) {
      verification.panNumber = payload.panNumber.trim().toUpperCase();
      verification.panImageUrl = payload.panImageUrl;
      if (payload.aadhaarImageUrl) verification.aadhaarImageUrl = payload.aadhaarImageUrl;
      verification.status = 'pending';
      verification.rejectionReason = '';
      await verification.save();
    } else {
      verification = await DocumentVerificationModel.create({
        student: studentId,
        panNumber: payload.panNumber.trim().toUpperCase(),
        panImageUrl: payload.panImageUrl,
        aadhaarImageUrl: payload.aadhaarImageUrl || '',
        status: 'pending',
      });
    }

    return verification;
  }

  /**
   * Get verification status for student
   */
  static async getStudentVerification(studentId: string): Promise<IDocumentVerification | null> {
    return DocumentVerificationModel.findOne({ student: studentId });
  }

  /**
   * Admin: Get verification review queue
   */
  static async getAdminVerificationQueue(statusFilter?: string) {
    const filter = statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {};
    return DocumentVerificationModel.find(filter)
      .populate('student', 'name email phone referralCode photo')
      .sort({ updatedAt: -1 });
  }

  /**
   * Admin: Review and update document status (Approve / Reject)
   */
  static async reviewVerification(
    verificationId: string,
    action: 'approve' | 'reject',
    reason: string,
    adminId: string
  ): Promise<IDocumentVerification> {
    const doc = await DocumentVerificationModel.findById(verificationId);
    if (!doc) throw new Error('Document verification record not found.');

    if (action === 'approve') {
      doc.status = 'verified';
      doc.rejectionReason = '';
    } else {
      doc.status = 'rejected';
      doc.rejectionReason = reason || 'Document image unreadable or invalid PAN details.';
    }

    doc.reviewedBy = adminId as any;
    doc.reviewedAt = new Date();
    await doc.save();

    return doc;
  }
}
