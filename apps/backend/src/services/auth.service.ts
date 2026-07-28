import bcrypt from "bcryptjs";
import { User } from "../models/User.model";
import { RefreshToken } from "../models/RefreshToken.model";
import { IRole } from "../models/Role.model";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { UnauthorizedError, BadRequestError } from "../errors/AppError";
import { LoginInput } from "@mmit-ieee/shared";

export class AuthService {
  static async login(input: LoginInput, ipAddress?: string, userAgent?: string) {
    const user = await User.findOne({ email: input.email.toLowerCase() }).populate<{ role: IRole }>("role");

    if (!user || !user.isActive) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const payload = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      roleId: user.role._id.toString(),
      roleName: user.role.name,
      permissions: user.role.permissions || [],
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const tokenHash = hashToken(refreshToken);

    // Save refresh token session in database
    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress,
      userAgent,
    });

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshTokens(token: string, ipAddress?: string, userAgent?: string) {
    if (!token) {
      throw new UnauthorizedError("Refresh token is required");
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const currentHash = hashToken(token);
    const existingSession = await RefreshToken.findOne({
      userId: payload.userId,
      tokenHash: currentHash,
      isRevoked: false,
    });

    if (!existingSession) {
      throw new UnauthorizedError("Invalid session or revoked refresh token");
    }

    // Revoke old refresh token session
    existingSession.isRevoked = true;
    await existingSession.save();

    const user = await User.findById(payload.userId).populate<{ role: IRole }>("role");
    if (!user || !user.isActive) {
      throw new UnauthorizedError("User no longer exists or is inactive");
    }

    const newPayload = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      roleId: user.role._id.toString(),
      roleName: user.role.name,
      permissions: user.role.permissions || [],
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);
    const newHash = hashToken(newRefreshToken);

    await RefreshToken.create({
      userId: user._id,
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress,
      userAgent,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(token?: string) {
    if (token) {
      const currentHash = hashToken(token);
      await RefreshToken.updateOne(
        { tokenHash: currentHash },
        { $set: { isRevoked: true } }
      );
    }
  }
}
