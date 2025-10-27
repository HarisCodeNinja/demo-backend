// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";

export class Department extends Model< InferAttributes<Department>, InferCreationAttributes<Department>> {

declare departmentId: CreationOptional<string>;
declare departmentName: string;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeDepartment(sequelize: Sequelize) {
	Department.init({
			departmentId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			departmentName: {
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
			{ name: 'departments_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'departments_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'u_departments_departmentname_idx', fields: ['department_name'], unique: true }, 
			{ name: 'u_departments_departmentid_pkey', fields: ['department_id'], unique: true }],
			tableName: 'departments',
			 sequelize
		})
}