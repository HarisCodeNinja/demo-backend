// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { JobOpening } from "../job-opening/model";
import { Employee } from "../employee/model";

export class Candidate extends Model< InferAttributes<Candidate>, InferCreationAttributes<Candidate>> {

declare candidateId: CreationOptional<string>;
declare firstName: string;
declare lastName: string;
declare email: string;
declare phoneNumber: CreationOptional<string>;
declare resumeText: CreationOptional<string>;
declare source: CreationOptional<string>;
declare currentStatus: string;
declare jobOpeningId: ForeignKey<JobOpening['jobOpeningId']>;
declare referredByEmployeeId: ForeignKey<Employee['employeeId']>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeCandidate(sequelize: Sequelize) {
	Candidate.init({
			candidateId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false
				},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false
				},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
				},
			phoneNumber: {
				type: DataTypes.STRING,
				allowNull: true
				},
			resumeText: {
				type: DataTypes.TEXT,
				allowNull: true
				},
			source: {
				type: DataTypes.STRING,
				allowNull: true
				},
			currentStatus: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'Applied'
				},
			jobOpeningId: {
				type: DataTypes.UUID,
				allowNull: true
				},
			referredByEmployeeId: {
				type: DataTypes.UUID,
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
			{ name: 'candidates_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'candidates_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'candidates_referredbyemployeeid_idx', fields: ['referred_by_employee_id'], unique: false }, 
			{ name: 'candidates_jobopeningid_idx', fields: ['job_opening_id'], unique: false }, 
			{ name: 'candidates_currentstatus_idx', fields: ['current_status'], unique: false }, 
			{ name: 'candidates_source_idx', fields: ['source'], unique: false }, 
			{ name: 'u_candidates_email_idx', fields: ['email'], unique: true }, 
			{ name: 'candidates_lastname_idx', fields: ['last_name'], unique: false }, 
			{ name: 'candidates_firstname_idx', fields: ['first_name'], unique: false }, 
			{ name: 'u_candidates_candidateid_pkey', fields: ['candidate_id'], unique: true }],
			tableName: 'candidates',
			 sequelize
		})
}

export function establishRelationsCandidate() {
	  Candidate.belongsTo(JobOpening, {
    foreignKey: 'jobOpeningId',
    as: 'jobOpening',
  });
  Candidate.belongsTo(Employee, {
    foreignKey: 'referredByEmployeeId',
    as: 'referredByEmployee',
  });

	}