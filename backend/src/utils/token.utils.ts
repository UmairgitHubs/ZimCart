import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    { ...user },
    config.JWT_SECRET,
    { expiresIn: '15m' } 
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { ...user },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN as any }
  );
};

export const verifyRefreshToken = (token: string): any => {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
};

export const verifyAccessToken = (token: string): any => {
    return jwt.verify(token, config.JWT_SECRET);
};
