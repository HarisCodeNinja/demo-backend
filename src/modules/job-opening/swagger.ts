import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaJobOpeningSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea JobOpening API',
		version: '1.0.0',
		description: 'API documentation for managing job-openings in the default-area area.',
	},
	paths: {
		'/api/default-area/job-openings': {
			get: {
				summary: 'Get list of job-openings (DefaultArea)',
				description: 'Retrieve a paginated list of job-openings with default-area access',
				tags: ['DefaultArea - JobOpenings'],
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
						description: 'Search term for filtering job-openings',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'title',
						description: 'Filter by title',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'description',
						description: 'Filter by description',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'departmentId',
						description: 'Filter by departmentId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'designationId',
						description: 'Filter by designationId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'locationId',
						description: 'Filter by locationId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'requiredExperience',
						description: 'Filter by requiredExperience',
						schema: { type: 'integer' }
					},
					{
						in: 'query',
						name: 'status',
						description: 'Filter by status',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'publishedAt',
						description: 'Filter by publishedAt',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'closedAt',
						description: 'Filter by closedAt',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'createdBy',
						description: 'Filter by createdById',
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
						description: 'List of job-openings retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningListResponse' }
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
				summary: 'Create a new job-opening (DefaultArea)',
				description: 'Add a new job-opening to the system',
				tags: ['DefaultArea - JobOpenings'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateJobOpeningInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'JobOpening created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningCreateResponse' }
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
		'/api/default-area/job-openings/select': {
			get: {
				summary: 'Get job-openings for selection dropdown (DefaultArea)',
				description: 'Retrieve a simplified list of job-openings for dropdown selection purposes',
				tags: ['DefaultArea - JobOpenings'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering job-openings',
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
						description: 'JobOpening selection list retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningSelectResponse' }
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
		'/api/default-area/job-openings/{jobOpeningId}': {
			get: {
				summary: 'Get job-opening for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific job-opening for editing',
				tags: ['DefaultArea - JobOpenings'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobOpeningId',
						required: true,
						description: 'ID of the job-opening to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'JobOpening details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningEditResponse' }
							}
						}
					},
					404: {
						description: 'JobOpening not found',
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
				summary: 'Update a job-opening (DefaultArea)',
				description: 'Modify an existing job-opening in the system',
				tags: ['DefaultArea - JobOpenings'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobOpeningId',
						required: true,
						description: 'ID of the job-opening to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateJobOpeningInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'JobOpening updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningUpdateResponse' }
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
						description: 'JobOpening not found',
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
				summary: 'Delete a job-opening (DefaultArea)',
				description: 'Remove a job-opening from the system',
				tags: ['DefaultArea - JobOpenings'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobOpeningId',
						required: true,
						description: 'ID of the job-opening to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'JobOpening deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningDeleteResponse' }
							}
						}
					},
					404: {
						description: 'JobOpening not found',
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
		'/api/default-area/job-openings/detail/{jobOpeningId}': {
			get: {
				summary: 'Get detailed job-opening information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific job-opening',
				tags: ['DefaultArea - JobOpenings'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobOpeningId',
						required: true,
						description: 'ID of the job-opening to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'JobOpening details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningDetailResponse' }
							}
						}
					},
					404: {
						description: 'JobOpening not found',
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
			JobOpeningListItem: {
				type: 'object',
				properties: {
					jobOpeningId: { type: 'string', format: 'uuid', description: 'jobOpeningId' },
					title: { type: 'string', description: 'title' },
					description: { type: 'string', description: 'description' },
					departmentId: { type: 'string', description: 'departmentId' },
					designationId: { type: 'string', description: 'designationId' },
					locationId: { type: 'string', description: 'locationId' },
					requiredExperience: { type: 'integer', description: 'requiredExperience' },
					status: { type: 'string', description: 'status' },
					publishedAt: { type: 'string', format: 'date-time', description: 'publishedAt' },
					closedAt: { type: 'string', format: 'date-time', description: 'closedAt' },
					createdBy: { type: 'string', description: 'createdById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['jobOpeningId', ' title', ' description', ' departmentId', ' designationId', ' locationId', ' requiredExperience', ' status', ' createdBy', ' createdAt', ' updatedAt']
			},

			JobOpeningListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/JobOpeningListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of job-openings' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			JobOpeningSelectItem: {
				type: 'object',
				properties: {
					value: { type: 'string', format: 'uuid', description: 'Unique jobOpening identifier'},
					label: { type: 'string', description: 'JobOpening display label'}
				},
				required: ['value', ' label']
			},

			JobOpeningSelectResponse: {
				type: 'array',
				items: { $ref: '#/components/schemas/JobOpeningSelectItem' }
			},

			JobOpeningDetailResponse: {
				type: 'object',
				properties: {
					jobOpeningId: { type: 'string', format: 'uuid', description: 'jobOpeningId' },
					title: { type: 'string', description: 'title' },
					description: { type: 'string', description: 'description' },
					departmentId: { type: 'string', description: 'departmentId' },
					designationId: { type: 'string', description: 'designationId' },
					locationId: { type: 'string', description: 'locationId' },
					requiredExperience: { type: 'integer', description: 'requiredExperience' },
					status: { type: 'string', description: 'status' },
					publishedAt: { type: 'string', format: 'date-time', nullable: true, description: 'publishedAt' },
					closedAt: { type: 'string', format: 'date-time', nullable: true, description: 'closedAt' },
					createdBy: { type: 'string', description: 'createdById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			JobOpeningEditResponse: {
				type: 'object',
				properties: {
					title: { type: 'string', description: 'title' },
					description: { type: 'string', description: 'description' },
					departmentId: { type: 'string', description: 'departmentId' },
					designationId: { type: 'string', description: 'designationId' },
					locationId: { type: 'string', description: 'locationId' },
					requiredExperience: { type: 'integer', description: 'requiredExperience' },
					status: { type: 'string', description: 'status' },
					publishedAt: { type: 'string', format: 'date-time', nullable: true, description: 'publishedAt' },
					closedAt: { type: 'string', format: 'date-time', nullable: true, description: 'closedAt' }
				}
			},

			CreateJobOpeningInput: {
				type: 'object',
				properties: {
					title: { type: 'string', description: 'title', example: 'Example title' },
					description: { type: 'string', description: 'description' },
					departmentId: { type: 'string', description: 'departmentId' },
					designationId: { type: 'string', description: 'designationId' },
					locationId: { type: 'string', description: 'locationId' },
					requiredExperience: { type: 'integer', description: 'requiredExperience', example: 123 },
					status: { type: 'string', description: 'status', example: 'status Option' },
					publishedAt: { type: 'string', format: 'date-time', description: 'publishedAt', example: '2024-01-01T12:00:00Z' },
					closedAt: { type: 'string', format: 'date-time', description: 'closedAt', example: '2024-01-01T12:00:00Z' }
				},
				required: ['title', 'description', 'departmentId', 'designationId', 'locationId', 'requiredExperience', 'status']
			},

			JobOpeningCreateResponse: {
				type: 'object',
				properties: {
					jobOpeningId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateJobOpeningInput: {
				type: 'object',
				properties: {
					title: { type: 'string', description: 'title' },
					description: { type: 'string', description: 'description' },
					departmentId: { type: 'string', description: 'departmentId' },
					designationId: { type: 'string', description: 'designationId' },
					locationId: { type: 'string', description: 'locationId' },
					requiredExperience: { type: 'integer', description: 'requiredExperience' },
					status: { type: 'string', description: 'status' },
					publishedAt: { type: 'string', format: 'date-time', description: 'publishedAt' },
					closedAt: { type: 'string', format: 'date-time', description: 'closedAt' }
				},
				required: ['title', 'description', 'departmentId', 'designationId', 'locationId', 'requiredExperience', 'status']
			},

			JobOpeningUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'JobOpening updated successfully' },
					data: {
						type: 'object',
						properties: {
							title: { type: 'string', description: 'title' },
							description: { type: 'string', description: 'description' },
							departmentId: { type: 'string', description: 'departmentId' },
							designationId: { type: 'string', description: 'designationId' },
							locationId: { type: 'string', description: 'locationId' },
							requiredExperience: { type: 'integer', description: 'requiredExperience' },
							status: { type: 'string', description: 'status' },
							publishedAt: { type: 'string', format: 'date-time', nullable: true, description: 'publishedAt' },
							closedAt: { type: 'string', format: 'date-time', nullable: true, description: 'closedAt' }
						}
					}
				}
			},

			JobOpeningDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'JobOpening deleted successfully' }
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

export default defaultAreaJobOpeningSwagger;
