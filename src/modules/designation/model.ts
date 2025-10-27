// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";

export class Designation extends Model< InferAttributes<Designation>, InferCreationAttributes<Designation>> {

declare designationId: CreationOptional<string>;
declare designationName: string;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeDesignation(sequelize: Sequelize) {
	Designation.init({
			designationId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			designationName: {
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
			{ name: 'designations_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'designations_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'u_designations_designationname_idx', fields: ['designation_name'], unique: true }, 
			{ name: 'u_designations_designationid_pkey', fields: ['designation_id'], unique: true }],
			tableName: 'designations',
			 sequelize
		})
}