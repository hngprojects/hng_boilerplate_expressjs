// src/index.ts
import "reflect-metadata";
import AppDataSource from "./data-source";
import log from "./utils/logger";
import express, { Express, Request, Response } from "express";
import config from "./config";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter, authRoute, testimonialRoute, notificationRouter, smsRouter, blogRoute, helpRouter , sendEmailRoute } from "./routes";
import { routeNotFound, errorHandler } from "./middleware";
import { orgRouter } from "./routes/organisation";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";

dotenv.config();

const port = config.port;
const server: Express = express();
server.options("*", cors());
server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  })
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});
server.use("/api/v1", userRouter, orgRouter);
server.use("/api/v1/auth", authRoute);
server.use("/api/v1", sendEmailRoute);
server.use("/api/v1/sms", smsRouter);
server.use("/api/v1/help-center", helpRouter);
server.use("/api/v1/sms", smsRouter);
server.use("/api/v1", testimonialRoute);
server.use("/api/v1/blogs", blogRoute);
server.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.use(routeNotFound);
server.use(errorHandler);
server.use("/api/v1/settings", notificationRouter);

AppDataSource.initialize()
  .then(async () => {
    // seed().catch(log.error);
    server.use(express.json());
    server.get("/", (req: Request, res: Response) => {
      res.send("Hello world");
    });

    server.listen(port, () => {
      log.info(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => console.error(error));

export default server;
