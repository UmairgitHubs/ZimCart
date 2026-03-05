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
        sessionId?: string;
      };
    }
  }
}

import config from '../config/config.js';

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Senior: Prioritize Cookies for higher security (HTTP-Only)
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    
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

    // Senior Implementation: Session Validation
    // If token has a sessionId, ensure that session hasn't been revoked
    if (decoded.sessionId) {
      const activeSession = await prisma.userSession.findUnique({
        where: { id: decoded.sessionId }
      });
      if (!activeSession) {
        throw new ApiError(401, 'Your session has been terminated. Please login again.');
      }
    }

    req.user = { 
      id: user.id, 
      role: user.role, 
      email: user.email,
      sessionId: decoded.sessionId 
    };
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


export const verifyJWTOptional = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next(); // No token, no problem (public access)
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    if (!decoded?.id) return next();

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true }
    });

    if (user) {
      req.user = { 
        id: (user as any).id, 
        role: (user as any).role, 
        email: (user as any).email,
        sessionId: decoded.sessionId 
      };
    }
    
    next();
  } catch (error) {
    // If token is expired/invalid, we just treat it as public access
    next();
  }
};


export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'You are not logged in');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `User role '${req.user.role}' is not authorized to access this resource`);
    }

    next();
  };
};
