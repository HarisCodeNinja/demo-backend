// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Employee } from "../employee/model";

export class PerformanceReview extends Model< InferAttributes<PerformanceReview>, InferCreationAttributes<PerformanceReview>> {

declare performanceReviewId: CreationOptional<string>;
declare employeeId: ForeignKey<Employee['employeeId']>;
declare reviewerId: ForeignKey<Employee['employeeId']>;
declare reviewPeriod: string;
declare reviewDate: Date;
declare selfAssessment: CreationOptional<string>;
declare managerFeedback: CreationOptional<string>;
declare overallRating: CreationOptional<number>;
declare recommendation: CreationOptional<string>;
declare status: string;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializePerformanceReview(sequelize: Sequelize) {
	PerformanceReview.init({
			performanceReviewId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			employeeId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			reviewerId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			reviewPeriod: {
				type: DataTypes.STRING,
				allowNull: false
				},
			reviewDate: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
				},
			selfAssessment: {
				type: DataTypes.TEXT,
				allowNull: true
				},
			managerFeedback: {
				type: DataTypes.TEXT,
				allowNull: true
				},
			overallRating: {
				type: DataTypes.INTEGER,
				allowNull: true
				},
			recommendation: {
				type: DataTypes.TEXT,
				allowNull: true
				},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'Pending'
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
			{ name: 'performancereviews_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'performancereviews_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'performancereviews_status_idx', fields: ['status'], unique: false }, 
			{ name: 'performancereviews_reviewdate_idx', fields: ['review_date'], unique: false }, 
			{ name: 'performancereviews_reviewperiod_idx', fields: ['review_period'], unique: false }, 
			{ name: 'performancereviews_reviewerid_idx', fields: ['reviewer_id'], unique: false }, 
			{ name: 'performancereviews_employeeid_idx', fields: ['employee_id'], unique: false }, 
			{ name: 'u_performancereviews_performancereviewid_pkey', fields: ['performance_review_id'], unique: true }],
			tableName: 'performance_reviews',
			 sequelize
		})
}

export function establishRelationsPerformanceReview() {
	  PerformanceReview.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });
  PerformanceReview.belongsTo(Employee, {
    foreignKey: 'reviewerId',
    as: 'reviewer',
  });

	}