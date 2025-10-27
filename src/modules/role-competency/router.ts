import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {roleCompetencyQueryValidator, createRoleCompetencyPayloadValidator, updateRoleCompetencyPayloadValidator, roleCompetencyParamValidator} from './validation';
import {fetchRoleCompetencyList, addRoleCompetency, editRoleCompetency, updateRoleCompetency, getRoleCompetency, deleteRoleCompetency} from './service';
import { QueryRoleCompetencyInput } from './types';


export const RoleCompetencyRoutes = Router();

RoleCompetencyRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(roleCompetencyQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchRoleCompetencyList(req.query as unknown as QueryRoleCompetencyInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

RoleCompetencyRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createRoleCompetencyPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addRoleCompetency(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

RoleCompetencyRoutes.get('/:roleCompetencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(roleCompetencyParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editRoleCompetency(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateRoleCompetency = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateRoleCompetencyPayloadValidator(req.params.roleCompetencyId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
RoleCompetencyRoutes.put('/:roleCompetencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(roleCompetencyParamValidator, 'params'),
  validateUpdateRoleCompetency,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateRoleCompetency(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

RoleCompetencyRoutes.get('/detail/:roleCompetencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(roleCompetencyParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getRoleCompetency(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

RoleCompetencyRoutes.delete('/:roleCompetencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(roleCompetencyParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteRoleCompetency(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

