import Bull, { Job } from "bull";
import config from "../config";
import { EmailData, SmsData } from "../types/index";
import logs from "./logger";
import { Sendmail } from "./mail";
import sendSms from "./sms";

const retries: number = 2;
const delay: number = 1000 * 30;

const redisConfig = {
  host: config.REDIS_HOST,
  port: Number(config.REDIS_PORT),
};

function asyncHandler(fn: (job: Job) => Promise<void>) {
  return (job: Job, done: Bull.DoneCallback) => {
    Promise.resolve(fn(job))
      .then(() => done())
      .catch(done);
  };
}

const emailQueue = new Bull("Email", { redis: redisConfig });

const addEmailToQueue = async (data: EmailData): Promise<string> => {
  try {
    await emailQueue.add(data, {
      attempts: retries,
      backoff: {
        type: "fixed",
        delay,
      },
    });
    return "Email sent.";
  } catch (error) {
    return "Error sending email!";
  }
};

emailQueue.process(
  asyncHandler(async (job: Job) => {
    await Sendmail(job.data);
    job.log("Email sent successfully to " + job.data.to);
    logs.info("Email sent successfully");
  }),
);

// Notification Queue
const notificationQueue = new Bull("Notification", { redis: redisConfig });

const addNotificationToQueue = async (data: any) => {
  await notificationQueue.add(data, {
    attempts: retries,
    backoff: {
      type: "fixed",
      delay,
    },
  });
};

notificationQueue.process(
  asyncHandler(async (job: Job) => {
    // Sending Notification Function
    job.log("Notification sent successfully to " + job.data.to);
    logs.info("Notification sent successfully");
  }),
);

// SMS Queue
const smsQueue = new Bull("SMS", { redis: redisConfig });

const addSmsToQueue = async (data: SmsData) => {
  await smsQueue.add(data, {
    attempts: retries,
    backoff: {
      type: "fixed",
      delay,
    },
  });
};

smsQueue.process(
  asyncHandler(async (job: Job) => {
    const { message, phoneNumber } = job.data;
    await sendSms(phoneNumber, message);
    job.log("SMS sent successfully to " + job.data.phoneNumber);
    logs.info("SMS sent successfully");
  }),
);

const handleJobCompletion = (queue: Bull.Queue, type: string) => {
  queue.on("completed", (job: Job) => {
    logs.info(`${type} Job with id ${job.id} has been completed`);
  });

  queue.on("failed", (job: Job, error: Error) => {
    logs.error(
      `${type} Job with id ${job.id} has been failed with error: ${error.message}`,
    );
  });
};

handleJobCompletion(smsQueue, "SMS");
handleJobCompletion(notificationQueue, "Notification");
handleJobCompletion(emailQueue, "Email");

export {
  addEmailToQueue,
  addNotificationToQueue,
  addSmsToQueue,
  emailQueue,
  notificationQueue,
  smsQueue,
};
