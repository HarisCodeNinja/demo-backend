// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";

export class User extends Model< InferAttributes<User>, InferCreationAttributes<User>> {

declare userId: CreationOptional<string>;
declare email: string;
declare username: string;
declare password: string;
declare role: string;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeUser(sequelize: Sequelize) {
	User.init({
			userId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
				},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
				},
			password: {
				type: DataTypes.STRING,
				allowNull: false
				},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'admin'
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
			{ name: 'users_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'users_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'users_role_idx', fields: ['role'], unique: false }, 
			{ name: 'u_users_username_idx', fields: ['username'], unique: true }, 
			{ name: 'u_users_email_idx', fields: ['email'], unique: true }, 
			{ name: 'u_users_userid_pkey', fields: ['user_id'], unique: true }],
			tableName: 'users',
			 sequelize
		})
}