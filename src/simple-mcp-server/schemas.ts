/**
 * Zod Schemas for Tool Parameters
 *
 * Extends existing HRM validation schemas for MCP tools
 */

import { z } from 'zod';
import { employeeQueryValidator } from '../modules/employee/validation';
import { departmentQueryValidator } from '../modules/department/validation';

// Schema for search_employees tool
// Merges the existing employeeQueryValidator with MCP-specific fields
export const SearchEmployeesSchema = employeeQueryValidator.merge(
  z.object({
    query: z.string().optional().default(''),
    filters: z
      .object({
        departmentId: z.string().uuid('Invalid department UUID').optional(),
        status: z.enum(['active', 'inactive']).optional(),
      })
      .optional()
      .default({}),
  }),
);

export type SearchEmployeesInput = z.infer<typeof SearchEmployeesSchema>;

// Schema for get_departments tool
// Merges the existing departmentQueryValidator with MCP-specific fields
export const GetDepartmentsSchema = departmentQueryValidator.merge(
  z.object({
    includeEmployeeCount: z.boolean().optional().default(true),
  }),
);

export type GetDepartmentsInput = z.infer<typeof GetDepartmentsSchema>;
