import express, { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateAccessToken, requireRoles } from '../../../helper/auth';
import { validateZodSchema } from '../../../middleware/zodValidation';
import { dashboardQuerySchema, departmentSummarySchema, dateRangeSchema } from './validation';
import {
  getHeadcountDistribution,
  getOpenPositions,
  getRecentHires,
  getDepartmentSummary,
  getLeaveOverview,
  getPayrollSummary,
  getPerformanceSnapshot,
  getGoalsStats,
  getQuickStats,
} from './service';

const router = express.Router();

/**
 * @route GET /hyper/dashboard/headcount-distribution
 * @desc Get employee headcount distribution by department, designation, location
 * @access Manager, HR, Admin
 */
router.get(
  '/headcount-distribution',
  // validateAccessToken,
  // requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getHeadcountDistribution(req, req.query);
    res.status(200).json(result);
  }),
);

/**
 * @route GET /hyper/dashboard/open-positions
 * @desc Get all open job positions
 * @access HR, Admin
 */
router.get(
  '/open-positions',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  validateZodSchema(dashboardQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getOpenPositions(req, req.query);
    res.status(200).json(result);
  }),
);

/**
 * @route GET /hyper/dashboard/recent-hires
 * @desc Get recently joined employees
 * @access Manager, HR, Admin
 */
router.get(
  '/recent-hires',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(dashboardQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getRecentHires(req, req.query);
    res.status(200).json(result);
  }),
);

/**
 * @route GET /hyper/dashboard/department-summary/:departmentId
 * @desc Get comprehensive summary for a specific department
 * @access Manager, HR, Admin
 */
router.get(
  '/department-summary/:departmentId',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getDepartmentSummary(req, {
      departmentId: req.params.departmentId,
    });
    res.status(200).json(result);
  }),
);

/**
 * @route GET /hyper/dashboard/leave-overview
 * @desc Get leave applications overview and statistics
 * @access Manager, HR, Admin
 */
router.get(
  '/leave-overview',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(dashboardQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getLeaveOverview(req, req.query);
    res.status(200).json(result);
  }),
);

/**
 * @route GET /hyper/dashboard/payroll-summary
 * @desc Get payroll summary and statistics
 * @access HR, Admin
 */
router.get(
  '/payroll-summary',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getPayrollSummary(req, req.query);
    res.status(200).json(result);
  }),
);

/**
 * @route GET /hyper/dashboard/performance-snapshot
 * @desc Get performance review snapshot and top performers
 * @access Manager, HR, Admin
 */
router.get(
  '/performance-snapshot',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getPerformanceSnapshot(req, req.query);
    res.status(200).json(result);
  }),
);

/**
 * @route GET /hyper/dashboard/goals-stats
 * @desc Get goals/OKRs statistics
 * @access Manager, HR, Admin
 */
router.get(
  '/goals-stats',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getGoalsStats(req, req.query);
    res.status(200).json(result);
  }),
);

/**
 * @route GET /hyper/dashboard/quick-stats
 * @desc Get all-in-one quick statistics dashboard
 * @access Manager, HR, Admin
 */
router.get(
  '/quick-stats',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getQuickStats(req, req.query);
    res.status(200).json(result);
  }),
);

export default router;
