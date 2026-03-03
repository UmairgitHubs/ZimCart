import "dotenv/config";
import app from "./app.js";
import http from "http";
import * as socketService from "./services/socket.service.js";

import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

socketService.init(server);

server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
// Trigger restart for environment update and prisma client refresh - forcing reload at 2026-02-20T05:48:00
