// from sequelize model creator
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { Employee } from '../employee/model';
import { LeaveType } from '../leave-type/model';

export class LeaveApplication extends Model<InferAttributes<LeaveApplication>, InferCreationAttributes<LeaveApplication>> {
  declare leaveApplicationId: CreationOptional<string>;
  declare employeeId: ForeignKey<Employee['employeeId']>;
  declare leaveTypeId: ForeignKey<LeaveType['leaveTypeId']>;
  declare startDate: Date;
  declare endDate: Date;
  declare numberOfDay: CreationOptional<number>;
  declare reason: string;
  declare status: string;
  declare appliedBy: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initializeLeaveApplication(sequelize: Sequelize) {
  LeaveApplication.init(
    {
      leaveApplicationId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      leaveTypeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      numberOfDay: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
      },
      appliedBy: {
        type: DataTypes.STRING,
        allowNull: false,
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
        { name: 'leaveapplications_updatedat_idx', fields: ['updated_at'], unique: false },
        { name: 'leaveapplications_createdat_idx', fields: ['created_at'], unique: false },
        { name: 'leaveapplications_appliedbyid_idx', fields: ['applied_by'], unique: false },
        { name: 'leaveapplications_status_idx', fields: ['status'], unique: false },
        { name: 'leaveapplications_enddate_idx', fields: ['end_date'], unique: false },
        { name: 'leaveapplications_startdate_idx', fields: ['start_date'], unique: false },
        { name: 'leaveapplications_leavetypeid_idx', fields: ['leave_type_id'], unique: false },
        { name: 'leaveapplications_employeeid_idx', fields: ['employee_id'], unique: false },
        { name: 'leaveapplications_employee_status_idx', fields: ['employee_id', 'status'], unique: false },
        { name: 'u_leaveapplications_leaveapplicationid_pkey', fields: ['leave_application_id'], unique: true },
      ],
      tableName: 'leave_applications',
      sequelize,
    },
  );
}

export function establishRelationsLeaveApplication() {
  LeaveApplication.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });
  LeaveApplication.belongsTo(LeaveType, {
    foreignKey: 'leaveTypeId',
    as: 'leaveType',
  });
}
