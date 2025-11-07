import { Request } from 'express';
import { Op, fn, col } from 'sequelize';
import { Employee } from '../../employee/model';
import { Department } from '../../department/model';
import { Designation } from '../../designation/model';
import { Location } from '../../location/model';
import { JobOpening } from '../../job-opening/model';
import { Candidate } from '../../candidate/model';
import { Attendance } from '../../attendance/model';
import { LeaveApplication } from '../../leave-application/model';
import { LeaveType } from '../../leave-type/model';
import { SalaryStructure } from '../../salary-structure/model';
import { Payslip } from '../../payslip/model';
import { PerformanceReview } from '../../performance-review/model';
import { Goal } from '../../goal/model';
import { Interview } from '../../interview/model';
import { HeadcountDistribution, OpenPosition, RecentHire, DepartmentSummary, LeaveOverview, PayrollSummary, PerformanceSnapshot, GoalsStats, QuickStats } from './types';

/**
 * Get headcount distribution
 */
export const getHeadcountDistribution = async (req: Request, query: any) => {
  const employees = await Employee.findAll({
    include: [
      {
        model: Department,
        as: 'department',
        attributes: ['departmentName'],
      },
      {
        model: Designation,
        as: 'designation',
        attributes: ['designationName'],
      },
    ],
  });

  const totalEmployees = employees.length;

  // By Department
  const deptMap = new Map<string, number>();
  employees.forEach((emp) => {
    const deptName = (emp as any).department?.departmentName || 'Unassigned';
    deptMap.set(deptName, (deptMap.get(deptName) || 0) + 1);
  });

  const byDepartment = Array.from(deptMap.entries()).map(([departmentName, count]) => ({
    departmentName,
    count,
    percentage: totalEmployees > 0 ? (count / totalEmployees) * 100 : 0,
  }));

  // By Designation
  const desigMap = new Map<string, number>();
  employees.forEach((emp) => {
    const desigName = (emp as any).designation?.designationName || 'Unassigned';
    desigMap.set(desigName, (desigMap.get(desigName) || 0) + 1);
  });

  const byDesignation = Array.from(desigMap.entries()).map(([designationName, count]) => ({
    designationName,
    count,
    percentage: totalEmployees > 0 ? (count / totalEmployees) * 100 : 0,
  }));

  // By Location - Currently not available as Employee model doesn't have location association
  const byLocation: Array<{ locationName: string; count: number; percentage: number }> = [];

  const distribution: HeadcountDistribution = {
    totalEmployees,
    byDepartment,
    byDesignation,
    byLocation,
  };

  return {
    data: distribution,
    meta: {
      message: `Headcount distribution for ${totalEmployees} employees`,
    },
  };
};

/**
 * Get open positions
 */
export const getOpenPositions = async (req: Request, query: any) => {
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  const whereClause: any = { status: 'open' };
  if (query.departmentId) {
    whereClause.departmentId = query.departmentId;
  }

  const jobOpenings = await JobOpening.findAll({
    where: whereClause,
    include: [
      {
        model: Department,
        as: 'department',
        attributes: ['departmentName'],
      },
      {
        model: Designation,
        as: 'designation',
        attributes: ['designationName'],
      },
      {
        model: Location,
        as: 'location',
        attributes: ['locationName'],
      },
      {
        model: Candidate,
        as: 'candidates',
        attributes: ['candidateId'],
        required: false,
      },
    ],
    limit,
    offset,
  });

  const openPositions: OpenPosition[] = jobOpenings.map((job) => {
    const postedDate = new Date(job.publishedAt || job.createdAt);
    const daysOpen = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));

    let urgency: 'low' | 'medium' | 'high' = 'low';
    if (daysOpen > 60) {
      urgency = 'high';
    } else if (daysOpen > 30) {
      urgency = 'medium';
    }

    return {
      jobOpeningId: job.jobOpeningId,
      jobTitle: (job as any).designation?.designationName || 'N/A',
      department: (job as any).department?.departmentName || 'N/A',
      location: (job as any).location?.locationName || 'N/A',
      status: job.status,
      applicants: ((job as any).candidates || []).length,
      daysOpen,
      urgency,
    };
  });

  return {
    data: openPositions,
    meta: {
      total: openPositions.length,
      message: `Found ${openPositions.length} open positions`,
    },
  };
};

/**
 * Get recent hires
 */
export const getRecentHires = async (req: Request, query: any) => {
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = query.endDate ? new Date(query.endDate) : new Date();

  const employees = await Employee.findAll({
    where: {
      employmentStartDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: Department,
        as: 'department',
        attributes: ['departmentName'],
      },
      {
        model: Designation,
        as: 'designation',
        attributes: ['designationName'],
      },
      {
        model: Employee,
        as: 'reportingManager',
        attributes: ['firstName', 'lastName'],
      },
    ],
    order: [['joiningDate', 'DESC']],
    limit,
    offset,
  });

  const recentHires: RecentHire[] = employees.map((emp) => {
    const joinDate = new Date(emp.employmentStartDate || Date.now());
    const daysWithCompany = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

    // Simplified onboarding status
    let onboardingStatus: 'not_started' | 'in_progress' | 'completed' = 'in_progress';
    if (daysWithCompany < 7) {
      onboardingStatus = 'not_started';
    } else if (daysWithCompany > 30) {
      onboardingStatus = 'completed';
    }

    return {
      employeeId: emp.employeeId,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      designation: (emp as any).designation?.designationName || 'N/A',
      department: (emp as any).department?.departmentName || 'N/A',
      joinDate,
      daysWithCompany,
      onboardingStatus,
      reportingManager: (emp as any).reportingManager ? `${(emp as any).reportingManager.firstName} ${(emp as any).reportingManager.lastName}` : undefined,
    };
  });

  return {
    data: recentHires,
    meta: {
      total: recentHires.length,
      message: `Found ${recentHires.length} recent hires`,
    },
  };
};

/**
 * Get department summary
 */
export const getDepartmentSummary = async (req: Request, query: any) => {
  const { departmentId } = query;

  const department = await Department.findByPk(departmentId);
  if (!department) {
    return { data: null, meta: { message: 'Department not found' } };
  }

  const employees = await Employee.findAll({
    where: { departmentId },
  });

  const totalEmployees = employees.length;

  // Gender distribution (if you have a gender field)
  const genderDistribution = {
    male: 0,
    female: 0,
    other: 0,
  };

  // Average tenure
  let totalTenure = 0;
  employees.forEach((emp) => {
    if (emp.employmentStartDate) {
      const joinDate = new Date(emp.employmentStartDate);
      const tenure = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      totalTenure += tenure;
    }
  });
  const averageTenure = totalEmployees > 0 ? totalTenure / totalEmployees : 0;

  // Open positions
  const openPositions = await JobOpening.count({
    where: { departmentId, status: 'open' },
  });

  // Recent hires (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentHires = await Employee.count({
    where: {
      departmentId,
      employmentStartDate: {
        [Op.gte]: thirtyDaysAgo,
      },
    },
  });

  const summary: DepartmentSummary = {
    departmentId,
    departmentName: department.departmentName,
    totalEmployees,
    averageAge: 0, // Would need birthDate field
    genderDistribution,
    averageTenure,
    openPositions,
    recentHires,
    attendanceRate: 0, // Would need attendance calculation
    leaveUtilization: 0, // Would need leave calculation
  };

  return {
    data: summary,
    meta: {
      message: `Department summary for ${department.departmentName}`,
    },
  };
};

/**
 * Get leave overview
 */
export const getLeaveOverview = async (req: Request, query: any) => {
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = query.endDate ? new Date(query.endDate) : new Date();

  const leaveApplications = await LeaveApplication.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: ['firstName', 'lastName'],
      },
      {
        model: LeaveType,
        as: 'leaveType',
        attributes: ['leaveTypeName'],
      },
    ],
  });

  const totalLeaveApplications = leaveApplications.length;
  const pending = leaveApplications.filter((l) => l.status === 'pending').length;
  const approved = leaveApplications.filter((l) => l.status === 'approved').length;
  const rejected = leaveApplications.filter((l) => l.status === 'rejected').length;

  // Employees on leave today
  const today = new Date();
  const employeesOnLeaveToday = await LeaveApplication.count({
    where: {
      status: 'approved',
      startDate: {
        [Op.lte]: today,
      },
      endDate: {
        [Op.gte]: today,
      },
    },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: [],
      },
    ],
  });

  // Upcoming leaves (next 7 days)
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

  const upcomingLeavesData = await LeaveApplication.findAll({
    where: {
      status: 'approved',
      startDate: {
        [Op.between]: [today, sevenDaysLater],
      },
    },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: ['firstName', 'lastName'],
      },
      {
        model: LeaveType,
        as: 'leaveType',
        attributes: ['leaveTypeName'],
      },
    ],
    limit: 10,
  });

  const upcomingLeaves = upcomingLeavesData.map((leave) => ({
    employeeName: `${(leave as any).employee?.firstName || ''} ${(leave as any).employee?.lastName || ''}`,
    leaveType: (leave as any).leaveType?.leaveTypeName || 'N/A',
    startDate: leave.startDate,
    endDate: leave.endDate,
    days: leave.numberOfDay || 0,
  }));

  // Leave by type
  const leaveTypeMap = new Map<string, { count: number; totalDays: number }>();
  leaveApplications.forEach((leave) => {
    if (leave.status === 'approved') {
      const typeName = (leave as any).leaveType?.leaveTypeName || 'Unknown';
      const current = leaveTypeMap.get(typeName) || {
        count: 0,
        totalDays: 0,
      };
      current.count++;
      current.totalDays += leave.numberOfDay || 0;
      leaveTypeMap.set(typeName, current);
    }
  });

  const leaveByType = Array.from(leaveTypeMap.entries()).map(([leaveType, stats]) => ({
    leaveType,
    count: stats.count,
    totalDays: stats.totalDays,
  }));

  const overview: LeaveOverview = {
    totalLeaveApplications,
    pending,
    approved,
    rejected,
    employeesOnLeaveToday,
    upcomingLeaves,
    leaveByType,
  };

  return {
    data: overview,
    meta: {
      message: `Leave overview for the period`,
    },
  };
};

/**
 * Get payroll summary
 */
export const getPayrollSummary = async (req: Request, query: any) => {
  const employees = await Employee.findAll({
    include: [
      {
        model: SalaryStructure,
        as: 'salaryStructures',
        required: false,
      },
      {
        model: Department,
        as: 'department',
        attributes: ['departmentName'],
      },
    ],
  });

  const totalEmployees = employees.length;
  let employeesWithSalaryStructure = 0;
  let totalPayroll = 0;

  const deptPayrollMap = new Map<string, { totalPayroll: number; employeeCount: number }>();

  employees.forEach((emp) => {
    const salaryStructures = (emp as any).salaryStructures || [];
    if (salaryStructures.length > 0) {
      employeesWithSalaryStructure++;
      const latestSalary = salaryStructures[salaryStructures.length - 1];
      const basicSalary = parseFloat(latestSalary.basicSalary || '0');
      totalPayroll += basicSalary;

      const deptName = (emp as any).department?.departmentName || 'Unassigned';
      const current = deptPayrollMap.get(deptName) || {
        totalPayroll: 0,
        employeeCount: 0,
      };
      current.totalPayroll += basicSalary;
      current.employeeCount++;
      deptPayrollMap.set(deptName, current);
    }
  });

  const averageSalary = employeesWithSalaryStructure > 0 ? totalPayroll / employeesWithSalaryStructure : 0;

  const byDepartment = Array.from(deptPayrollMap.entries()).map(([departmentName, stats]) => ({
    departmentName,
    totalPayroll: stats.totalPayroll,
    averageSalary: stats.totalPayroll / stats.employeeCount,
    employeeCount: stats.employeeCount,
  }));

  // Payslips generated this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const payslipsGenerated = await Payslip.count({
    where: {
      createdAt: {
        [Op.gte]: startOfMonth,
      },
    },
  });

  const summary: PayrollSummary = {
    totalEmployees,
    employeesWithSalaryStructure,
    totalPayroll,
    averageSalary,
    byDepartment,
    payslipsGenerated,
    pendingPayslips: totalEmployees - employeesWithSalaryStructure,
  };

  return {
    data: summary,
    meta: {
      message: `Payroll summary`,
    },
  };
};

/**
 * Get performance snapshot
 */
export const getPerformanceSnapshot = async (req: Request, query: any) => {
  const reviews = await PerformanceReview.findAll({
    include: [
      {
        model: Employee,
        as: 'employee',
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['departmentName'],
          },
        ],
      },
    ],
  });

  const totalReviews = reviews.length;
  const completedReviews = reviews.filter((r) => r.status === 'completed').length;
  const pendingReviews = totalReviews - completedReviews;

  // Calculate average rating
  let totalRating = 0;
  let ratingCount = 0;

  reviews.forEach((review) => {
    if (review.overallRating) {
      totalRating += parseFloat(review.overallRating.toString());
      ratingCount++;
    }
  });

  const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

  // Rating distribution (assuming 1-5 scale)
  const ratingMap = new Map<number, number>();
  reviews.forEach((review) => {
    if (review.overallRating) {
      const rating = Math.round(parseFloat(review.overallRating.toString()));
      ratingMap.set(rating, (ratingMap.get(rating) || 0) + 1);
    }
  });

  const ratingDistribution = Array.from(ratingMap.entries()).map(([rating, count]) => ({
    rating,
    count,
    percentage: ratingCount > 0 ? (count / ratingCount) * 100 : 0,
  }));

  // Top performers (rating >= 4.5)
  const topPerformers = reviews
    .filter((r) => r.overallRating && parseFloat(r.overallRating.toString()) >= 4.5)
    .slice(0, 10)
    .map((review) => ({
      employeeId: review.employeeId,
      employeeName: `${(review as any).employee?.firstName || ''} ${(review as any).employee?.lastName || ''}`,
      department: (review as any).employee?.department?.departmentName || 'N/A',
      averageRating: parseFloat(review.overallRating?.toString() || '0'),
    }));

  const snapshot: PerformanceSnapshot = {
    totalReviews,
    completedReviews,
    pendingReviews,
    averageRating,
    ratingDistribution,
    topPerformers,
  };

  return {
    data: snapshot,
    meta: {
      message: `Performance snapshot`,
    },
  };
};

/**
 * Get goals statistics
 */
export const getGoalsStats = async (req: Request, query: any) => {
  const goals = await Goal.findAll({
    include: [
      {
        model: Employee,
        as: 'employee',
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['departmentName'],
          },
        ],
      },
    ],
  });

  const totalGoals = goals.length;
  const completed = goals.filter((g) => g.status === 'completed').length;
  const inProgress = goals.filter((g) => g.status === 'in_progress').length;
  const notStarted = goals.filter((g) => g.status === 'not_started').length;

  // Overdue goals
  const today = new Date();
  const overdue = goals.filter((g) => {
    if (g.endDate && g.status !== 'completed') {
      return new Date(g.endDate) < today;
    }
    return false;
  }).length;

  const completionRate = totalGoals > 0 ? (completed / totalGoals) * 100 : 0;

  // By department
  const deptGoalsMap = new Map<string, { total: number; completed: number }>();

  goals.forEach((goal) => {
    const deptName = (goal as any).employee?.department?.departmentName || 'Unassigned';
    const current = deptGoalsMap.get(deptName) || { total: 0, completed: 0 };
    current.total++;
    if (goal.status === 'completed') {
      current.completed++;
    }
    deptGoalsMap.set(deptName, current);
  });

  const byDepartment = Array.from(deptGoalsMap.entries()).map(([departmentName, stats]) => ({
    departmentName,
    total: stats.total,
    completed: stats.completed,
    completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
  }));

  const stats: GoalsStats = {
    totalGoals,
    completed,
    inProgress,
    notStarted,
    overdue,
    completionRate,
    byDepartment,
  };

  return {
    data: stats,
    meta: {
      message: `Goals statistics`,
    },
  };
};

/**
 * Get quick stats (all-in-one dashboard)
 */
export const getQuickStats = async (req: Request, query: any) => {
  // Employees
  const totalEmployees = await Employee.count({});
  const activeEmployees = totalEmployees; // Assuming all are active

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const onLeaveToday = await LeaveApplication.count({
    where: {
      status: 'approved',
      startDate: { [Op.lte]: endOfDay },
      endDate: { [Op.gte]: startOfDay },
    },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: [],
      },
    ],
  });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newHiresThisMonth = await Employee.count({
    where: {
      employmentStartDate: {
        [Op.gte]: startOfMonth,
      },
    },
  });

  // Attendance
  const todayAttendance = await Attendance.findAll({
    where: {
      attendanceDate: { [Op.between]: [startOfDay, endOfDay] } as any,
    },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: [],
      },
    ],
  });

  const todayPresent = todayAttendance.filter((a) => a.checkInTime !== null).length;
  const todayAbsent = totalEmployees - todayPresent - onLeaveToday;
  const attendanceRate = totalEmployees > 0 ? (todayPresent / totalEmployees) * 100 : 0;

  // Recruitment
  const openPositions = await JobOpening.count({
    where: { status: 'open' },
  });

  const totalCandidates = await Candidate.count();

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const interviewsThisWeek = await Interview.count({
    where: {
      interviewDate: {
        [Op.gte]: startOfWeek,
      },
    },
  });

  // Leaves
  const pendingApprovals = await LeaveApplication.count({
    where: { status: 'pending' },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: [],
      },
    ],
  });

  const approvedThisMonth = await LeaveApplication.count({
    where: {
      status: 'approved',
      updatedAt: {
        [Op.gte]: startOfMonth,
      },
    },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: [],
      },
    ],
  });

  // Performance
  const reviewsDue = await PerformanceReview.count({
    where: { status: 'pending' },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: [],
      },
    ],
  });

  const goalsOverdue = await Goal.count({
    where: {
      endDate: {
        [Op.lt]: today,
      },
      status: {
        [Op.ne]: 'completed',
      },
    },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: [],
      },
    ],
  });

  const quickStats: QuickStats = {
    employees: {
      total: totalEmployees,
      active: activeEmployees,
      onLeaveToday,
      newHiresThisMonth,
    },
    attendance: {
      todayPresent,
      todayAbsent,
      attendanceRate,
    },
    recruitment: {
      openPositions,
      totalCandidates,
      interviewsThisWeek,
    },
    leaves: {
      pendingApprovals,
      approvedThisMonth,
    },
    performance: {
      reviewsDue,
      goalsOverdue,
    },
  };

  return {
    data: quickStats,
    meta: {
      message: `Quick stats dashboard`,
    },
  };
};
