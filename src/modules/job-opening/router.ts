import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {jobOpeningQueryValidator, createJobOpeningPayloadValidator, updateJobOpeningPayloadValidator, jobOpeningParamValidator} from './validation';
import {fetchJobOpeningList, selectJobOpening, addJobOpening, editJobOpening, updateJobOpening, getJobOpening, deleteJobOpening} from './service';
import { QueryJobOpeningInput } from './types';


export const JobOpeningRoutes = Router();

JobOpeningRoutes.get('/', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  validateZodSchema(jobOpeningQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchJobOpeningList(req.query as unknown as QueryJobOpeningInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

JobOpeningRoutes.get('/select', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await selectJobOpening();
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

JobOpeningRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createJobOpeningPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addJobOpening(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

JobOpeningRoutes.get('/:jobOpeningId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobOpeningParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editJobOpening(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateJobOpening = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateJobOpeningPayloadValidator(req.params.jobOpeningId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
JobOpeningRoutes.put('/:jobOpeningId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobOpeningParamValidator, 'params'),
  validateUpdateJobOpening,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateJobOpening(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

JobOpeningRoutes.get('/detail/:jobOpeningId', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  validateZodSchema(jobOpeningParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getJobOpening(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

JobOpeningRoutes.delete('/:jobOpeningId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(jobOpeningParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteJobOpening(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

