import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {goalQueryValidator, createGoalPayloadValidator, updateGoalPayloadValidator, goalParamValidator} from './validation';
import {fetchGoalList, addGoal, editGoal, updateGoal, getGoal, deleteGoal} from './service';
import { QueryGoalInput } from './types';


export const GoalRoutes = Router();

GoalRoutes.get('/', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(goalQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchGoalList(req.query as unknown as QueryGoalInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

GoalRoutes.post('/', validateAccessToken, requireRoles(['user:manager','user:admin']),
  validateZodSchema(createGoalPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addGoal(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

GoalRoutes.get('/:goalId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(goalParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editGoal(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateGoal = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateGoalPayloadValidator(req.params.goalId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
GoalRoutes.put('/:goalId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(goalParamValidator, 'params'),
  validateUpdateGoal,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateGoal(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

GoalRoutes.get('/detail/:goalId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(goalParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getGoal(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

GoalRoutes.delete('/:goalId', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(goalParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteGoal(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

