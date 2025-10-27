import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {jobOpeningSkillQueryValidator, createJobOpeningSkillPayloadValidator, updateJobOpeningSkillPayloadValidator, jobOpeningSkillParamValidator} from './validation';
import {fetchJobOpeningSkillList, addJobOpeningSkill, editJobOpeningSkill, updateJobOpeningSkill, getJobOpeningSkill, deleteJobOpeningSkill} from './service';
import { QueryJobOpeningSkillInput } from './types';


export const JobOpeningSkillRoutes = Router();

JobOpeningSkillRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobOpeningSkillQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchJobOpeningSkillList(req.query as unknown as QueryJobOpeningSkillInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

JobOpeningSkillRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createJobOpeningSkillPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addJobOpeningSkill(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

JobOpeningSkillRoutes.get('/:jobOpeningSkillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobOpeningSkillParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editJobOpeningSkill(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateJobOpeningSkill = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateJobOpeningSkillPayloadValidator(req.params.jobOpeningSkillId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
JobOpeningSkillRoutes.put('/:jobOpeningSkillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobOpeningSkillParamValidator, 'params'),
  validateUpdateJobOpeningSkill,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateJobOpeningSkill(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

JobOpeningSkillRoutes.get('/detail/:jobOpeningSkillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobOpeningSkillParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getJobOpeningSkill(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

JobOpeningSkillRoutes.delete('/:jobOpeningSkillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobOpeningSkillParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteJobOpeningSkill(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

