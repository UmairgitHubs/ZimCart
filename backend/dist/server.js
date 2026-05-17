import "dotenv/config";
import app from "./app.js";
import http from "http";
import * as socketService from "./services/socket.service.js";
import logger from "./utils/logger.js";
const PORT = Number(process.env.PORT) || 5000;
/** Bind all interfaces so LAN devices can reach the API (e.g. admin at http://192.168.x.x:3000). */
const HOST = process.env.HOST || '0.0.0.0';
const server = http.createServer(app);
socketService.init(server);
server.listen(PORT, HOST, () => {
    logger.info(`Server listening on http://${HOST}:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
// Reload trigger: 2026-03-06 05:01
//# sourceMappingURL=server.js.map