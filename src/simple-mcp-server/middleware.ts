/**
 * Simple MCP Server Middleware
 * JWT authentication middleware for MCP routes
 */

import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JWTPayload, AuthRequest, OAuthTokenRequest } from './types';

/**
 * POST /oauth/token
 * Get OAuth access token using client credentials
 */
export const getOAuthToken = asyncHandler(async (req: Request<{}, {}, OAuthTokenRequest>, res: Response) => {
  const { grant_type, client_id, client_secret } = req.body;

  // Validate grant type
  if (grant_type !== 'client_credentials') {
    res.status(400).json({
      error: 'unsupported_grant_type',
      error_description: 'Only client_credentials grant type is supported',
    });
    return;
  }

  // Validate JWT client_secret (generated on client side)
  try {
    // Decode and verify the JWT client_secret
    const decoded = jwt.verify(client_secret, env.JWT_SECRET) as any;
    const roles = decoded.scope || ['user:viewer'];

    // Generate access token with user-specific roles
    const payload: JWTPayload = {
      client_id: client_id,
      type: 'mcp_client',
      roles: roles,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600,
    });
  } catch (error) {
    console.log('[OAuth] Invalid client_secret JWT:', error instanceof Error ? error.message : error);
    res.status(401).json({
      error: 'invalid_client',
      error_description: 'Invalid client credentials',
    });
  }
});

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
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
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
