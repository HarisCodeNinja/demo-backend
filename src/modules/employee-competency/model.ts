// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Employee } from "../employee/model";
import { Competency } from "../competency/model";

export class EmployeeCompetency extends Model< InferAttributes<EmployeeCompetency>, InferCreationAttributes<EmployeeCompetency>> {

declare employeeCompetencyId: CreationOptional<string>;
declare employeeId: ForeignKey<Employee['employeeId']>;
declare competencyId: ForeignKey<Competency['competencyId']>;
declare currentProficiency: CreationOptional<string>;
declare lastEvaluated: CreationOptional<Date>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeEmployeeCompetency(sequelize: Sequelize) {
	EmployeeCompetency.init({
			employeeCompetencyId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			employeeId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			competencyId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			currentProficiency: {
				type: DataTypes.STRING,
				allowNull: true
				},
			lastEvaluated: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: DataTypes.NOW
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
			{ name: 'employeecompetencies_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'employeecompetencies_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'employeecompetencies_competencyid_idx', fields: ['competency_id'], unique: false }, 
			{ name: 'employeecompetencies_employeeid_idx', fields: ['employee_id'], unique: false }, 
			{ name: 'u_employeecompetencies_employeecompetencyid_pkey', fields: ['employee_competency_id'], unique: true }],
			tableName: 'employee_competencies',
			 sequelize
		})
}

export function establishRelationsEmployeeCompetency() {
	  EmployeeCompetency.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });
  EmployeeCompetency.belongsTo(Competency, {
    foreignKey: 'competencyId',
    as: 'competency',
  });

	}