import "reflect-metadata";
import { AppDataSource } from "./data-source";
import log from "./utils/logger";
import { seed } from "./seeder";
import express, { Express, Request, Response } from "express";
import config from "./config";
import userRouter from "./routes/user";
import dotenv from "dotenv";

dotenv.config();

const port = config.port
const server: Express = express();
AppDataSource.initialize()
  .then(async () => {
    seed().catch(log.error);
    server.use(express.json());
    server.get("/", (req: Request, res: Response) => {
      res.send("Hello world");
    });
    server.use("/api/v1", userRouter);

    server.listen(port, () => {
      log.info(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => console.error(error));

export default server;
