import cron from 'node-cron';
import { Employee } from '../modules/employee/model';
import { Attendance } from '../modules/attendance/model';
import logger from '../util/logger';
import { Op } from 'sequelize';
import { env } from '../config/env';

// Track job execution state for monitoring
interface JobState {
  lastRun: Date | null;
  lastSuccess: Date | null;
  lastError: Error | null;
  consecutiveFailures: number;
  isRunning: boolean;
}

const jobState: JobState = {
  lastRun: null,
  lastSuccess: null,
  lastError: null,
  consecutiveFailures: 0,
  isRunning: false,
};

// Configuration
const MAX_CONSECUTIVE_FAILURES = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds between retries
const MAX_RETRIES = 3;

/**
 * Generates a random attendance status distribution for the day
 * @returns Array of 6 status strings with dynamic distribution
 */
function generateDynamicStatusDistribution(): string[] {
  const possibleStatuses = ['Present', 'Absent', 'Late'];
  const statuses: string[] = [];

  // Weights for status distribution (can be adjusted)
  // Present: 60-80% chance, Absent: 10-20% chance, Late: 10-20% chance
  const presentWeight = 0.7 + Math.random() * 0.1; // 70-80%
  const absentWeight = 0.1 + Math.random() * 0.1; // 10-20%
  const lateWeight = 1 - presentWeight - absentWeight; // remaining

  // Generate 6 statuses based on weighted random selection
  for (let i = 0; i < 6; i++) {
    const random = Math.random();

    if (random < presentWeight) {
      statuses.push('Present');
    } else if (random < presentWeight + absentWeight) {
      statuses.push('Absent');
    } else {
      statuses.push('Late');
    }
  }

  // Shuffle the array to randomize order
  return statuses.sort(() => Math.random() - 0.5);
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Core seeding logic (without retry wrapper)
 * @throws Error if seeding fails
 */
async function seedDailyAttendanceCore(): Promise<void> {
  logger.info('Starting daily attendance seeding...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if attendance already exists for today
  const existingAttendance = await Attendance.count({
    where: {
      attendanceDate: today,
    },
  });

  if (existingAttendance > 0) {
    logger.info(`Attendance records already exist for ${today.toISOString().split('T')[0]}. Skipping seeding.`);
    return;
  }

  // Get 6 random active employees
  const randomEmployees = await Employee.findAll({
    where: {
      status: 'active',
    },
    order: Employee.sequelize!.random(),
    limit: 6,
  });

  if (randomEmployees.length === 0) {
    logger.warn('No active employees found for attendance seeding');
    return;
  }

  // Generate dynamic status distribution
  const statuses = generateDynamicStatusDistribution();

  // Create attendance records
  const attendanceRecords = randomEmployees.map((employee, index) => ({
    employeeId: employee.employeeId,
    attendanceDate: today,
    status: statuses[index] || 'Present', // Fallback to Present if index out of bounds
    checkInTime:
      statuses[index] === 'Present' || statuses[index] === 'Late'
        ? new Date(today.getTime() + 9 * 60 * 60 * 1000) // 9 AM check-in
        : null,
    checkOutTime:
      statuses[index] === 'Present'
        ? new Date(today.getTime() + 17 * 60 * 60 * 1000) // 5 PM check-out
        : null,
  }));

  // Bulk insert attendance records
  await Attendance.bulkCreate(attendanceRecords);

  logger.info(`Successfully seeded ${attendanceRecords.length} attendance records for ${today.toISOString().split('T')[0]}`);
  logger.info(`Status distribution: ${statuses.join(', ')}`);
}

/**
 * Seeds daily attendance with retry logic and error handling
 * This wrapper ensures failures don't crash the server or prevent future jobs
 */
async function seedDailyAttendance(): Promise<void> {
  // Prevent concurrent executions
  if (jobState.isRunning) {
    logger.warn('Attendance seeding already in progress, skipping this execution');
    return;
  }

  jobState.isRunning = true;
  jobState.lastRun = new Date();

  let lastError: Error | null = null;

  // Retry loop with exponential backoff
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await seedDailyAttendanceCore();

      // Success - reset failure counter
      jobState.consecutiveFailures = 0;
      jobState.lastSuccess = new Date();
      jobState.lastError = null;
      jobState.isRunning = false;

      logger.info('Daily attendance seeding completed successfully');
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      logger.error(
        {
          error: lastError,
          attempt,
          maxRetries: MAX_RETRIES,
        },
        `Attendance seeding attempt ${attempt}/${MAX_RETRIES} failed`,
      );

      // If not the last attempt, wait before retrying
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt; // Linear backoff
        logger.info(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // All retries exhausted
  jobState.consecutiveFailures++;
  jobState.lastError = lastError;
  jobState.isRunning = false;

  logger.error(
    {
      error: lastError,
      consecutiveFailures: jobState.consecutiveFailures,
      maxConsecutiveFailures: MAX_CONSECUTIVE_FAILURES,
    },
    'All retry attempts exhausted for daily attendance seeding',
  );

  // Circuit breaker: Alert if too many consecutive failures
  if (jobState.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    logger.fatal(
      {
        consecutiveFailures: jobState.consecutiveFailures,
        lastError: lastError,
      },
      'CRITICAL: Daily attendance seeding has failed too many times consecutively! Manual intervention may be required.',
    );
  }
}

/**
 * Initializes the daily attendance seeding cron job
 * Runs every day at 12:00 AM (00:00)
 */
export function initializeDailyAttendanceSeeding() {
  try {
    const cronSchedule = env.ATTENDANCE_CRON_SCHEDULE;

    // Validate cron expression
    if (!cron.validate(cronSchedule)) {
      throw new Error(`Invalid cron schedule: ${cronSchedule}`);
    }

    // Schedule cron job
    // Cron format: 'minute hour day month weekday'
    // Examples:
    //   '0 0 * * *'  = Every day at midnight
    //   '* * * * *'  = Every minute (for testing)
    //   '*/5 * * * *' = Every 5 minutes
    const task = cron.schedule(
      cronSchedule,
      async () => {
        try {
          logger.info(`Daily attendance seeding cron job triggered (schedule: ${cronSchedule})`);
          await seedDailyAttendance();
        } catch (error) {
          // Extra safety net - should never reach here due to internal error handling
          logger.error({ error }, 'Unexpected error in cron job callback - this should not happen');
        }
      },
      {
        timezone: 'UTC', // UTC+0
      },
    );

    logger.info(`Daily attendance seeding cron job initialized successfully (schedule: ${cronSchedule})`);
    logger.info('Note: Set ATTENDANCE_CRON_SCHEDULE in .env to change the schedule');

    // Validate the task is scheduled
    if (!task) {
      throw new Error('Failed to create cron task');
    }
  } catch (error) {
    logger.error({ error }, 'Failed to initialize daily attendance seeding cron job');
    // Don't throw - allow server to continue running even if cron job fails to initialize
  }
}

/**
 * Manually trigger attendance seeding (useful for testing)
 * Safe to call - will not crash the server on failure
 */
export async function manualSeedAttendance(): Promise<{ success: boolean; error?: string }> {
  try {
    logger.info('Manual attendance seeding triggered');
    await seedDailyAttendance();
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ error }, 'Manual attendance seeding failed');
    return { success: false, error: errorMessage };
  }
}

/**
 * Get the current state of the attendance seeding job
 * Useful for health checks and monitoring
 */
export function getJobState(): Readonly<JobState> {
  return {
    ...jobState,
    lastError: jobState.lastError
      ? ({
          name: jobState.lastError.name,
          message: jobState.lastError.message,
          stack: jobState.lastError.stack,
        } as any)
      : null,
  };
}
