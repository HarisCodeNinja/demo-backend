import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaCompetencySwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Competency API',
		version: '1.0.0',
		description: 'API documentation for managing competencies in the default-area area.',
	},
	paths: {
		'/api/default-area/competencies': {
			get: {
				summary: 'Get list of competencies (DefaultArea)',
				description: 'Retrieve a paginated list of competencies with default-area access',
				tags: ['DefaultArea - Competencies'],
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
						description: 'Search term for filtering competencies',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'competencyName',
						description: 'Filter by competencyName',
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
						description: 'List of competencies retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CompetencyListResponse' }
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
				summary: 'Create a new competency (DefaultArea)',
				description: 'Add a new competency to the system',
				tags: ['DefaultArea - Competencies'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateCompetencyInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Competency created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CompetencyCreateResponse' }
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
		'/api/default-area/competencies/select': {
			get: {
				summary: 'Get competencies for selection dropdown (DefaultArea)',
				description: 'Retrieve a simplified list of competencies for dropdown selection purposes',
				tags: ['DefaultArea - Competencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering competencies',
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
						description: 'Competency selection list retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CompetencySelectResponse' }
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
		'/api/default-area/competencies/{competencyId}': {
			get: {
				summary: 'Get competency for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific competency for editing',
				tags: ['DefaultArea - Competencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'competencyId',
						required: true,
						description: 'ID of the competency to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Competency details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CompetencyEditResponse' }
							}
						}
					},
					404: {
						description: 'Competency not found',
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
				summary: 'Update a competency (DefaultArea)',
				description: 'Modify an existing competency in the system',
				tags: ['DefaultArea - Competencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'competencyId',
						required: true,
						description: 'ID of the competency to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateCompetencyInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Competency updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CompetencyUpdateResponse' }
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
						description: 'Competency not found',
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
				summary: 'Delete a competency (DefaultArea)',
				description: 'Remove a competency from the system',
				tags: ['DefaultArea - Competencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'competencyId',
						required: true,
						description: 'ID of the competency to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Competency deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CompetencyDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Competency not found',
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
		'/api/default-area/competencies/detail/{competencyId}': {
			get: {
				summary: 'Get detailed competency information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific competency',
				tags: ['DefaultArea - Competencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'competencyId',
						required: true,
						description: 'ID of the competency to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Competency details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CompetencyDetailResponse' }
							}
						}
					},
					404: {
						description: 'Competency not found',
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
			CompetencyListItem: {
				type: 'object',
				properties: {
					competencyId: { type: 'string', format: 'uuid', description: 'competencyId' },
					competencyName: { type: 'string', description: 'competencyName' },
					description: { type: 'string', description: 'description' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['competencyId', ' competencyName', ' createdAt', ' updatedAt']
			},

			CompetencyListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/CompetencyListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of competencies' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			CompetencySelectItem: {
				type: 'object',
				properties: {
					value: { type: 'string', format: 'uuid', description: 'Unique competency identifier'},
					label: { type: 'string', description: 'Competency display label'}
				},
				required: ['value', ' label']
			},

			CompetencySelectResponse: {
				type: 'array',
				items: { $ref: '#/components/schemas/CompetencySelectItem' }
			},

			CompetencyDetailResponse: {
				type: 'object',
				properties: {
					competencyId: { type: 'string', format: 'uuid', description: 'competencyId' },
					competencyName: { type: 'string', description: 'competencyName' },
					description: { type: 'string', nullable: true, description: 'description' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			CompetencyEditResponse: {
				type: 'object',
				properties: {
					competencyName: { type: 'string', description: 'competencyName' },
					description: { type: 'string', nullable: true, description: 'description' }
				}
			},

			CreateCompetencyInput: {
				type: 'object',
				properties: {
					competencyName: { type: 'string', description: 'competencyName', example: 'Example competencyName' },
					description: { type: 'string', description: 'description' }
				},
				required: ['competencyName']
			},

			CompetencyCreateResponse: {
				type: 'object',
				properties: {
					competencyId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateCompetencyInput: {
				type: 'object',
				properties: {
					competencyName: { type: 'string', description: 'competencyName' },
					description: { type: 'string', description: 'description' }
				},
				required: ['competencyName']
			},

			CompetencyUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Competency updated successfully' },
					data: {
						type: 'object',
						properties: {
							competencyName: { type: 'string', description: 'competencyName' },
							description: { type: 'string', nullable: true, description: 'description' }
						}
					}
				}
			},

			CompetencyDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Competency deleted successfully' }
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

export default defaultAreaCompetencySwagger;
