import { Router, Request, Response } from 'express';
import { manualSeedAttendance, getJobState } from './daily-attendance-seeding';
import logger from '../util/logger';

const router = Router();

/**
 * GET /api/attendance-seeding/status
 * Get the current status of the attendance seeding job
 */
router.get('/status', (req: Request, res: Response) => {
  try {
    const state = getJobState();

    res.json({
      success: true,
      data: {
        isRunning: state.isRunning,
        lastRun: state.lastRun,
        lastSuccess: state.lastSuccess,
        consecutiveFailures: state.consecutiveFailures,
        lastError: state.lastError ? {
          message: state.lastError.message,
          name: state.lastError.name,
        } : null,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching attendance seeding status');
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job status',
    });
  }
});

/**
 * POST /api/attendance-seeding/trigger
 * Manually trigger attendance seeding (useful for testing)
 */
router.post('/trigger', async (req: Request, res: Response) => {
  try {
    const result = await manualSeedAttendance();

    if (result.success) {
      res.json({
        success: true,
        message: 'Attendance seeding completed successfully',
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Unknown error occurred',
      });
    }
  } catch (error) {
    logger.error({ error }, 'Error triggering manual attendance seeding');
    res.status(500).json({
      success: false,
      error: 'Failed to trigger attendance seeding',
    });
  }
});

/**
 * GET /api/attendance-seeding/health
 * Health check endpoint to verify job is functioning properly
 */
router.get('/health', (req: Request, res: Response) => {
  try {
    const state = getJobState();

    // Consider unhealthy if:
    // 1. Job is stuck in running state for too long
    // 2. Too many consecutive failures
    const isHealthy =
      state.consecutiveFailures < 3 &&
      (!state.isRunning ||
        (state.lastRun && new Date().getTime() - state.lastRun.getTime() < 5 * 60 * 1000));

    if (isHealthy) {
      res.json({
        success: true,
        status: 'healthy',
        message: 'Attendance seeding job is functioning normally',
        details: {
          lastSuccess: state.lastSuccess,
          consecutiveFailures: state.consecutiveFailures,
        },
      });
    } else {
      res.status(503).json({
        success: false,
        status: 'unhealthy',
        message: 'Attendance seeding job is experiencing issues',
        details: {
          consecutiveFailures: state.consecutiveFailures,
          lastError: state.lastError?.message,
          lastSuccess: state.lastSuccess,
        },
      });
    }
  } catch (error) {
    logger.error({ error }, 'Error checking attendance seeding health');
    res.status(500).json({
      success: false,
      status: 'unknown',
      error: 'Failed to check job health',
    });
  }
});

export default router;
