import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(
    "Application Error:",
    err.response?.data || err.message || err
  );

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorDetails = err.response?.data || err.error || undefined;

  return res.status(status).json({
    success: false,
    message,
    ...(errorDetails && { error: errorDetails }),
  });
};
