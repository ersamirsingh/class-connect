import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { LiveModerationService } from '../modules/live/liveModeration.service';
import { logger } from '../utils/logger';

export const initLiveSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`Live Socket connected: ${socket.id}`);

    // Student joins a specific live session room
    socket.on('join-live-room', async (data: { liveSessionId: string; studentId?: string }) => {
      const { liveSessionId, studentId } = data;
      socket.join(liveSessionId);
      if (studentId) {
        socket.join(`user-${studentId}`);
      }
      logger.info(`Socket ${socket.id} joined live room: ${liveSessionId}`);
    });

    // Student sends a message
    socket.on('send-message', async (data: { liveSessionId: string; studentId: string; message: string }) => {
      try {
        const { liveSessionId, studentId, message } = data;
        const savedMsg = await LiveModerationService.saveChatMessage(liveSessionId, studentId, message);
        io.to(liveSessionId).emit('receive-message', savedMsg);
      } catch (err: any) {
        socket.emit('you-are-suspended', {
          message: err.message || 'You are suspended from sending messages in this live class.',
        });
      }
    });

    // Admin suspends a student (chat_mute or full)
    socket.on('suspend-student', async (data: { liveSessionId: string; studentId: string; type: 'chat_mute' | 'full'; reason: string; adminId: string; courseId?: string }) => {
      try {
        const { liveSessionId, studentId, type, reason, adminId, courseId } = data;
        const suspension = await LiveModerationService.suspendStudent(liveSessionId, studentId, type, reason, adminId, courseId);
        
        // Notify target student socket
        io.to(`user-${studentId}`).emit('you-are-suspended', {
          type,
          reason: suspension?.reason || reason,
          message: type === 'chat_mute' ? 'You have been muted from chat by an Admin.' : 'You have been removed from this live class by an Admin.',
        });

        // Notify room moderation update
        io.to(liveSessionId).emit('student-suspended-update', suspension);
      } catch (err: any) {
        socket.emit('error-message', err.message);
      }
    });

    // Admin restores a student
    socket.on('restore-student', async (data: { liveSessionId: string; studentId: string }) => {
      try {
        const { liveSessionId, studentId } = data;
        await LiveModerationService.restoreStudent(liveSessionId, studentId);

        // Notify target student socket
        io.to(`user-${studentId}`).emit('you-are-restored', {
          message: 'Your access to the live class and chat has been restored by an Admin.',
        });

        // Notify room moderation update
        io.to(liveSessionId).emit('student-restored-update', { studentId });
      } catch (err: any) {
        socket.emit('error-message', err.message);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Live Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
