import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {employeeQueryValidator, createEmployeePayloadValidator, updateEmployeePayloadValidator, employeeParamValidator} from './validation';
import {fetchEmployeeList, selectEmployee, addEmployee, editEmployee, updateEmployee, getEmployee, deleteEmployee} from './service';
import { QueryEmployeeInput } from './types';


export const EmployeeRoutes = Router();

EmployeeRoutes.get('/', validateAccessToken, requireRoles(['user:manager','user:hr','user:admin']),
  validateZodSchema(employeeQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchEmployeeList(req.query as unknown as QueryEmployeeInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

EmployeeRoutes.get('/select', validateAccessToken, requireRoles(['user:manager','user:hr','user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await selectEmployee();
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

EmployeeRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createEmployeePayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addEmployee(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

EmployeeRoutes.get('/:employeeId', validateAccessToken, requireRoles(['user:manager','user:hr','user:admin']),
  validateZodSchema(employeeParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editEmployee(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateEmployee = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateEmployeePayloadValidator(req.params.employeeId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
EmployeeRoutes.put('/:employeeId', validateAccessToken, requireRoles(['user:manager','user:hr','user:admin']),
  validateZodSchema(employeeParamValidator, 'params'),
  validateUpdateEmployee,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateEmployee(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

EmployeeRoutes.get('/detail/:employeeId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(employeeParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getEmployee(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

EmployeeRoutes.delete('/:employeeId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(employeeParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteEmployee(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

