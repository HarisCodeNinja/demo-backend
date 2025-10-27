// from sequelize model creator
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { Employee } from '../employee/model';

export class SalaryStructure extends Model<InferAttributes<SalaryStructure>, InferCreationAttributes<SalaryStructure>> {
  declare salaryStructureId: CreationOptional<string>;
  declare employeeId: ForeignKey<Employee['employeeId']>;
  declare basicSalary: number;
  declare allowance: CreationOptional<Object>;
  declare deduction: CreationOptional<Object>;
  declare effectiveDate: Date;
  declare status: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initializeSalaryStructure(sequelize: Sequelize) {
  SalaryStructure.init(
    {
      salaryStructureId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      basicSalary: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      allowance: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      deduction: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
        { name: 'salarystructures_updatedat_idx', fields: ['updated_at'], unique: false },
        { name: 'salarystructures_createdat_idx', fields: ['created_at'], unique: false },
        { name: 'salarystructures_effectivedate_idx', fields: ['effective_date'], unique: false },
        { name: 'salarystructures_employeeid_idx', fields: ['employee_id'], unique: false },
        { name: 'u_salarystructures_salarystructureid_pkey', fields: ['salary_structure_id'], unique: true },
      ],
      tableName: 'salary_structures',
      sequelize,
    },
  );
}

export function establishRelationsSalaryStructure() {
  SalaryStructure.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });
}
