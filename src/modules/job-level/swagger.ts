import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaJobLevelSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea JobLevel API',
		version: '1.0.0',
		description: 'API documentation for managing job-levels in the default-area area.',
	},
	paths: {
		'/api/default-area/job-levels': {
			get: {
				summary: 'Get list of job-levels (DefaultArea)',
				description: 'Retrieve a paginated list of job-levels with default-area access',
				tags: ['DefaultArea - JobLevels'],
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
						description: 'Search term for filtering job-levels',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'levelName',
						description: 'Filter by levelName',
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
						description: 'List of job-levels retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobLevelListResponse' }
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
				summary: 'Create a new job-level (DefaultArea)',
				description: 'Add a new job-level to the system',
				tags: ['DefaultArea - JobLevels'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateJobLevelInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'JobLevel created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobLevelCreateResponse' }
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
		'/api/default-area/job-levels/{jobLevelId}': {
			get: {
				summary: 'Get job-level for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific job-level for editing',
				tags: ['DefaultArea - JobLevels'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobLevelId',
						required: true,
						description: 'ID of the job-level to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'JobLevel details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobLevelEditResponse' }
							}
						}
					},
					404: {
						description: 'JobLevel not found',
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
				summary: 'Update a job-level (DefaultArea)',
				description: 'Modify an existing job-level in the system',
				tags: ['DefaultArea - JobLevels'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobLevelId',
						required: true,
						description: 'ID of the job-level to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateJobLevelInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'JobLevel updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobLevelUpdateResponse' }
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
						description: 'JobLevel not found',
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
				summary: 'Delete a job-level (DefaultArea)',
				description: 'Remove a job-level from the system',
				tags: ['DefaultArea - JobLevels'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobLevelId',
						required: true,
						description: 'ID of the job-level to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'JobLevel deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobLevelDeleteResponse' }
							}
						}
					},
					404: {
						description: 'JobLevel not found',
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
		'/api/default-area/job-levels/detail/{jobLevelId}': {
			get: {
				summary: 'Get detailed job-level information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific job-level',
				tags: ['DefaultArea - JobLevels'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobLevelId',
						required: true,
						description: 'ID of the job-level to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'JobLevel details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobLevelDetailResponse' }
							}
						}
					},
					404: {
						description: 'JobLevel not found',
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
			JobLevelListItem: {
				type: 'object',
				properties: {
					jobLevelId: { type: 'string', format: 'uuid', description: 'jobLevelId' },
					levelName: { type: 'string', description: 'levelName' },
					description: { type: 'string', description: 'description' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['jobLevelId', ' levelName', ' createdAt', ' updatedAt']
			},

			JobLevelListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/JobLevelListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of job-levels' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			JobLevelDetailResponse: {
				type: 'object',
				properties: {
					jobLevelId: { type: 'string', format: 'uuid', description: 'jobLevelId' },
					levelName: { type: 'string', description: 'levelName' },
					description: { type: 'string', nullable: true, description: 'description' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			JobLevelEditResponse: {
				type: 'object',
				properties: {
					levelName: { type: 'string', description: 'levelName' },
					description: { type: 'string', nullable: true, description: 'description' }
				}
			},

			CreateJobLevelInput: {
				type: 'object',
				properties: {
					levelName: { type: 'string', description: 'levelName', example: 'Example levelName' },
					description: { type: 'string', description: 'description' }
				},
				required: ['levelName']
			},

			JobLevelCreateResponse: {
				type: 'object',
				properties: {
					jobLevelId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateJobLevelInput: {
				type: 'object',
				properties: {
					levelName: { type: 'string', description: 'levelName' },
					description: { type: 'string', description: 'description' }
				},
				required: ['levelName']
			},

			JobLevelUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'JobLevel updated successfully' },
					data: {
						type: 'object',
						properties: {
							levelName: { type: 'string', description: 'levelName' },
							description: { type: 'string', nullable: true, description: 'description' }
						}
					}
				}
			},

			JobLevelDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'JobLevel deleted successfully' }
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

export default defaultAreaJobLevelSwagger;
