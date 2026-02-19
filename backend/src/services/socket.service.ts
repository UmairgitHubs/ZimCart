import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import logger from "../utils/logger.js";

class SocketService {
  private static instance: SocketService;
  private io: SocketIOServer | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public init(server: HttpServer): void {
    if (this.io) {
      logger.warn("Socket.io is already initialized!");
      return;
    }

    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      pingTimeout: 60000,
      transports: ["websocket", "polling"],
    });

    this.io.on("connection", (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      socket.on("error", (error) => {
        logger.error(`Socket error for client ${socket.id}: ${error.message}`);
      });

      socket.on("disconnect", (reason) => {
        logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
      });
    });

    logger.info("Socket.io initialized successfully");
  }

  public getIO(): SocketIOServer {
    if (!this.io) {
      throw new Error("Socket.io not initialized! Call init() first.");
    }
    return this.io;
  }
}

export const socketService = SocketService.getInstance();
