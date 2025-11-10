import { Request, Response, NextFunction } from 'express';
import { Employee } from '../modules/employee/model';
import { Op } from 'sequelize';

/**
 * Role-based filtering middleware for employee-related data
 * This middleware adds filtering logic to the request based on the authenticated user's role
 *
 * Usage:
 *   router.get('/', validateAccessToken, requireRoles([...]), applyRoleBasedFilter('employee-data'), handler)
 *
 * The middleware attaches filtering information to req.roleFilter which services can use
 */

export interface RoleFilterConfig {
  allowedEmployeeIds: string[] | null; // null means no filtering (see all)
  currentEmployeeId: string | null;
  isHROrAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
}

/**
 * Filter strategies for different data types
 */
export type FilterStrategy =
  | 'employee-data'           // Employee can see own, Manager sees team, HR/Admin see all
  | 'sensitive-financial'     // Employee sees own only, HR/Admin see all (no manager access)
  | 'team-viewable'           // Employee sees own, Manager sees team + own, HR/Admin see all
  | 'hr-admin-only'           // Only HR/Admin can access
  | 'self-only';              // Everyone can only see their own data

/**
 * Apply role-based filtering middleware
 * Attaches filtering logic to request object for services to use
 *
 * @param strategy - The filtering strategy to apply
 */
export const applyRoleBasedFilter = (strategy: FilterStrategy = 'employee-data') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          errorCode: 'UNAUTHORIZED',
          message: 'User not authenticated'
        });
      }

      const { userId, role } = user;
      const roleFilter: RoleFilterConfig = {
        allowedEmployeeIds: null,
        currentEmployeeId: null,
        isHROrAdmin: role === 'hr' || role === 'admin',
        isManager: role === 'manager',
        isEmployee: role === 'employee',
      };

      // HR and Admin always see everything for most strategies
      if (roleFilter.isHROrAdmin && strategy !== 'self-only') {
        (req as any).roleFilter = roleFilter;
        return next();
      }

      // Find current user's employee record
      const currentEmployee = await Employee.findOne({
        where: { userId },
        attributes: ['employeeId'],
      });

      if (!currentEmployee) {
        // User has no employee record - deny access to employee data
        roleFilter.allowedEmployeeIds = [];
        (req as any).roleFilter = roleFilter;
        return next();
      }

      roleFilter.currentEmployeeId = currentEmployee.employeeId;

      // Apply filtering based on strategy
      switch (strategy) {
        case 'employee-data':
        case 'team-viewable':
          // Employee: own data only
          // Manager: own + team members
          // HR/Admin: all (already handled above)
          if (roleFilter.isEmployee) {
            roleFilter.allowedEmployeeIds = [currentEmployee.employeeId];
          } else if (roleFilter.isManager) {
            // Fetch team members
            const teamMembers = await Employee.findAll({
              where: { reportingManagerId: currentEmployee.employeeId },
              attributes: ['employeeId'],
            });
            roleFilter.allowedEmployeeIds = [
              currentEmployee.employeeId,
              ...teamMembers.map(emp => emp.employeeId),
            ];
          } else {
            // Unknown role - deny access
            roleFilter.allowedEmployeeIds = [];
          }
          break;

        case 'sensitive-financial':
          // Only employee can see their own, managers excluded
          // HR/Admin already handled above
          if (roleFilter.isEmployee) {
            roleFilter.allowedEmployeeIds = [currentEmployee.employeeId];
          } else if (roleFilter.isManager) {
            // Managers should not access sensitive financial data
            roleFilter.allowedEmployeeIds = [];
          } else {
            roleFilter.allowedEmployeeIds = [];
          }
          break;

        case 'self-only':
          // Everyone (including HR/Admin) can only see their own data
          roleFilter.allowedEmployeeIds = [currentEmployee.employeeId];
          break;

        case 'hr-admin-only':
          // Only HR/Admin should have gotten here (should be blocked by requireRoles)
          // But if somehow they did, deny access
          roleFilter.allowedEmployeeIds = [];
          break;

        default:
          roleFilter.allowedEmployeeIds = [];
      }

      // Attach to request
      (req as any).roleFilter = roleFilter;
      next();
    } catch (error) {
      console.error('Error in role-based filter middleware:', error);
      res.status(500).json({
        errorCode: 'INTERNAL_ERROR',
        message: 'Error applying role-based filtering'
      });
    }
  };
};

/**
 * Helper function to build Sequelize where clause from role filter
 * Services can use this to apply filtering to their queries
 *
 * @param roleFilter - The role filter config from request
 * @returns Sequelize where clause object or null if no filtering needed
 */
export const buildEmployeeFilter = (roleFilter: RoleFilterConfig): any => {
  // If allowedEmployeeIds is null, no filtering needed (see all)
  if (roleFilter.allowedEmployeeIds === null) {
    return null;
  }

  // If empty array, user has no access
  if (roleFilter.allowedEmployeeIds.length === 0) {
    // Return impossible condition
    return { employeeId: 'NO_ACCESS' };
  }

  // Return filter for allowed employee IDs
  if (roleFilter.allowedEmployeeIds.length === 1) {
    return { employeeId: roleFilter.allowedEmployeeIds[0] };
  }

  return { employeeId: { [Op.in]: roleFilter.allowedEmployeeIds } };
};

/**
 * Helper to check if user has access to any data
 * Services can use this for early return
 */
export const hasAccess = (roleFilter: RoleFilterConfig): boolean => {
  return roleFilter.allowedEmployeeIds === null ||
         roleFilter.allowedEmployeeIds.length > 0;
};
