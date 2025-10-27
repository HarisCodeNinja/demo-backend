import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {employeeCompetencyQueryValidator, createEmployeeCompetencyPayloadValidator, updateEmployeeCompetencyPayloadValidator, employeeCompetencyParamValidator} from './validation';
import {fetchEmployeeCompetencyList, addEmployeeCompetency, editEmployeeCompetency, updateEmployeeCompetency, getEmployeeCompetency, deleteEmployeeCompetency} from './service';
import { QueryEmployeeCompetencyInput } from './types';


export const EmployeeCompetencyRoutes = Router();

EmployeeCompetencyRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(employeeCompetencyQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchEmployeeCompetencyList(req.query as unknown as QueryEmployeeCompetencyInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

EmployeeCompetencyRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createEmployeeCompetencyPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addEmployeeCompetency(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

EmployeeCompetencyRoutes.get('/:employeeCompetencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(employeeCompetencyParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editEmployeeCompetency(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateEmployeeCompetency = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateEmployeeCompetencyPayloadValidator(req.params.employeeCompetencyId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
EmployeeCompetencyRoutes.put('/:employeeCompetencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(employeeCompetencyParamValidator, 'params'),
  validateUpdateEmployeeCompetency,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateEmployeeCompetency(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

EmployeeCompetencyRoutes.get('/detail/:employeeCompetencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(employeeCompetencyParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getEmployeeCompetency(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

EmployeeCompetencyRoutes.delete('/:employeeCompetencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(employeeCompetencyParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteEmployeeCompetency(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

