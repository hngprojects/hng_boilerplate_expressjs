// src/index.ts
import "reflect-metadata";
import AppDataSource from "./data-source";
import log from "./utils/logger";
import express, { Express, Request, Response } from "express";
import config from "./config";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./config/google.passport.config";
import {
  userRouter,
  authRoute,
  helpRouter,
  testimonialRoute,
  notificationRouter,
  productRouter,
  jobRouter,
  blogRouter,
  adminRouter,
  exportRouter,
  sendEmailRoute,
} from "./routes";
import { smsRouter } from "./routes/sms";
import { routeNotFound, errorHandler } from "./middleware";
import { orgRouter } from "./routes/organisation";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";
import { organisationRoute } from "./routes/createOrg";
import updateRouter from "./routes/updateOrg";
import { authMiddleware } from "./middleware/auth";
import { Limiter } from "./utils";
import ServerAdapter from "./views/bull-board";

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
  }),
);
server.use(Limiter);
server.use(passport.initialize());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});
server.use("/api/v1/admin", adminRouter);
server.use("/api/v1/users", userRouter);
server.use("/api/v1/auth", authRoute);
server.use("/api/v1", sendEmailRoute);
server.use("/api/v1/sms", smsRouter);
server.use("/api/v1/help-center", helpRouter);
server.use("/api/v1", exportRouter);
server.use("/api/v1/sms", smsRouter);
server.use("/api/v1", testimonialRoute);
server.use("/api/v1/products", productRouter);
server.use("/api/v1/blog", blogRouter);
server.use("/api/v1", blogRouter);
server.use("/api/v1/product", productRouter);
server.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.use("/api/v1/settings", notificationRouter);
server.use("/api/v1/jobs", jobRouter);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.use("/api/v1", orgRouter);
server.use("/api/v1", authMiddleware, orgRouter);
server.use("/admin/queues", ServerAdapter.getRouter());

server.use(routeNotFound);
server.use(errorHandler);

server.use(routeNotFound);
server.use(errorHandler);


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
