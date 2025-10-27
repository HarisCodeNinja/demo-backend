// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";

export class Competency extends Model< InferAttributes<Competency>, InferCreationAttributes<Competency>> {

declare competencyId: CreationOptional<string>;
declare competencyName: string;
declare description: CreationOptional<string>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeCompetency(sequelize: Sequelize) {
	Competency.init({
			competencyId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			competencyName: {
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
			{ name: 'competencies_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'competencies_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'u_competencies_competencyname_idx', fields: ['competency_name'], unique: true }, 
			{ name: 'u_competencies_competencyid_pkey', fields: ['competency_id'], unique: true }],
			tableName: 'competencies',
			 sequelize
		})
}