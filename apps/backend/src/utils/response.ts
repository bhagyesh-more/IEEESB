import { Response } from "express";

interface SendResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    totalDocs?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export const sendResponse = <T>({
  res,
  statusCode = 200,
  message,
  data,
  meta,
}: SendResponseOptions<T>): Response => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
    timestamp: new Date().toISOString(),
  });
};
