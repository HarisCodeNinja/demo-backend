// from sequelize model creator
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { Designation } from '../designation/model';
import { Department } from '../department/model';

export class JobOpening extends Model<InferAttributes<JobOpening>, InferCreationAttributes<JobOpening>> {
  declare jobOpeningId: CreationOptional<string>;
  declare title: string;
  declare description: string;
  declare departmentId: ForeignKey<Department['departmentId']>;
  declare designationId: ForeignKey<Designation['designationId']>;
  declare requiredExperience: number;
  declare status: string;
  declare publishedAt: CreationOptional<Date>;
  declare closedAt: CreationOptional<Date>;
  declare createdBy: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initializeJobOpening(sequelize: Sequelize) {
  JobOpening.init(
    {
      jobOpeningId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      designationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      requiredExperience: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'draft',
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      closedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      underscored: true,
      indexes: [
        { name: 'jobopenings_updatedat_idx', fields: ['updated_at'], unique: false },
        { name: 'jobopenings_createdat_idx', fields: ['created_at'], unique: false },
        { name: 'jobopenings_createdbyid_idx', fields: ['created_by'], unique: false },
        { name: 'jobopenings_closedat_idx', fields: ['closed_at'], unique: false },
        { name: 'jobopenings_publishedat_idx', fields: ['published_at'], unique: false },
        { name: 'jobopenings_status_idx', fields: ['status'], unique: false },
        { name: 'jobopenings_status_department_idx', fields: ['status', 'department_id'], unique: false },
        { name: 'jobopenings_designationid_idx', fields: ['designation_id'], unique: false },
        { name: 'jobopenings_title_idx', fields: ['title'], unique: false },
        { name: 'u_jobopenings_jobopeningid_pkey', fields: ['job_opening_id'], unique: true },
      ],
      tableName: 'job_openings',
      sequelize,
    },
  );
}

export function establishRelationsJobOpening() {
  JobOpening.belongsTo(Designation, {
    foreignKey: 'designationId',
    as: 'designation',
  });
  JobOpening.belongsTo(Department, {
    foreignKey: 'departmentId',
    as: 'department',
  });
}
