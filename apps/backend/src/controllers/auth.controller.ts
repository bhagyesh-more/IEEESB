import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/response";
import { AuthService } from "../services/auth.service";
import { setAuthCookies, clearAuthCookies } from "../utils/jwt";
import { loginSchema } from "@mmit-ieee/shared";
import { BadRequestError } from "../errors/AppError";
import { AuthenticatedRequest } from "../middlewares/authGuard";

export class AuthController {
  static login = asyncHandler(async (req: Request, res: Response) => {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BadRequestError("Invalid login payload", parseResult.error.errors);
    }

    const { user, accessToken, refreshToken } = await AuthService.login(
      parseResult.data,
      req.ip,
      req.headers["user-agent"]
    );

    setAuthCookies(res, accessToken, refreshToken);

    return sendResponse({
      res,
      statusCode: 200,
      message: "Login successful",
      data: {
        user,
        accessToken,
      },
    });
  });

  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } = await AuthService.refreshTokens(
      token,
      req.ip,
      req.headers["user-agent"]
    );

    setAuthCookies(res, accessToken, newRefreshToken);

    return sendResponse({
      res,
      statusCode: 200,
      message: "Tokens refreshed successfully",
      data: {
        accessToken,
      },
    });
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    await AuthService.logout(token);
    clearAuthCookies(res);

    return sendResponse({
      res,
      statusCode: 200,
      message: "Logged out successfully",
    });
  });

  static getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    return sendResponse({
      res,
      statusCode: 200,
      message: "Authenticated user profile fetched successfully",
      data: {
        user: req.user,
      },
    });
  });
}
