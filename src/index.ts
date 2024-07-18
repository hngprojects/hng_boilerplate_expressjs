import express, { Express, Request, Response } from "express";

const server: Express = express();

server.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

server.listen(process.env.PORT || 8080, () => {
  console.info(`Server is listening on port ${process.env.PORT || 8080}`);
});
