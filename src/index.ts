import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import { AppDataSource } from "./config/ormconfig";
import { authenticateJWT, authorizeRole } from "./middlewares/auth.middleware";
import dotenv from "dotenv";
import logger from "./utils/logger";
import preferencesRouter from "./routes/Preference.routes"; // Corrected import path

dotenv.config();

const server: Express = express();

server.use(express.json());

// Apply Winston logger as a middleware to log requests
server.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  res.on("finish", () => {
    logger.info(`Response: ${res.statusCode} ${req.method} ${req.url}`);
  });
  next();
});

// Apply authentication middleware
server.use(authenticateJWT, authorizeRole(["superadmin", "owner"]));

// Use the preferences router
server.use("/v1/api/organization/", preferencesRouter);

server.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});
server.listen(process.env.PORT || 8080, () => {
  logger.info(`Server is listening on port ${process.env.PORT || 8080}`);
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database initialized successfully");
  })
  .catch((error) => {
    logger.error(`Error initializing the database: ${error.message}`);
  });

export default server;
