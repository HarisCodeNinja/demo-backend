import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import {
  getOverviewStats,
  getEmployeeDistribution,
  getTodayAttendanceStats,
  getLeaveStats,
  getLeaveTypeDistribution,
  getRecruitmentStats,
  getCandidateStatusDistribution,
  getCandidateSourceDistribution,
  getInterviewStatusDistribution,
  getJobOpeningStatusDistribution,
  getPerformanceReviewStats,
  getGoalStats,
  getDepartmentWiseAttendance,
  getMonthlyLeaveDistribution,
  getAttendanceTrend,
  getUpcomingInterviews,
  getRecentCandidates,
  getAllDashboardData,
} from './service';

export const DashboardRoutes = Router();

// Get all dashboard data at once
DashboardRoutes.get(
  '/',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAllDashboardData();
    res.status(200).json(result);
  })
);

// Overview Statistics
DashboardRoutes.get(
  '/overview',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getOverviewStats();
    res.status(200).json(result);
  })
);

// Employee Distribution
DashboardRoutes.get(
  '/employees/distribution',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getEmployeeDistribution();
    res.status(200).json(result);
  })
);

// Today's Attendance
DashboardRoutes.get(
  '/attendance/today',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getTodayAttendanceStats();
    res.status(200).json(result);
  })
);

// Attendance Trend (Last 7 Days)
DashboardRoutes.get(
  '/attendance/trend',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getAttendanceTrend();
    res.status(200).json(result);
  })
);

// Department-wise Attendance
DashboardRoutes.get(
  '/attendance/departments',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getDepartmentWiseAttendance();
    res.status(200).json(result);
  })
);

// Leave Statistics
DashboardRoutes.get(
  '/leaves/stats',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getLeaveStats();
    res.status(200).json(result);
  })
);

// Leave Type Distribution
DashboardRoutes.get(
  '/leaves/types',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getLeaveTypeDistribution();
    res.status(200).json(result);
  })
);

// Monthly Leave Distribution
DashboardRoutes.get(
  '/leaves/monthly',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getMonthlyLeaveDistribution();
    res.status(200).json(result);
  })
);

// Recruitment Statistics
DashboardRoutes.get(
  '/recruitment/stats',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getRecruitmentStats();
    res.status(200).json(result);
  })
);

// Candidate Status Distribution
DashboardRoutes.get(
  '/recruitment/candidates/status',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getCandidateStatusDistribution();
    res.status(200).json(result);
  })
);

// Interview Status Distribution
DashboardRoutes.get(
  '/recruitment/interviews/status',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getInterviewStatusDistribution();
    res.status(200).json(result);
  })
);

// Performance Review Statistics
DashboardRoutes.get(
  '/performance/stats',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getPerformanceReviewStats();
    res.status(200).json(result);
  })
);

// Goal Statistics
DashboardRoutes.get(
  '/goals/stats',
  validateAccessToken,
  requireRoles(['user:manager', 'user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getGoalStats();
    res.status(200).json(result);
  })
);

// Candidate Source Distribution
DashboardRoutes.get(
  '/recruitment/candidates/source',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getCandidateSourceDistribution();
    res.status(200).json(result);
  })
);

// Job Opening Status Distribution
DashboardRoutes.get(
  '/recruitment/job-openings/status',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getJobOpeningStatusDistribution();
    res.status(200).json(result);
  })
);

// Upcoming Interviews
DashboardRoutes.get(
  '/recruitment/interviews/upcoming',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getUpcomingInterviews();
    res.status(200).json(result);
  })
);

// Recent Candidates
DashboardRoutes.get(
  '/recruitment/candidates/recent',
  validateAccessToken,
  requireRoles(['user:hr', 'user:admin']),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await getRecentCandidates();
    res.status(200).json(result);
  })
);
