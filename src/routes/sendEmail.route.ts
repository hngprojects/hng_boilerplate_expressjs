import   {Router} from 'express';
import { SendEmail , getEmailTemplates } from '../controllers/sendEmail.controller';
import { authMiddleware } from '../middleware';

const sendEmailRoute = Router();

sendEmailRoute.post('/send_email', authMiddleware, SendEmail);
sendEmailRoute.get('/email_templates', getEmailTemplates);

export { sendEmailRoute };