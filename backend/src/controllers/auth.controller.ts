import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { getDeviceInfo } from '../utils/device.utils.js';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const, // For cross-domain dev
};

export class AuthController {
    private async generateTokensAndSetCookies(res: Response, user: any, deviceInfo: any) {
        const data = await authService.loginWithTokens(user, deviceInfo);
        
        res.cookie('accessToken', data.accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000, // 15 mins
        });

        res.cookie('refreshToken', data.refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return { user: data.user };
    }

    register = asyncHandler(async (req: Request, res: Response) => {
        const { email, password, name, phone, role } = req.body;
        
        if (!email || !password || !name) {
            throw new ApiError(400, "Name, email and password are required");
        }

        const deviceInfo = getDeviceInfo(req);
        const data = await authService.register(req.body, deviceInfo);
        
        // Use cookie for registration login too
        await this.generateTokensAndSetCookies(res, data.user, deviceInfo);

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
        const loginResult = await authService.login(req.body, deviceInfo) as any;

        if (loginResult.mfaRequired) {
            return res.status(200).json(new ApiResponse(200, loginResult, "2FA Required"));
        }

        // Senior: Set Cookies here
        const data = await this.generateTokensAndSetCookies(res, loginResult.user, deviceInfo);

        return res.status(200).json(
            new ApiResponse(200, data, "User logged in successfully")
        );
    });

    refresh = asyncHandler(async (req: Request, res: Response) => {
        // First check cookies, then body (for mobile)
        const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is missing");
        }

        const data = await authService.refreshTokens(incomingRefreshToken);

        // Update cookies with new tokens
        res.cookie('accessToken', data.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', data.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

        return res.status(200).json(
            new ApiResponse(200, {}, "Token refreshed successfully")
        );
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        const sessionId = req.user?.sessionId;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        await authService.logout(userId, sessionId);

        // Clear cookies
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

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

        // Success: Set Login Cookies
        await this.generateTokensAndSetCookies(res, data.user, deviceInfo);

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

    getMe = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }

        return res.status(200).json(
            new ApiResponse(200, { user }, "User profile fetched successfully")
        );
    });
}

export const authController = new AuthController();
