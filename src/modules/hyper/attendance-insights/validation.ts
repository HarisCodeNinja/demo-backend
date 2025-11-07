import { z } from 'zod';

export const attendanceQuerySchema = z.object({
  date: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export const absenteePatternSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAbsences: z.string().transform(Number).optional(),
  departmentId: z.string().uuid().optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export const lateComersSchema = z.object({
  date: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  minLateMinutes: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export const teamAttendanceSchema = z.object({
  managerId: z.string().uuid(),
  date: z.string().optional(),
});

export const monthlyTrendSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  departmentId: z.string().uuid().optional(),
});
