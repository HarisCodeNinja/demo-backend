// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Employee } from "../employee/model";

export class Attendance extends Model< InferAttributes<Attendance>, InferCreationAttributes<Attendance>> {

declare attendanceId: CreationOptional<string>;
declare employeeId: ForeignKey<Employee['employeeId']>;
declare attendanceDate: Date;
declare checkInTime: Date;
declare checkOutTime: CreationOptional<Date>;
declare status: string;
declare totalHour: CreationOptional<Various>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeAttendance(sequelize: Sequelize) {
	Attendance.init({
			attendanceId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			employeeId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			attendanceDate: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
				},
			checkInTime: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
				},
			checkOutTime: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: DataTypes.NOW
				},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'Present'
				},
			totalHour: {
				type: DataTypes.STRING,
				allowNull: true
				},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
				},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
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
			{ name: 'u_attendance_attendanceid_pkey', fields: ['attendance_id'], unique: true }],
			tableName: 'attendances',
			 sequelize
		})
}

export function establishRelationsAttendance() {
	  Attendance.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });

	}