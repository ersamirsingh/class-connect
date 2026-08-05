import { LiveChatMessageModel } from './liveChatMessage.model';
import { LiveSuspensionModel, SuspensionType } from './liveSuspension.model';

export class LiveModerationService {
  /**
   * Get chat history for a live session
   */
  static async getChatHistory(liveSessionId: string) {
    return LiveChatMessageModel.find({ liveSessionId })
      .populate('student', 'name photo role')
      .sort({ createdAt: 1 })
      .limit(200);
  }

  /**
   * Check if student is suspended in session
   */
  static async checkSuspension(liveSessionId: string, studentId: string) {
    return LiveSuspensionModel.findOne({
      liveSessionId,
      student: studentId,
      status: 'active',
    });
  }

  /**
   * Save a chat message (verifies suspension first)
   */
  static async saveChatMessage(liveSessionId: string, studentId: string, message: string) {
    const activeSuspension = await this.checkSuspension(liveSessionId, studentId);
    if (activeSuspension) {
      const typeLabel = activeSuspension.type === 'chat_mute' ? 'muted from chat' : 'suspended from session';
      throw new Error(`You have been ${typeLabel} by an Admin. Reason: ${activeSuspension.reason || 'Violation of live chat guidelines.'}`);
    }

    const msg = await LiveChatMessageModel.create({
      liveSessionId,
      student: studentId,
      message: message.trim(),
    });

    return LiveChatMessageModel.findById(msg._id).populate('student', 'name photo role');
  }

  /**
   * Admin: Suspend or mute a student in a session
   */
  static async suspendStudent(
    liveSessionId: string,
    studentId: string,
    type: SuspensionType,
    reason: string,
    adminId: string,
    courseId?: string
  ) {
    // Deactivate previous active suspensions
    await LiveSuspensionModel.updateMany(
      { liveSessionId, student: studentId, status: 'active' },
      { $set: { status: 'lifted', liftedAt: new Date() } }
    );

    const suspension = await LiveSuspensionModel.create({
      liveSessionId,
      course: courseId || undefined,
      student: studentId,
      type,
      status: 'active',
      reason: reason || 'Violation of live conduct policy',
      suspendedBy: adminId,
      suspendedAt: new Date(),
    });

    return LiveSuspensionModel.findById(suspension._id)
      .populate('student', 'name email photo')
      .populate('suspendedBy', 'name');
  }

  /**
   * Admin: Restore a student (lift suspension/mute)
   */
  static async restoreStudent(liveSessionId: string, studentId: string) {
    await LiveSuspensionModel.updateMany(
      { liveSessionId, student: studentId, status: 'active' },
      { $set: { status: 'lifted', liftedAt: new Date() } }
    );

    return { success: true, message: 'Student conduct status restored.' };
  }

  /**
   * Admin: Get session suspensions & participant roster
   */
  static async getSessionRoster(liveSessionId: string) {
    const suspensions = await LiveSuspensionModel.find({ liveSessionId })
      .populate('student', 'name email photo')
      .sort({ updatedAt: -1 });

    const messages = await LiveChatMessageModel.find({ liveSessionId })
      .populate('student', 'name email photo')
      .sort({ createdAt: -1 });

    return { suspensions, recentParticipants: messages };
  }
}
