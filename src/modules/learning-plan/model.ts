// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Employee } from "../employee/model";

export class LearningPlan extends Model< InferAttributes<LearningPlan>, InferCreationAttributes<LearningPlan>> {

declare learningPlanId: CreationOptional<string>;
declare employeeId: ForeignKey<Employee['employeeId']>;
declare title: string;
declare description: CreationOptional<string>;
declare startDate: Date;
declare endDate: Date;
declare status: string;
declare assignedBy: CreationOptional<Various>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeLearningPlan(sequelize: Sequelize) {
	LearningPlan.init({
			learningPlanId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			employeeId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			title: {
				type: DataTypes.STRING,
				allowNull: false
				},
			description: {
				type: DataTypes.TEXT,
				allowNull: true
				},
			startDate: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
				},
			endDate: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
				},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'Pending'
				},
			assignedBy: {
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
			{ name: 'learningplans_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'learningplans_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'learningplans_assignedbyid_idx', fields: ['assigned_by'], unique: false }, 
			{ name: 'learningplans_status_idx', fields: ['status'], unique: false }, 
			{ name: 'learningplans_enddate_idx', fields: ['end_date'], unique: false }, 
			{ name: 'learningplans_startdate_idx', fields: ['start_date'], unique: false }, 
			{ name: 'learningplans_title_idx', fields: ['title'], unique: false }, 
			{ name: 'learningplans_employeeid_idx', fields: ['employee_id'], unique: false }, 
			{ name: 'u_learningplans_learningplanid_pkey', fields: ['learning_plan_id'], unique: true }],
			tableName: 'learning_plans',
			 sequelize
		})
}

export function establishRelationsLearningPlan() {
	  LearningPlan.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });

	}