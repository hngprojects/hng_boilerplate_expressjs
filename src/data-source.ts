import 'reflect-metadata';
import { DataSource, Tree } from 'typeorm';
import config from './config';
const isDevelopment = config.NODE_ENV === 'development';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: 5432,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: isDevelopment,
  logging: false,
  entities: ['src/models/**/*.ts'],
});

export async function initializeDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}

export default AppDataSource;
