import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT ?? 8000,
  API_PREFIX: "api/v1",
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  TOKEN_SECRET: process.env.AUTH_SECRET,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  NODE_ENV: process.env.NODE_ENV,
};

export default config;
