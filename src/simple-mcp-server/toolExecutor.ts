/**
 * Tool Executor
 *
 * Executes MCP tools by calling real HRM service functions
 * Validates arguments with Zod schemas (extends existing HRM validators)
 */

import { Request } from 'express';
import { SearchEmployeesSchema, GetDepartmentsSchema } from './schemas';
import { fetchEmployeeList } from '../modules/employee/service';
import { fetchDepartmentList } from '../modules/department/service';

// Type definitions
interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError: boolean;
}

/**
 * Create standardized MCP tool response
 */
function createToolResponse(data: any): ToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
    isError: false,
  };
}

/**
 * Main tool executor
 * Validates arguments with Zod schemas and calls service functions directly
 */
export async function execute(toolName: string, args: Record<string, any>, req: Request): Promise<ToolResponse> {
  try {
    console.log(`[ToolExecutor] Executing: ${toolName}`);

    // Validate and execute based on tool name
    switch (toolName) {
      case 'search_employees': {
        // Validate with existing employeeQueryValidator extended with MCP fields
        const validatedArgs = SearchEmployeesSchema.parse(args);

        // Call service function directly
        const result = await fetchEmployeeList({
          page: validatedArgs.page ?? 0,
          pageSize: validatedArgs.pageSize ?? 20,
        });

        // Return formatted response
        return createToolResponse({
          ...result,
          meta: {
            ...result.meta,
            timestamp: new Date().toISOString(),
          },
        });
      }

      case 'get_departments': {
        // Validate with existing departmentQueryValidator extended with MCP fields
        const validatedArgs = GetDepartmentsSchema.parse(args);

        // Call service function directly
        const result = await fetchDepartmentList({
          page: validatedArgs.page ?? 0,
          pageSize: validatedArgs.pageSize ?? 20,
        });

        // Return formatted response
        return createToolResponse({
          ...result,
          meta: {
            ...result.meta,
            timestamp: new Date().toISOString(),
          },
        });
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[ToolExecutor] Error executing ${toolName}:`, errorMessage);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: true,
              message: errorMessage,
              tool: toolName,
            },
            null,
            2,
          ),
        },
      ],
      isError: true,
    };
  }
}
