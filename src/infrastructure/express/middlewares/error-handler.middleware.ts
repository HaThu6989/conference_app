import { NextFunction, Request, Response } from "express";

export const errorHandlerMiddleware = (error : any, req: Request, res: Response, next: NextFunction) => {
  const formattedError = {
    message: error.message || 'An error occurs',
    code: (error as any).statusCode || 500
  }
  res.status(formattedError.code).json({
    success: false,
    data: null,
    error: formattedError
  })
}