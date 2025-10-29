import { Sequelize } from 'sequelize';
import { User } from './model';

import { CreateUserInput, UpdateUserInput, QueryUserInput } from './types';
import { hashPassword } from '../../helper/auth';

export const fetchUserList = async (params: QueryUserInput) => {
  const pageSize = Math.min(params.pageSize || 10, 1000);
  const curPage = params.page || 0;

  const { count, rows } = await User.findAndCountAll({
    attributes: [
      // userId, email, username, password, role, createdAt, updatedAt
      [Sequelize.col('User.user_id'), 'userId'],
      [Sequelize.col('User.email'), 'email'],
      [Sequelize.col('User.username'), 'username'],
      [Sequelize.col('User.password'), 'password'],
      [Sequelize.col('User.role'), 'role'],
      [Sequelize.col('User.created_at'), 'createdAt'],
      [Sequelize.col('User.updated_at'), 'updatedAt'],
    ],
    offset: Number(curPage) * Number(pageSize),
    limit: Number(pageSize),
  });

  const plainRows = rows.map((row) => row.get({ plain: true }));
  return { data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const selectUser = async () => {
  const results = await User.findAll({
    attributes: [
      [Sequelize.col('User.user_id'), 'value'],
      [Sequelize.col('User.email'), 'label'],
    ],
  });

  const plainRows = results.map((item) => item.get({ plain: true }));
  return plainRows;
};

export const addUser = async (payload: CreateUserInput): Promise<any> => {
  const userDefaultPayload = {
    role: payload.role ?? 'admin',
  };

  let hashResult = await hashPassword(payload.password);

  const user = await User.create({ ...payload, ...userDefaultPayload, password: hashResult.passwordHash });

  return user.get({ plain: true });
};

export const editUser = async (params: any): Promise<User | { errorCode: string; message: string }> => {
  // Initialize filters and include relationships
  let where: any = {};
  const include: any[] = [];

  const user = await User.findOne({
    attributes: [
      // email, username, password, role
      [Sequelize.col('User.email'), 'email'],
      [Sequelize.col('User.username'), 'username'],
      [Sequelize.col('User.password'), 'password'],
      [Sequelize.col('User.role'), 'role'],
    ],
    where: {
      userId: params.userId,
      ...where,
    },
  });

  if (!user) {
    return { errorCode: 'INVALID_USER_ID', message: 'Invalid user ID' };
  }

  return user.get({ plain: true }) as User;
};

export const updateUser = async (params: any, payload: UpdateUserInput): Promise<any> => {
  let where: any = {};

  const user = await User.findOne({
    where: {
      userId: params.userId,
      ...where,
    },
  });

  if (!user) {
    return { errorCode: 'INVALID_USER_ID', message: 'Invalid user ID' };
  }

  await user.update(payload);

  return {
    message: 'User updated successfully',
    data: user.get({ plain: true }),
  };
};

export const getUser = async (params: any): Promise<any> => {
  let where: any = {};
  const include: any[] = [];

  const user = await User.findOne({
    attributes: [
      // userId, email, username, password, role, createdAt, updatedAt
      [Sequelize.col('User.email'), 'email'],
      [Sequelize.col('User.username'), 'username'],
      [Sequelize.col('User.role'), 'role'],
      [Sequelize.col('User.created_at'), 'createdAt'],
      [Sequelize.col('User.updated_at'), 'updatedAt'],
    ],
    where: {
      userId: params.userId,
      ...where,
    },
    include: [...include],
  });

  if (!user) {
    return { errorCode: 'INVALID_USER_ID', message: 'Invalid user ID' };
  }

  return {
    data: user.get({ plain: true }),
  };
};

export const deleteUser = async (params: any): Promise<any> => {
  let where: any = {};

  const user = await User.findOne({
    where: {
      userId: params.userId,
      ...where,
    },
  });

  if (!user) {
    return { errorCode: 'INVALID_USER_ID', message: 'Invalid user ID' };
  }

  await user.destroy();

  return { messageCode: 'USER_DELETED_SUCCESSFULLY', message: 'user Deleted Successfully' };
};
