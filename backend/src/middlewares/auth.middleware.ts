import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../config/db.js';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
      };
    }
  }
}

import config from '../config/config.js';

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    if (!decoded?.id) {
         throw new ApiError(401, 'Invalid Access Token');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
          id: true,
          email: true,
          role: true,
          // Add isBanned checks etc later if schema supports
      }
    });

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }

    req.user = { id: user.id, role: user.role, email: user.email };
    next();
    
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, "Invalid token");
    }
    throw new ApiError(401, (error as any)?.message || 'Invalid access token');
  }
};
