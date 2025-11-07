import express, { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateAccessToken, requireRoles } from '../../../helper/auth';
import { validateZodSchema } from '../../../middleware/zodValidation';
import {
  attendanceQuerySchema,
  absenteePatternSchema,
  lateComersSchema,
  teamAttendanceSchema,
  monthlyTrendSchema,
} from './validation';
import {
  getTodaySummary,
  getAbsenteePatterns,
  getLateComers,
  getAnomalyDetection,
  getTeamAttendance,
  getMonthlyTrends,
} from './service';

const router = express.Router();

/**
 * @route GET /hyper/attendance/today-summary
 * @desc Get today's attendance summary
 * @access Manager, HR, Admin
 */
router.get(
  '/today-summary',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(attendanceQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getTodaySummary(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/attendance/absentee-patterns
 * @desc Get employees with absentee patterns
 * @access Manager, HR, Admin
 */
router.get(
  '/absentee-patterns',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(absenteePatternSchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAbsenteePatterns(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/attendance/late-comers
 * @desc Get late comers for a specific date
 * @access Manager, HR, Admin
 */
router.get(
  '/late-comers',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(lateComersSchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getLateComers(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/attendance/anomaly-detection
 * @desc Detect attendance anomalies
 * @access HR, Admin
 */
router.get(
  '/anomaly-detection',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  validateZodSchema(attendanceQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAnomalyDetection(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/attendance/team-attendance/:managerId
 * @desc Get team attendance for a specific manager
 * @access Manager, HR, Admin
 */
router.get(
  '/team-attendance/:managerId',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(teamAttendanceSchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getTeamAttendance(req, {
      ...req.query,
      managerId: req.params.managerId,
    });
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/attendance/monthly-trends
 * @desc Get monthly attendance trends
 * @access Manager, HR, Admin
 */
router.get(
  '/monthly-trends',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(monthlyTrendSchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getMonthlyTrends(req, req.query);
    res.status(200).json(result);
  })
);

export default router;
