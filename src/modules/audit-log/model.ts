// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { User } from "../user/model";

export class AuditLog extends Model< InferAttributes<AuditLog>, InferCreationAttributes<AuditLog>> {

declare auditLogId: CreationOptional<string>;
declare userId: ForeignKey<User['userId']>;
declare action: string;
declare tableName: string;
declare recordId: string;
declare oldValue: CreationOptional<Object>;
declare newValue: CreationOptional<Object>;
declare ipAddress: CreationOptional<string>;
declare timestamp: CreationOptional<Date>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeAuditLog(sequelize: Sequelize) {
	AuditLog.init({
			auditLogId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			userId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			action: {
				type: DataTypes.STRING,
				allowNull: false
				},
			tableName: {
				type: DataTypes.STRING,
				allowNull: false
				},
			recordId: {
				type: DataTypes.STRING,
				allowNull: false
				},
			oldValue: {
				type: DataTypes.JSON,
				allowNull: true,
				defaultValue: {}
				},
			newValue: {
				type: DataTypes.JSON,
				allowNull: true,
				defaultValue: {}
				},
			ipAddress: {
				type: DataTypes.STRING,
				allowNull: true
				},
			timestamp: {
				type: DataTypes.DATE,
				allowNull: false,
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
			{ name: 'auditlogs_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'auditlogs_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'auditlogs_timestamp_idx', fields: ['timestamp'], unique: false }, 
			{ name: 'auditlogs_recordid_idx', fields: ['record_id'], unique: false }, 
			{ name: 'auditlogs_tablename_idx', fields: ['table_name'], unique: false }, 
			{ name: 'auditlogs_action_idx', fields: ['action'], unique: false }, 
			{ name: 'auditlogs_userid_idx', fields: ['user_id'], unique: false }, 
			{ name: 'u_auditlogs_auditlogid_pkey', fields: ['audit_log_id'], unique: true }],
			tableName: 'audit_logs',
			 sequelize
		})
}

export function establishRelationsAuditLog() {
	  AuditLog.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

	}