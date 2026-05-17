import { getIO } from '../services/socket.service.js';
import logger from './logger.js';

export const emitToRider = (riderId: string, event: string, payload: unknown) => {
  try {
    getIO().to(`rider:${riderId}`).emit(event, payload);
  } catch (err) {
    logger.warn(`Socket emit skipped (${event}): ${(err as Error).message}`);
  }
};
