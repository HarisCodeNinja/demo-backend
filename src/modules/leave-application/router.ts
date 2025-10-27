import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {leaveApplicationQueryValidator, createLeaveApplicationPayloadValidator, updateLeaveApplicationPayloadValidator, leaveApplicationParamValidator} from './validation';
import {fetchLeaveApplicationList, addLeaveApplication, editLeaveApplication, updateLeaveApplication, getLeaveApplication, deleteLeaveApplication} from './service';
import { QueryLeaveApplicationInput } from './types';


export const LeaveApplicationRoutes = Router();

LeaveApplicationRoutes.get('/', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(leaveApplicationQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchLeaveApplicationList(req.query as unknown as QueryLeaveApplicationInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

LeaveApplicationRoutes.post('/', validateAccessToken, requireRoles(['user:employee','user:admin']),
  validateZodSchema(createLeaveApplicationPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addLeaveApplication(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

LeaveApplicationRoutes.get('/:leaveApplicationId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(leaveApplicationParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editLeaveApplication(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateLeaveApplication = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateLeaveApplicationPayloadValidator(req.params.leaveApplicationId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
LeaveApplicationRoutes.put('/:leaveApplicationId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(leaveApplicationParamValidator, 'params'),
  validateUpdateLeaveApplication,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateLeaveApplication(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

LeaveApplicationRoutes.get('/detail/:leaveApplicationId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(leaveApplicationParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getLeaveApplication(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

LeaveApplicationRoutes.delete('/:leaveApplicationId', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(leaveApplicationParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteLeaveApplication(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

