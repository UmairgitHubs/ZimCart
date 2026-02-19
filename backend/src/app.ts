import express from "express";
import cors from "cors";
import helmet from "helmet";
import { morganMiddleware } from "./middlewares/morgan.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import healthRoutes from "./routes/health.routes.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(cors({ origin: "*" } ));
app.use(express.json());
app.use(helmet());
app.use(morganMiddleware);

app.use("/health", healthRoutes);
app.use("/api/v1", apiRoutes);

app.use(errorHandler);

export default app;
