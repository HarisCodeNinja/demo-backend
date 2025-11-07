export interface HeadcountDistribution {
  totalEmployees: number;
  byDepartment: {
    departmentName: string;
    count: number;
    percentage: number;
  }[];
  byDesignation: {
    designationName: string;
    count: number;
    percentage: number;
  }[];
  byLocation: {
    locationName: string;
    count: number;
    percentage: number;
  }[];
}

export interface OpenPosition {
  jobOpeningId: string;
  jobTitle: string;
  department: string;
  location: string;
  status: string;
  applicants: number;
  daysOpen: number;
  assignedRecruiter?: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface RecentHire {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  joinDate: Date;
  daysWithCompany: number;
  onboardingStatus: 'not_started' | 'in_progress' | 'completed';
  reportingManager?: string;
}

export interface DepartmentSummary {
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  averageTenure: number;
  openPositions: number;
  recentHires: number;
  attendanceRate: number;
  leaveUtilization: number;
}

export interface LeaveOverview {
  totalLeaveApplications: number;
  pending: number;
  approved: number;
  rejected: number;
  employeesOnLeaveToday: number;
  upcomingLeaves: {
    employeeName: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    days: number;
  }[];
  leaveByType: {
    leaveType: string;
    count: number;
    totalDays: number;
  }[];
}

export interface PayrollSummary {
  totalEmployees: number;
  employeesWithSalaryStructure: number;
  totalPayroll: number;
  averageSalary: number;
  byDepartment: {
    departmentName: string;
    totalPayroll: number;
    averageSalary: number;
    employeeCount: number;
  }[];
  payslipsGenerated: number;
  pendingPayslips: number;
}

export interface PerformanceSnapshot {
  totalReviews: number;
  completedReviews: number;
  pendingReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
  topPerformers: {
    employeeId: string;
    employeeName: string;
    department: string;
    averageRating: number;
  }[];
}

export interface GoalsStats {
  totalGoals: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  overdue: number;
  completionRate: number;
  byDepartment: {
    departmentName: string;
    total: number;
    completed: number;
    completionRate: number;
  }[];
}

export interface QuickStats {
  employees: {
    total: number;
    active: number;
    onLeaveToday: number;
    newHiresThisMonth: number;
  };
  attendance: {
    todayPresent: number;
    todayAbsent: number;
    attendanceRate: number;
  };
  recruitment: {
    openPositions: number;
    totalCandidates: number;
    interviewsThisWeek: number;
  };
  leaves: {
    pendingApprovals: number;
    approvedThisMonth: number;
  };
  performance: {
    reviewsDue: number;
    goalsOverdue: number;
  };
}
