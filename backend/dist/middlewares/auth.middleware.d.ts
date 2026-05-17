import type { Request, Response, NextFunction } from 'express';
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
export declare const verifyJWT: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyJWTOptional: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const restrictTo: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map