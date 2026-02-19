import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        // We throw a 400 Bad Request
        const message = errorMessages.map((e: any) => `${e.field}: ${e.message}`).join(', ');
        return next(new ApiError(400, `Validation Error: ${message}`));
      }
      return next(error);
    }
  };
};
