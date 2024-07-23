// src/index.ts
import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import AppDataSource from "./data-source";
import log from "./utils/logger";
import config from "./config";

dotenv.config();

const port = config.PORT;

AppDataSource.initialize()
  .then(async () => {
    // seed().catch(log.error);

    app.listen(port, () => {
      log.info(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => log.error(error));
