import { z } from 'zod';
import { Op } from 'sequelize';
import { Goal } from './model';

export const goalQueryValidator = z.object({
  page: z.coerce.number().optional().nullable(),
  pageSize: z.coerce.number().optional().nullable(),
});

export const goalParamValidator = z.object({
  goalId: z.uuid('Invalid UUID format'),
});

export const createGoalPayloadValidator = z.object({
  employeeId: z.uuid('Invalid UUID format'),
  title: z.string({ error: 'Title is required' }),
  description: z.string().nullish().or(z.literal('')),
  kpi: z.any().nullish(),
  period: z.string({ error: 'Period is required' }),
  startDate: z.coerce.date({ error: 'Start Date is required' }),
  endDate: z.coerce.date({ error: 'End Date is required' }),
  status: z.string({ error: 'Status is required' }),
});

export const updateGoalPayloadValidator = (goalId: string) =>
  z.object({
    employeeId: z.uuid('Invalid UUID format'),
    title: z.string({ error: 'Title is required' }),
    description: z.string().nullish().or(z.literal('')),
    kpi: z.any().nullish(),
    period: z.string({ error: 'Period is required' }),
    startDate: z.coerce.date({ error: 'Start Date is required' }),
    endDate: z.coerce.date({ error: 'End Date is required' }),
    status: z.string({ error: 'Status is required' }),
  });
