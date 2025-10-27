// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Employee } from "../employee/model";

export class Payslip extends Model< InferAttributes<Payslip>, InferCreationAttributes<Payslip>> {

declare payslipId: CreationOptional<string>;
declare employeeId: ForeignKey<Employee['employeeId']>;
declare payPeriodStart: Date;
declare payPeriodEnd: Date;
declare grossSalary: number;
declare netSalary: number;
declare deductionsAmount: number;
declare allowancesAmount: number;
declare pdfUrl: string;
declare generatedBy: CreationOptional<Various>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializePayslip(sequelize: Sequelize) {
	Payslip.init({
			payslipId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			employeeId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			payPeriodStart: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
				},
			payPeriodEnd: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
				},
			grossSalary: {
				type: DataTypes.DECIMAL,
				allowNull: false
				},
			netSalary: {
				type: DataTypes.DECIMAL,
				allowNull: false
				},
			deductionsAmount: {
				type: DataTypes.DECIMAL,
				allowNull: false
				},
			allowancesAmount: {
				type: DataTypes.DECIMAL,
				allowNull: false
				},
			pdfUrl: {
				type: DataTypes.STRING,
				allowNull: false
				},
			generatedBy: {
				type: DataTypes.STRING,
				allowNull: false
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
			{ name: 'payslips_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'payslips_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'payslips_generatedbyid_idx', fields: ['generated_by'], unique: false }, 
			{ name: 'payslips_payperiodend_idx', fields: ['pay_period_end'], unique: false }, 
			{ name: 'payslips_payperiodstart_idx', fields: ['pay_period_start'], unique: false }, 
			{ name: 'payslips_employeeid_idx', fields: ['employee_id'], unique: false }, 
			{ name: 'u_payslips_payslipid_pkey', fields: ['payslip_id'], unique: true }],
			tableName: 'payslips',
			 sequelize
		})
}

export function establishRelationsPayslip() {
	  Payslip.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });

	}