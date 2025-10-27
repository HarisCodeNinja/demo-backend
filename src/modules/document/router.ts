import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {documentQueryValidator, createDocumentPayloadValidator, updateDocumentPayloadValidator, documentParamValidator} from './validation';
import {fetchDocumentList, addDocument, editDocument, updateDocument, getDocument, deleteDocument} from './service';
import { QueryDocumentInput } from './types';


export const DocumentRoutes = Router();

DocumentRoutes.get('/', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  validateZodSchema(documentQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchDocumentList(req.query as unknown as QueryDocumentInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

DocumentRoutes.post('/', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  validateZodSchema(createDocumentPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addDocument(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

DocumentRoutes.get('/:documentId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(documentParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editDocument(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateDocument = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateDocumentPayloadValidator(req.params.documentId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
DocumentRoutes.put('/:documentId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(documentParamValidator, 'params'),
  validateUpdateDocument,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateDocument(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

DocumentRoutes.get('/detail/:documentId', validateAccessToken, requireRoles(['user:employee','user:hr','user:admin']),
  validateZodSchema(documentParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getDocument(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

DocumentRoutes.delete('/:documentId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(documentParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteDocument(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

