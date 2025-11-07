# HRMS Backend - Comprehensive Architecture Overview

## Quick Summary

**28 API modules** with **26 database models** covering complete HR operations:
- User & Employee Management
- Attendance & Leave Management  
- Payroll & Salary Processing
- Recruitment & Hiring
- Performance Management
- Skills & Development
- Audit & Analytics

All with modern **role-based access control (RBAC)** using middleware-based filtering.

---

## Project Structure

```
src/
├── app.ts                    # Express setup
├── server.ts                 # Entry point
├── config/                   # Configuration
│   ├── db.ts                # Database models & relationships
│   ├── env.ts               # Environment validation
│   ├── swagger.ts           # API documentation
│   └── routes/defaultRoutes.ts
├── middleware/
│   ├── roleBasedFilter.ts   # Row-level security middleware
│   ├── errorHandler.ts
│   └── zodValidation.ts
├── helper/auth.ts           # JWT & passwords
├── util/
│   ├── roleFilterHelpers.ts # Service layer filtering
│   ├── cache.ts
│   ├── logger.ts
│   └── routeConfig.ts
└── modules/                 # 28 Feature modules
    ├── user/
    ├── employee/
    ├── attendance/
    ├── leave-application/
    ├── payslip/
    ├── salary-structure/
    ├── candidate/
    ├── job-opening/
    ├── interview/
    ├── performance-review/
    ├── goal/
    ├── learning-plan/
    ├── department/
    ├── designation/
    ├── location/
    ├── skill/
    ├── competency/
    ├── audit-log/
    └── ... (10 more modules)
```

