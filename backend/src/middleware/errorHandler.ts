import { Request, Response, NextFunction } from "express";


class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}


const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};


export { errorHandler, ErrorResponse };