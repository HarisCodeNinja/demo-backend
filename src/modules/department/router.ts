import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {departmentQueryValidator, createDepartmentPayloadValidator, updateDepartmentPayloadValidator, departmentParamValidator} from './validation';
import {fetchDepartmentList, selectDepartment, addDepartment, editDepartment, updateDepartment, getDepartment, deleteDepartment} from './service';
import { QueryDepartmentInput } from './types';


export const DepartmentRoutes = Router();

DepartmentRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(departmentQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchDepartmentList(req.query as unknown as QueryDepartmentInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

DepartmentRoutes.get('/select', validateAccessToken, requireRoles(['user:hr','user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await selectDepartment();
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

DepartmentRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createDepartmentPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addDepartment(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

DepartmentRoutes.get('/:departmentId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(departmentParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editDepartment(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateDepartment = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateDepartmentPayloadValidator(req.params.departmentId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
DepartmentRoutes.put('/:departmentId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(departmentParamValidator, 'params'),
  validateUpdateDepartment,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateDepartment(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

DepartmentRoutes.get('/detail/:departmentId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(departmentParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getDepartment(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

DepartmentRoutes.delete('/:departmentId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(departmentParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteDepartment(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

