import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {offerLetterQueryValidator, createOfferLetterPayloadValidator, updateOfferLetterPayloadValidator, offerLetterParamValidator} from './validation';
import {fetchOfferLetterList, addOfferLetter, editOfferLetter, updateOfferLetter, getOfferLetter, deleteOfferLetter} from './service';
import { QueryOfferLetterInput } from './types';


export const OfferLetterRoutes = Router();

OfferLetterRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(offerLetterQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchOfferLetterList(req.query as unknown as QueryOfferLetterInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

OfferLetterRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createOfferLetterPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addOfferLetter(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

OfferLetterRoutes.get('/:offerLetterId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(offerLetterParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editOfferLetter(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateOfferLetter = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateOfferLetterPayloadValidator(req.params.offerLetterId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
OfferLetterRoutes.put('/:offerLetterId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(offerLetterParamValidator, 'params'),
  validateUpdateOfferLetter,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateOfferLetter(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

OfferLetterRoutes.get('/detail/:offerLetterId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(offerLetterParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getOfferLetter(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

OfferLetterRoutes.delete('/:offerLetterId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(offerLetterParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteOfferLetter(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

