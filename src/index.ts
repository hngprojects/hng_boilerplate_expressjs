import "reflect-metadata";
import dotenv from "dotenv";
import AppDataSource from "./data-source";
import app from "./app";
import config from "./config";
import log from "./utils/logger";

dotenv.config();

const port = config.port;

AppDataSource.initialize()
  .then(async () => {
    app.listen(port, () => {
      log.info(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => log.error(error));
