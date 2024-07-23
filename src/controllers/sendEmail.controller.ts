import { Request, Response } from 'express';
import { EmailService } from '../services';
import { EmailQueuePayload } from '../types';
import { ServerError ,BadRequest } from '../middleware'; 


const emailService = new EmailService();

export const SendEmail = async (req: Request, res: Response) => {

  const { template_id, recipient, variables } = req.body;
  const payload: EmailQueuePayload = { templateId: template_id, recipient, variables };
  if (!template_id || !recipient ) {
    // const response = {
    //   StatusCode: 400,  
    //   error: 'Invalid input. Please provide template_id, recipient, and variables.',
    // };
    res.status(400).json(new BadRequest('Invalid input. Please provide template_id, recipient, and variables.'));
    return;
  }

  try {
    await emailService.queueEmail(payload);
    await emailService.sendEmail(payload);

    const response = {
      message: 'Email sending request accepted and is being processed.',
    };
    res.status(202).json(response);
  } catch (error) {
    console.error('Error sending email:', error);
    const response = {
      statusCode: 500,  
      error: 'Internal server error.',
    };
    res.status(500).json(new ServerError(response.error));
  }
};