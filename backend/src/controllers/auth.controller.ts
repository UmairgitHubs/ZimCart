import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { getDeviceInfo } from '../utils/device.utils.js';

export class AuthController {
    register = asyncHandler(async (req: Request, res: Response) => {
        const { email, password, name, phone } = req.body;
        
        // Basic validation (can also use Zod middleware)
        if (!email || !password || !name) {
            throw new ApiError(400, "Name, email and password are required");
        }

        const deviceInfo = getDeviceInfo(req);
        const data = await authService.register(req.body, deviceInfo);
        
        return res.status(201).json(
            new ApiResponse(201, data, "User registered successfully")
        );
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        const deviceInfo = getDeviceInfo(req);
        const data = await authService.login(req.body, deviceInfo);

        return res.status(200).json(
            new ApiResponse(200, data, "User logged in successfully")
        );
    });

    refresh = asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = req.body; // Expect RT in body for Mobile Apps

        const data = await authService.refreshTokens(refreshToken);

        return res.status(200).json(
            new ApiResponse(200, data, "Token refreshed successfully")
        );
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        // req.user is populated by verifyJWT middleware
        const userId = req.user?.id;
        const sessionId = req.user?.sessionId;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        await authService.logout(userId, sessionId);

        return res.status(200).json(
            new ApiResponse(200, {}, "Logged out successfully")
        );
    });

    forgotPassword = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        return res.status(200).json(new ApiResponse(200, result, "Reset email sent"));
    });

    verifyResetCode = asyncHandler(async (req: Request, res: Response) => {
        const { email, code } = req.body;
        if (!email || !code) throw new ApiError(400, "Email and code are required");
        
        const result = await authService.verifyResetCode(email, code);
        return res.status(200).json(new ApiResponse(200, result, "Code verified successfully"));
    });

    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { token, password } = req.body;
        const result = await authService.resetPassword(token, password);
        return res.status(200).json(new ApiResponse(200, result, "Password reset successfully"));
    });

    changePassword = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const result = await authService.changePassword(userId, req.body);

        return res.status(200).json(
            new ApiResponse(200, result, "Password changed successfully")
        );
    });

    verify2FA = asyncHandler(async (req: Request, res: Response) => {
        const { mfaToken, code } = req.body;
        if (!mfaToken || !code) throw new ApiError(400, "MFA token and code are required");

        const deviceInfo = getDeviceInfo(req);
        const data = await authService.verify2FA(mfaToken, code, deviceInfo);

        return res.status(200).json(
            new ApiResponse(200, data, "2FA verification successful")
        );
    });

    resend2FA = asyncHandler(async (req: Request, res: Response) => {
        const { mfaToken } = req.body;
        if (!mfaToken) throw new ApiError(400, "MFA token is required");

        const result = await authService.resend2FA(mfaToken);

        return res.status(200).json(
            new ApiResponse(200, result, "New verification code sent")
        );
    });
}

export const authController = new AuthController();
