import { Request, Response } from 'express';
import PasswordResetService from '../services/passwordReset.services';

const passwordResetService = new PasswordResetService();

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await passwordResetService.requestPasswordReset(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const token = req.headers['x-reset-token'] as string;

  if (!token) {
    return res.status(400).json({ message: "Reset token is missing" });
  }

  try {
    const result = await passwordResetService.resetPassword(newPassword, token);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
