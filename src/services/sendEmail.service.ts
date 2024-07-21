import e from 'express';
import { AppDataSource } from '../data-source';
import { EmailQueue } from '../models/emailQueue';
import { EmailQueuePayload } from '../types';
import emailQueue from '../utils/emailQueue';
import config from '../config';

export class EmailService {
  async queueEmail(payload: EmailQueuePayload): Promise<EmailQueue> {
    const emailQueueRepository = AppDataSource.getRepository(EmailQueue);
    const newEmail = emailQueueRepository.create(payload);
    await emailQueueRepository.save(newEmail);

   
    const emailContent = {
      from:  config.SMTP_USER,
      to: payload.recipient,
      subject: 'Email subject',
      text: 'Message to be replace with the templete',
      html: '<b>Message to be replace with the templete</b>'
    };
    
    await emailQueue.add(emailContent);
    
    return newEmail;
  }

  async sendEmail(payload: EmailQueuePayload): Promise<void> {
    console.log(`Sending email to ${payload.recipient} using template ${payload.templateId} with variables:`, payload.variables);

  

    
    try {
  
    } catch (error) {
      console.error('Error in sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
