import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {candidateQueryValidator, createCandidatePayloadValidator, updateCandidatePayloadValidator, candidateParamValidator} from './validation';
import {fetchCandidateList, selectCandidate, addCandidate, editCandidate, updateCandidate, getCandidate, deleteCandidate} from './service';
import { QueryCandidateInput } from './types';


export const CandidateRoutes = Router();

CandidateRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(candidateQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchCandidateList(req.query as unknown as QueryCandidateInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

CandidateRoutes.get('/select', validateAccessToken, requireRoles(['user:hr','user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await selectCandidate();
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

CandidateRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createCandidatePayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addCandidate(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

CandidateRoutes.get('/:candidateId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(candidateParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editCandidate(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateCandidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateCandidatePayloadValidator(req.params.candidateId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
CandidateRoutes.put('/:candidateId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(candidateParamValidator, 'params'),
  validateUpdateCandidate,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateCandidate(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

CandidateRoutes.get('/detail/:candidateId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(candidateParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getCandidate(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

CandidateRoutes.delete('/:candidateId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(candidateParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteCandidate(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

