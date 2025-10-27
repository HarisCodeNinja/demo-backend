import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { OfferLetter } from './model';
import { Candidate } from '../candidate/model';
import { JobOpening } from '../job-opening/model';
import { convertStringFieldsToNumbers } from '../../util/dataTransform';

import { CreateOfferLetterInput, UpdateOfferLetterInput, QueryOfferLetterInput } from './types';

export const fetchOfferLetterList = async (params: QueryOfferLetterInput) => {
  const pageSize = Math.min(params.pageSize || 10, 1000);
  const curPage = params.page || 0;

  const include: any[] = [
    {
      model: Candidate,
      as: 'candidate',
    },
    {
      model: JobOpening,
      as: 'jobOpening',
    },
  ];

  const { count, rows } = await OfferLetter.findAndCountAll({
    attributes: [
      // offerLetterId, candidateId, jobOpeningId, salaryOffered, joiningDate, termsAndConditions, status, issuedById, approvedById, createdAt, updatedAt
      [Sequelize.col('OfferLetter.offer_letter_id'), 'offerLetterId'],
      [Sequelize.col('OfferLetter.candidate_id'), 'candidateId'],
      [Sequelize.col('OfferLetter.job_opening_id'), 'jobOpeningId'],
      [Sequelize.col('OfferLetter.salary_offered'), 'salaryOffered'],
      [Sequelize.col('OfferLetter.joining_date'), 'joiningDate'],
      [Sequelize.col('OfferLetter.terms_and_condition'), 'termsAndCondition'],
      [Sequelize.col('OfferLetter.status'), 'status'],
      [Sequelize.col('OfferLetter.issued_by'), 'issuedBy'],
      [Sequelize.col('OfferLetter.created_at'), 'createdAt'],
      [Sequelize.col('OfferLetter.updated_at'), 'updatedAt'],
      [Sequelize.col('candidate.first_name'), 'candidateFirstName'],
      [Sequelize.col('candidate.last_name'), 'candidateLastName'],
      [Sequelize.col('jobOpening.title'), 'jobTitle'],
    ],
    offset: Number(curPage) * Number(pageSize),
    limit: Number(pageSize),
    include: [...include],
  });

  const plainRows = rows.map((row) => row.get({ plain: true }));
  return { data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addOfferLetter = async (payload: CreateOfferLetterInput): Promise<any> => {
  // Prepare payload data and add properties

  const offerLetterDefaultPayload = {
    joiningDate: payload.joiningDate ?? new Date(),
    status: payload.status ?? 'Draft',
  };
  const offerLetter = await OfferLetter.create({ ...payload, ...offerLetterDefaultPayload });

  return offerLetter.get({ plain: true });
};

export const editOfferLetter = async (params: any): Promise<OfferLetter | { errorCode: string; message: string }> => {
  // Initialize filters and include relationships
  let where: any = {};
  const include: any[] = [
    {
      model: Candidate,
      as: 'candidate',
    },
    {
      model: JobOpening,
      as: 'jobOpening',
    },
  ];

  const offerLetter = await OfferLetter.findOne({
    attributes: [
      // candidateId, jobOpeningId, salaryOffered, joiningDate, termsAndConditions, status, approvedById
      [Sequelize.col('OfferLetter.candidate_id'), 'candidateId'],
      [Sequelize.col('OfferLetter.job_opening_id'), 'jobOpeningId'],
      [Sequelize.col('OfferLetter.salary_offered'), 'salaryOffered'],
      [Sequelize.col('OfferLetter.joining_date'), 'joiningDate'],
      [Sequelize.col('OfferLetter.terms_and_condition'), 'termsAndCondition'],
      [Sequelize.col('OfferLetter.status'), 'status'],
      [Sequelize.col('candidate.first_name'), 'candidateFirstName'],
      [Sequelize.col('candidate.last_name'), 'candidateLastName'],
      [Sequelize.col('jobOpening.title'), 'jobTitle'],
    ],
    where: {
      offerLetterId: params.offerLetterId,
      ...where,
    },
    include: [...include],
  });

  if (!offerLetter) {
    return { errorCode: 'INVALID_OFFER_LETTER_ID', message: 'Invalid offerLetter ID' };
  }

  const offerLetterData = offerLetter.get({ plain: true });
  return convertStringFieldsToNumbers(offerLetterData, ['salaryOffered']) as OfferLetter;
};

export const updateOfferLetter = async (params: any, payload: UpdateOfferLetterInput): Promise<any> => {
  let where: any = {};

  const offerLetter = await OfferLetter.findOne({
    where: {
      offerLetterId: params.offerLetterId,
      ...where,
    },
  });

  if (!offerLetter) {
    return { errorCode: 'INVALID_OFFER_LETTER_ID', message: 'Invalid offerLetter ID' };
  }

  await offerLetter.update(payload);

  return {
    message: 'OfferLetter updated successfully',
    data: offerLetter.get({ plain: true }),
  };
};

export const getOfferLetter = async (params: any): Promise<any> => {
  let where: any = {};
  const include: any[] = [
    {
      model: Candidate,
      as: 'candidate',
    },
    {
      model: JobOpening,
      as: 'jobOpening',
    },
  ];

  const offerLetter = await OfferLetter.findOne({
    attributes: [
      // offerLetterId, candidateId, jobOpeningId, salaryOffered, joiningDate, termsAndConditions, status, issuedById, approvedById, createdAt, updatedAt
      [Sequelize.col('OfferLetter.offer_letter_id'), 'offerLetterId'],
      [Sequelize.col('OfferLetter.candidate_id'), 'candidateId'],
      [Sequelize.col('OfferLetter.job_opening_id'), 'jobOpeningId'],
      [Sequelize.col('OfferLetter.salary_offered'), 'salaryOffered'],
      [Sequelize.col('OfferLetter.joining_date'), 'joiningDate'],
      [Sequelize.col('OfferLetter.terms_and_condition'), 'termsAndCondition'],
      [Sequelize.col('OfferLetter.status'), 'status'],
      [Sequelize.col('OfferLetter.issued_by'), 'issuedBy'],
      [Sequelize.col('OfferLetter.created_at'), 'createdAt'],
      [Sequelize.col('OfferLetter.updated_at'), 'updatedAt'],
      [Sequelize.col('candidate.first_name'), 'candidateFirstName'],
      [Sequelize.col('candidate.last_name'), 'candidateLastName'],
      [Sequelize.col('jobOpening.title'), 'jobTitle'],
    ],
    where: {
      offerLetterId: params.offerLetterId,
      ...where,
    },
    include: [...include],
  });

  if (!offerLetter) {
    return { errorCode: 'INVALID_OFFER_LETTER_ID', message: 'Invalid offerLetter ID' };
  }

  return {
    data: offerLetter.get({ plain: true }),
  };
};

export const deleteOfferLetter = async (params: any): Promise<any> => {
  let where: any = {};

  const offerLetter = await OfferLetter.findOne({
    where: {
      offerLetterId: params.offerLetterId,
      ...where,
    },
  });

  if (!offerLetter) {
    return { errorCode: 'INVALID_OFFER_LETTER_ID', message: 'Invalid offerLetter ID' };
  }

  await offerLetter.destroy();

  return { messageCode: 'OFFER_LETTER_DELETED_SUCCESSFULLY', message: 'offerLetter Deleted Successfully' };
};
