import { Request } from 'express';
import { Op } from 'sequelize';
import { Attendance } from '../../attendance/model';
import { Employee } from '../../employee/model';
import { Department } from '../../department/model';
import { LeaveApplication } from '../../leave-application/model';
import { TodaySummary, AbsenteePattern, LateComer, AttendanceAnomaly, TeamAttendance, MonthlyTrend } from './types';

/**
 * Get today's attendance summary
 */
export const getTodaySummary = async (req: Request, query: any) => {
  const targetDate = query.date ? new Date(query.date) : new Date();
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  // Get total employees
  const totalEmployees = await Employee.count({});

  // Get today's attendance
  const attendances = await Attendance.findAll({
    where: {
      attendanceDate: {
        [Op.between]: [startOfDay, endOfDay],
      } as any,
    },
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

  // Get employees on leave today
  const onLeave = await LeaveApplication.count({
    where: {
      status: 'approved',
      startDate: {
        [Op.lte]: endOfDay,
      },
      endDate: {
        [Op.gte]: startOfDay,
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

  const present = attendances.filter((a) => a.checkInTime !== null).length;
  const late = attendances.filter((a) => {
    if (!a.checkInTime) return false;
    const checkIn = new Date(a.checkInTime);
    const scheduledTime = new Date();
    scheduledTime.setHours(9, 0, 0, 0); // Assuming 9 AM start time
    return checkIn > scheduledTime;
  }).length;

  const absent = totalEmployees - present - onLeave;
  const attendancePercentage = totalEmployees > 0 ? (present / totalEmployees) * 100 : 0;

  // Department-wise breakdown
  const departmentMap = new Map<string, { present: number; total: number }>();

  const allEmployees = await Employee.findAll({
    include: [
      {
        model: Department,
        as: 'department',
        attributes: ['departmentName'],
      },
    ],
  });

  allEmployees.forEach((emp) => {
    const deptName = (emp as any).department?.departmentName || 'Unknown';
    if (!departmentMap.has(deptName)) {
      departmentMap.set(deptName, { present: 0, total: 0 });
    }
    const deptStats = departmentMap.get(deptName)!;
    deptStats.total++;
  });

  attendances.forEach((att) => {
    const deptName = (att as any).employee?.department?.departmentName || 'Unknown';
    if (departmentMap.has(deptName)) {
      const deptStats = departmentMap.get(deptName)!;
      if (att.checkInTime) {
        deptStats.present++;
      }
    }
  });

  const departments = Array.from(departmentMap.entries()).map(([departmentName, stats]) => ({
    departmentName,
    present: stats.present,
    total: stats.total,
    percentage: stats.total > 0 ? (stats.present / stats.total) * 100 : 0,
  }));

  const summary: TodaySummary = {
    date: targetDate,
    totalEmployees,
    present,
    absent,
    late,
    onLeave,
    attendancePercentage,
    departments,
  };

  return {
    data: summary,
    meta: {
      message: `Attendance summary for ${targetDate.toDateString()}`,
    },
  };
};

/**
 * Get absentee patterns
 */
export const getAbsenteePatterns = async (req: Request, query: any) => {
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = query.endDate ? new Date(query.endDate) : new Date();
  const minAbsences = query.minAbsences || 3;
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  // Get all employees
  const employees = await Employee.findAll({
    include: [
      {
        model: Department,
        as: 'department',
        attributes: ['departmentName'],
      },
      {
        model: Attendance,
        as: 'attendances',
        where: {
          attendanceDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        required: false,
      },
    ],
    limit,
    offset,
  });

  // Calculate working days in the period
  const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const workingDays = Math.floor((daysDiff / 7) * 5); // Rough estimate

  const absenteePatterns: AbsenteePattern[] = [];

  for (const employee of employees) {
    const attendances = (employee as any).attendances || [];
    const presentDays = attendances.filter((a: any) => a.checkInTime !== null).length;
    const totalAbsences = workingDays - presentDays;

    if (totalAbsences >= minAbsences) {
      // Detect pattern (simplified logic)
      let pattern: 'frequent' | 'consecutive' | 'monday_friday' | 'irregular' = 'irregular';
      if (totalAbsences > workingDays * 0.3) {
        pattern = 'frequent';
      }

      absenteePatterns.push({
        employeeId: employee.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        department: (employee as any).department?.departmentName || 'N/A',
        totalAbsences,
        consecutiveAbsences: 0, // Would need date-by-date analysis
        absentDates: [], // Would need to calculate missing dates
        pattern,
      });
    }
  }

  return {
    data: absenteePatterns,
    meta: {
      total: absenteePatterns.length,
      message: `Found ${absenteePatterns.length} employees with absentee patterns`,
    },
  };
};

/**
 * Get late comers
 */
export const getLateComers = async (req: Request, query: any) => {
  const targetDate = query.date ? new Date(query.date) : new Date();
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
  const minLateMinutes = query.minLateMinutes || 15;
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  const scheduledTime = new Date(startOfDay);
  scheduledTime.setHours(9, 0, 0, 0); // 9 AM

  const attendances = await Attendance.findAll({
    where: {
      attendanceDate: {
        [Op.between]: [startOfDay, endOfDay],
      } as any,
      checkInTime: {
        [Op.ne]: null,
      } as any,
    },
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
          {
            model: Employee,
            as: 'reportingManager',
            attributes: ['firstName', 'lastName'],
          },
        ],
      },
    ],
    limit,
    offset,
  });

  const lateComers: LateComer[] = [];

  for (const attendance of attendances) {
    const checkIn = new Date(attendance.checkInTime!);
    const minutesLate = Math.floor((checkIn.getTime() - scheduledTime.getTime()) / (1000 * 60));

    if (minutesLate >= minLateMinutes) {
      // Count late occurrences in last 7 and 30 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const recentAttendances = await Attendance.findAll({
        where: {
          employeeId: attendance.employeeId,
          attendanceDate: {
            [Op.gte]: thirtyDaysAgo,
          } as any,
          checkInTime: {
            [Op.ne]: null,
          } as any,
        },
      });

      let lateCount7Days = 0;
      let lateCount30Days = 0;

      recentAttendances.forEach((att) => {
        const attCheckIn = new Date(att.checkInTime!);
        const attDate = new Date(att.attendanceDate);
        const attScheduled = new Date(attDate);
        attScheduled.setHours(9, 0, 0, 0);
        const attMinutesLate = Math.floor((attCheckIn.getTime() - attScheduled.getTime()) / (1000 * 60));

        if (attMinutesLate >= minLateMinutes) {
          lateCount30Days++;
          if (new Date(att.attendanceDate) >= sevenDaysAgo) {
            lateCount7Days++;
          }
        }
      });

      const employee = (attendance as any).employee;
      lateComers.push({
        employeeId: attendance.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        department: employee.department?.departmentName || 'N/A',
        manager: employee.reportingManager ? `${employee.reportingManager.firstName} ${employee.reportingManager.lastName}` : 'N/A',
        date: attendance.attendanceDate,
        scheduledTime: '09:00 AM',
        checkInTime: checkIn.toLocaleTimeString(),
        minutesLate,
        lateCount7Days,
        lateCount30Days,
      });
    }
  }

  return {
    data: lateComers,
    meta: {
      total: lateComers.length,
      message: `Found ${lateComers.length} late comers`,
    },
  };
};

/**
 * Detect attendance anomalies
 */
export const getAnomalyDetection = async (req: Request, query: any) => {
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = query.endDate ? new Date(query.endDate) : new Date();
  const limit = query.limit || 50;
  const offset = query.offset || 0;

  const attendances = await Attendance.findAll({
    where: {
      attendanceDate: {
        [Op.between]: [startDate, endDate],
      } as any,
    },
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
    limit,
    offset,
  });

  const anomalies: AttendanceAnomaly[] = [];

  attendances.forEach((attendance) => {
    const employee = (attendance as any).employee;

    // Missing checkout
    if (attendance.checkInTime && !attendance.checkOutTime) {
      const daysSinceCheckIn = Math.floor((Date.now() - new Date(attendance.checkInTime).getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceCheckIn >= 1) {
        anomalies.push({
          type: 'missing_checkout',
          employeeId: attendance.employeeId,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          department: employee.department?.departmentName || 'N/A',
          date: attendance.attendanceDate,
          details: `Check-in at ${new Date(attendance.checkInTime).toLocaleTimeString()}, no check-out recorded`,
          severity: 'medium',
        });
      }
    }

    // Unusual hours (more than 12 hours)
    if (attendance.checkInTime && attendance.checkOutTime) {
      const hoursWorked = (new Date(attendance.checkOutTime).getTime() - new Date(attendance.checkInTime).getTime()) / (1000 * 60 * 60);

      if (hoursWorked > 12) {
        anomalies.push({
          type: 'unusual_hours',
          employeeId: attendance.employeeId,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          department: employee.department?.departmentName || 'N/A',
          date: attendance.attendanceDate,
          details: `Worked ${hoursWorked.toFixed(1)} hours`,
          severity: 'high',
        });
      }
    }

    // Weekend login
    const dayOfWeek = new Date(attendance.attendanceDate).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (attendance.checkInTime) {
        anomalies.push({
          type: 'weekend_login',
          employeeId: attendance.employeeId,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          department: employee.department?.departmentName || 'N/A',
          date: attendance.attendanceDate,
          details: `Checked in on ${dayOfWeek === 0 ? 'Sunday' : 'Saturday'}`,
          severity: 'low',
        });
      }
    }
  });

  return {
    data: anomalies,
    meta: {
      total: anomalies.length,
      message: `Found ${anomalies.length} attendance anomalies`,
    },
  };
};

/**
 * Get team attendance for a manager
 */
export const getTeamAttendance = async (req: Request, query: any) => {
  const { managerId } = query;
  const targetDate = query.date ? new Date(query.date) : new Date();
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  // Get manager details
  const manager = await Employee.findByPk(managerId);
  if (!manager) {
    return { data: null, meta: { message: 'Manager not found' } };
  }

  // Get team members
  const teamMembers = await Employee.findAll({
    where: {
      reportingManagerId: managerId,
    },
    include: [
      {
        model: Attendance,
        as: 'attendances',
        where: {
          attendanceDate: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
        required: false,
      },
    ],
  });

  const teamSize = teamMembers.length;
  let presentToday = 0;
  let lateToday = 0;

  const teamMembersList = teamMembers.map((member) => {
    const todayAttendance = (member as any).attendances?.[0];
    let status: 'present' | 'absent' | 'late' | 'on_leave' = 'absent';
    let checkInTime: string | undefined;

    if (todayAttendance && todayAttendance.checkInTime) {
      const checkIn = new Date(todayAttendance.checkInTime);
      checkInTime = checkIn.toLocaleTimeString();

      const scheduledTime = new Date(todayAttendance.date);
      scheduledTime.setHours(9, 0, 0, 0);

      if (checkIn > scheduledTime) {
        status = 'late';
        lateToday++;
      } else {
        status = 'present';
      }
      presentToday++;
    }

    return {
      employeeId: member.employeeId,
      employeeName: `${member.firstName} ${member.lastName}`,
      status,
      checkInTime,
    };
  });

  const absentToday = teamSize - presentToday;
  const onLeaveToday = 0; // Would need to query LeaveApplication

  const teamAttendance: TeamAttendance = {
    managerId,
    managerName: `${manager.firstName} ${manager.lastName}`,
    teamSize,
    presentToday,
    absentToday,
    lateToday,
    onLeaveToday,
    attendanceRate7Days: 0, // Would need historical calculation
    attendanceRate30Days: 0, // Would need historical calculation
    teamMembers: teamMembersList,
  };

  return {
    data: teamAttendance,
    meta: {
      message: `Team attendance for ${manager.firstName} ${manager.lastName}`,
    },
  };
};

/**
 * Get monthly attendance trends
 */
export const getMonthlyTrends = async (req: Request, query: any) => {
  const startDate = query.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = query.endDate ? new Date(query.endDate) : new Date();

  // Get total employees
  const totalEmployees = await Employee.count({});

  // Get attendance grouped by date
  const attendances = await Attendance.findAll({
    where: {
      attendanceDate: {
        [Op.between]: [startDate, endDate],
      } as any,
    },
    include: [
      {
        model: Employee,
        as: 'employee',
        attributes: [],
      },
    ],
  });

  // Group by date
  const dateMap = new Map<string, { present: number; late: number }>();

  attendances.forEach((att) => {
    const dateKey = new Date(att.attendanceDate).toDateString();
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, { present: 0, late: 0 });
    }

    const stats = dateMap.get(dateKey)!;
    if (att.checkInTime) {
      stats.present++;

      const checkIn = new Date(att.checkInTime);
      const scheduled = new Date(att.attendanceDate);
      scheduled.setHours(9, 0, 0, 0);

      if (checkIn > scheduled) {
        stats.late++;
      }
    }
  });

  const trends: MonthlyTrend[] = Array.from(dateMap.entries()).map(([dateStr, stats]) => {
    const date = new Date(dateStr);
    const absent = totalEmployees - stats.present;
    const attendancePercentage = totalEmployees > 0 ? (stats.present / totalEmployees) * 100 : 0;

    return {
      date,
      totalEmployees,
      present: stats.present,
      absent,
      late: stats.late,
      onLeave: 0, // Would need LeaveApplication query
      attendancePercentage,
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
    };
  });

  trends.sort((a, b) => a.date.getTime() - b.date.getTime());

  return {
    data: trends,
    meta: {
      total: trends.length,
      message: `Attendance trends for ${trends.length} days`,
    },
  };
};
