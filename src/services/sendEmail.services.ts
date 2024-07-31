import AppDataSource from "../data-source";
import { EmailQueue, User } from "../models";
import { EmailQueuePayload } from "../types";
import { addEmailToQueue } from "../utils/queue";
import config from "../config";
import { ServerError } from "../middleware";
import Handlebars from "handlebars";
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

    const data = {
      title: payload.variables?.title,
      logoUrl: payload.variables?.logoUrl || "https://example.com/logo.png",
      imageUrl:
        payload.variables?.imageUrl ||
        "https://exampleImg.com/reset-password.png",
      userName: payload.variables?.userName || "User",
      activationLinkUrl: payload.variables?.activationLink,
      resetUrl: payload.variables?.resetUrl,
      body: payload.variables?.body,
      companyName: payload.variables?.companyName || "Boilerplate",
      supportUrl:
        payload.variables?.supportUrl || "https://example.com/support",
      socialIcons: payload.variables?.socialIcons || [
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
      companyWebsite:
        payload.variables?.companyWebsite || "https://example.com",
      preferencesUrl:
        payload.variables?.preferencesUrl || "https://example.com/preferences",
      unsubscribeUrl:
        payload.variables?.unsubscribeUrl || "https://example.com/unsubscribe",
    };

    const templateSource = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateSource);
    const htmlTemplate = template(data);

    const varibles = {
      userName: payload.variables?.userName || "User",
      title: payload.variables?.title,
      // activationLinkUrl:"https://example.com"
    };

    const emailContent = {
      from: config.SMTP_USER,
      to: payload.recipient,
      subject: data.title,
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
