import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Location } from './model';


import { CreateLocationInput, UpdateLocationInput, QueryLocationInput } from './types';

export const fetchLocationList = async (params: QueryLocationInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const { count, rows } = await Location.findAndCountAll({
		attributes: [
// locationId, locationName, createdAt, updatedAt
			[Sequelize.col('Location.location_id'), 'locationId'],
			[Sequelize.col('Location.location_name'), 'locationName'],
			[Sequelize.col('Location.created_at'), 'createdAt'],
			[Sequelize.col('Location.updated_at'), 'updatedAt'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const selectLocation = async () => {

	const results = await Location.findAll({
		attributes: [
			[Sequelize.col('Location.location_id'), 'value'],
			[Sequelize.col('Location.location_name'), 'label'],
		],
	});

	const plainRows = results.map((item) => item.get({ plain: true }));
	return plainRows;
};

export const addLocation = async (payload: CreateLocationInput): Promise<any> => {
	// Prepare payload data and add properties

	const location = await Location.create(payload);

	return location.get({ plain: true });
};

export const editLocation = async (params: any): Promise<Location | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [];

	const location = await Location.findOne({
		attributes: [
// locationName
			[Sequelize.col('Location.location_name'), 'locationName'],
		],
		where: {
			locationId: params.locationId,
			...where,
		},
	});

	if (!location) {
		return { errorCode: 'INVALID_LOCATION_ID', message: 'Invalid location ID' };
	}

	return location.get({ plain: true }) as Location;
};

export const updateLocation = async (params: any, payload: UpdateLocationInput): Promise<any> => {
	let where: any = {};

	const location = await Location.findOne({
		where: {
			locationId: params.locationId,
			...where,
		},
	});

	if (!location) {
		return { errorCode: 'INVALID_LOCATION_ID', message: 'Invalid location ID' };
	}

	await location.update(payload);

	return {
		message: 'Location updated successfully',
		data: location.get({ plain: true }),
	};
};

export const getLocation = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [];

	const location = await Location.findOne({
		attributes: [
// locationId, locationName, createdAt, updatedAt
			[Sequelize.col('Location.location_id'), 'locationId'],
			[Sequelize.col('Location.location_name'), 'locationName'],
			[Sequelize.col('Location.created_at'), 'createdAt'],
			[Sequelize.col('Location.updated_at'), 'updatedAt'],
		],
		where: {
			locationId: params.locationId,
			...where,
		},
		include: [...include],
	});

	if (!location) {
		return { errorCode: 'INVALID_LOCATION_ID', message: 'Invalid location ID' };
	}

	return {
		data: location.get({ plain: true }),
	};
};

export const deleteLocation = async (params: any): Promise<any> => {
	let where: any = {};

	const location = await Location.findOne({
		where: {
			locationId: params.locationId,
			...where,
		},
	});

	if (!location) {
		return { errorCode: 'INVALID_LOCATION_ID', message: 'Invalid location ID' };
	}

	await location.destroy();

	return { messageCode: 'LOCATION_DELETED_SUCCESSFULLY',  message: 'location Deleted Successfully' };
};

