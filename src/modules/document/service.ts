import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Document } from './model';
import { Employee } from '../employee/model';


import { CreateDocumentInput, UpdateDocumentInput, QueryDocumentInput } from './types';

export const fetchDocumentList = async (params: QueryDocumentInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const { count, rows } = await Document.findAndCountAll({
		attributes: [
// documentId, employeeId, documentType, fileName, fileUrl, uploadedById, createdAt, updatedAt
			[Sequelize.col('Document.document_id'), 'documentId'],
			[Sequelize.col('Document.employee_id'), 'employeeId'],
			[Sequelize.col('Document.document_type'), 'documentType'],
			[Sequelize.col('Document.file_name'), 'fileName'],
			[Sequelize.col('Document.file_url'), 'fileUrl'],
			[Sequelize.col('Document.uploaded_by'), 'uploadedBy'],
			[Sequelize.col('Document.created_at'), 'createdAt'],
			[Sequelize.col('Document.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
		include: [...include],
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addDocument = async (payload: CreateDocumentInput): Promise<any> => {
	// Prepare payload data and add properties

	const document = await Document.create(payload);

	return document.get({ plain: true });
};

export const editDocument = async (params: any): Promise<Document | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const document = await Document.findOne({
		attributes: [
// employeeId, documentType, fileName, fileUrl
			[Sequelize.col('Document.employee_id'), 'employeeId'],
			[Sequelize.col('Document.document_type'), 'documentType'],
			[Sequelize.col('Document.file_name'), 'fileName'],
			[Sequelize.col('Document.file_url'), 'fileUrl'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			documentId: params.documentId,
			...where,
		},
		include: [...include],
	});

	if (!document) {
		return { errorCode: 'INVALID_DOCUMENT_ID', message: 'Invalid document ID' };
	}

	return document.get({ plain: true }) as Document;
};

export const updateDocument = async (params: any, payload: UpdateDocumentInput): Promise<any> => {
	let where: any = {};

	const document = await Document.findOne({
		where: {
			documentId: params.documentId,
			...where,
		},
	});

	if (!document) {
		return { errorCode: 'INVALID_DOCUMENT_ID', message: 'Invalid document ID' };
	}

	await document.update(payload);

	return {
		message: 'Document updated successfully',
		data: document.get({ plain: true }),
	};
};

export const getDocument = async (params: any): Promise<any> => {
	let where: any = {};
	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const document = await Document.findOne({
		attributes: [
// documentId, employeeId, documentType, fileName, fileUrl, uploadedById, createdAt, updatedAt
			[Sequelize.col('Document.document_id'), 'documentId'],
			[Sequelize.col('Document.employee_id'), 'employeeId'],
			[Sequelize.col('Document.document_type'), 'documentType'],
			[Sequelize.col('Document.file_name'), 'fileName'],
			[Sequelize.col('Document.file_url'), 'fileUrl'],
			[Sequelize.col('Document.uploaded_by'), 'uploadedBy'],
			[Sequelize.col('Document.created_at'), 'createdAt'],
			[Sequelize.col('Document.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			documentId: params.documentId,
			...where,
		},
		include: [...include],
	});

	if (!document) {
		return { errorCode: 'INVALID_DOCUMENT_ID', message: 'Invalid document ID' };
	}

	return {
		data: document.get({ plain: true }),
	};
};

export const deleteDocument = async (params: any): Promise<any> => {
	let where: any = {};

	const document = await Document.findOne({
		where: {
			documentId: params.documentId,
			...where,
		},
	});

	if (!document) {
		return { errorCode: 'INVALID_DOCUMENT_ID', message: 'Invalid document ID' };
	}

	await document.destroy();

	return { messageCode: 'DOCUMENT_DELETED_SUCCESSFULLY',  message: 'document Deleted Successfully' };
};

