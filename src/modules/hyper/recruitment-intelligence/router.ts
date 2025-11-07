import express, { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateAccessToken, requireRoles } from '../../../helper/auth';
import { validateZodSchema } from '../../../middleware/zodValidation';
import {
  recruitmentQuerySchema,
  candidateMatchingSchema,
  hiringFunnelSchema,
  pipelineSummarySchema,
} from './validation';
import {
  getPendingFeedback,
  getCandidateMatching,
  getHiringFunnel,
  getPipelineSummary,
  getOverdueInterviews,
  getRecruiterPerformance,
} from './service';

const router = express.Router();

/**
 * @route GET /hyper/recruitment/pending-feedback
 * @desc Get interviews waiting for feedback
 * @access HR, Admin
 */
router.get(
  '/pending-feedback',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  validateZodSchema(recruitmentQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getPendingFeedback(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/recruitment/candidate-matching/:jobOpeningId
 * @desc Get candidate matching scores for a job opening
 * @access HR, Admin
 */
router.get(
  '/candidate-matching/:jobOpeningId',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  validateZodSchema(candidateMatchingSchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getCandidateMatching(req, {
      ...req.query,
      jobOpeningId: req.params.jobOpeningId,
    });
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/recruitment/hiring-funnel
 * @desc Get hiring funnel statistics
 * @access HR, Admin
 */
router.get(
  '/hiring-funnel',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  validateZodSchema(hiringFunnelSchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getHiringFunnel(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/recruitment/pipeline-summary
 * @desc Get recruitment pipeline summary for all job openings
 * @access HR, Admin
 */
router.get(
  '/pipeline-summary',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  validateZodSchema(pipelineSummarySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getPipelineSummary(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/recruitment/overdue-interviews
 * @desc Get overdue interviews needing attention
 * @access HR, Admin
 */
router.get(
  '/overdue-interviews',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  validateZodSchema(recruitmentQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getOverdueInterviews(req, req.query);
    res.status(200).json(result);
  })
);

/**
 * @route GET /hyper/recruitment/recruiter-performance
 * @desc Get recruiter performance metrics
 * @access Admin
 */
router.get(
  '/recruiter-performance',
  validateAccessToken,
  requireRoles(['user:admin']),
  validateZodSchema(recruitmentQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getRecruiterPerformance(req, req.query);
    res.status(200).json(result);
  })
);

export default router;
