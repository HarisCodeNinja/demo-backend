import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {leaveTypeQueryValidator, createLeaveTypePayloadValidator, updateLeaveTypePayloadValidator, leaveTypeParamValidator} from './validation';
import {fetchLeaveTypeList, selectLeaveType, addLeaveType, editLeaveType, updateLeaveType, getLeaveType, deleteLeaveType} from './service';
import { QueryLeaveTypeInput } from './types';


export const LeaveTypeRoutes = Router();

LeaveTypeRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(leaveTypeQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchLeaveTypeList(req.query as unknown as QueryLeaveTypeInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

LeaveTypeRoutes.get('/select', validateAccessToken, requireRoles(['user:hr','user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await selectLeaveType();
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

LeaveTypeRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createLeaveTypePayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addLeaveType(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

LeaveTypeRoutes.get('/:leaveTypeId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(leaveTypeParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editLeaveType(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateLeaveType = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateLeaveTypePayloadValidator(req.params.leaveTypeId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
LeaveTypeRoutes.put('/:leaveTypeId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(leaveTypeParamValidator, 'params'),
  validateUpdateLeaveType,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateLeaveType(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

LeaveTypeRoutes.get('/detail/:leaveTypeId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(leaveTypeParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getLeaveType(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

LeaveTypeRoutes.delete('/:leaveTypeId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(leaveTypeParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteLeaveType(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

