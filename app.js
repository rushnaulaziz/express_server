import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import logger from "./utils/logger.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  }),
);

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10kb" }));

app.use("/api/users", userRouter);

app.use((req, res) => {
  req.log.warn(`Route not found: ${req.method} ${req.url}`);
  res
    .status(404)
    .json({ error: `Route ${req.method} ${req.url} does not exist.` });
});

app.use((err, req, res, next) => {
  req.log.error({ err }, "An unhandled exception was caught by the boundary");

  res.status(500).json({
    error: "An unexpected internal error occurred.",
  });
});
export default app;
