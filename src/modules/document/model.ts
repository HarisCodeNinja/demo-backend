// from sequelize model creator 
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute} from "sequelize";
import { Employee } from "../employee/model";

export class Document extends Model< InferAttributes<Document>, InferCreationAttributes<Document>> {

declare documentId: CreationOptional<string>;
declare employeeId: ForeignKey<Employee['employeeId']>;
declare documentType: string;
declare fileName: string;
declare fileUrl: string;
declare uploadedBy: CreationOptional<Various>;
declare createdAt: CreationOptional<Date>;
declare updatedAt: CreationOptional<Date>;
}


export function initializeDocument(sequelize: Sequelize) {
	Document.init({
			documentId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4
				},
			employeeId: {
				type: DataTypes.UUID,
				allowNull: false
				},
			documentType: {
				type: DataTypes.STRING,
				allowNull: false
				},
			fileName: {
				type: DataTypes.STRING,
				allowNull: false
				},
			fileUrl: {
				type: DataTypes.STRING,
				allowNull: false
				},
			uploadedBy: {
				type: DataTypes.STRING,
				allowNull: false
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
			{ name: 'documents_updatedat_idx', fields: ['updated_at'], unique: false }, 
			{ name: 'documents_createdat_idx', fields: ['created_at'], unique: false }, 
			{ name: 'documents_uploadedbyid_idx', fields: ['uploaded_by'], unique: false }, 
			{ name: 'documents_documenttype_idx', fields: ['document_type'], unique: false }, 
			{ name: 'documents_employeeid_idx', fields: ['employee_id'], unique: false }, 
			{ name: 'u_documents_documentid_pkey', fields: ['document_id'], unique: true }],
			tableName: 'documents',
			 sequelize
		})
}

export function establishRelationsDocument() {
	  Document.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee',
  });

	}