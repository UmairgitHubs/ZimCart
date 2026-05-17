import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { getDeviceInfo } from '../utils/device.utils.js';
import logger from '../utils/logger.js';
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
};
const generateTokensAndSetCookies = async (res, user, deviceInfo) => {
    const data = await authService.loginWithTokens(user, deviceInfo);
    res.cookie('accessToken', data.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', data.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
    };
};
export const register = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        throw new ApiError(400, "Name, email and password are required");
    }
    const deviceInfo = getDeviceInfo(req);
    const data = await authService.register(req.body, deviceInfo);
    await generateTokensAndSetCookies(res, data.user, deviceInfo);
    return res.status(201).json(new ApiResponse(201, data, "User registered successfully"));
});
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    const deviceInfo = getDeviceInfo(req);
    const loginResult = await authService.login(req.body, deviceInfo);
    if (loginResult.mfaRequired) {
        return res.status(200).json(new ApiResponse(200, loginResult, "2FA Required"));
    }
    const data = await generateTokensAndSetCookies(res, loginResult.user, deviceInfo);
    return res.status(200).json(new ApiResponse(200, data, "User logged in successfully"));
});
export const refresh = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) {
        console.log("Refresh token is missing");
        throw new ApiError(401, "Invalid Credentials");
    }
    const data = await authService.refreshTokens(incomingRefreshToken);
    res.cookie('accessToken', data.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', data.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.status(200).json(new ApiResponse(200, { accessToken: data.accessToken, refreshToken: data.refreshToken }, "Token refreshed successfully"));
});
export const logout = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const sessionId = req.user?.sessionId;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    await authService.logout(userId, sessionId);
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return res.status(200).json(new ApiResponse(200, result, "Reset email sent"));
});
export const verifyResetCode = asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code)
        throw new ApiError(400, "Email and code are required");
    const result = await authService.verifyResetCode(email, code);
    return res.status(200).json(new ApiResponse(200, result, "Code verified successfully"));
});
export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    return res.status(200).json(new ApiResponse(200, result, "Password reset successfully"));
});
export const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    const result = await authService.changePassword(userId, req.body);
    return res.status(200).json(new ApiResponse(200, result, "Password changed successfully"));
});
export const verify2FA = asyncHandler(async (req, res) => {
    const { mfaToken, code } = req.body;
    if (!mfaToken || !code)
        throw new ApiError(400, "MFA token and code are required");
    const deviceInfo = getDeviceInfo(req);
    const data = await authService.verify2FA(mfaToken, code, deviceInfo);
    await generateTokensAndSetCookies(res, data.user, deviceInfo);
    return res.status(200).json(new ApiResponse(200, data, "2FA verification successful"));
});
export const resend2FA = asyncHandler(async (req, res) => {
    const { mfaToken } = req.body;
    if (!mfaToken)
        throw new ApiError(400, "MFA token is required");
    const result = await authService.resend2FA(mfaToken);
    return res.status(200).json(new ApiResponse(200, result, "New verification code sent"));
});
export const getMe = asyncHandler(async (req, res) => {
    const userPayload = req.user;
    if (!userPayload) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await authService.getUserById(userPayload.id);
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, { user }, "User profile fetched successfully"));
});
//# sourceMappingURL=auth.controller.js.map