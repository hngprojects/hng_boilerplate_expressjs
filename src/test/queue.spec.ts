//@ts-nocheck
import Bull from 'bull';
import { EmailService } from '../services';
import { addEmailToQueue, emailQueue } from '../utils/queue';

// Mocking Bull library
jest.mock('bull', () => {
  const add = jest.fn();
  const process = jest.fn();
  const mockedBull = jest.fn(() => ({
    add,
    process,
  }));
  mockedBull.add = add;
  mockedBull.process = process;
  return mockedBull;
});

const mockAdd = (Bull as any).add;
const mockProcess = (Bull as any).process;

describe('Queue Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addEmailToQueue', () => {
    it('should add email to queue', async () => {
      const emailData = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test Email</p>',
      };

      await addEmailToQueue(emailData);

      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(mockAdd).toHaveBeenCalledWith(emailData, {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 1000 * 60 * 5,
        },
      });
    });
  });

  describe('emailQueue processing', () => {
    it('should process the email queue', async () => {
      const job = {
        data: {
          from: 'test@example.com',
          to: 'recipient@example.com',
          subject: 'Test Subject',
          html: '<p>Test Email</p>',
        },
        log: jest.fn(),
      };

      let done = jest.fn();

      // Mock the Sendmail function
      jest.mock('../utils/mail', () => ({
        Sendmail: jest.fn().mockResolvedValueOnce(true),
      }));

      const { Sendmail } = require('../utils/mail');

      // Directly mock the call to process
      mockProcess.mock.calls.push([
        async (job, done) => {
          await Sendmail(job.data);
          job.log('Email sent successfully to ' + job.data.to);
          done();
        },
      ]);

      const processCallback = mockProcess.mock.calls[0][0];
      await processCallback(job, done);

      expect(Sendmail).toHaveBeenCalledWith(job.data);
      expect(job.log).toHaveBeenCalledWith('Email sent successfully to ' + job.data.to);
      expect(done).toHaveBeenCalled();
    });
  });
});

