import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {jobLevelQueryValidator, createJobLevelPayloadValidator, updateJobLevelPayloadValidator, jobLevelParamValidator} from './validation';
import {fetchJobLevelList, addJobLevel, editJobLevel, updateJobLevel, getJobLevel, deleteJobLevel} from './service';
import { QueryJobLevelInput } from './types';


export const JobLevelRoutes = Router();

JobLevelRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobLevelQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchJobLevelList(req.query as unknown as QueryJobLevelInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

JobLevelRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createJobLevelPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addJobLevel(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

JobLevelRoutes.get('/:jobLevelId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobLevelParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editJobLevel(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateJobLevel = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateJobLevelPayloadValidator(req.params.jobLevelId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
JobLevelRoutes.put('/:jobLevelId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobLevelParamValidator, 'params'),
  validateUpdateJobLevel,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateJobLevel(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

JobLevelRoutes.get('/detail/:jobLevelId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobLevelParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getJobLevel(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

JobLevelRoutes.delete('/:jobLevelId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobLevelParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteJobLevel(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

