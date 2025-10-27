import { z } from "zod";
import { Op } from "sequelize";
import { Location } from "./model";

export const locationQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const locationParamValidator = z.object({
	locationId: z.uuid("Invalid UUID format"),
});


export const createLocationPayloadValidator = z.object({
	locationName: z.string({error: "Location Name is required"}).refine(async (value) => {
				const existingLocation = await Location.findOne({ where: { locationName: value } });
				return !existingLocation;
			}, "LocationName already exists"),
});


export const updateLocationPayloadValidator = (locationId: string) => z.object({
	locationName: z.string({error: "Location Name is required"}).refine(async (value) => {
		const existingLocation = await Location.findOne({ 
			where: { 
				locationName: value,
				locationId:  { [Op.ne]: locationId }
			} 
		});
		return !existingLocation;
	}, "LocationName already exists"),
});


