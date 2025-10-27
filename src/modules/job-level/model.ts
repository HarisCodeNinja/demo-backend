// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";

export class JobLevel extends Model< InferAttributes<JobLevel>, InferCreationAttributes<JobLevel>> {

declare jobLevelId: CreationOptional<string>;
declare levelName: string;
declare description: CreationOptional<string>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeJobLevel(sequelize: Sequelize) {
	JobLevel.init({
			jobLevelId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			levelName: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
				},
			description: {
				type: DataTypes.TEXT,
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
			{ name: 'joblevels_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'joblevels_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'u_joblevels_levelname_idx', fields: ['level_name'], unique: true }, 
			{ name: 'u_joblevels_joblevelid_pkey', fields: ['job_level_id'], unique: true }],
			tableName: 'job_levels',
			 sequelize
		})
}