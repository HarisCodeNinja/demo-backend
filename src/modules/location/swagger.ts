import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaLocationSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Location API',
		version: '1.0.0',
		description: 'API documentation for managing locations in the default-area area.',
	},
	paths: {
		'/api/default-area/locations': {
			get: {
				summary: 'Get list of locations (DefaultArea)',
				description: 'Retrieve a paginated list of locations with default-area access',
				tags: ['DefaultArea - Locations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'page',
						description: 'Page number for pagination',
						schema: { type: 'integer', minimum: 1, default: 1 }
					},
					{
						in: 'query',
						name: 'pageSize',
						description: 'Number of items per page',
						schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
					},
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering locations',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'locationName',
						description: 'Filter by locationName',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'createdAt',
						description: 'Filter by createdAt',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'updatedAt',
						description: 'Filter by updatedAt',
						schema: { type: 'string' }
					},
				],
				responses: {
					200: {
						description: 'List of locations retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LocationListResponse' }
							}
						}
					},
					401: {
						description: 'Unauthorized - Invalid or missing token',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					403: {
						description: 'Forbidden - Insufficient permissions',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					500: {
						description: 'Internal server error',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					}				}
			},
			post: {
				summary: 'Create a new location (DefaultArea)',
				description: 'Add a new location to the system',
				tags: ['DefaultArea - Locations'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateLocationInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Location created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LocationCreateResponse' }
							}
						}
					},
					400: {
						description: 'Bad request - Invalid input data',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
							}
						}
					},
					401: {
						description: 'Unauthorized - Invalid or missing token',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					403: {
						description: 'Forbidden - Insufficient permissions',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					500: {
						description: 'Internal server error',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					}				}
			},
		},
		'/api/default-area/locations/select': {
			get: {
				summary: 'Get locations for selection dropdown (DefaultArea)',
				description: 'Retrieve a simplified list of locations for dropdown selection purposes',
				tags: ['DefaultArea - Locations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering locations',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'limit',
						description: 'Number of items to return',
						schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 }
					}
				],
				responses: {
					200: {
						description: 'Location selection list retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LocationSelectResponse' }
							}
						}
					},
					401: {
						description: 'Unauthorized - Invalid or missing token',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					403: {
						description: 'Forbidden - Insufficient permissions',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					500: {
						description: 'Internal server error',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					}				}
			},
		},
		'/api/default-area/locations/{locationId}': {
			get: {
				summary: 'Get location for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific location for editing',
				tags: ['DefaultArea - Locations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'locationId',
						required: true,
						description: 'ID of the location to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Location details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LocationEditResponse' }
							}
						}
					},
					404: {
						description: 'Location not found',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					401: {
						description: 'Unauthorized - Invalid or missing token',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					403: {
						description: 'Forbidden - Insufficient permissions',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					500: {
						description: 'Internal server error',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					}				}
			},
			put: {
				summary: 'Update a location (DefaultArea)',
				description: 'Modify an existing location in the system',
				tags: ['DefaultArea - Locations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'locationId',
						required: true,
						description: 'ID of the location to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateLocationInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Location updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LocationUpdateResponse' }
							}
						}
					},
					400: {
						description: 'Bad request - Invalid input data',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
							}
						}
					},
					404: {
						description: 'Location not found',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					401: {
						description: 'Unauthorized - Invalid or missing token',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					403: {
						description: 'Forbidden - Insufficient permissions',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					500: {
						description: 'Internal server error',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					}				}
			},
			delete: {
				summary: 'Delete a location (DefaultArea)',
				description: 'Remove a location from the system',
				tags: ['DefaultArea - Locations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'locationId',
						required: true,
						description: 'ID of the location to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Location deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LocationDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Location not found',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					401: {
						description: 'Unauthorized - Invalid or missing token',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					403: {
						description: 'Forbidden - Insufficient permissions',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					500: {
						description: 'Internal server error',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					}				}
			},
		},
		'/api/default-area/locations/detail/{locationId}': {
			get: {
				summary: 'Get detailed location information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific location',
				tags: ['DefaultArea - Locations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'locationId',
						required: true,
						description: 'ID of the location to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Location details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LocationDetailResponse' }
							}
						}
					},
					404: {
						description: 'Location not found',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					401: {
						description: 'Unauthorized - Invalid or missing token',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					403: {
						description: 'Forbidden - Insufficient permissions',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					},
					500: {
						description: 'Internal server error',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/ErrorResponse' }
							}
						}
					}				}
			},
		},
	},
	components: {
		schemas: {
			LocationListItem: {
				type: 'object',
				properties: {
					locationId: { type: 'string', format: 'uuid', description: 'locationId' },
					locationName: { type: 'string', description: 'locationName' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['locationId', ' locationName', ' createdAt', ' updatedAt']
			},

			LocationListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/LocationListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of locations' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			LocationSelectItem: {
				type: 'object',
				properties: {
					value: { type: 'string', format: 'uuid', description: 'Unique location identifier'},
					label: { type: 'string', description: 'Location display label'}
				},
				required: ['value', ' label']
			},

			LocationSelectResponse: {
				type: 'array',
				items: { $ref: '#/components/schemas/LocationSelectItem' }
			},

			LocationDetailResponse: {
				type: 'object',
				properties: {
					locationId: { type: 'string', format: 'uuid', description: 'locationId' },
					locationName: { type: 'string', description: 'locationName' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			LocationEditResponse: {
				type: 'object',
				properties: {
					locationName: { type: 'string', description: 'locationName' }
				}
			},

			CreateLocationInput: {
				type: 'object',
				properties: {
					locationName: { type: 'string', description: 'locationName', example: 'Example locationName' }
				},
				required: ['locationName']
			},

			LocationCreateResponse: {
				type: 'object',
				properties: {
					locationId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateLocationInput: {
				type: 'object',
				properties: {
					locationName: { type: 'string', description: 'locationName' }
				},
				required: ['locationName']
			},

			LocationUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Location updated successfully' },
					data: {
						type: 'object',
						properties: {
							locationName: { type: 'string', description: 'locationName' }
						}
					}
				}
			},

			LocationDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Location deleted successfully' }
				}
			},

			ErrorResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', description: 'Error message' },
					timestamp: { type: 'string', format: 'date-time', description: 'Error timestamp' }
				},
				required: ['message']
			},

		},
	},
};

export default defaultAreaLocationSwagger;
