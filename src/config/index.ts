import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT ?? 8000,
  "api-prefix": "api/v1",
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  TOKEN_SECRET: process.env.AUTH_SECRET,
  TOKEN_EXPIRY: process.env.AUTH_EXPIRY,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_SERVICE: process.env.SMTP_SERVICE,
  SMTP_PORT: process.env.SMTP_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  NODE_ENV: process.env.NODE_ENV,
  TWILIO_SID: process.env.TWILIO_SID || "ACXXXXXXXXXXXXXXXX",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "twilo_auth_token",
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_AUTH_CALLBACK_URL: process.env.GOOGLE_AUTH_CALLBACK_URL,
  FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY,
  FLW_SECRET_KEY: process.env.FLW_SECRET_KEY,
  FLW_ENCRYPTION_KEY: process.env.FLW_ENCRYPTION_KEY,
  LEMONSQUEEZY_SIGNING_KEY: process.env.LEMONSQUEEZY_SIGNING_KEY,
  BASE_URL: process.env.BASE_URL,
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY,
  SUPER_SECRET_KEY: process.env.SUPER_SECRET_KEY,
};

export default config;
