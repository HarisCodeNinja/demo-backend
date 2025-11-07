import { z } from 'zod';

export const recruitmentQuerySchema = z.object({
  departmentId: z.string().uuid().optional(),
  days: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export const candidateMatchingSchema = z.object({
  jobOpeningId: z.string().uuid(),
  minMatchScore: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export const hiringFunnelSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  jobOpeningId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
});

export const pipelineSummarySchema = z.object({
  departmentId: z.string().uuid().optional(),
  status: z.enum(['open', 'closed', 'on_hold']).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});
