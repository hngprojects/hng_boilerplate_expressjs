import { AppDataSource } from '../data-source';
import { EmailQueue } from '../models/emailQueue';
import { EmailQueuePayload } from '../types';
import { Sendmail } from '../utils/mail';

export class EmailService {
    async queueEmail(payload: EmailQueuePayload): Promise<EmailQueue> {
      const emailQueueRepository = AppDataSource.getRepository(EmailQueue);
      const newEmail = emailQueueRepository.create(payload);
      return await emailQueueRepository.save(newEmail);
    }
  
    async sendEmail(payload: EmailQueuePayload): Promise<void> {
      
      console.log(`Sending email to ${payload.recipient} using template ${payload.templateId} with variables:`, payload.variables);
    
    }
  }