import express, { Express, Request, Response } from "express";
import log from "./utils/logger";
import config from "config";

const server: Express = express();
const port = config.get<string>("port");

server.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

server.listen(port, () => {
  log.info(`Server is listening on port ${port}`);
});

export default server;
