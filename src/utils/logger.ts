import logger from 'pino';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';

// Define the log directory path
const logDir = path.join(__dirname, '..', 'logs');

// Ensure the log directory exists
if (!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}

const log = logger({
  transport: {
    target: 'pino-pretty',
    options: {
      // Write logs to a file in the logs directory
      destination: path.join(logDir, 'app.log'),
    },
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
