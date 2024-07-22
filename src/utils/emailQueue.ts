import Bull from 'bull';
import config from '../config';
import { Sendmail } from './mail';
import log from './logger';


const emailQueue = new Bull('email', {
  redis: {
    host: config.REDIS_HOST,
    port: Number(config.REDIS_PORT),
    // password: config.REDIS_PASSWORD,
  },
});


emailQueue.process(async (job) => {
  try {
    await Sendmail(job.data);
    log.info(`Email sent successfully to ${job.data.to}` );
  } catch (error) {
    log.error('Error sending email:', error);
    throw error;
  }
});

export default emailQueue;
