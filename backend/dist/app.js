import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { morganMiddleware } from "./middlewares/morgan.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import healthRoutes from "./routes/health.routes.js";
import apiRoutes from "./routes/index.js";
import config from "./config/config.js";
const app = express();
const corsOrigins = config.FRONTEND_URL.split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morganMiddleware);
app.use("/health", healthRoutes);
app.use("/api/v1", apiRoutes);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map