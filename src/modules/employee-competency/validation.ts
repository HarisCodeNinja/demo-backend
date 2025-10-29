import { z } from 'zod';

export const employeeCompetencyQueryValidator = z.object({
  page: z.coerce.number().optional().nullable(),
  pageSize: z.coerce.number().optional().nullable(),
});

export const employeeCompetencyParamValidator = z.object({
  employeeCompetencyId: z.uuid('Invalid UUID format'),
});

export const createEmployeeCompetencyPayloadValidator = z.object({
  employeeId: z.uuid('Invalid UUID format'),
  competencyId: z.uuid('Invalid UUID format'),
  currentProficiency: z.string().nullish(),
  lastEvaluated: z.coerce.date().nullish(),
});

export const updateEmployeeCompetencyPayloadValidator = (employeeCompetencyId: string) =>
  z.object({
    employeeId: z.uuid('Invalid UUID format'),
    competencyId: z.uuid('Invalid UUID format'),
    currentProficiency: z.string().nullish(),
    lastEvaluated: z.coerce.date().nullish(),
  });
