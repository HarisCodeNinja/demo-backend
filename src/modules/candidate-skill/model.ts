// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Skill } from "../skill/model";
import { Candidate } from "../candidate/model";

export class CandidateSkill extends Model< InferAttributes<CandidateSkill>, InferCreationAttributes<CandidateSkill>> {

declare candidateSkillId: CreationOptional<string>;
declare candidateId: ForeignKey<Candidate['candidateId']>;
declare skillId: ForeignKey<Skill['skillId']>;
declare proficiency: CreationOptional<string>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeCandidateSkill(sequelize: Sequelize) {
	CandidateSkill.init({
			candidateSkillId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			candidateId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			skillId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			proficiency: {
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
			{ name: 'candidateskills_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'candidateskills_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'candidateskills_skillid_idx', fields: ['skill_id'], unique: false }, 
			{ name: 'candidateskills_candidateid_idx', fields: ['candidate_id'], unique: false }, 
			{ name: 'u_candidateskills_candidateskillid_pkey', fields: ['candidate_skill_id'], unique: true }],
			tableName: 'candidate_skills',
			 sequelize
		})
}

export function establishRelationsCandidateSkill() {
	  CandidateSkill.belongsTo(Skill, {
    foreignKey: 'skillId',
    as: 'skill',
  });
  CandidateSkill.belongsTo(Candidate, {
    foreignKey: 'candidateId',
    as: 'candidate',
  });

	}