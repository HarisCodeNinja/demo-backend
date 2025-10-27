import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {designationQueryValidator, createDesignationPayloadValidator, updateDesignationPayloadValidator, designationParamValidator} from './validation';
import {fetchDesignationList, selectDesignation, addDesignation, editDesignation, updateDesignation, getDesignation, deleteDesignation} from './service';
import { QueryDesignationInput } from './types';


export const DesignationRoutes = Router();

DesignationRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(designationQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchDesignationList(req.query as unknown as QueryDesignationInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

DesignationRoutes.get('/select', validateAccessToken, requireRoles(['user:hr','user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await selectDesignation();
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

DesignationRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createDesignationPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addDesignation(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

DesignationRoutes.get('/:designationId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(designationParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editDesignation(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateDesignation = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateDesignationPayloadValidator(req.params.designationId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
DesignationRoutes.put('/:designationId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(designationParamValidator, 'params'),
  validateUpdateDesignation,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateDesignation(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

DesignationRoutes.get('/detail/:designationId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(designationParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getDesignation(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

DesignationRoutes.delete('/:designationId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(designationParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteDesignation(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

