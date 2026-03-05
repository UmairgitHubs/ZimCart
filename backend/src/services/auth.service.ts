import prisma from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } from '../utils/token.utils.js';
import { sendPasswordResetEmail, sendTwoFactorEmail } from './email.service.js';
import * as notificationService from './notification.service.js';

export const createSession = async (userId: string, deviceInfo: any) => {
  return prisma.userSession.create({
    data: {
      userId,
      deviceName: deviceInfo.deviceName || 'Unknown Device',
      deviceType: deviceInfo.deviceType || 'mobile',
      os: deviceInfo.os || 'Unknown OS',
      ipAddress: deviceInfo.ipAddress,
      lastActive: new Date(),
    }
  });
};

export const loginWithTokens = async (user: any, deviceInfo: any) => {
  const session = await createSession(user.id, deviceInfo);

  const accessToken = generateAccessToken({ ...user, sessionId: session.id });
  const refreshToken = generateRefreshToken({ id: user.id, sessionId: session.id });

  await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
  });

  notificationService.sendNotification(
      [user.id],
      'New Login Detected',
      `A new login was successful on your ZimCart account from ${deviceInfo?.os || 'a new device'} (${deviceInfo?.ipAddress || 'unknown IP'}). If this wasn't you, please change your password immediately.`,
      { type: 'SECURITY' }
  ).catch(console.error);

  const { password: _, refreshToken: __, twoFactorCode: ___, twoFactorExpires: ____, ...userResponse } = user;

  return { user: userResponse, accessToken, refreshToken };
};

export const register = async (data: any, deviceInfo?: any) => {
  const { email, password, name, phone, role, country, termsConsent, privacyConsent } = data;

  const finalRole = role || 'CUSTOMER';
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.$transaction(async (tx) => {
    // 1. Create the User primary record
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        country,
        role: finalRole,
        termsConsent: termsConsent || false,
        privacyConsent: privacyConsent || false,
        notifications: {
          create: {
            pushEnabled: true,
            emailEnabled: finalRole === 'CUSTOMER',
            smsEnabled: finalRole === 'CUSTOMER' && !!phone,
            soundEnabled: true,
            vibrationEnabled: true,
            orderUpdatesEnabled: true,
            deliveryUpdatesEnabled: true,
            promotionalEnabled: finalRole === 'CUSTOMER',
            newArrivalsEnabled: finalRole === 'CUSTOMER',
          }
        }
      },
      select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          country: true,
          avatar: true,
          isPremium: true,
          createdAt: true
      }
    });

    // 2. If the user is a STORE_MANAGER, automatically create their Mart
    if (finalRole === 'STORE_MANAGER') {
      await tx.store.create({
        data: {
          name: name, // Default to the manager's provided name
          isActive: true, // Auto-activate for now, can be manual via Admin later
          status: 'OPEN',
          managerId: user.id
        }
      });
    }

    return user;
  });

  let session = null;
  if (deviceInfo) {
    session = await createSession(newUser.id, deviceInfo);
  }

  const accessToken = generateAccessToken({ ...newUser, sessionId: session?.id });
  const refreshToken = generateRefreshToken({ id: newUser.id, sessionId: session?.id });

  await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken }
  });

  return { user: newUser, accessToken, refreshToken };
};

export const login = async (data: any, deviceInfo?: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (user.isTwoFactorEnabled) {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: otpCode,
        twoFactorExpires: otpExpires
      }
    });

    sendTwoFactorEmail(user.email, otpCode).catch(console.error);

    const mfaToken = generateAccessToken({ id: user.id, type: 'mfa' });

    return {
      mfaRequired: true,
      mfaToken,
      email: user.email.replace(/(.{2})(.*)(?=@)/, (_gp1: string, gp2: string, gp3: string) => gp2 + "*".repeat(gp3.length))
    };
  }

  return await loginWithTokens(user, deviceInfo || {});
};

export const verify2FA = async (mfaToken: string, code: string, deviceInfo?: any) => {
  try {
    const decoded = verifyAccessToken(mfaToken);
    if (decoded.type !== 'mfa') throw new ApiError(401, "Invalid MFA token");

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new ApiError(401, "Invalid or expired MFA session");

    if (!user.twoFactorCode || !user.twoFactorExpires || user.twoFactorExpires < new Date()) {
      throw new ApiError(400, "2FA code has expired. Please request a new one.");
    }

    if (user.twoFactorCode !== code) {
      throw new ApiError(400, "Invalid 2FA code.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorCode: null, twoFactorExpires: null }
    });

    const session = await createSession(user.id, deviceInfo || {});

    const accessToken = generateAccessToken({ ...user, sessionId: session.id });
    const refreshToken = generateRefreshToken({ id: user.id, sessionId: session.id });

    notificationService.sendNotification(
        [user.id],
        'New Login Detected',
        `A new login was successful on your ZimCart account via 2FA from ${deviceInfo?.os || 'a new device'}.`,
        { type: 'SECURITY' }
    ).catch(console.error);

    const { password: _, refreshToken: __, twoFactorCode: ___, twoFactorExpires: ____, ...userResponse } = user;
    return { user: userResponse, accessToken, refreshToken };

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid or expired MFA session");
  }
};

export const resend2FA = async (mfaToken: string) => {
  try {
    const decoded = verifyAccessToken(mfaToken);
    if (decoded.type !== 'mfa') throw new ApiError(401, "Invalid MFA token");

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new ApiError(401, "Invalid or expired MFA session");

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorCode: otpCode, twoFactorExpires: otpExpires }
    });

    await sendTwoFactorEmail(user.email, otpCode);

    return { message: "New code sent to your email" };
  } catch (error) {
     if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid or expired MFA session");
  }
};

export const refreshTokens = async (token: string) => {
    if (!token) throw new ApiError(401, "No refresh token provided");

    try {
        const decoded = verifyRefreshToken(token);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user || user.refreshToken !== token) {
            throw new ApiError(403, "Invalid session or token expired");
        }

        const accessToken = generateAccessToken({ ...user, sessionId: decoded.sessionId });
        const newRefreshToken = generateRefreshToken({ id: user.id, sessionId: decoded.sessionId });

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken }
        });

        return { accessToken, refreshToken: newRefreshToken };

    } catch (error) {
        throw new ApiError(403, "Invalid session or token expired");
    }
};

export const logout = async (userId: string, sessionId?: string) => {
    if (sessionId) {
        await prisma.userSession.delete({ where: { id: sessionId, userId } }).catch(() => {});
    }
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null }
    });
    return { message: "Logged out successfully" };
};

export const forgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { message: "If that email exists, a reset code has been sent." };
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const passwordResetToken = crypto.createHash('sha256').update(resetCode).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetPasswordToken: passwordResetToken,
            resetPasswordExpires: passwordResetExpires
        }
    });

    await sendPasswordResetEmail(email, resetCode);

    return { message: "If that email exists, a reset code has been sent." };
};

export const verifyResetCode = async (email: string, code: string) => {
    const hashedToken = crypto.createHash('sha256').update(code).digest('hex');

    const user = await prisma.user.findFirst({
        where: {
            email,
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { gt: new Date() }
        }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired verification code");
    }

    return { token: hashedToken, message: "Code verified successfully" };
};

export const resetPassword = async (token: string, password: string) => {
    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { gt: new Date() }
        }
    });

    if (!user) {
        throw new ApiError(400, "Token is invalid or has expired");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }
    });
    
    return { message: "Password reset successfully. Please login with your new password." };
};

export const changePassword = async (userId: string, data: any) => {
  const { currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    throw new ApiError(400, 'New password must be different from current password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  return { message: 'Password changed successfully' };
};
