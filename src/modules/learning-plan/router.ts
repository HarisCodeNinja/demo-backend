import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {learningPlanQueryValidator, createLearningPlanPayloadValidator, updateLearningPlanPayloadValidator, learningPlanParamValidator} from './validation';
import {fetchLearningPlanList, addLearningPlan, editLearningPlan, updateLearningPlan, getLearningPlan, deleteLearningPlan} from './service';
import { QueryLearningPlanInput } from './types';


export const LearningPlanRoutes = Router();

LearningPlanRoutes.get('/', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(learningPlanQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchLearningPlanList(req.query as unknown as QueryLearningPlanInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

LearningPlanRoutes.post('/', validateAccessToken, requireRoles(['user:manager','user:admin']),
  validateZodSchema(createLearningPlanPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addLearningPlan(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

LearningPlanRoutes.get('/:learningPlanId', validateAccessToken, requireRoles(['user:manager','user:hr','user:admin']),
  validateZodSchema(learningPlanParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editLearningPlan(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateLearningPlan = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateLearningPlanPayloadValidator(req.params.learningPlanId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
LearningPlanRoutes.put('/:learningPlanId', validateAccessToken, requireRoles(['user:manager','user:hr','user:admin']),
  validateZodSchema(learningPlanParamValidator, 'params'),
  validateUpdateLearningPlan,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateLearningPlan(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

LearningPlanRoutes.get('/detail/:learningPlanId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(learningPlanParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getLearningPlan(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

LearningPlanRoutes.delete('/:learningPlanId', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(learningPlanParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteLearningPlan(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

