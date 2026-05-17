import { getIO } from '../services/socket.service.js';

export const emitToCustomer = (userId: string, event: string, payload: unknown) => {
  try {
    getIO().to(`customer:${userId}`).emit(event, payload);
  } catch {
    // Socket may be unavailable in tests
  }
};
