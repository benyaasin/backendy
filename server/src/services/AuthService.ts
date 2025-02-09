import { User, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

export class AuthService {
  static async register(data: {
    name: string;
    username: string;
    password: string;
  }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        hashed_password: hashedPassword,
        role: 'member'
      }
    });

    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    // Remove hashed password from response
    const { hashed_password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      accessToken,
      refreshToken
    };
  }

  static async login(username: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    // Remove hashed password from response
    const { hashed_password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      accessToken,
      refreshToken
    };
  }

  static async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: number };
      
      const refreshTokenRecord = await prisma.refreshToken.findFirst({
        where: {
          user_id: decoded.userId,
          revoked_at: null,
          expires_at: {
            gt: new Date()
          }
        }
      });

      if (!refreshTokenRecord) {
        throw new Error('Invalid refresh token');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Revoke old refresh token
      await prisma.refreshToken.update({
        where: { id: refreshTokenRecord.id },
        data: { revoked_at: new Date() }
      });

      // Generate new tokens
      return this.generateTokens(user);

    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static async logout(userId: number): Promise<void> {
    // Revoke all refresh tokens for user
    await prisma.refreshToken.updateMany({
      where: {
        user_id: userId,
        revoked_at: null
      },
      data: {
        revoked_at: new Date()
      }
    });
  }

  private static async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
} 