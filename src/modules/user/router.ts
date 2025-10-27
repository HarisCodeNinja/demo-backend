import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {userQueryValidator, createUserPayloadValidator, updateUserPayloadValidator, userParamValidator} from './validation';
import {fetchUserList, selectUser, addUser, editUser, updateUser, getUser, deleteUser} from './service';
import { QueryUserInput } from './types';


export const UserRoutes = Router();

UserRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(userQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchUserList(req.query as unknown as QueryUserInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

UserRoutes.get('/select', validateAccessToken, requireRoles(['user:hr','user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await selectUser();
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

UserRoutes.post('/', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(createUserPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addUser(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

UserRoutes.get('/:userId', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  validateZodSchema(userParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editUser(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateUserPayloadValidator(req.params.userId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
UserRoutes.put('/:userId', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  validateZodSchema(userParamValidator, 'params'),
  validateUpdateUser,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateUser(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

UserRoutes.get('/detail/:userId', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  validateZodSchema(userParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getUser(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

UserRoutes.delete('/:userId', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(userParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteUser(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

