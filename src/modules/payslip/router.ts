import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {payslipQueryValidator, createPayslipPayloadValidator, updatePayslipPayloadValidator, payslipParamValidator} from './validation';
import {fetchPayslipList, addPayslip, editPayslip, updatePayslip, getPayslip, deletePayslip} from './service';
import { QueryPayslipInput } from './types';


export const PayslipRoutes = Router();

PayslipRoutes.get('/', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  validateZodSchema(payslipQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userContext = (req as any).user; // Get user context from JWT token
    const result = await fetchPayslipList(req.query as unknown as QueryPayslipInput, userContext);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

PayslipRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createPayslipPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addPayslip(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

PayslipRoutes.get('/:payslipId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(payslipParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editPayslip(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdatePayslip = (req: Request, res: Response, next: NextFunction) => {
  const schema = updatePayslipPayloadValidator(req.params.payslipId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
PayslipRoutes.put('/:payslipId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(payslipParamValidator, 'params'),
  validateUpdatePayslip,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updatePayslip(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

PayslipRoutes.get('/detail/:payslipId', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  validateZodSchema(payslipParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userContext = (req as any).user; // Get user context from JWT token
    const result = await getPayslip(req.params, userContext);

    if (result && 'errorCode' in result) {
      const status = result.errorCode === 'FORBIDDEN' ? 403 : 404;
      res.status(status).json(result);
      return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

PayslipRoutes.delete('/:payslipId', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(payslipParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deletePayslip(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

