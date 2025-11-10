# Role-Based Filtering Implementation Guide

## Overview

This guide shows how to implement role-based access control for employee data using our new middleware system. The middleware approach is **much cleaner** than the old pattern of passing `userContext` to every service function.

---

## ✅ New Approach (RECOMMENDED)

### Step 1: Add Middleware to Router

```typescript
import { applyRoleBasedFilter } from '../../middleware/roleBasedFilter';

ModuleRoutes.get('/',
  validateAccessToken,
  requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  applyRoleBasedFilter('team-viewable'), // 👈 ONE LINE - handles everything!
  asyncHandler(async (req: Request, res: Response) => {
    const result = await fetchList(req.query, req);
    res.status(200).json(result);
  })
);
```

### Step 2: Use Helpers in Service

```typescript
import { checkAccess, applyRoleFilter } from '../../util/roleFilterHelpers';

export const fetchList = async (params: QueryInput, req: any) => {
  // Early return if no access
  if (!checkAccess(req)) {
    return { data: [], meta: { total: 0 } };
  }

  // Apply filtering - ONE LINE!
  const whereClause = applyRoleFilter(req);

  const { count, rows } = await Model.findAndCountAll({
    where: whereClause, // 👈 Automatically filtered!
    // ... rest of query
  });

  return { data: rows, meta: { total: count } };
};
```

**That's it!** Just 3 lines of code:
1. Add middleware to route
2. Check access in service
3. Apply filter to query

---

## ❌ Old Approach (DEPRECATED)

**Don't do this anymore!** This is what we used to do:

### Router (Old Way)
```typescript
// ❌ NO MIDDLEWARE
ModuleRoutes.get('/', validateAccessToken, requireRoles([...]),
  asyncHandler(async (req: Request, res: Response) => {
    const userContext = (req as any).user; // 👈 Manual extraction
    const result = await fetchList(req.query, userContext); // 👈 Pass everywhere
    res.status(200).json(result);
  })
);
```

### Service (Old Way)
```typescript
// ❌ LOTS OF BOILERPLATE CODE IN EVERY SERVICE!
interface UserContext {
  userId: string;
  role: string;
  scope?: string[];
}

const getRoleBasedFilter = async (userContext: UserContext) => {
  const { userId, role } = userContext;

  if (role === 'hr' || role === 'admin') {
    return null;
  }

  const currentEmployee = await Employee.findOne({ where: { userId } });
  if (!currentEmployee) {
    return { allowedEmployeeIds: [] };
  }

  if (role === 'employee') {
    return { allowedEmployeeIds: [currentEmployee.employeeId] };
  }

  if (role === 'manager') {
    const teamMembers = await Employee.findAll({
      where: { reportingManagerId: currentEmployee.employeeId }
    });
    return {
      allowedEmployeeIds: [currentEmployee.employeeId, ...teamMembers.map(e => e.employeeId)]
    };
  }

  return { allowedEmployeeIds: [] };
};

export const fetchList = async (params: QueryInput, userContext: UserContext) => {
  // 👎 Repeat this in EVERY service function
  const roleFilter = await getRoleBasedFilter(userContext);
  let whereClause: any = {};

  if (roleFilter !== null) {
    if (roleFilter.allowedEmployeeIds.length === 0) {
      return { data: [], meta: { total: 0 } };
    }
    whereClause.employeeId = { [Op.in]: roleFilter.allowedEmployeeIds };
  }

  const { count, rows } = await Model.findAndCountAll({
    where: whereClause,
    // ... rest
  });

  return { data: rows, meta: { total: count } };
};
```

**Problems with old approach:**
- 🔴 50+ lines of boilerplate in EVERY module
- 🔴 Must pass `userContext` to every service function
- 🔴 Easy to forget security checks
- 🔴 Inconsistent implementation across modules
- 🔴 Hard to maintain and update

---

## Filter Strategies

The middleware supports different filtering strategies for different data types:

### 1. `'team-viewable'` (Default for most modules)
- **Employee**: Own data only
- **Manager**: Own + team members
- **HR/Admin**: All data
- **Use for**: Attendance, Goals, Learning Plans, Performance Reviews

```typescript
applyRoleBasedFilter('team-viewable')
```

### 2. `'sensitive-financial'` (For salary/financial data)
- **Employee**: Own data only
- **Manager**: ❌ NO ACCESS (too sensitive)
- **HR/Admin**: All data
- **Use for**: Payslips, Salary Info

```typescript
applyRoleBasedFilter('sensitive-financial')
```

### 3. `'employee-data'` (General employee records)
- **Employee**: Own record only
- **Manager**: Own + team members
- **HR/Admin**: All records
- **Use for**: Employee profiles, Documents

```typescript
applyRoleBasedFilter('employee-data')
```

### 4. `'self-only'` (Personal account data)
- **Everyone**: Own data only (even HR/Admin)
- **Use for**: User accounts, Personal settings

```typescript
applyRoleBasedFilter('self-only')
```

### 5. `'hr-admin-only'` (Administrative data)
- **HR/Admin**: All data
- **Everyone else**: No access
- **Use for**: System configs (usually already handled by `requireRoles`)

```typescript
applyRoleBasedFilter('hr-admin-only')
```

---

## Helper Functions Reference

### 1. `checkAccess(req)`
Check if user has access to any data.

```typescript
if (!checkAccess(req)) {
  return { data: [], meta: { total: 0 } };
}
```

### 2. `applyRoleFilter(req)`
Get where clause for Sequelize queries.

```typescript
const whereClause = applyRoleFilter(req);
await Model.findAll({ where: whereClause });
```

### 3. `buildWhereWithRoleFilter(req, conditions)`
Combine role filtering with additional conditions.

```typescript
const where = buildWhereWithRoleFilter(req, {
  status: 'active',
  startDate: { [Op.gte]: new Date() }
});
```

### 4. `canAccessEmployee(req, employeeId)`
Check if user can access specific employee's data.

```typescript
if (!canAccessEmployee(req, targetEmployeeId)) {
  return { errorCode: 'FORBIDDEN', message: 'No access' };
}
```

### 5. `getCurrentEmployeeId(req)`
Get logged-in user's employee ID.

```typescript
const currentEmployeeId = getCurrentEmployeeId(req);
```

---

## Complete Example: Implementing a New Module

Let's implement role-based filtering for a hypothetical "TimeOff" module:

### 1. Router Implementation

```typescript
import { Router, Request, Response } from 'express';
import { validateAccessToken, requireRoles } from '../../helper/auth';
import { applyRoleBasedFilter } from '../../middleware/roleBasedFilter';
import { fetchTimeOffList, getTimeOff } from './service';

export const TimeOffRoutes = Router();

// List endpoint
TimeOffRoutes.get('/',
  validateAccessToken,
  requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  applyRoleBasedFilter('team-viewable'), // 👈 Middleware!
  asyncHandler(async (req: Request, res: Response) => {
    const result = await fetchTimeOffList(req.query, req);
    res.status(200).json(result);
  })
);

// Detail endpoint
TimeOffRoutes.get('/detail/:id',
  validateAccessToken,
  requireRoles(['user:employee','user:manager','user:hr','user:admin']),
  applyRoleBasedFilter('team-viewable'), // 👈 Middleware!
  asyncHandler(async (req: Request, res: Response) => {
    const result = await getTimeOff(req.params, req);

    if (result && 'errorCode' in result) {
      const status = result.errorCode === 'FORBIDDEN' ? 403 : 404;
      return res.status(status).json(result);
    }

    res.status(200).json(result);
  })
);
```

### 2. Service Implementation

```typescript
import { checkAccess, applyRoleFilter } from '../../util/roleFilterHelpers';

export const fetchTimeOffList = async (params: QueryInput, req: any) => {
  // Check access
  if (!checkAccess(req)) {
    return { data: [], meta: { total: 0 } };
  }

  // Apply filter
  const whereClause = applyRoleFilter(req);

  const { count, rows } = await TimeOff.findAndCountAll({
    where: whereClause,
    include: [{ model: Employee, as: 'employee' }],
    limit: params.pageSize,
    offset: params.page * params.pageSize,
  });

  return { data: rows, meta: { total: count } };
};

export const getTimeOff = async (params: any, req: any) => {
  // Check access
  if (!checkAccess(req)) {
    return { errorCode: 'FORBIDDEN', message: 'No permission' };
  }

  // Apply filter
  const whereClause = applyRoleFilter(req);

  const record = await TimeOff.findOne({
    where: {
      timeOffId: params.id,
      ...whereClause, // 👈 Role filter applied!
    },
    include: [{ model: Employee, as: 'employee' }],
  });

  if (!record) {
    return { errorCode: 'NOT_FOUND', message: 'Record not found' };
  }

  return { data: record };
};
```

**That's all you need!** No complex role checking logic, no passing userContext everywhere, no boilerplate.

---

## Migration Checklist

To migrate existing modules to the new pattern:

- [ ] Import middleware in router: `import { applyRoleBasedFilter } from '../../middleware/roleBasedFilter'`
- [ ] Import helpers in service: `import { checkAccess, applyRoleFilter } from '../../util/roleFilterHelpers'`
- [ ] Add middleware to GET routes with appropriate strategy
- [ ] Update service functions to accept `req` parameter
- [ ] Replace role checking logic with `checkAccess(req)`
- [ ] Replace where clause logic with `applyRoleFilter(req)`
- [ ] Update router to pass `req` to service functions
- [ ] Remove old `UserContext` interface and `getRoleBasedFilter()` function
- [ ] Build and test
- [ ] Commit changes

---

## Modules Status

### ✅ Implemented with New Pattern
- **Leave Application** (migrated to new pattern)
- **Payslip** (critical - financial data)
- **Attendance** (team-viewable data)

### 🔄 Need Migration
These modules still use the old pattern and should be migrated:
- Performance Review
- Goal
- Learning Plan
- Document
- Employee
- User

### 📋 To Be Implemented
These modules need role-based filtering added:
- All items in "Need Migration" list above

---

## Testing

After implementing role-based filtering, test these scenarios:

1. **Employee Login**
   - ✅ Can see own data
   - ❌ Cannot see other employees' data
   - ❌ Returns 403 when trying to access others' records

2. **Manager Login**
   - ✅ Can see own data
   - ✅ Can see team members' data
   - ❌ Cannot see data from other teams
   - ❌ Cannot see sensitive financial data (payslips)

3. **HR/Admin Login**
   - ✅ Can see all data
   - ✅ No filtering applied

---

## Benefits Summary

| Aspect | Old Approach | New Approach |
|--------|-------------|--------------|
| **Lines of Code** | ~80 lines per module | ~5 lines per module |
| **Boilerplate** | Repeated in every module | Written once, reused everywhere |
| **Consistency** | Varies by implementation | Standardized across codebase |
| **Maintainability** | Hard to update | Change once in middleware |
| **Error Prone** | Easy to forget checks | Enforced at route level |
| **Testability** | Must test each module | Test middleware once |

**New approach is 16x less code and infinitely more maintainable!**

---

## Questions?

- **Q: Can I use multiple strategies on one route?**
  A: No, each route should have one strategy. If you need custom logic, extend the middleware.

- **Q: What if I need different logic for one endpoint?**
  A: You can skip the middleware and use the helper functions directly in your service.

- **Q: How do I debug filtering issues?**
  A: Use `getFilterInfo(req)` helper to log filtering state.

- **Q: Can managers see payslips?**
  A: No, use `'sensitive-financial'` strategy which excludes managers.

---

## Next Steps

1. ✅ Middleware system created
2. ✅ Attendance module implemented
3. 🔄 Migrate remaining modules to new pattern
4. 📝 Update API documentation
5. 🧪 Add integration tests

---

**Need help?** Check the reference implementations:
- `src/modules/attendance/` - Complete example with new pattern
- `src/middleware/roleBasedFilter.ts` - Middleware source code
- `src/util/roleFilterHelpers.ts` - Helper functions source code
