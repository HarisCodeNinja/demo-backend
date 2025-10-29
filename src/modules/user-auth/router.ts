import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';

import {
  userLoginValidation,
  userRegisterValidation,
  userProfileUpdateValidation,
  userParamValidator,
  userForgotPasswordValidation,
  userResetPasswordValidation,
  userChangePasswordValidation,
} from './validation';

import { resetUserPasswords, loginUser, registerUser, fetchUserProfile, updateUserProfile, forgotUserPassword, resetUserPassword, changeUserPassword } from './service';

import { validateAccessToken } from '../../helper/auth';

export const UserAuthRoutes = Router();

UserAuthRoutes.post(
  '/reset-passwords',
  asyncHandler(async (_req, res) => {
    const data = await resetUserPasswords();
    res.json(data);
  }),
);

UserAuthRoutes.post(
  '/login',
  validateZodSchema(userLoginValidation, 'body'),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };
    const result = await loginUser(email, password);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

UserAuthRoutes.post(
  '/register',
  validateZodSchema(userRegisterValidation, 'body'),
  asyncHandler(async (req, res) => {
    const result = await registerUser(req.body as any);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

UserAuthRoutes.get(
  '/profile',
  validateAccessToken,
  asyncHandler(async (req, res) => {
    const userId = (req as any).user?.userId;
    const result = await fetchUserProfile(userId);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

const validateUpdateUserProfile = (req: Request, res: Response, next: NextFunction) => {
  const schema = userProfileUpdateValidation(req.params.userId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
UserAuthRoutes.put(
  '/profile/:userId',
  validateAccessToken,
  validateZodSchema(userParamValidator, 'params'),
  validateUpdateUserProfile,
  asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    if (userId !== (req as any).user?.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const result = await updateUserProfile(userId, req.body as any);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

UserAuthRoutes.post(
  '/forgot-password',
  validateZodSchema(userForgotPasswordValidation, 'body'),
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await forgotUserPassword(email);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

UserAuthRoutes.post(
  '/reset-password',
  validateZodSchema(userResetPasswordValidation, 'body'),
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await resetUserPassword(token, newPassword);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

UserAuthRoutes.put(
  '/change-password/:userId',
  validateAccessToken,
  validateZodSchema(userParamValidator, 'params'),
  validateZodSchema(userChangePasswordValidation, 'body'),
  asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    if (userId !== (req as any).user?.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    const { currentPassword, newPassword } = req.body;
    const result = await changeUserPassword(userId, currentPassword, newPassword);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);
