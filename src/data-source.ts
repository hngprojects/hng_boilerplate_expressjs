import "reflect-metadata";
import { DataSource} from "typeorm";
import config from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST,
  port: 5432,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: false,
  logging: false,
  entities: ["src/models/**/*.ts"], // Automatically include all entity files
  migrations: ["src/migration/**/*.ts"], // Automatically include all migration files
  subscribers: ["src/subscriber/**/*.ts"]
  // ssl: false,
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // },
});
