import Bull, { Job } from "bull";
import config from "../config";
import { Sendmail } from "./mail";
import logs from "./logger";
import smsServices from "../services/sms.services";

interface EmailData {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
}

interface SmsData {
  sender: string;
  message: string;
  phoneNumber: string;
}

const retries: number = 3;
const delay = 1000 * 60 * 5;

const redisConfig = {
  host: config.REDIS_HOST,
  port: Number(config.REDIS_PORT),
  // password: config.REDIS_PASSWORD,
};

// Email Queue
const emailQueue = new Bull("Email", {
  redis: redisConfig,
});

const addEmailToQueue = async (data: EmailData) => {
  await emailQueue.add(data, {
    attempts: retries,
    backoff: {
      type: "fixed",
      delay,
    },
  });
};

emailQueue.process(async (job: Job, done) => {
  try {
    await Sendmail(job.data);
    job.log("Email sent successfully to " + job.data.to);
    logs.info("Email sent successfully");
  } catch (error) {
    logs.error("Error sending email:", error);
    throw error;
  } finally {
    done();
  }
});

// Notification Queue
const notificationQueue = new Bull("Notification", {
  redis: redisConfig,
});

const addNotificationToQueue = async (data: any) => {
  await notificationQueue.add(data, {
    attempts: retries,
    backoff: {
      type: "fixed",
      delay,
    },
  });
};

notificationQueue.process(async (job: Job, done) => {
  try {
    // sending Notification Function
    job.log("Notification sent successfully to " + job.data.to);
    logs.info("Notification sent successfully");
  } catch (error) {
    logs.error("Error sending notification:", error);
    throw error;
  } finally {
    done();
  }
});

// SMS Queue
const smsQueue = new Bull("SMS", {
  redis: redisConfig,
});

const addSmsToQueue = async (data: SmsData) => {
  await smsQueue.add(data, {
    attempts: retries,
    backoff: {
      type: "fixed",
      delay,
    },
  });
};

smsQueue.process(async (job: Job, done) => {
  try {
    // const {sender , message , phoneNumber} = job.data;
    // await smsServices.sendSms(sender , message , phoneNumber);
    job.log("SMS sent successfully to " + job.data);
    logs.info("SMS sent successfully");
  } catch (error) {
    logs.error("Error sending SMS:", error);
    throw error;
  } finally {
    done();
  }
});

export {
  emailQueue,
  smsQueue,
  notificationQueue,
  addEmailToQueue,
  addNotificationToQueue,
  addSmsToQueue,
};
