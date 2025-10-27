import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {interviewQueryValidator, createInterviewPayloadValidator, updateInterviewPayloadValidator, interviewParamValidator} from './validation';
import {fetchInterviewList, addInterview, editInterview, updateInterview, getInterview, deleteInterview} from './service';
import { QueryInterviewInput } from './types';


export const InterviewRoutes = Router();

InterviewRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(interviewQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchInterviewList(req.query as unknown as QueryInterviewInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

InterviewRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createInterviewPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addInterview(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

InterviewRoutes.get('/:interviewId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(interviewParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editInterview(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateInterview = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateInterviewPayloadValidator(req.params.interviewId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
InterviewRoutes.put('/:interviewId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(interviewParamValidator, 'params'),
  validateUpdateInterview,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateInterview(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

InterviewRoutes.get('/detail/:interviewId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(interviewParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getInterview(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

InterviewRoutes.delete('/:interviewId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(interviewParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteInterview(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

