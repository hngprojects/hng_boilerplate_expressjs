import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config";

const isDevelopment = config.NODE_ENV === "development";

const AppDataSource = new DataSource({
  type: "postgres",
  url: config.DB_URL,
  // host: config.DB_HOST,
  // port: Number(config.DB_PORT) || 5432,
  // username: config.DB_USER,
  // password: config.DB_PASSWORD,
  // database: config.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["src/models/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  migrationsTableName: "migrations",
  // ssl: true,
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
