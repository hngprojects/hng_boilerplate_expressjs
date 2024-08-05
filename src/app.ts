import "reflect-metadata";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { errorHandler, routeNotFound } from "./middleware";
import swaggerSpec from "./config/swaggerConfig";
import { Limiter } from "./utils";
import {
  authRoute,
  adminRoute,
  squeezeRoute,
  userRoute,
  helpRoute,
  testimonialRoute,
  emailRoute,
  jobRoute,
  notificationsRoute,
  notificationSettingRoute,
} from "./routes";
import ServerAdapter from "./views/bull-board";

const app: Express = express();
app.options("*", cors());
app.use(
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

app.use(Limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/queues/:passkey", ServerAdapter.getRouter());
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "I am the express API responding for team panther" });
});
app.get("/api/v1", (req: Request, res: Response) => {
  res.json({ message: "I am the express API responding for team Panther" });
});

app.use("/api/v1", authRoute);
app.use("/api/v1", adminRoute);
app.use("/api/v1", squeezeRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", helpRoute);
app.use("/api/v1", testimonialRoute);
app.use("/api/v1", emailRoute);
app.use("/api/v1", jobRoute);
app.use("/api/v1", notificationSettingRoute);
app.use("/api/v1", notificationsRoute);

app.use(routeNotFound);
app.use(errorHandler);

export default app;
