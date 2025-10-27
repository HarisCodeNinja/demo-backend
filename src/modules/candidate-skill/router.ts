import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {candidateSkillQueryValidator, createCandidateSkillPayloadValidator, updateCandidateSkillPayloadValidator, candidateSkillParamValidator} from './validation';
import {fetchCandidateSkillList, addCandidateSkill, editCandidateSkill, updateCandidateSkill, getCandidateSkill, deleteCandidateSkill} from './service';
import { QueryCandidateSkillInput } from './types';


export const CandidateSkillRoutes = Router();

CandidateSkillRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(candidateSkillQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchCandidateSkillList(req.query as unknown as QueryCandidateSkillInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

CandidateSkillRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createCandidateSkillPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addCandidateSkill(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

CandidateSkillRoutes.get('/:candidateSkillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(candidateSkillParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editCandidateSkill(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateCandidateSkill = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateCandidateSkillPayloadValidator(req.params.candidateSkillId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
CandidateSkillRoutes.put('/:candidateSkillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(candidateSkillParamValidator, 'params'),
  validateUpdateCandidateSkill,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateCandidateSkill(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

CandidateSkillRoutes.get('/detail/:candidateSkillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(candidateSkillParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getCandidateSkill(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

CandidateSkillRoutes.delete('/:candidateSkillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(candidateSkillParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteCandidateSkill(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

