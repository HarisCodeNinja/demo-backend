import { z } from 'zod';

export const dashboardQueryValidator = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  departmentId: z.string().uuid().optional(),
});
