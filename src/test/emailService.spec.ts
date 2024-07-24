//@ts-nocheck

import request from 'supertest';
import { Express } from 'express';
import AppDataSource from '../data-source';
import { User } from '../models';
import { EmailService } from '../services';
import { sendEmailRoute } from '../routes/sendEmail.route';
import express from 'express';

jest.mock('../services/sendEmail.services', () => {
  return {
    EmailService: jest.fn().mockImplementation(() => {
      return {
        getEmailTemplates: jest.fn().mockResolvedValue([{ templateId: 'test_template' }]),
        queueEmail: jest.fn().mockResolvedValue({}),
        sendEmail: jest.fn().mockResolvedValue({})
      };
    })
  };
});

jest.mock("../data-source", () => {
  return {
    AppDataSource: {
      manager: {},
      initialize: jest.fn().mockResolvedValue(true),
    },
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
      save: jest.fn(),
    }),
  };
});

jest.mock('../middleware', () => {
  return {
    authMiddleware: (req, res, next) => next()
  };
});

const app: Express = express();
app.use(express.json());
app.use(sendEmailRoute);

describe('SendEmail Controller', () => {
  let mockManager;
  
  beforeEach(() => {
    mockManager = { save: jest.fn() };
    AppDataSource.manager = mockManager;
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('should return 400 if template_id or recipient is missing', async () => {
    const res = await request(app)
      .post('/send_email')
      .send({ template_id: 'test_template' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      status_code: 400,
      message: 'Invalid input. Template ID and recipient are required.'
    });
  });

  it('should return 400 if template_id is not found', async () => {
    const res = await request(app)
      .post('/send_email')
      .send({ template_id: 'non_existent_template', recipient: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      status_code: 400,
      message: 'Template not found',
      available_templates: ['test_template']
    });
  });

  it('should return 404 if user is not found', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/send_email')
      .send({ template_id: 'test_template', recipient: 'nonexistent@example.com' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      status_code: 404,
      message: 'User not found'
    });
  });

  it('should return 202 if email is sent successfully', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockResolvedValueOnce({ email: 'test@example.com' } as User);

    const res = await request(app)
      .post('/send_email')
      .send({ template_id: 'test_template', recipient: 'test@example.com', variables: {} });

    expect(res.status).toBe(202);
    expect(res.body).toEqual({ message: 'Email sending request accepted and is being processed.' });
  });

  it('should return 500 if there is an internal server error', async () => {
    jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockRejectedValueOnce(new Error('Internal server error'));

    const res = await request(app)
      .post('/send_email')
      .send({ template_id: 'test_template', recipient: 'test@example.com', variables: {} });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error.' });
  });
});

describe('GetEmailTemplates Controller', () => {
  it('should return 200 with available templates', async () => {
    const res = await request(app)
      .get('/email_templates');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Available templates',
      templates: [{ templateId: 'test_template' }]
    });
  });
});
