import AppDataSource from "../data-source";
import { EmailQueue, User } from "../models";
import { EmailQueuePayload } from "../types";
import { addEmailToQueue } from "../utils/queue";
import config from "../config";
import { ServerError } from "../middleware";
import Handlebars from "handlebars";
import path from "path";
import fs from "fs";

export class EmailService {
  async getEmailTemplates(): Promise<{}[]> {
    const templateDir = path.resolve("src/views/email/templates");
    const templates = fs.readdirSync(templateDir);
    const availableTemplate = templates.map((template) => {
      return { templateId: template.split(".")[0] };
    });

    return availableTemplate;
  }

  async queueEmail(payload: EmailQueuePayload, user): Promise<EmailQueue> {
    const emailQueueRepository = AppDataSource.getRepository(EmailQueue);
    const newEmail = emailQueueRepository.create(payload);
    await emailQueueRepository.save(newEmail);

    const templatePath = path.resolve(
      `src/views/email/templates/${payload.templateId}.hbs`,
    );
    if (!fs.existsSync(templatePath)) {
      throw new ServerError("Invalid template id" + templatePath);
    }

    const data = {
      title: payload.variables?.title,
      logoUrl: "https://example.com/logo.png",
      imageUrl: "https://exampleImg.com/reset-password.png",
      userName: payload.variables?.user_name || user.name,
      activationLinkUrl: payload.variables?.activationLink,
      resetUrl: payload.variables?.resetUrl,
      companyName: "Boilerplate",
      supportUrl: "https://example.com/support",
      socialIcons: [
        {
          url: "https://facebook.com",
          imgSrc:
            "https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/tiktok@2x.png",
          alt: "Facebook",
        },
        {
          url: "https://twitter.com",
          imgSrc:
            "https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/twitter@2x.png",
          alt: "Twitter",
        },
        {
          url: "https://instagram.com",
          imgSrc:
            "https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/instagram@2x.png",
          alt: "Instagram",
        },
      ],
      companyWebsite: "https://example.com",
      preferencesUrl: "https://example.com/preferences",
      unsubscribeUrl: "https://example.com/unsubscribe",
    };

    const templateSource = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateSource);
    const htmlTemplate = template(data);

    const emailContent = {
      from: config.SMTP_USER,
      to: payload.recipient,
      subject: data.title,
      html: htmlTemplate,
    };

    await addEmailToQueue(emailContent);

    return newEmail;
  }

  async sendEmail(payload: EmailQueuePayload): Promise<void> {
    console.log(
      `Sending email to ${payload.recipient} using template ${payload.templateId} with variables:`,
      payload.variables,
    );

    try {
    } catch (error) {
      throw new ServerError("Internal server error");
    }
  }
}
