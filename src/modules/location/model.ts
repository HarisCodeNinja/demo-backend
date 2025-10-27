// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";

export class Location extends Model< InferAttributes<Location>, InferCreationAttributes<Location>> {

declare locationId: CreationOptional<string>;
declare locationName: string;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeLocation(sequelize: Sequelize) {
	Location.init({
			locationId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			locationName: {
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
			{ name: 'locations_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'locations_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'u_locations_locationname_idx', fields: ['location_name'], unique: true }, 
			{ name: 'u_locations_locationid_pkey', fields: ['location_id'], unique: true }],
			tableName: 'locations',
			 sequelize
		})
}