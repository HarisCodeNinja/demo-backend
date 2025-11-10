import { Request } from 'express';
import { RoleFilterConfig, buildEmployeeFilter, hasAccess } from '../middleware/roleBasedFilter';
import { Op } from 'sequelize';

/**
 * Helper utilities for services to apply role-based filtering
 * These helpers extract the roleFilter from the request and apply it to queries
 */

/**
 * Get the role filter from request
 * @param req - Express request object
 * @returns RoleFilterConfig or null if not available
 */
export const getRoleFilter = (req: Request): RoleFilterConfig | null => {
  return (req as any).roleFilter || null;
};

/**
 * Apply role-based filtering to a Sequelize query where clause
 * Returns an object that can be spread into the where clause
 *
 * @param req - Express request object
 * @returns Where clause object or empty object if no filtering needed
 *
 * Example:
 *   const whereClause = {
 *     status: 'active',
 *     ...applyRoleFilter(req)
 *   };
 */
export const applyRoleFilter = (req: Request): any => {
  const roleFilter = getRoleFilter(req);

  if (!roleFilter) {
    // No filter available - this shouldn't happen if middleware is properly applied
    console.warn('Role filter not found in request. Did you forget to apply applyRoleBasedFilter middleware?');
    return {};
  }

  const filter = buildEmployeeFilter(roleFilter);

  // If filter is null, return empty object (no filtering needed)
  if (filter === null) {
    return {};
  }

  return filter;
};

/**
 * Check if the current user has access to any data based on role filter
 * Services can use this for early return with empty results
 *
 * @param req - Express request object
 * @returns true if user has access, false otherwise
 *
 * Example:
 *   if (!checkAccess(req)) {
 *     return { data: [], meta: { total: 0 } };
 *   }
 */
export const checkAccess = (req: Request): boolean => {
  const roleFilter = getRoleFilter(req);

  if (!roleFilter) {
    console.warn('Role filter not found in request. Denying access by default.');
    return false;
  }

  return hasAccess(roleFilter);
};

/**
 * Get filter information for logging or debugging
 * @param req - Express request object
 */
export const getFilterInfo = (req: Request): string => {
  const roleFilter = getRoleFilter(req);

  if (!roleFilter) {
    return 'No role filter applied';
  }

  if (roleFilter.isHROrAdmin && roleFilter.allowedEmployeeIds === null) {
    return 'HR/Admin - Full access';
  }

  if (roleFilter.isManager) {
    return `Manager - Access to ${roleFilter.allowedEmployeeIds?.length || 0} employees`;
  }

  if (roleFilter.isEmployee) {
    return 'Employee - Self access only';
  }

  return 'Unknown role configuration';
};

/**
 * Check if user can access a specific employee's data
 * Useful for detail/update/delete operations
 *
 * @param req - Express request object
 * @param employeeId - The employee ID to check access for
 * @returns true if user has access, false otherwise
 */
export const canAccessEmployee = (req: Request, employeeId: string): boolean => {
  const roleFilter = getRoleFilter(req);

  if (!roleFilter) {
    return false;
  }

  // HR/Admin have access to all
  if (roleFilter.allowedEmployeeIds === null) {
    return true;
  }

  // Check if employeeId is in allowed list
  return roleFilter.allowedEmployeeIds.includes(employeeId);
};

/**
 * Get the current user's employee ID from the role filter
 * @param req - Express request object
 * @returns Employee ID or null
 */
export const getCurrentEmployeeId = (req: Request): string | null => {
  const roleFilter = getRoleFilter(req);
  return roleFilter?.currentEmployeeId || null;
};

/**
 * Build a comprehensive where clause with role filtering and additional conditions
 *
 * @param req - Express request object
 * @param additionalWhere - Additional where conditions to merge
 * @returns Combined where clause
 *
 * Example:
 *   const where = buildWhereWithRoleFilter(req, { status: 'active' });
 *   const results = await Model.findAll({ where });
 */
export const buildWhereWithRoleFilter = (req: Request, additionalWhere: any = {}): any => {
  const roleFilterWhere = applyRoleFilter(req);

  return {
    ...additionalWhere,
    ...roleFilterWhere,
  };
};
