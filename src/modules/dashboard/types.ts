export interface DashboardOverviewStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  totalDesignations: number;
}

export interface EmployeeDistribution {
  departmentName: string;
  employeeCount: number;
}

export interface AttendanceStats {
  date: string;
  present: number;
  absent: number;
  late: number;
  totalEmployees: number;
  attendanceRate: number;
}

export interface LeaveStats {
  pending: number;
  approved: number;
  rejected: number;
  totalApplications: number;
}

export interface LeaveTypeDistribution {
  typeName: string;
  count: number;
}

export interface RecruitmentStats {
  totalCandidates: number;
  totalInterviews: number;
  totalOffers: number;
  totalJobOpenings: number;
  activeJobOpenings: number;
}

export interface CandidateStatusDistribution {
  status: string;
  count: number;
}

export interface CandidateSourceDistribution {
  source: string;
  count: number;
}

export interface UpcomingInterview {
  interviewId: string;
  candidateFirstName: string;
  candidateLastName: string;
  jobTitle: string;
  interviewDate: Date;
  interviewerFirstName: string;
  interviewerLastName: string;
  status: string;
}

export interface RecentCandidate {
  candidateId: string;
  firstName: string;
  lastName: string;
  email: string;
  currentStatus: string;
  jobTitle: string;
  createdAt: Date;
}

export interface InterviewStatusDistribution {
  status: string;
  count: number;
}

export interface PerformanceReviewStats {
  pending: number;
  completed: number;
  total: number;
  averageRating?: number;
}

export interface GoalStats {
  draft: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  total: number;
}

export interface RecentActivity {
  type: string;
  description: string;
  timestamp: Date;
  employeeName?: string;
}

export interface UpcomingEvents {
  type: string;
  title: string;
  date: Date;
  employeeName?: string;
}

export interface DepartmentWiseAttendance {
  departmentName: string;
  present: number;
  absent: number;
  attendanceRate: number;
}

export interface MonthlyLeaveDistribution {
  month: string;
  leaveCount: number;
}

export interface SalaryDistribution {
  range: string;
  count: number;
}

export interface QueryDashboardInput {
  startDate?: Date;
  endDate?: Date;
  departmentId?: string;
}
