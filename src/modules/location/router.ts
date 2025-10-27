import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {locationQueryValidator, createLocationPayloadValidator, updateLocationPayloadValidator, locationParamValidator} from './validation';
import {fetchLocationList, selectLocation, addLocation, editLocation, updateLocation, getLocation, deleteLocation} from './service';
import { QueryLocationInput } from './types';


export const LocationRoutes = Router();

LocationRoutes.get('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(locationQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchLocationList(req.query as unknown as QueryLocationInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

LocationRoutes.get('/select', validateAccessToken, requireRoles(['user:hr','user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await selectLocation();
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

LocationRoutes.post('/', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(createLocationPayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addLocation(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

LocationRoutes.get('/:locationId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(locationParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editLocation(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateLocation = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateLocationPayloadValidator(req.params.locationId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
LocationRoutes.put('/:locationId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(locationParamValidator, 'params'),
  validateUpdateLocation,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateLocation(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

LocationRoutes.get('/detail/:locationId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(locationParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getLocation(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

LocationRoutes.delete('/:locationId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(locationParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteLocation(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

