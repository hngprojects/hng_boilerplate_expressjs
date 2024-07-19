import express, { Express, Request, Response } from "express";
import log from "./utils/logger";

const server: Express = express();

server.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

server.listen(process.env.PORT || 8000, () => {
  log.info(`Server is listening on port ${process.env.PORT || 8000}`);
});

export default server;
