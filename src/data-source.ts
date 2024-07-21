import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST,
  port: Number(config.DB_PORT) || 5432,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["src/models/**/*.ts"],
  ssl: false,
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // },
});
