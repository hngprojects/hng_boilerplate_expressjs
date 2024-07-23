// src/app.ts
import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import router from "./routes/index";
import { routeNotFound, errorHandler } from "./middleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggerConfig";

const app: Express = express();

app.options("*", cors());
app.use(
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

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.use("/" + config.API_PREFIX, router);

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routeNotFound);
app.use(errorHandler);

export default app;
