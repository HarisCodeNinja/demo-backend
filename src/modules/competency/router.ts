import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {competencyQueryValidator, createCompetencyPayloadValidator, updateCompetencyPayloadValidator, competencyParamValidator} from './validation';
import {fetchCompetencyList, selectCompetency, addCompetency, editCompetency, updateCompetency, getCompetency, deleteCompetency} from './service';
import { QueryCompetencyInput } from './types';


export const CompetencyRoutes = Router();

CompetencyRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(competencyQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchCompetencyList(req.query as unknown as QueryCompetencyInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

CompetencyRoutes.get('/select', validateAccessToken, requireRoles(['user:hr','user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await selectCompetency();
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

CompetencyRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createCompetencyPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addCompetency(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

CompetencyRoutes.get('/:competencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(competencyParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editCompetency(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateCompetency = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateCompetencyPayloadValidator(req.params.competencyId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
CompetencyRoutes.put('/:competencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(competencyParamValidator, 'params'),
  validateUpdateCompetency,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateCompetency(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

CompetencyRoutes.get('/detail/:competencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(competencyParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getCompetency(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

CompetencyRoutes.delete('/:competencyId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(competencyParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteCompetency(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

