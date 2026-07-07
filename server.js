import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  console.log(
    `[PRIMARY ${process.pid}] Launching cluster across ${numCPUs} CPU cores...`,
  );

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `[ALERT] Worker process ${worker.process.pid} died. Spawning replacement clone...`,
    );
    cluster.fork();
  });
} else {
  const server = app.listen(PORT, () => {
    console.log(
      `🚀 Worker process ${process.pid} listening on http://localhost:${PORT}`,
    );
  });

  const gracefulShutdown = (signal) => {
    console.log(
      `[PID ${process.pid}] Received ${signal}. Draining active connections...`,
    );

    server.close(() => {
      console.log(
        `[PID ${process.pid}] All connections safely closed. Exiting cleanly.`,
      );
      process.exit(0);
    });

    setTimeout(() => {
      console.error(`[PID ${process.pid}] Forced shutdown triggered.`);
      process.exit(1);
    }, 10000);
  };
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}
