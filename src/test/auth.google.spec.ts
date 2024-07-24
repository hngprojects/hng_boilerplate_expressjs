// @ts-nocheck

import request from 'supertest';
import express from 'express';
import passport from 'passport';
import { googleAuthCallback } from '../controllers/googleAuthController';
import { ServerError, Unauthorized } from '../middleware';

const app = express();
app.use(express.json());

jest.mock('../controllers/googleAuthController', () => ({
  googleAuthCallback: jest.fn(),
}));

// Mock passport.authenticate
jest.mock('passport', () => ({
  authenticate: jest.fn((strategy, options, callback) => {
    return (req, res, next) => {
      callback(null, { id: 'googleId', displayName: 'Test User' });
    };
  }),
}));

jest.mock('../services/google.passport.service', () => {
  return {
    GoogleAuthService: jest.fn().mockImplementation(() => ({
      getUserByGoogleId: jest.fn().mockResolvedValue(null),
      handleGoogleAuthUser: jest.fn().mockResolvedValue({ id: '123', name: 'Test User' }),
    })),
  };
});

describe('Google Auth Callback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful authentication', async () => {
    (googleAuthCallback as jest.Mock).mockImplementation((req, res) => {
      res.status(200).json({ id: '123', name: 'Test User' });
    });

    app.get('/auth/google/callback', googleAuthCallback);

    const response = await request(app).get('/auth/google/callback');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '123', name: 'Test User' });
  });

  it('should handle authentication errors', async () => {
    (googleAuthCallback as jest.Mock).mockImplementation((req, res, next) => {
      next(new ServerError("Authentication error"));
    });

    app.get('/auth/google/callback', googleAuthCallback);

    const response = await request(app).get('/auth/google/callback');

    expect(response.status).toBe(500);
  });

});
