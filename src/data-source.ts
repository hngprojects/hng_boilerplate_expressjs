import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config";
import "reflect-metadata";

const isDevelopment = config.NODE_ENV === "development";

const AppDataSource = new DataSource({
  type: "postgres",
  // host: config.DB_HOST,
  // port: 5432,
  // username: config.DB_USER,
  // password: config.DB_PASSWORD,
  // database: config.DB_NAME,
  url: config.DB_URL,
  synchronize: true,
  logging: false,
  entities: ["src/models/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  migrationsTableName: "migrations",
  // ssl: false,
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // },
});

export async function initializeDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}

export default AppDataSource;
