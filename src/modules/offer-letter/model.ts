// from sequelize model creator
import { Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { Candidate } from '../candidate/model';
import { JobOpening } from '../job-opening/model';

export class OfferLetter extends Model<InferAttributes<OfferLetter>, InferCreationAttributes<OfferLetter>> {
  declare offerLetterId: CreationOptional<string>;
  declare candidateId: ForeignKey<Candidate['candidateId']>;
  declare jobOpeningId: ForeignKey<JobOpening['jobOpeningId']>;
  declare salaryOffered: number;
  declare joiningDate: Date;
  declare termsAndCondition: CreationOptional<string>;
  declare status: string;
  declare issuedBy: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initializeOfferLetter(sequelize: Sequelize) {
  OfferLetter.init(
    {
      offerLetterId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      candidateId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      jobOpeningId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      salaryOffered: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      joiningDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      termsAndCondition: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Draft',
      },
      issuedBy: {
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
        { name: 'offerletters_updatedat_idx', fields: ['updated_at'], unique: false },
        { name: 'offerletters_createdat_idx', fields: ['created_at'], unique: false },
        { name: 'offerletters_issuedbyid_idx', fields: ['issued_by'], unique: false },
        { name: 'offerletters_status_idx', fields: ['status'], unique: false },
        { name: 'offerletters_joiningdate_idx', fields: ['joining_date'], unique: false },
        { name: 'offerletters_jobopeningid_idx', fields: ['job_opening_id'], unique: false },
        { name: 'offerletters_candidateid_idx', fields: ['candidate_id'], unique: false },
        { name: 'u_offerletters_offerletterid_pkey', fields: ['offer_letter_id'], unique: true },
      ],
      tableName: 'offer_letters',
      sequelize,
    },
  );
}

export function establishRelationsOfferLetter() {
  OfferLetter.belongsTo(Candidate, {
    foreignKey: 'candidateId',
    as: 'candidate',
  });
  OfferLetter.belongsTo(JobOpening, {
    foreignKey: 'jobOpeningId',
    as: 'jobOpening',
  });
}
