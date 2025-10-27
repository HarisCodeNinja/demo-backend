import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {auditLogQueryValidator, createAuditLogPayloadValidator, updateAuditLogPayloadValidator, auditLogParamValidator} from './validation';
import {fetchAuditLogList, addAuditLog, editAuditLog, updateAuditLog, getAuditLog, deleteAuditLog} from './service';
import { QueryAuditLogInput } from './types';


export const AuditLogRoutes = Router();

AuditLogRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(auditLogQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchAuditLogList(req.query as unknown as QueryAuditLogInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

AuditLogRoutes.post('/', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(createAuditLogPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addAuditLog(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

AuditLogRoutes.get('/:auditLogId', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(auditLogParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editAuditLog(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateAuditLog = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateAuditLogPayloadValidator(req.params.auditLogId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
AuditLogRoutes.put('/:auditLogId', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(auditLogParamValidator, 'params'),
  validateUpdateAuditLog,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateAuditLog(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

AuditLogRoutes.get('/detail/:auditLogId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(auditLogParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAuditLog(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

AuditLogRoutes.delete('/:auditLogId', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(auditLogParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteAuditLog(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

