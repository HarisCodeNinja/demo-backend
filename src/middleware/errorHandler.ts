import { Request, Response, NextFunction } from 'express';
import logger from '../util/logger';
import {env} from '../config/env'

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  // Structured error logging
  logger.error({ err, url: req.originalUrl, method: req.method }, 'Unhandled error');

  // Handle Sequelize errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      errorCode: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: err.message,
    });
  }

  // Handle JWT errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      errorCode: 'UNAUTHORIZED',
      message: 'Invalid token or no token provided',
    });
  }

  // Default error response
  res.status(statusCode).json({
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Internal server error',
    ...(env.ENVIRONMENT === 'development' && { stack: err.stack }),
  });
};
