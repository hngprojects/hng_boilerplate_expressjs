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
  productRouter,
  jobRouter,
  blogRouter,
  adminRouter,
  exportRouter,
  sendEmailRoute,
  paymentRouter,
  contactRouter,
  paymentFlutterwaveRouter,
  paymentStripeRouter,
  faqRouter,
} from "./routes";
import { smsRouter } from "./routes/sms";
import { routeNotFound, errorHandler } from "./middleware";
import { orgRouter } from "./routes/organisation";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";
// import updateRouter from "./routes/updateOrg";
import { Limiter } from "./utils";
import ServerAdapter from "./views/bull-board";
import passport from "./config/google.passport.config";
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
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(passport.initialize());
server.get("/api/v1", (req: Request, res: Response) => {
  res.json({ message: "I am the express API responding for team Panther" });
});

server.get("/api/v1/probe", (req: Request, res: Response) => {
  res.send("I am the express api responding for team panther");
});
server.use("/api/v1", authRoute);
server.use("/api/v1", userRouter);
server.use("/api/v1", adminRouter);
server.use("/api/v1", sendEmailRoute);
server.use("/api/v1", helpRouter);
server.use("/api/v1", productRouter);
server.use("/api/v1", paymentFlutterwaveRouter);
server.use("/api/v1", paymentStripeRouter);
server.use("/api/v1", smsRouter);
server.use("/api/v1", notificationRouter);
server.use("/api/v1", paymentRouter);
server.use("/api/v1", orgRouter);
server.use("/api/v1", exportRouter);
server.use("/api/v1", testimonialRoute);
server.use("/api/v1", blogRouter);
server.use("/api/v1", contactRouter);
server.use("/api/v1", jobRouter);
server.use("/api/v1", orgRouter);
server.use("/api/v1", faqRouter);
server.use("/api/v1/queues", ServerAdapter.getRouter());
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use(routeNotFound);
server.use(errorHandler);

AppDataSource.initialize()
  .then(async () => {
    // await seed();
    server.use(express.json());
    server.get("/", (req: Request, res: Response) => {
      res.send("Hello world");
    });

    server.get("/probe", (req: Request, res: Response) => {
      try {
        res.send("I am the express api responding for team panther");
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    server.listen(port, () => {
      log.info(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => console.error(error));

export default server;
