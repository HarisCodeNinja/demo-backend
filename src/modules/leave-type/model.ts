// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";

export class LeaveType extends Model< InferAttributes<LeaveType>, InferCreationAttributes<LeaveType>> {

declare leaveTypeId: CreationOptional<string>;
declare typeName: string;
declare maxDaysPerYear: number;
declare isPaid: boolean;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeLeaveType(sequelize: Sequelize) {
	LeaveType.init({
			leaveTypeId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			typeName: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
				},
			maxDaysPerYear: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
				},
			isPaid: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
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
			{ name: 'leavetypes_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'leavetypes_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'u_leavetypes_typename_idx', fields: ['type_name'], unique: true }, 
			{ name: 'u_leavetypes_leavetypeid_pkey', fields: ['leave_type_id'], unique: true }],
			tableName: 'leave_types',
			 sequelize
		})
}