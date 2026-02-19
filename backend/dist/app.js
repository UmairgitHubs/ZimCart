import express from "express";
import cors from "cors";
import helmet from "helmet";
import { morganMiddleware } from "./middlewares/morgan.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import logger from "./utils/logger.js";
import healthRoutes from "./routes/health.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morganMiddleware);
app.use("/health", healthRoutes);
app.use("/api/v1/health", healthRoutes);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map