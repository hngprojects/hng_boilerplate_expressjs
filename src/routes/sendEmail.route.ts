import   {Router} from 'express';
import { SendEmail } from '../controllers/sendEmail.controller';

const sendEmailRoute = Router();

sendEmailRoute.post('/send_email', SendEmail);

export { sendEmailRoute };