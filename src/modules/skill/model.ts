// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";

export class Skill extends Model< InferAttributes<Skill>, InferCreationAttributes<Skill>> {

declare skillId: CreationOptional<string>;
declare skillName: string;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeSkill(sequelize: Sequelize) {
	Skill.init({
			skillId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			skillName: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
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
			{ name: 'skills_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'skills_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'u_skills_skillname_idx', fields: ['skill_name'], unique: true }, 
			{ name: 'u_skills_skillid_pkey', fields: ['skill_id'], unique: true }],
			tableName: 'skills',
			 sequelize
		})
}