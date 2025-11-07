import express, { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateAccessToken, requireRoles } from '../../../helper/auth';
import { validateZodSchema } from '../../../middleware/zodValidation';
import {
  employeeLifecycleQuerySchema,
  departmentChangesQuerySchema,
  newHiresQuerySchema,
} from './validation';
import {
  getMissingDocuments,
  getIncompleteOnboarding,
  getDepartmentChanges,
  getRoleMismatches,
  getPendingVerifications,
  getNewHiresSummary,
  getOffboardingChecklist,
} from './service';

const router = express.Router();

/**
 * @route GET /hyper/employee-lifecycle/missing-documents
 * @desc Get employees with missing documents
 * @access Manager, HR, Admin
 */
router.get(
  '/missing-documents',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(employeeLifecycleQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getMissingDocuments(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/employee-lifecycle/incomplete-onboarding
 * @desc Get employees with incomplete onboarding
 * @access Manager, HR, Admin
 */
router.get(
  '/incomplete-onboarding',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(employeeLifecycleQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getIncompleteOnboarding(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/employee-lifecycle/department-changes
 * @desc Get department change requests and history
 * @access Manager, HR, Admin
 */
router.get(
  '/department-changes',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(departmentChangesQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getDepartmentChanges(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/employee-lifecycle/role-mismatches
 * @desc Detect mismatches between HRM and Payroll data
 * @access HR, Admin
 */
router.get(
  '/role-mismatches',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  validateZodSchema(employeeLifecycleQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getRoleMismatches(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/employee-lifecycle/pending-verifications
 * @desc Get items pending verification
 * @access Manager, HR, Admin
 */
router.get(
  '/pending-verifications',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(employeeLifecycleQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getPendingVerifications(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/employee-lifecycle/new-hires-summary
 * @desc Get summary of new hires and their onboarding status
 * @access Manager, HR, Admin
 */
router.get(
  '/new-hires-summary',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  validateZodSchema(newHiresQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getNewHiresSummary(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/employee-lifecycle/offboarding-checklist
 * @desc Get offboarding checklist for exiting employees
 * @access HR, Admin
 */
router.get(
  '/offboarding-checklist',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  validateZodSchema(employeeLifecycleQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getOffboardingChecklist(req, req.query);
    res.status(200).json(result);
  })
);

export default router;
