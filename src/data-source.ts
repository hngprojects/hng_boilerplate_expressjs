import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config";

const isDevelopment = config.NODE_ENV === "development";

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST,
  port: Number(config.DB_PORT) || 5432,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: isDevelopment,
  logging: false,
  entities: ["src/models/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  migrationsTableName: "migrations",
  // ssl: false,
  // extra: {
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  // },
});

export async function initializeDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}

export default AppDataSource;
