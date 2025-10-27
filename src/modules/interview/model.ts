// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Employee } from "../employee/model";
import { JobOpening } from "../job-opening/model";
import { Candidate } from "../candidate/model";

export class Interview extends Model< InferAttributes<Interview>, InferCreationAttributes<Interview>> {

declare interviewId: CreationOptional<string>;
declare candidateId: ForeignKey<Candidate['candidateId']>;
declare jobOpeningId: ForeignKey<JobOpening['jobOpeningId']>;
declare interviewerId: ForeignKey<Employee['employeeId']>;
declare interviewDate: Date;
declare feedback: CreationOptional<string>;
declare rating: CreationOptional<number>;
declare status: string;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeInterview(sequelize: Sequelize) {
	Interview.init({
			interviewId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			candidateId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			jobOpeningId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			interviewerId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			interviewDate: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW
				},
			feedback: {
				type: DataTypes.TEXT,
				allowNull: true
				},
			rating: {
				type: DataTypes.INTEGER,
				allowNull: true
				},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'Scheduled'
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
			{ name: 'interviews_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'interviews_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'interviews_status_idx', fields: ['status'], unique: false }, 
			{ name: 'interviews_interviewdate_idx', fields: ['interview_date'], unique: false }, 
			{ name: 'interviews_interviewerid_idx', fields: ['interviewer_id'], unique: false }, 
			{ name: 'interviews_jobopeningid_idx', fields: ['job_opening_id'], unique: false }, 
			{ name: 'interviews_candidateid_idx', fields: ['candidate_id'], unique: false }, 
			{ name: 'u_interviews_interviewid_pkey', fields: ['interview_id'], unique: true }],
			tableName: 'interviews',
			 sequelize
		})
}

export function establishRelationsInterview() {
	  Interview.belongsTo(Employee, {
    foreignKey: 'interviewerId',
    as: 'interviewer',
  });
  Interview.belongsTo(JobOpening, {
    foreignKey: 'jobOpeningId',
    as: 'jobOpening',
  });
  Interview.belongsTo(Candidate, {
    foreignKey: 'candidateId',
    as: 'candidate',
  });

	}