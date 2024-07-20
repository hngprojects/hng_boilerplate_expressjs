import "reflect-metadata";
import { AppDataSource } from "./data-source";
import log from "./utils/logger";
import express, { Express, Request, Response } from "express";
import config from "./config";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter, authRoute } from "./routes";
import { routeNotFound, errorHandler } from "./middleware";

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
server.use("/api/v1", userRouter);
server.use("/api/v1/auth", authRoute);
server.use(routeNotFound);
server.use(errorHandler);

AppDataSource.initialize()
  .then(async () => {
    server.listen(port, () => {
      log.info(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => console.error(error));

export default server;
