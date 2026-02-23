import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } from '../utils/token.utils.js';
import { sendPasswordResetEmail, sendTwoFactorEmail } from './email.service.js';
import { notificationService } from './notification.service.js';

export class AuthService {

  async register(data: any, deviceInfo?: any) {
    const { email, password, name, phone } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'CUSTOMER', // Default
        notifications: {
            create: {
                pushEnabled: true,
                emailEnabled: true,
                smsEnabled: !!phone,
                soundEnabled: true,
                vibrationEnabled: true,
                orderUpdatesEnabled: true,
                deliveryUpdatesEnabled: true,
                promotionalEnabled: true,
                newArrivalsEnabled: true,
            }
        }
      },
      select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          avatar: true,
          isPremium: true,
          createdAt: true
      }
    });

    // Create session if deviceInfo is provided
    let session = null;
    if (deviceInfo) {
      session = await this.createSession(newUser.id, deviceInfo);
    }

    // Create tokens including sessionId
    const accessToken = generateAccessToken({ ...newUser, sessionId: session?.id });
    const refreshToken = generateRefreshToken({ id: newUser.id, sessionId: session?.id });

    // Store refresh token
    await prisma.user.update({
        where: { id: newUser.id },
        data: { refreshToken }
    });

    return { user: newUser, accessToken, refreshToken };
  }

  async login(data: any, deviceInfo?: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Check 2FA
    if (user.isTwoFactorEnabled) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorCode: otpCode,
          twoFactorExpires: otpExpires
        }
      });

      // Send OTP Email (Wait in background)
      sendTwoFactorEmail(user.email, otpCode).catch(console.error);

      // Return partial response with a temporary MFA token
      const mfaToken = generateAccessToken({ id: user.id, type: 'mfa' });

      return {
        mfaRequired: true,
        mfaToken,
        email: user.email.replace(/(.{2})(.*)(?=@)/, (_gp1: string, gp2: string, gp3: string) => gp2 + "*".repeat(gp3.length))
      };
    }

    // Create session
    const session = await this.createSession(user.id, deviceInfo || {});

    // Create tokens including sessionId
    const accessToken = generateAccessToken({ ...user, sessionId: session.id });
    const refreshToken = generateRefreshToken({ id: user.id, sessionId: session.id });

    // Store refresh token
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

    // Send Login Notification (Don't wait)
    notificationService.sendNotification(
        [user.id],
        'New Login Detected 🔐',
        `A new login was successful on your ZimCart account from ${deviceInfo?.os || 'a new device'} (${deviceInfo?.ipAddress || 'unknown IP'}). If this wasn't you, please change your password immediately.`,
        { type: 'SECURITY' }
    ).catch(console.error);

    const { password: _, refreshToken: __, twoFactorCode: ___, twoFactorExpires: ____, ...userResponse } = user;

    return { user: userResponse, accessToken, refreshToken };
  }

  async verify2FA(mfaToken: string, code: string, deviceInfo?: any) {
    try {
      const decoded = verifyAccessToken(mfaToken); // Using verifyRefreshToken as generic verifier, or use a specific one
      if (decoded.type !== 'mfa') throw new ApiError(401, "Invalid MFA token");

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) throw new ApiError(404, "User not found");

      if (!user.twoFactorCode || !user.twoFactorExpires || user.twoFactorExpires < new Date()) {
        throw new ApiError(400, "2FA code has expired. Please request a new one.");
      }

      if (user.twoFactorCode !== code) {
        throw new ApiError(400, "Invalid 2FA code.");
      }

      // Clear the code
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorCode: null, twoFactorExpires: null }
      });

      // Issue final tokens with new session
      const session = await this.createSession(user.id, deviceInfo || {});

      const accessToken = generateAccessToken({ ...user, sessionId: session.id });
      const refreshToken = generateRefreshToken({ id: user.id, sessionId: session.id });

      // Send Login Notification (Don't wait)
      notificationService.sendNotification(
          [user.id],
          'New Login Detected 🔐',
          `A new login was successful on your ZimCart account via 2FA from ${deviceInfo?.os || 'a new device'}.`,
          { type: 'SECURITY' }
      ).catch(console.error);

      const { password: _, refreshToken: __, twoFactorCode: ___, twoFactorExpires: ____, ...userResponse } = user;
      return { user: userResponse, accessToken, refreshToken };

    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, "Invalid or expired MFA session");
    }
  }

  private async createSession(userId: string, deviceInfo: any) {
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
  }

  async resend2FA(mfaToken: string) {
    try {
      const decoded = verifyAccessToken(mfaToken);
      if (decoded.type !== 'mfa') throw new ApiError(401, "Invalid MFA token");

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) throw new ApiError(404, "User not found");

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
  }

  async refreshTokens(token: string) {
      if (!token) throw new ApiError(401, "No refresh token provided");

      try {
          const decoded = verifyRefreshToken(token);
          const user = await prisma.user.findUnique({ where: { id: decoded.id } });

          if (!user || user.refreshToken !== token) {
              throw new ApiError(403, "Invalid refresh token or session expired");
          }

          const accessToken = generateAccessToken({ ...user, sessionId: decoded.sessionId });
          const newRefreshToken = generateRefreshToken({ id: user.id, sessionId: decoded.sessionId });

          // Rotate refresh token
          await prisma.user.update({
              where: { id: user.id },
              data: { refreshToken: newRefreshToken }
          });

          return { accessToken, refreshToken: newRefreshToken };

      } catch (error) {
          throw new ApiError(403, "Invalid or expired refresh token");
      }
  }

  async logout(userId: string, sessionId?: string) {
      if (sessionId) {
          await prisma.userSession.delete({ where: { id: sessionId, userId } }).catch(() => {});
      }
      await prisma.user.update({
          where: { id: userId },
          data: { refreshToken: null }
      });
      return { message: "Logged out successfully" };
  }



  async forgotPassword(email: string) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
          // Security: Don't reveal if user exists
          return { message: "If that email exists, a reset code has been sent." };
      }

      // Senior Implementation: Generate a 6-digit OTP code for better mobile flow
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const passwordResetToken = crypto.createHash('sha256').update(resetCode).digest('hex');
      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.user.update({
          where: { id: user.id },
          data: {
              resetPasswordToken: passwordResetToken,
              resetPasswordExpires: passwordResetExpires
          }
      });

      // Send Actual Email with Code
      await sendPasswordResetEmail(email, resetCode);

      return { message: "If that email exists, a reset code has been sent." };
  }

  async verifyResetCode(email: string, code: string) {
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
  }

  async resetPassword(token: string, password: string) {
      // The token passed here is now the hashed one returned from verifyResetCode
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

      const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
              password: hashedPassword,
              resetPasswordToken: null,
              resetPasswordExpires: null
          }
      });
      
      return { message: "Password reset successfully. Please login with your new password." };
  }

  async changePassword(userId: string, data: any) {
    const { currentPassword, newPassword } = data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError(404, 'User not found');
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
  }
}

export const authService = new AuthService();
