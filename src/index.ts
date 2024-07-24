// src/index.ts
import "reflect-metadata";
import AppDataSource from "./data-source";
import log from "./utils/logger";
import express, { Express, Request, Response } from "express";
import config from "./config";
import dotenv from "dotenv";
import cors from "cors";
import {
  userRouter,
  authRoute,
  helpRouter,
  testimonialRoute,
  notificationRouter,
  smsRouter,
  productRouter,
  jobRouter,
  blogRouter,
  adminRouter
} from "./routes";
// import { seed } from "./seeder";
import { routeNotFound, errorHandler } from "./middleware";
import { orgRouter } from "./routes/organisation";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";
import { organisationRoute } from "./routes/createOrg";

dotenv.config();

const port = config.port;
const server: Express = express();
server.options("*", cors());
server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
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
server.use("/api/v1/admin", adminRouter);
server.use("/api/v1/users", userRouter);
server.use("/api/v1/auth", authRoute);
server.use("/api/v1/help-center", helpRouter);
server.use("/api/v1/sms", smsRouter);
server.use("/api/v1", testimonialRoute);
server.use("/api/v1/blog", blogRouter);
server.use("/api/v1", blogRouter);
server.use("/api/v1/product", productRouter);
server.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.use(routeNotFound);
server.use(errorHandler);
server.use("/api/v1/settings", notificationRouter);
server.use("/api/v1/jobs", jobRouter);

AppDataSource.initialize()
  .then(async () => {
    // await seed();
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
