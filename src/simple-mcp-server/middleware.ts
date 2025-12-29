/**
 * Simple MCP Server Middleware
 * JWT authentication middleware for MCP routes
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'simple-mcp-secret-key';

export interface JWTPayload {
  client_id: string;
  type: string;
  roles: string[];
  iat: number;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

/**
 * Authenticate JWT token from Authorization header
 */
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      error: 'unauthorized',
      message: 'No token provided',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JWTPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({
      error: 'forbidden',
      message: 'Invalid or expired token',
    });
    return;
  }
}
