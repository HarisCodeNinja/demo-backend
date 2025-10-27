import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {skillQueryValidator, createSkillPayloadValidator, updateSkillPayloadValidator, skillParamValidator} from './validation';
import {fetchSkillList, selectSkill, addSkill, editSkill, updateSkill, getSkill, deleteSkill} from './service';
import { QuerySkillInput } from './types';


export const SkillRoutes = Router();

SkillRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(skillQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchSkillList(req.query as unknown as QuerySkillInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

SkillRoutes.get('/select', validateAccessToken, requireRoles(['user:hr','user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await selectSkill();
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

SkillRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createSkillPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addSkill(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

SkillRoutes.get('/:skillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(skillParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editSkill(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateSkill = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateSkillPayloadValidator(req.params.skillId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
SkillRoutes.put('/:skillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(skillParamValidator, 'params'),
  validateUpdateSkill,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateSkill(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

SkillRoutes.get('/detail/:skillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(skillParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getSkill(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

SkillRoutes.delete('/:skillId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(skillParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteSkill(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

