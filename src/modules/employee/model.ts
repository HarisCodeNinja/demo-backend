// from sequelize model creator
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { User } from '../user/model';
import { Designation } from '../designation/model';
import { Department } from '../department/model';
import { Document } from '../document/model';

export class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
  declare employeeId: CreationOptional<string>;
  declare userId: ForeignKey<User['userId']>;
  declare employeeUniqueId: CreationOptional<string>;
  declare firstName: string;
  declare lastName: string;
  declare dateOfBirth: CreationOptional<Date>;
  declare gender: CreationOptional<string>;
  declare phoneNumber: CreationOptional<string>;
  declare address: CreationOptional<string>;
  declare personalEmail: CreationOptional<string>;
  declare employmentStartDate: Date;
  declare employmentEndDate: CreationOptional<Date>;
  declare departmentId: ForeignKey<Department['departmentId']>;
  declare designationId: ForeignKey<Designation['designationId']>;
  declare reportingManagerId: ForeignKey<Employee['employeeId']>;
  declare status: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initializeEmployee(sequelize: Sequelize) {
  Employee.init(
    {
      employeeId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      employeeUniqueId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      personalEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      employmentStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      employmentEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      designationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reportingManagerId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
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
        { name: 'employees_updatedat_idx', fields: ['updated_at'], unique: false },
        { name: 'employees_createdat_idx', fields: ['created_at'], unique: false },
        { name: 'employees_status_idx', fields: ['status'], unique: false },
        { name: 'employees_reportingmanagerid_idx', fields: ['reporting_manager_id'], unique: false },
        { name: 'employees_designationid_idx', fields: ['designation_id'], unique: false },
        { name: 'employees_departmentid_idx', fields: ['department_id'], unique: false },
        { name: 'employees_employmentstartdate_idx', fields: ['employment_start_date'], unique: false },
        { name: 'employees_personalemail_idx', fields: ['personal_email'], unique: false },
        { name: 'employees_lastname_idx', fields: ['last_name'], unique: false },
        { name: 'employees_firstname_idx', fields: ['first_name'], unique: false },
        { name: 'u_employees_employeeuniqueid_idx', fields: ['employee_unique_id'], unique: true },
        { name: 'employees_userid_idx', fields: ['user_id'], unique: false },
        { name: 'u_employees_employeeid_pkey', fields: ['employee_id'], unique: true },
      ],
      tableName: 'employees',
      sequelize,
    },
  );
}

export function establishRelationsEmployee() {
  Employee.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
  Employee.belongsTo(Designation, {
    foreignKey: 'designationId',
    as: 'designation',
  });
  Employee.belongsTo(Department, {
    foreignKey: 'departmentId',
    as: 'department',
  });
  Employee.belongsTo(Employee, {
    foreignKey: 'reportingManagerId',
    as: 'reportingManager',
  });
  Employee.hasMany(Document, {
    foreignKey: 'employeeId',
    as: 'documents',
  });
}
