import AppDataSource from "../data-source";
import { EmailQueue } from "../models";
import { EmailQueuePayload } from "../types";
import { addEmailToQueue } from "../utils/queue";
import config from "../config";
import { ServerError } from "../middleware";
import path from "path";
import fs from "fs";
import renderTemplate from "../views/email/renderTemplate";

export class EmailService {
  async queueEmail(payload: EmailQueuePayload): Promise<EmailQueue> {
    const emailQueueRepository = AppDataSource.getRepository(EmailQueue);
    const newEmail = emailQueueRepository.create(payload);
    await emailQueueRepository.save(newEmail);

    const templatePath = path.resolve(
      `src/views/email/templates/${payload.templateId}.hbs`,
    );

    if (!fs.existsSync(templatePath)) {
      throw new ServerError(`Invalid template id: ${templatePath}`);
    }

    const variables = {
      userName: payload.variables?.userName || "User",
      title: payload.variables?.title,
    };

    const emailContent = {
      from: config.SMTP_USER,
      to: payload.recipient,
      subject: variables.title,
      html: renderTemplate(payload.templateId, variables),
    };

    await addEmailToQueue(emailContent);

    return newEmail;
  }
}
