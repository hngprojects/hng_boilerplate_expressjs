import pino from "pino";
import dayjs from "dayjs";

const log = pino({
  transport: {
    target: "pino-pretty",
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;