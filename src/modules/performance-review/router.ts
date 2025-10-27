import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {performanceReviewQueryValidator, createPerformanceReviewPayloadValidator, updatePerformanceReviewPayloadValidator, performanceReviewParamValidator} from './validation';
import {fetchPerformanceReviewList, addPerformanceReview, editPerformanceReview, updatePerformanceReview, getPerformanceReview, deletePerformanceReview} from './service';
import { QueryPerformanceReviewInput } from './types';


export const PerformanceReviewRoutes = Router();

PerformanceReviewRoutes.get('/', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(performanceReviewQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchPerformanceReviewList(req.query as unknown as QueryPerformanceReviewInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

PerformanceReviewRoutes.post('/', validateAccessToken, requireRoles(['user:manager','user:admin']),
  validateZodSchema(createPerformanceReviewPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addPerformanceReview(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

PerformanceReviewRoutes.get('/:performanceReviewId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(performanceReviewParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editPerformanceReview(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdatePerformanceReview = (req: Request, res: Response, next: NextFunction) => {
  const schema = updatePerformanceReviewPayloadValidator(req.params.performanceReviewId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
PerformanceReviewRoutes.put('/:performanceReviewId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(performanceReviewParamValidator, 'params'),
  validateUpdatePerformanceReview,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updatePerformanceReview(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

PerformanceReviewRoutes.get('/detail/:performanceReviewId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(performanceReviewParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getPerformanceReview(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

PerformanceReviewRoutes.delete('/:performanceReviewId', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(performanceReviewParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deletePerformanceReview(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

