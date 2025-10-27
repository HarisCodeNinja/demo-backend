// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Skill } from "../skill/model";
import { JobOpening } from "../job-opening/model";

export class JobOpeningSkill extends Model< InferAttributes<JobOpeningSkill>, InferCreationAttributes<JobOpeningSkill>> {

declare jobOpeningSkillId: CreationOptional<string>;
declare jobOpeningId: ForeignKey<JobOpening['jobOpeningId']>;
declare skillId: ForeignKey<Skill['skillId']>;
declare requiredLevel: CreationOptional<string>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeJobOpeningSkill(sequelize: Sequelize) {
	JobOpeningSkill.init({
			jobOpeningSkillId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			jobOpeningId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			skillId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			requiredLevel: {
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
			{ name: 'jobopeningskills_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'jobopeningskills_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'jobopeningskills_skillid_idx', fields: ['skill_id'], unique: false }, 
			{ name: 'jobopeningskills_jobopeningid_idx', fields: ['job_opening_id'], unique: false }, 
			{ name: 'u_jobopeningskills_jobopeningskillid_pkey', fields: ['job_opening_skill_id'], unique: true }],
			tableName: 'job_opening_skills',
			 sequelize
		})
}

export function establishRelationsJobOpeningSkill() {
	  JobOpeningSkill.belongsTo(Skill, {
    foreignKey: 'skillId',
    as: 'skill',
  });
  JobOpeningSkill.belongsTo(JobOpening, {
    foreignKey: 'jobOpeningId',
    as: 'jobOpening',
  });

	}