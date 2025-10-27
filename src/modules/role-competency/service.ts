import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { RoleCompetency } from './model';
import { Competency } from '../competency/model';
import { Designation } from '../designation/model';


import { CreateRoleCompetencyInput, UpdateRoleCompetencyInput, QueryRoleCompetencyInput } from './types';

export const fetchRoleCompetencyList = async (params: QueryRoleCompetencyInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include = [
		{
			model: Designation,
			as: 'designation',
		},
		{
			model: Competency,
			as: 'competency',
		},
	];

	const { count, rows } = await RoleCompetency.findAndCountAll({
		attributes: [
// roleCompetencyId, designationId, competencyId, requiredProficiency, createdAt, updatedAt
			[Sequelize.col('RoleCompetency.role_competency_id'), 'roleCompetencyId'],
			[Sequelize.col('RoleCompetency.designation_id'), 'designationId'],
			[Sequelize.col('RoleCompetency.competency_id'), 'competencyId'],
			[Sequelize.col('RoleCompetency.required_proficiency'), 'requiredProficiency'],
			[Sequelize.col('RoleCompetency.created_at'), 'createdAt'],
			[Sequelize.col('RoleCompetency.updated_at'), 'updatedAt'],
			[Sequelize.col('designation.designation_name'), 'designationName'],
			[Sequelize.col('competency.competency_name'), 'competencyName'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
		include: [...include],
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addRoleCompetency = async (payload: CreateRoleCompetencyInput): Promise<any> => {
	// Prepare payload data and add properties

	const roleCompetency = await RoleCompetency.create(payload);

	return roleCompetency.get({ plain: true });
};

export const editRoleCompetency = async (params: any): Promise<RoleCompetency | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [
		{
			model: Designation,
			as: 'designation',
		},
		{
			model: Competency,
			as: 'competency',
		},
	];

	const roleCompetency = await RoleCompetency.findOne({
		attributes: [
// designationId, competencyId, requiredProficiency
			[Sequelize.col('RoleCompetency.designation_id'), 'designationId'],
			[Sequelize.col('RoleCompetency.competency_id'), 'competencyId'],
			[Sequelize.col('RoleCompetency.required_proficiency'), 'requiredProficiency'],
			[Sequelize.col('designation.designation_name'), 'designationName'],
			[Sequelize.col('competency.competency_name'), 'competencyName'],
		],
		where: {
			roleCompetencyId: params.roleCompetencyId,
			...where,
		},
		include: [...include],
	});

	if (!roleCompetency) {
		return { errorCode: 'INVALID_ROLE_COMPETENCY_ID', message: 'Invalid roleCompetency ID' };
	}

	return roleCompetency.get({ plain: true }) as RoleCompetency;
};

export const updateRoleCompetency = async (params: any, payload: UpdateRoleCompetencyInput): Promise<any> => {
	let where: any = {};

	const roleCompetency = await RoleCompetency.findOne({
		where: {
			roleCompetencyId: params.roleCompetencyId,
			...where,
		},
	});

	if (!roleCompetency) {
		return { errorCode: 'INVALID_ROLE_COMPETENCY_ID', message: 'Invalid roleCompetency ID' };
	}

	await roleCompetency.update(payload);

	return {
		message: 'RoleCompetency updated successfully',
		data: roleCompetency.get({ plain: true }),
	};
};

export const getRoleCompetency = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [
		{
			model: Designation,
			as: 'designation',
		},
		{
			model: Competency,
			as: 'competency',
		},
	];

	const roleCompetency = await RoleCompetency.findOne({
		attributes: [
// roleCompetencyId, designationId, competencyId, requiredProficiency, createdAt, updatedAt
			[Sequelize.col('RoleCompetency.role_competency_id'), 'roleCompetencyId'],
			[Sequelize.col('RoleCompetency.designation_id'), 'designationId'],
			[Sequelize.col('RoleCompetency.competency_id'), 'competencyId'],
			[Sequelize.col('RoleCompetency.required_proficiency'), 'requiredProficiency'],
			[Sequelize.col('RoleCompetency.created_at'), 'createdAt'],
			[Sequelize.col('RoleCompetency.updated_at'), 'updatedAt'],
			[Sequelize.col('designation.designation_name'), 'designationName'],
			[Sequelize.col('competency.competency_name'), 'competencyName'],
		],
		where: {
			roleCompetencyId: params.roleCompetencyId,
			...where,
		},
		include: [...include],
	});

	if (!roleCompetency) {
		return { errorCode: 'INVALID_ROLE_COMPETENCY_ID', message: 'Invalid roleCompetency ID' };
	}

	return {
		data: roleCompetency.get({ plain: true }),
	};
};

export const deleteRoleCompetency = async (params: any): Promise<any> => {
	let where: any = {};

	const roleCompetency = await RoleCompetency.findOne({
		where: {
			roleCompetencyId: params.roleCompetencyId,
			...where,
		},
	});

	if (!roleCompetency) {
		return { errorCode: 'INVALID_ROLE_COMPETENCY_ID', message: 'Invalid roleCompetency ID' };
	}

	await roleCompetency.destroy();

	return { messageCode: 'ROLE_COMPETENCY_DELETED_SUCCESSFULLY',  message: 'roleCompetency Deleted Successfully' };
};

