# Email Sending Service Documentation For Hng Boillerplate

## Overview

This documentation describes the implementation of an email sending service using Express.js, TypeORM, and Bull queues with Redis Server. The service supports sending emails based on predefined templates, queuing email requests, and managing email delivery attempts using Bull queues.

## Table of Contents

- [Endpoints](#endpoints)
- [Controllers](#controllers)
- [Services](#services)
- [Queue](#queue)
- [Routes](#routes)
- [Bull Board Integration](#bull-board-integration)

## Endpoints

### Send Email

- **Endpoint**: `/send-email`
- **Method**: POST
- **Description**: Sends an email using a specified template.
- **Request Body**:

  - `template_id`: (string) ID of the email template to use.
  - `recipient`: (string) Email address of the recipient.
  - `variables`: (object) Key-value pairs for template variables.

  | Variable            | Type   | Description                                                                                   |
  | ------------------- | ------ | --------------------------------------------------------------------------------------------- |
  | `title`             | string | The title of the email.                                                                       |
  | `logoUrl`           | string | URL of the company logo.                                                                      |
  | `imageUrl`          | string | URL of the main image in the email.                                                           |
  | `userName`          | string | Name of the recipient user.                                                                   |
  | `activationLinkUrl` | string | URL for account activation.                                                                   |
  | `resetUrl`          | string | URL for password reset.                                                                       |
  | `companyName`       | string | Name of the company.                                                                          |
  | `supportUrl`        | string | URL for customer support.                                                                     |
  | `socialIcons`       | array  | Array of social media icons with URLs and image sources e.g `[{url:"" , imgSrc:"", alt:"" }]` |
  | `companyWebsite`    | string | URL of the company website.                                                                   |
  | `preferencesUrl`    | string | URL to manage email preferences.                                                              |
  | `unsubscribeUrl`    | string | URL to unsubscribe from emails.                                                               |

#### Example:

```JSON
  {
  "template_id": "account-activation-request",
  "recipient": "john.doe@example.com",
  "variables": {
    "tittle": "Activate Your Account",
    "activationLinkUrl": "https://example.com",
    "user_name":"John Doe"
    //other variables if available
     }
  }
```

- **Responses**:
  - `200 OK`: Email sending request accepted and is being processed.
  - `400 Bad Request`: Invalid input, Template ID and recipient are required, or template not found.
  - `404 Not Found`: User not found.
  - `500 Internal Server Error`: An error occurred on the server.

### Get Email Templates

- **Endpoint**: `/email-templates`
- **Method**: GET
- **Description**: Retrieves a list of available email templates.
- **Responses**:

  - `200 OK`: List of available email templates.
  - `500 Internal Server Error`: An error occurred on the server.

  ### Response

  ```json
  {
    "message": "Available templates",
    "templates": [
      {
        "templateId": "account-activation-request"
      },
      {
        "templateId": "account-activation-successful"
      },
      {
        "templateId": "expired-account-activation-link"
      },
      {
        "templateId": "new-activation-link-sent"
      },
      {
        "templateId": "password-reset-complete"
      },
      {
        "templateId": "password-reset"
      }
    ]
  }
  ```

## Controllers

### sendEmail.controller.ts

Handles email sending and template retrieval logic.

```typescript
import { Request, Response } from "express";
import { EmailService } from "../services";
import { EmailQueuePayload } from "../types";
import { User } from "../models";
import AppDataSource from "../data-source";

const emailService = new EmailService();

export const SendEmail = async (req: Request, res: Response) => {
  const { template_id, recipient, variables } = req.body;
  if (!template_id || !recipient) {
    return res.status(400).json({
      success: false,
      status_code: 400,
      message: "Invalid input. Template ID and recipient are required.",
    });
  }

  const payload: EmailQueuePayload = {
    templateId: template_id,
    recipient,
    variables,
  };

  try {
    const availableTemplates: {}[] = await emailService.getEmailTemplates();
    const templateIds = availableTemplates.map(
      (template: { templateId: string }) => template.templateId,
    );

    if (!templateIds.includes(template_id)) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "Template not found",
        available_templates: templateIds,
      });
    }

    const user = await AppDataSource.getRepository(User).findOne({
      where: { email: payload.recipient },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        status_code: 404,
        message: "User not found",
      });
    }

    await emailService.queueEmail(payload, user);
    await emailService.sendEmail(payload);

    return res
      .status(202)
      .json({
        message: "Email sending request accepted and is being processed.",
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getEmailTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await emailService.getEmailTemplates();
    return res.status(200).json({ message: "Available templates", templates });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
```

## Services

### emailService.ts

Handles email-related operations, including fetching templates, queuing emails, and sending emails.

````typescript
import AppDataSource from '../data-source';
import { EmailQueue, User } from '../models';
import { EmailQueuePayload } from '../types';
import { addEmailToQueue } from '../utils/queue';
import config from '../config';
import { ServerError } from '../middleware';
import Handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';

export class EmailService {
  async getEmailTemplates(): Promise<{}[]> {
    const templateDir = path.resolve('src/views/email/templates');
    const templates = fs.readdirSync(templateDir);
    const availableTemplates = templates.map((template) => {
      return { templateId: template.split('.')[0] };
    });

    return availableTemplates;
  }

  async queueEmail(payload: EmailQueuePayload, user): Promise<EmailQueue> {
    const emailQueueRepository = AppDataSource.getRepository(EmailQueue);
    const newEmail = emailQueueRepository.create(payload);
    await emailQueueRepository.save(newEmail);

    const templatePath = path.resolve(`src/views/email/templates/${payload.templateId}.hbs`);
    if (!fs.existsSync(templatePath)) {
      throw new ServerError('Invalid template id' + templatePath);
    }

    const data = {
      title: payload.variables?.title,
      logoUrl: 'https://example.com/logo.png',
      imageUrl: 'https://exampleImg.com/reset-password.png',
      userName: payload.variables?.user_name || user.name,
      activationLinkUrl: payload.variables?.activationLink,
      resetUrl: payload.variables?.resetUrl,
      companyName: 'Boilerplate',
      supportUrl: 'https://example.com/support',
      socialIcons: [
        { url: 'https://facebook.com', imgSrc: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/tiktok@2x.png', alt: 'Facebook' },
        { url: 'https://twitter.com', imgSrc: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/twitter@2x.png', alt: 'Twitter' },
        { url: 'https://instagram.com', imgSrc: 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/instagram@2x.png', alt: 'Instagram' }
      ],
      companyWebsite: 'https://example.com',
      preferencesUrl: 'https://example.com/preferences',
      unsubscribeUrl: 'https://example.com/unsubscribe'
    };

    const templateSource = fs.readFileSync(templatePath, 'utf8');
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
    console.log(`Sending email to ${payload.recipient} using template ${payload.templateId} with variables:`, payload.variables);

    try {
      // Actual email sending logic here
    } catch (error) {
      throw new ServerError('Internal server error');
    }
  }
}


## Queue

### queue.ts

Manages Bull queues for email, notifications, and SMS.

```typescript
import Bull, { Job } from 'bull';
import config from '../config';
import { Sendmail } from './mail';
import logs from './logger';
import smsServices from '../services/sms.services';

interface EmailData {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
}

interface SmsData {
  sender: string;
  message: string;
  phoneNumber: string;
}

const retries: number = 3;
const delay = 1000 * 60 * 5;

const redisConfig = {
  host: config.REDIS_HOST,
  port: Number(config.REDIS_PORT),
};

// Email Queue
const emailQueue = new Bull('Email', {
  redis: redisConfig,
});

const addEmailToQueue = async (data: EmailData) => {
  await emailQueue.add(data, {
    attempts: retries,
    backoff: {
      type: 'fixed',
      delay,
    },
  });
};

emailQueue.process(async (job: Job, done) => {
  try {
    // await Sendmail(job.data);
    job.log('Email sent successfully to ' + job.data.to);
    logs.info('Email sent successfully');
  } catch (error) {
    logs.error

('Error sending email:', error);
    throw error;
  } finally {
    done();
  }
});

// Notification Queue
const notificationQueue = new Bull('Notification', {
  redis: redisConfig,
});

const addNotificationToQueue = async (data: any) => {
  await notificationQueue.add(data, {
    attempts: retries,
    backoff: {
      type: 'fixed',
      delay,
    },
  });
};

notificationQueue.process(async (job: Job, done) => {
  try {
    // sending Notification Function
    job.log('Notification sent successfully to ' + job.data.to);
    logs.info('Notification sent successfully');
  } catch (error) {
    logs.error('Error sending notification:', error);
    throw error;
  } finally {
    done();
  }
});

// SMS Queue
const smsQueue = new Bull('SMS', {
  redis: redisConfig,
});

const addSmsToQueue = async (data: SmsData) => {
  await smsQueue.add(data, {
    attempts: retries,
    backoff: {
      type: 'fixed',
      delay,
    },
  });
};

smsQueue.process(async (job: Job, done) => {
  try {
    // const {sender, message, phoneNumber} = job.data;
    // await smsServices.sendSms(sender, message, phoneNumber);
    job.log('SMS sent successfully to ' + job.data);
    logs.info('SMS sent successfully');
  } catch (error) {
    logs.error('Error sending SMS:', error);
    throw error;
  } finally {
    done();
  }
});

export { emailQueue, smsQueue, notificationQueue, addEmailToQueue, addNotificationToQueue, addSmsToQueue };
````

## Routes

### sendEmail.routes.ts

Defines the API routes for sending emails and retrieving templates.

```typescript
import { Router } from "express";
import {
  SendEmail,
  getEmailTemplates,
} from "../controllers/sendEmail.controller";
import { authMiddleware } from "../middleware";

const sendEmailRoute = Router();

sendEmailRoute.post("/send-email", authMiddleware, SendEmail);
sendEmailRoute.get("/email-templates", getEmailTemplates);

export { sendEmailRoute };
```

## Bull Board Integration

### bullBoard.ts

Integrates Bull Board for monitoring and managing Bull queues.

```typescript
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

ServerAdapter.setBasePath("/admin/queues");
export default ServerAdapter;
```

#### To view the bullboard dashboard visit `/admin/queue`
