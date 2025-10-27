import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateZodSchema } from '../../middleware/zodValidation';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {attendanceQueryValidator, createAttendancePayloadValidator, updateAttendancePayloadValidator, attendanceParamValidator} from './validation';
import {fetchAttendanceList, addAttendance, editAttendance, updateAttendance, getAttendance, deleteAttendance} from './service';
import { QueryAttendanceInput } from './types';


export const AttendanceRoutes = Router();

AttendanceRoutes.get('/', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(attendanceQueryValidator, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await fetchAttendanceList(req.query as unknown as QueryAttendanceInput);
    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

AttendanceRoutes.post('/', validateAccessToken, requireRoles(['user:employee','user:admin']),
  validateZodSchema(createAttendancePayloadValidator, 'body'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await addAttendance(req.body);
    const status = (result as any).statusCode || 201;
    res.status(status).json(result);
  }),
);

AttendanceRoutes.get('/:attendanceId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(attendanceParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await editAttendance(req.params);

    if (result && 'errorCode' in result) {
      res.status(404).json(result);
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

const validateUpdateAttendance = (req: Request, res: Response, next: NextFunction) => {
  const schema = updateAttendancePayloadValidator(req.params.attendanceId);
  return validateZodSchema(schema, 'body')(req, res, next);
};
AttendanceRoutes.put('/:attendanceId', validateAccessToken, requireRoles(['user:hr','user:admin']),
  validateZodSchema(attendanceParamValidator, 'params'),
  validateUpdateAttendance,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await updateAttendance(req.params, req.body);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result);
  }),
);

AttendanceRoutes.get('/detail/:attendanceId', validateAccessToken, requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  validateZodSchema(attendanceParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAttendance(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 200;
    res.status(status).json(result.data ?? result);
  }),
);

AttendanceRoutes.delete('/:attendanceId', validateAccessToken, requireRoles(['user:admin']),
  validateZodSchema(attendanceParamValidator, 'params'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await deleteAttendance(req.params);

    if (result.isError) {
      res.status(404).json(result);
			return;
    }

    const status = (result as any).statusCode || 202;
    res.status(status).json(result);
  }),
);

