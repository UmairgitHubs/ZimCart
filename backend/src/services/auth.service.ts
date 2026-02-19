import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.utils.js';
import { sendPasswordResetEmail } from './email.service.js';

export class AuthService {

  async register(data: any) {
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

    // Create tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken({ id: newUser.id });

    // Store refresh token
    await prisma.user.update({
        where: { id: newUser.id },
        data: { refreshToken }
    });

    return { user: newUser, accessToken, refreshToken };
  }

  async login(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken({ id: user.id });

    // Store refresh token (invalidating previous sessions effectively if single column)
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

    const { password: _, refreshToken: __, ...userResponse } = user;

    return { user: userResponse, accessToken, refreshToken };
  }

  async refreshTokens(token: string) {
      if (!token) throw new ApiError(401, "No refresh token provided");

      try {
          const decoded = verifyRefreshToken(token);
          const user = await prisma.user.findUnique({ where: { id: decoded.id } });

          if (!user || user.refreshToken !== token) {
              throw new ApiError(403, "Invalid refresh token or session expired");
          }

          const accessToken = generateAccessToken(user);
          const newRefreshToken = generateRefreshToken({ id: user.id });

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

  async logout(userId: string) {
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
          return { message: "If that email exists, a reset link has been sent." };
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.user.update({
          where: { id: user.id },
          data: {
              resetPasswordToken: passwordResetToken,
              resetPasswordExpires: passwordResetExpires
          }
      });

      // Send Actual Email
      await sendPasswordResetEmail(email, resetToken);

      return { message: "If that email exists, a reset link has been sent." };
  }

  async resetPassword(token: string, password: string) {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const user = await prisma.user.findFirst({
          where: {
              resetPasswordToken: hashedToken,
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
}

export const authService = new AuthService();
