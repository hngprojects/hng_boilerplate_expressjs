import "reflect-metadata";
import { DataSource, Tree } from "typeorm";
import config from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: config.DB_URL,
  // host: config.DB_HOST,
  // port: 5432,
  // username: config.DB_USER,
  // password: config.DB_PASSWORD,
  // database: config.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["src/models/**/*.ts"],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
