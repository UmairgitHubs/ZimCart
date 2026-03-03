import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import logger from "../utils/logger.js";

let io: SocketIOServer | null = null;


export const init = (server: HttpServer): void => {
  if (io) {
    logger.warn("Socket.io is already initialized!");
    return;
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on("error", (error) => {
      logger.error(`Socket error for client ${socket.id}: ${error.message}`);
    });

    socket.on("disconnect", (reason) => {
      logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
    });
  });

  logger.info("Socket.io initialized successfully");
};

/**
 * Get the initialized Socket.io instance
 */
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized! Call init() first.");
  }
  return io;
};
