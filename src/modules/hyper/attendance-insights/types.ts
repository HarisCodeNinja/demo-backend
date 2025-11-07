export interface TodaySummary {
  date: Date;
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  attendancePercentage: number;
  departments: {
    departmentName: string;
    present: number;
    total: number;
    percentage: number;
  }[];
}

export interface AbsenteePattern {
  employeeId: string;
  employeeName: string;
  department: string;
  totalAbsences: number;
  consecutiveAbsences: number;
  absentDates: Date[];
  pattern: 'frequent' | 'consecutive' | 'monday_friday' | 'irregular';
}

export interface LateComer {
  employeeId: string;
  employeeName: string;
  department: string;
  manager: string;
  date: Date;
  scheduledTime: string;
  checkInTime: string;
  minutesLate: number;
  lateCount7Days: number;
  lateCount30Days: number;
}

export interface AttendanceAnomaly {
  type: 'missing_checkout' | 'unusual_hours' | 'weekend_login' | 'duplicate_entry';
  employeeId: string;
  employeeName: string;
  department: string;
  date: Date;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TeamAttendance {
  managerId: string;
  managerName: string;
  teamSize: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeaveToday: number;
  attendanceRate7Days: number;
  attendanceRate30Days: number;
  teamMembers: {
    employeeId: string;
    employeeName: string;
    status: 'present' | 'absent' | 'late' | 'on_leave';
    checkInTime?: string;
  }[];
}

export interface MonthlyTrend {
  date: Date;
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  attendancePercentage: number;
  dayOfWeek: string;
}
