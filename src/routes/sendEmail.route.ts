import   {Router} from 'express';
import { SendEmail } from '../controllers/sendEmail.controller';

const sendEmailRoute = Router();

sendEmailRoute.post('/send-email', SendEmail);

export { sendEmailRoute };