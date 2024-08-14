// import Bull, { Job } from "bull";
// import config from "../config";
// import smsServices from "../services/sms.services";
// import logs from "./logger";
// import { Sendmail } from "./mail";

// interface EmailData {
//   from: string;
//   to: string;
//   subject: string;
//   html: string;
// }

// interface SmsData {
//   sender_id: string;
//   message: string;
//   phone_number: string;
// }

// const retries: number = 3;
// const delay = 1000 * 60 * 5;

// const redisConfig = {
//   host: config.REDIS_HOST,
//   port: Number(config.REDIS_PORT),
//   // password: config.REDIS_PASSWORD,
// };

// const emailQueue = new Bull("Email", {
//   redis: redisConfig,
// });

// const addEmailToQueue = async (data: EmailData) => {
//   await emailQueue.add(data, {
//     attempts: retries,
//     backoff: {
//       type: "fixed",
//       delay,
//     },
//   });
// };

// emailQueue.process(async (job: Job, done) => {
//   try {
//     await Sendmail(job.data);
//     job.log("Email sent successfully to " + job.data.to);
//     logs.info("Email sent successfully");
//   } catch (error) {
//     logs.error("Error sending email:", error);
//     throw error;
//   } finally {
//     done();
//   }
// });

// // Notification Queue
// const notificationQueue = new Bull("Notification", {
//   redis: redisConfig,
// });

// const addNotificationToQueue = async (data: any) => {
//   await notificationQueue.add(data, {
//     attempts: retries,
//     backoff: {
//       type: "fixed",
//       delay,
//     },
//   });
// };

// notificationQueue.process(async (job: Job, done) => {
//   try {
//     // sending Notification Function
//     job.log("Notification sent successfully to " + job.data.to);
//     logs.info("Notification sent successfully");
//   } catch (error) {
//     logs.error("Error sending notification:", error);
//     throw error;
//   } finally {
//     done();
//   }
// });

// // SMS Queue
// const smsQueue = new Bull("SMS", {
//   redis: redisConfig,
// });

// const addSmsToQueue = async (data: SmsData) => {
//   await smsQueue.add(data, {
//     attempts: retries,
//     backoff: {
//       type: "fixed",
//       delay,
//     },
//   });
// };

// smsQueue.process(async (job: Job, done) => {
//   try {
//     const { sender_id, message, phone_number } = job.data;
//     await smsServices.sendSms(sender_id, phone_number, message);
//     job.log("SMS sent successfully to " + job.data);
//     logs.info("SMS sent successfully");
//   } catch (error) {
//     logs.error("Error sending SMS:", error);
//     throw error;
//   } finally {
//     done();
//   }
// });

// smsQueue.on("completed", (job: Job) => {
//   logs.info(`Job with id ${job.id} has been completed`);
// });

// smsQueue.on("failed", (job: Job, error: Error) => {
//   logs.error(
//     `Job with id ${job.id} has been failed with error: ${error.message}`,
//   );
// });

// notificationQueue.on("completed", (job: Job) => {
//   logs.info(`Job with id ${job.id} has been completed`);
// });

// notificationQueue.on("failed", (job: Job, error: Error) => {
//   logs.error(
//     `Job with id ${job.id} has been failed with error: ${error.message}`,
//   );
// });

// emailQueue.on("completed", (job: Job) => {
//   logs.info(`Job with id ${job.id} has been completed`);
// });

// emailQueue.on("failed", (job: Job, error: Error) => {
//   logs.error(
//     `Job with id ${job.id} has been failed with error: ${error.message}`,
//   );
// });

// export {
//   addEmailToQueue,
//   addNotificationToQueue,
//   addSmsToQueue,
//   emailQueue,
//   notificationQueue,
//   smsQueue,
// };
