import { Op, Sequelize, fn } from 'sequelize';
import { AuthUserRegisterInput, AuthUserProfileUpdateInput, AuthUserSessionRecordsInput } from './types';
import { User } from './../user/model';
import {
  generateRandomPassword,
  hashPassword,
  verifyPassword,
  generateAccessToken,
  checkUsernameValidity,
  getScope,
  generatePasswordResetToken,
  hashResetToken,
  getPasswordResetExpiry,
  generateRefreshToken,
} from '../../helper/auth';
import { sendEmail, generatePasswordResetEmail } from '../../helper/email';
import { PasswordResetToken } from '../password/models/password-reset-token';

export const loginUser = async (username: string, password: string) => {
  const user = await User.findOne({
    where: { email: username },
    attributes: [
      'userId',
      // userId, email, username, password, role, createdAt, updatedAt
      [Sequelize.col('User.user_id'), 'userId'],
      [Sequelize.col('User.email'), 'email'],
      [Sequelize.col('User.username'), 'username'],
      [Sequelize.col('User.password'), 'password'],
      [Sequelize.col('User.role'), 'role'],
      [Sequelize.col('User.created_at'), 'createdAt'],
      [Sequelize.col('User.updated_at'), 'updatedAt'],
    ],
  });

  if (!user) {
    return {
      message: 'User not found or username/password incorrect',
      statusCode: 406,
      errorCode: 'INVALID_CREDENTIALS',
    };
  }

  let { valid } = await verifyPassword(password, user.password!);

  if (!valid) {
    return {
      message: 'User not found or username/password incorrect',
      statusCode: 406,
      errorCode: 'INVALID_CREDENTIALS',
    };
  }

  const scope = await getScope(user, 'user');
  const sessionData: Partial<AuthUserSessionRecordsInput> = {
    userId: user.dataValues.userId,
    email: user.dataValues.email,
    username: user.dataValues.username,
    password: user.dataValues.password,
    role: user.dataValues.role,
    createdAt: user.dataValues.createdAt,
    updatedAt: user.dataValues.updatedAt,
  };
  let data = { ...sessionData, scope };

  const token = generateAccessToken(data);
  const refreshToken = generateRefreshToken(data);

  return {
    message: 'user logged in successfully.',
    user: data,
    token,
    refreshToken,
  };
};

export const registerUser = async (payload: AuthUserRegisterInput) => {
  // check if user already exists
  const existingUser = await User.findOne({
    where: { email: payload.email },
  });

  if (existingUser) {
    return {
      message: 'User already exists',
      statusCode: 406,
    };
  }

  // prepare password
  let passwordHash = '';

  if (payload.password) {
    let hashResult = await hashPassword(payload.password);
    passwordHash = hashResult.passwordHash;
  }

  // Create a clean object for creation
  const createPayload: any = {
    ...payload,
    password: passwordHash,
  };

  const user = await User.create(createPayload);

  const scope = await getScope(user, 'user');
  const sessionData: Partial<AuthUserSessionRecordsInput> = {
    userId: user.dataValues.userId,
    email: user.dataValues.email,
    username: user.dataValues.username,
    password: user.dataValues.password,
    role: user.dataValues.role,
    createdAt: user.dataValues.createdAt,
    updatedAt: user.dataValues.updatedAt,
  };
  let data = { ...sessionData, scope };

  let token = generateAccessToken(data);

  return {
    message: 'user has been created successfully.',
    user: data,
    token: token,
  };
};

export const fetchUserProfile = async (userId: string) => {
  const user = await User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      userId: userId,
    },
  });

  if (!user) {
    return {
      message: 'Invalid user ID',
      statusCode: 406,
    };
  }

  return {
    data: user.get({ plain: true }),
  };
};

export const updateUserProfile = async (userId: string, payload: AuthUserProfileUpdateInput) => {
  const user = await User.findOne({
    where: {
      userId: userId,
    },
  });

  if (!user) {
    return {
      message: 'Invalid user',
      statusCode: 406,
    };
  }

  // Create update payload
  const updatePayload: AuthUserProfileUpdateInput = { ...payload } as AuthUserProfileUpdateInput;

  await user.update(updatePayload);

  return {
    message: 'User updated successfully',
  };
};

export const logoutUser = async (userId: string) => {
  const user = await User.findOne({
    where: {
      userId: userId,
    },
  });

  if (!user) {
    return {
      message: 'Invalid user ID',
      statusCode: 406,
    };
  }

  return {
    message: 'user logged out successfully',
  };
};

export const resetUserPasswords = async () => {
  const users = await User.findAll();

  const password = '123456';
  let { passwordHash } = await hashPassword(password);

  const updatePromises = users.map((user) => {
    user.password = passwordHash;
    return user.save();
  });

  await Promise.all(updatePromises);

  return {
    message: `All user passwords changed to '${password}' successfully.`,
  };
};

export const forgotUserPassword = async (email: string) => {
  try {
    // Find user by email
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      return {
        message: 'User not found with this email address',
        statusCode: 404,
      };
    }

    // Generate reset token
    const { token } = generatePasswordResetToken();
    const { hashedToken } = await hashResetToken(token);
    const { expiresAt } = getPasswordResetExpiry();

    // Store reset token in database
    // Note: This assumes you have a PasswordResetToken model
    // You'll need to create this model separately
    await PasswordResetToken.create({
      userId: user.userId,
      token: hashedToken,
      expiresAt,
    });

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/userResetPassword?token=${hashedToken}`;

    // Send email
    const emailTemplate = generatePasswordResetEmail(resetLink, user.username);
    await sendEmail(email, emailTemplate);

    return {
      message: 'Password reset email sent successfully',
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      message: 'Failed to send password reset email',
      statusCode: 500,
    };
  }
};

export const resetUserPassword = async (token: string, newPassword: string) => {
  try {
    // Find valid reset token
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token: token,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!resetToken) {
      return {
        message: 'Invalid or expired reset token',
        statusCode: 400,
      };
    }

    // Find user
    const user = await User.findByPk(resetToken.userId);

    if (!user) {
      return {
        message: 'User not found',
        statusCode: 404,
      };
    }

    // Hash new password
    const { passwordHash } = await hashPassword(newPassword);

    // Update password
    await user.update({
      password: passwordHash,
    });

    // Delete used reset token
    await resetToken.destroy();

    return {
      message: 'Password reset successfully',
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      message: 'Failed to reset password',
      statusCode: 500,
    };
  }
};

export const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  try {
    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return {
        message: 'User not found',
        statusCode: 404,
      };
    }

    // Verify current password
    const { valid } = await verifyPassword(currentPassword, user.password);

    if (!valid) {
      return {
        message: 'Current password is incorrect',
        statusCode: 400,
      };
    }

    // Hash new password
    const { passwordHash } = await hashPassword(newPassword);

    // Update password
    await user.update({
      password: passwordHash,
    });

    return {
      message: 'Password changed successfully',
    };
  } catch (error) {
    console.error('Change password error:', error);
    return {
      message: 'Failed to change password',
      statusCode: 500,
    };
  }
};

export const refreshUserToken = async (userId: number, oldRefreshToken?: string) => {
  const { Sequelize } = require('sequelize');

  const user = await User.findOne({
    where: {
      userId: userId,
    },
    attributes: [
      'userId',
      [Sequelize.col('User.user_id'), 'userId'],
      [Sequelize.col('User.username'), 'username'],
      [Sequelize.col('User.email'), 'email'],
      [Sequelize.col('User.role'), 'role'],
      [Sequelize.col('User.created_at'), 'createdAt'],
      [Sequelize.col('User.updated_at'), 'updatedAt'],
    ],
  });

  if (!user) {
    return {
      message: 'Invalid user ID',
      statusCode: 406,
    };
  }

  const userData = user.dataValues;
  const scope = await getScope(user, 'user');
  let data = { ...userData, scope, userVersion: 1 };

  let token = generateAccessToken(data);
  let refreshToken = generateRefreshToken(data);

  return {
    message: 'user token refreshed successfully',
    user: data,
    token: token,
    refreshToken: refreshToken,
    tokens: {
      accessToken: token,
      refreshToken: refreshToken,
    },
  };
};
