// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Competency } from "../competency/model";
import { Designation } from "../designation/model";

export class RoleCompetency extends Model< InferAttributes<RoleCompetency>, InferCreationAttributes<RoleCompetency>> {

declare roleCompetencyId: CreationOptional<string>;
declare designationId: ForeignKey<Designation['designationId']>;
declare competencyId: ForeignKey<Competency['competencyId']>;
declare requiredProficiency: CreationOptional<string>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeRoleCompetency(sequelize: Sequelize) {
	RoleCompetency.init({
			roleCompetencyId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			designationId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			competencyId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			requiredProficiency: {
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
			{ name: 'rolecompetencies_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'rolecompetencies_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'rolecompetencies_competencyid_idx', fields: ['competency_id'], unique: false }, 
			{ name: 'rolecompetencies_designationid_idx', fields: ['designation_id'], unique: false }, 
			{ name: 'u_rolecompetencies_rolecompetencyid_pkey', fields: ['role_competency_id'], unique: true }],
			tableName: 'role_competencies',
			 sequelize
		})
}

export function establishRelationsRoleCompetency() {
	  RoleCompetency.belongsTo(Competency, {
    foreignKey: 'competencyId',
    as: 'competency',
  });
  RoleCompetency.belongsTo(Designation, {
    foreignKey: 'designationId',
    as: 'designation',
  });

	}