const crypto = require('crypto');
import { Request, Response, NextFunction } from 'express';
import { User } from '../modules/user/model';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



// Express Auth Helpers

export const generateAccessToken = (data: object) => {
  const secret = process.env.JWT_SECRET;
  let expiresIn: string | number = process.env.JWT_EXPIRATION || '1d';
  if (secret === undefined) throw new Error('JWT_SECRET is not defined');
  if (!isNaN(Number(expiresIn))) expiresIn = Number(expiresIn);
  return jwt.sign(data, secret, { algorithm: 'HS256', expiresIn });
};

export const getScope = async (user: User, object: string) => {
  let scope = [];
		scope.push('user');
		if(user.role === 'employee'){
			scope.push('user:employee');
		}
		if(user.role === 'manager'){
			scope.push('user:manager');
		}
		if(user.role === 'hr'){
			scope.push('user:hr');
		}
		if(user.role === 'admin'){
			scope.push('user:admin');
		}

  return scope;
};

export const requireRoles = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const userRoles = user?.scope || [];
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!allowedRoles.some((role) => userRoles.includes(role))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

export const validateAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] as string | undefined;
  const token = authHeader && authHeader.split(/\s+/)[1];
  const secret = process.env.JWT_SECRET;
  if (!token) return res.status(401).json({ errorCode: 'NO_TOKEN', message: 'No token provided' });
  if (!secret) return res.status(500).json({ errorCode: 'NO_SECRET', message: 'JWT secret not configured' });
  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ errorCode: 'INVALID_TOKEN', message: 'Invalid token' });
    (req as any).user = decoded;
    next();
  });
};

export const checkUsernameValidity = async (username: string, type: string) => {
  let userCount = 0;
  if (type === 'user') {
    userCount = await User.count({ where: { email: username } });
  }

  return { valid: userCount === 0 };
};

export const hashPassword = async (password: string) => {
  const passwordHash = await bcrypt.hash(password, 10);
  return { passwordHash };
};

export const verifyPassword = async (password: string, hashed: string) => {
  const valid = await bcrypt.compare(password, hashed);
  return { valid };
};

export const generateRandomPassword = (minLength: number = 8) => {
  const getRandomChar = (characters: string) => characters[Math.floor(Math.random() * characters.length)];
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  let password = getRandomChar(lowercaseLetters) + getRandomChar(uppercaseLetters) + getRandomChar(numbers) + getRandomChar(specialChars);
  const remainingLength = minLength - password.length;
  for (let i = 0; i < remainingLength; i++) {
    const allChars = lowercaseLetters + uppercaseLetters + numbers + specialChars;
    password += getRandomChar(allChars);
  }
  password = password.split('').sort(() => Math.random() - 0.5).join('');
  return { password };
};

export const generatePasswordResetToken = (length: number = 48) => {
  const token = crypto.randomBytes(length).toString('hex');
  return { token };
};

export const hashResetToken = async (token: string) => {
  const hashedToken = await bcrypt.hash(token, 10);
  return { hashedToken };
};

export const getPasswordResetExpiry = (minutes: number = 15) => {
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
  return { expiresAt };
};

export const clearPasswordResetState = (auth: any, tokenField: string, expiryField: string) => {
  auth[tokenField] = null;
  auth[expiryField] = null;
};
