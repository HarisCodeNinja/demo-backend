import { z } from 'zod';
import { Op } from 'sequelize';
import { Attendance } from './model';

export const attendanceQueryValidator = z.object({
  page: z.coerce.number().optional().nullable(),
  pageSize: z.coerce.number().optional().nullable(),
});

export const attendanceParamValidator = z.object({
  attendanceId: z.uuid('Invalid UUID format'),
});

const optionalDate = z.coerce.date().optional().nullable();

export const createAttendancePayloadValidator = z.object({
  employeeId: z.uuid('Invalid UUID format'),
  attendanceDate: z.coerce.date({ error: 'Attendance Date is required' }),
  checkInTime: optionalDate,
  checkOutTime: optionalDate,
  status: z.string({ error: 'Status is required' }),
});

export const updateAttendancePayloadValidator = (attendanceId: string) =>
  z.object({
    employeeId: z.uuid('Invalid UUID format'),
    attendanceDate: z.coerce.date({ error: 'Attendance Date is required' }),
    checkInTime: optionalDate,
    checkOutTime: optionalDate,
    status: z.string({ error: 'Status is required' }),
  });
