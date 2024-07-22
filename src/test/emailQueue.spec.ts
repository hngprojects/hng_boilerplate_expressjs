//@ts-nocheck

import { EmailService } from '../services/sendEmail.service';
import { AppDataSource } from '../data-source';
import emailQueue from '../utils/emailQueue';
import { EmailQueuePayload } from '../types';

jest.mock('../data-source');
jest.mock('../utils/emailQueue');

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  it('should queue an email', async () => {
    const payload: EmailQueuePayload = {
      templateId: 'template1',
      recipient: 'test@example.com',
      variables: {},
    };

    const emailQueueRepository = AppDataSource.getRepository();
    emailQueueRepository.create.mockReturnValue(payload);
    emailQueueRepository.save.mockResolvedValue(payload);

    await emailService.queueEmail(payload);

    expect(emailQueueRepository.create).toHaveBeenCalledWith(payload);
    expect(emailQueueRepository.save).toHaveBeenCalledWith(payload);
    expect(emailQueue.add).toHaveBeenCalledWith({
      from: expect.any(String),
      to: payload.recipient,
      subject: 'Email subject',
      text: 'Message to be replaced with the template',
      html: '<b>Message to be replaced with the template</b>',
    });
  });

  it('should log sending email', async () => {
    const payload: EmailQueuePayload = {
      templateId: 'template1',
      recipient: 'test@example.com',
      variables: {},
    };

    console.log = jest.fn();

    await emailService.sendEmail(payload);

    expect(console.log).toHaveBeenCalledWith(
      `Sending email to ${payload.recipient} using template ${payload.templateId} with variables:`,
      payload.variables
    );
  });
});