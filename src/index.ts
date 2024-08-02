import "reflect-metadata";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import config from "./config";
import AppDataSource from "./data-source";
import { errorHandler, routeNotFound } from "./middleware";
import swaggerSpec from "./config/swaggerConfig";
import { Limiter } from "./utils";
import log from "./utils/logger";

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
server.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.get("/", (req: Request, res: Response) => {
  res.send({ message: "I am the express API responding for team panther" });
});
server.get("/api/v1", (req: Request, res: Response) => {
  res.json({ message: "I am the express API responding for team Panther" });
});

server.use(routeNotFound);
server.use(errorHandler);

AppDataSource.initialize()
  .then(async () => {
    server.listen(port, () => {
      log.info(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => log.error(error));

export default server;
