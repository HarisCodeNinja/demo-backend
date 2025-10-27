import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {salaryStructureQueryValidator, createSalaryStructurePayloadValidator, updateSalaryStructurePayloadValidator, salaryStructureParamValidator} from './validation';
import {fetchSalaryStructureList, addSalaryStructure, editSalaryStructure, updateSalaryStructure, getSalaryStructure, deleteSalaryStructure} from './service';
import { QuerySalaryStructureInput } from './types';


export const SalaryStructureRoutes = Router();

SalaryStructureRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(salaryStructureQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchSalaryStructureList(req.query as unknown as QuerySalaryStructureInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

SalaryStructureRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createSalaryStructurePayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addSalaryStructure(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

SalaryStructureRoutes.get('/:salaryStructureId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(salaryStructureParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editSalaryStructure(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateSalaryStructure = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateSalaryStructurePayloadValidator(req.params.salaryStructureId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
SalaryStructureRoutes.put('/:salaryStructureId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(salaryStructureParamValidator, 'params'),
  validateUpdateSalaryStructure,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateSalaryStructure(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

SalaryStructureRoutes.get('/detail/:salaryStructureId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(salaryStructureParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getSalaryStructure(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

SalaryStructureRoutes.delete('/:salaryStructureId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(salaryStructureParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteSalaryStructure(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

