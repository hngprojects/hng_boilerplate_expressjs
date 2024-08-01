import AppDataSource from "../data-source";
import { EmailQueue, User } from "../models";
import { EmailQueuePayload } from "../types";
import { addEmailToQueue } from "../utils/queue";
import config from "../config";
import { ServerError } from "../middleware";
import path from "path";
import fs from "fs";
import renderTemplate from "../views/email/renderTemplate";

export class EmailService {
  async getEmailTemplates(): Promise<{}[]> {
    const templateDir = path.resolve("src/views/email/templates");
    const templates = fs.readdirSync(templateDir);
    const availableTemplate = templates.map((template) => {
      return { templateId: template.split(".")[0] };
    });

    return availableTemplate;
  }

  async queueEmail(
    payload: EmailQueuePayload,
    user: User,
  ): Promise<EmailQueue> {
    const emailQueueRepository = AppDataSource.getRepository(EmailQueue);
    const newEmail = emailQueueRepository.create(payload);
    await emailQueueRepository.save(newEmail);

    const templatePath = path.resolve(
      `src/views/email/templates/${payload.templateId}.hbs`,
    );
    if (!fs.existsSync(templatePath)) {
      throw new ServerError("Invalid template id" + templatePath);
    }

    const varibles = {
      userName: payload.variables?.userName || "User",
      title: payload.variables?.title,
    };

    const emailContent = {
      from: config.SMTP_USER,
      to: payload.recipient,
      subject: varibles.title,
      html: renderTemplate(payload.templateId, varibles),
    };

    await addEmailToQueue(emailContent);

    return newEmail;
  }

  // async sendEmail(payload: EmailQueuePayload): Promise<void> {
  //   try {
  //   } catch (error) {
  //     throw new ServerError( "Internal server error");
  //   }
  // }
}
