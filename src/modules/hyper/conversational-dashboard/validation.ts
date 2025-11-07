import { z } from 'zod';

export const dashboardQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export const departmentSummarySchema = z.object({
  departmentId: z.string().uuid(),
});

export const dateRangeSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  departmentId: z.string().uuid().optional(),
});
