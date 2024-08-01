import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { emailQueue, notificationQueue, smsQueue } from "../utils/queue";
import { BullAdapter } from "@bull-board/api/bullAdapter";

const ServerAdapter = new ExpressAdapter();

createBullBoard({
  queues: [
    new BullAdapter(emailQueue),
    new BullAdapter(notificationQueue),
    new BullAdapter(smsQueue),
  ],
  serverAdapter: ServerAdapter,
});

ServerAdapter.setBasePath("/api/v1/queues");
export default ServerAdapter;
