import { User, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import * as argon2 from '@node-rs/argon2';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

const ARGON2_CONFIG = {
  timeCost: 4, // number of iterations
  memoryCost: 65536, // memory usage in KiB
  parallelism: 2, // degree of parallelism
  hashLength: 32 // output hash length
};

export class AuthService {
  static async register(data: {
    name: string;
    username: string;
    password: string;
  }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const hashedPassword = await argon2.hash(data.password, ARGON2_CONFIG);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        hashed_password: hashedPassword,
        role: 'member'
      }
    });

    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Save refresh token with expiry
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
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

    const validPassword = await argon2.verify(user.hashed_password, password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    // Revoke all existing refresh tokens for this user
    await prisma.refreshToken.updateMany({
      where: {
        user_id: user.id,
        revoked_at: null
      },
      data: {
        revoked_at: new Date()
      }
    });

    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Save new refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
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
          token: token,
          revoked_at: null,
          expires_at: {
            gt: new Date()
          }
        },
        include: {
          user: true
        }
      });

      if (!refreshTokenRecord || !refreshTokenRecord.user) {
        throw new Error('Invalid refresh token');
      }

      // Revoke current refresh token
      await prisma.refreshToken.update({
        where: { id: refreshTokenRecord.id },
        data: { revoked_at: new Date() }
      });

      // Generate new tokens
      const tokens = await this.generateTokens(refreshTokenRecord.user);

      // Save new refresh token
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          user_id: refreshTokenRecord.user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });

      return tokens;

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
    const tokenPayload = {
      userId: user.id,
      role: user.role,
      name: user.name
    };

    const accessToken = jwt.sign(
      tokenPayload,
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