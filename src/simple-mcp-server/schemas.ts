/**
 * Zod Schemas for Tool Parameters
 *
 * Based on existing HRM validation schemas for MCP tools
 */

import { z } from 'zod';

// Schema for search_employees tool
// Based on the existing employeeQueryValidator with MCP-specific fields
export const SearchEmployeesSchema = z.object({
  page: z.coerce.number().optional().nullable(),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  query: z.string().optional().default(''),
  filters: z
    .object({
      departmentId: z.string().uuid('Invalid department UUID').optional(),
      status: z.enum(['active', 'inactive']).optional(),
    })
    .optional()
    .default({}),
});

export type SearchEmployeesInput = z.infer<typeof SearchEmployeesSchema>;

// Schema for get_departments tool
// Based on the existing departmentQueryValidator with MCP-specific fields
export const GetDepartmentsSchema = z.object({
  page: z.coerce.number().optional().nullable(),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  includeEmployeeCount: z.boolean().optional().default(true),
});

export type GetDepartmentsInput = z.infer<typeof GetDepartmentsSchema>;
