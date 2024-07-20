import { Router } from 'express';
import { loginUser } from '../controllers/AuthController';

const router = Router();

router.post('/login', loginUser);

export default router;
