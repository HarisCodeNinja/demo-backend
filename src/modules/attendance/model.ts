// from sequelize model creator
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { Employee } from '../employee/model';

export class Attendance extends Model<InferAttributes<Attendance>, InferCreationAttributes<Attendance>> {
  declare attendanceId: CreationOptional<string>;
  declare employeeId: ForeignKey<Employee['employeeId']>;
  declare attendanceDate: Date;
  declare checkInTime: CreationOptional<Date | null>;
  declare checkOutTime: CreationOptional<Date | null>;
  declare status: string;
  declare totalHour: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initializeAttendance(sequelize: Sequelize) {
  Attendance.init(
    {
      attendanceId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      attendanceDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      checkInTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      checkOutTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Present',
      },
      totalHour: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      underscored: true,
      indexes: [
        { name: 'attendance_updatedat_idx', fields: ['updated_at'], unique: false },
        { name: 'attendance_createdat_idx', fields: ['created_at'], unique: false },
        { name: 'attendance_status_idx', fields: ['status'], unique: false },
        { name: 'attendance_attendancedate_idx', fields: ['attendance_date'], unique: false },
        { name: 'attendance_employeeid_idx', fields: ['employee_id'], unique: false },
        { name: 'attendance_employee_date_unique', fields: ['employee_id', 'attendance_date'], unique: true },
        { name: 'u_attendance_attendanceid_pkey', fields: ['attendance_id'], unique: true },
      ],
      tableName: 'attendances',
      sequelize,
    },
  );
}

export function establishRelationsAttendance() {
  Attendance.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });
}
