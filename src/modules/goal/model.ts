// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Employee } from "../employee/model";

export class Goal extends Model< InferAttributes<Goal>, InferCreationAttributes<Goal>> {

declare goalId: CreationOptional<string>;
declare employeeId: ForeignKey<Employee['employeeId']>;
declare title: string;
declare description: CreationOptional<string>;
declare kpi: CreationOptional<Object>;
declare period: string;
declare startDate: Date;
declare endDate: Date;
declare status: string;
declare assignedBy: CreationOptional<Various>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeGoal(sequelize: Sequelize) {
	Goal.init({
			goalId: {
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
			kpi: {
				type: DataTypes.JSON,
				allowNull: true,
				defaultValue: {}
				},
			period: {
				type: DataTypes.STRING,
				allowNull: false
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
				defaultValue: 'Draft'
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
			{ name: 'goals_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'goals_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'goals_assignedbyid_idx', fields: ['assigned_by'], unique: false }, 
			{ name: 'goals_status_idx', fields: ['status'], unique: false }, 
			{ name: 'goals_enddate_idx', fields: ['end_date'], unique: false }, 
			{ name: 'goals_startdate_idx', fields: ['start_date'], unique: false }, 
			{ name: 'goals_period_idx', fields: ['period'], unique: false }, 
			{ name: 'goals_title_idx', fields: ['title'], unique: false }, 
			{ name: 'goals_employeeid_idx', fields: ['employee_id'], unique: false }, 
			{ name: 'u_goals_goalid_pkey', fields: ['goal_id'], unique: true }],
			tableName: 'goals',
			 sequelize
		})
}

export function establishRelationsGoal() {
	  Goal.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });

	}