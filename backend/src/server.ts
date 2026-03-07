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
// Reload trigger: 2026-03-06 05:01
