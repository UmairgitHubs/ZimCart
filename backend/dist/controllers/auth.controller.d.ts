import type { Response } from 'express';
export declare const register: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const login: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const refresh: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const logout: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const forgotPassword: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const verifyResetCode: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const resetPassword: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const changePassword: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const verify2FA: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const resend2FA: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMe: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=auth.controller.d.ts.map