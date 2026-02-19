import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateAccessToken = (user: { id: string, role: string, email: string }) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    config.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived access token
  );
};

export const generateRefreshToken = (user: { id: string }) => {
  return jwt.sign(
    { id: user.id },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN as any } // Long-lived refresh token
  );
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET) as { id: string };
};
