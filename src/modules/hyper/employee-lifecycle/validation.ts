import { z } from 'zod';

export const employeeLifecycleQuerySchema = z.object({
  departmentId: z.string().uuid().optional(),
  days: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export const departmentChangesQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export const newHiresQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  onboardingStatus: z.enum(['not_started', 'in_progress', 'completed']).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});
