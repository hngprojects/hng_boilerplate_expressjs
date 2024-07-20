import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { check, validationResult } from 'express-validator';

export const loginUser = async (req: Request, res: Response) => {
  // Validate request
  await check('email').isEmail().withMessage('Invalid email address').run(req);
  await check('password').notEmpty().withMessage('Password is required').run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid request parameters",
      errors: errors.array(),
      statusCode: 422,
    });
  }

  const { email, password } = req.body;
  const userRepository = getRepository(User);

  try {
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password', error: 'Authentication failed', statusCode: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password', error: 'Authentication failed', statusCode: 401 });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '7d' }
    );

    
    user.refreshToken = refreshToken;
    await userRepository.save(user);

    return res.status(200).json({
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          signup_type: user.signup_type,
          is_active: user.is_active,
          is_verified: user.is_verified,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          last_login_at: new Date().toISOString()
        },
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message, statusCode: 500 });
  }
};
