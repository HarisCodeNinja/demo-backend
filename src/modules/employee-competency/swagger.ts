import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaEmployeeCompetencySwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea EmployeeCompetency API',
		version: '1.0.0',
		description: 'API documentation for managing employee-competencies in the default-area area.',
	},
	paths: {
		'/api/default-area/employee-competencies': {
			get: {
				summary: 'Get list of employee-competencies (DefaultArea)',
				description: 'Retrieve a paginated list of employee-competencies with default-area access',
				tags: ['DefaultArea - EmployeeCompetencies'],
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
						description: 'Search term for filtering employee-competencies',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'employeeId',
						description: 'Filter by employeeId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'competencyId',
						description: 'Filter by competencyId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'currentProficiency',
						description: 'Filter by currentProficiency',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'lastEvaluated',
						description: 'Filter by lastEvaluated',
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
						description: 'List of employee-competencies retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeCompetencyListResponse' }
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
				summary: 'Create a new employee-competency (DefaultArea)',
				description: 'Add a new employee-competency to the system',
				tags: ['DefaultArea - EmployeeCompetencies'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateEmployeeCompetencyInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'EmployeeCompetency created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeCompetencyCreateResponse' }
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
		'/api/default-area/employee-competencies/{employeeCompetencyId}': {
			get: {
				summary: 'Get employee-competency for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific employee-competency for editing',
				tags: ['DefaultArea - EmployeeCompetencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'employeeCompetencyId',
						required: true,
						description: 'ID of the employee-competency to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'EmployeeCompetency details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeCompetencyEditResponse' }
							}
						}
					},
					404: {
						description: 'EmployeeCompetency not found',
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
				summary: 'Update a employee-competency (DefaultArea)',
				description: 'Modify an existing employee-competency in the system',
				tags: ['DefaultArea - EmployeeCompetencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'employeeCompetencyId',
						required: true,
						description: 'ID of the employee-competency to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateEmployeeCompetencyInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'EmployeeCompetency updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeCompetencyUpdateResponse' }
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
						description: 'EmployeeCompetency not found',
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
				summary: 'Delete a employee-competency (DefaultArea)',
				description: 'Remove a employee-competency from the system',
				tags: ['DefaultArea - EmployeeCompetencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'employeeCompetencyId',
						required: true,
						description: 'ID of the employee-competency to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'EmployeeCompetency deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeCompetencyDeleteResponse' }
							}
						}
					},
					404: {
						description: 'EmployeeCompetency not found',
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
		'/api/default-area/employee-competencies/detail/{employeeCompetencyId}': {
			get: {
				summary: 'Get detailed employee-competency information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific employee-competency',
				tags: ['DefaultArea - EmployeeCompetencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'employeeCompetencyId',
						required: true,
						description: 'ID of the employee-competency to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'EmployeeCompetency details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeCompetencyDetailResponse' }
							}
						}
					},
					404: {
						description: 'EmployeeCompetency not found',
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
			EmployeeCompetencyListItem: {
				type: 'object',
				properties: {
					employeeCompetencyId: { type: 'string', format: 'uuid', description: 'employeeCompetencyId' },
					employeeId: { type: 'string', description: 'employeeId' },
					competencyId: { type: 'string', description: 'competencyId' },
					currentProficiency: { type: 'string', description: 'currentProficiency' },
					lastEvaluated: { type: 'string', format: 'date', description: 'lastEvaluated' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['employeeCompetencyId', ' employeeId', ' competencyId', ' createdAt', ' updatedAt']
			},

			EmployeeCompetencyListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/EmployeeCompetencyListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of employee-competencies' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			EmployeeCompetencyDetailResponse: {
				type: 'object',
				properties: {
					employeeCompetencyId: { type: 'string', format: 'uuid', description: 'employeeCompetencyId' },
					employeeId: { type: 'string', description: 'employeeId' },
					competencyId: { type: 'string', description: 'competencyId' },
					currentProficiency: { type: 'string', nullable: true, description: 'currentProficiency' },
					lastEvaluated: { type: 'string', format: 'date', nullable: true, description: 'lastEvaluated' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			EmployeeCompetencyEditResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					competencyId: { type: 'string', description: 'competencyId' },
					currentProficiency: { type: 'string', nullable: true, description: 'currentProficiency' },
					lastEvaluated: { type: 'string', format: 'date', nullable: true, description: 'lastEvaluated' }
				}
			},

			CreateEmployeeCompetencyInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					competencyId: { type: 'string', description: 'competencyId' },
					currentProficiency: { type: 'string', description: 'currentProficiency', example: 'currentProficiency Option' },
					lastEvaluated: { type: 'string', format: 'date', description: 'lastEvaluated', example: '2024-01-01' }
				},
				required: ['employeeId', 'competencyId']
			},

			EmployeeCompetencyCreateResponse: {
				type: 'object',
				properties: {
					employeeCompetencyId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateEmployeeCompetencyInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					competencyId: { type: 'string', description: 'competencyId' },
					currentProficiency: { type: 'string', description: 'currentProficiency' },
					lastEvaluated: { type: 'string', format: 'date', description: 'lastEvaluated' }
				},
				required: ['employeeId', 'competencyId']
			},

			EmployeeCompetencyUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'EmployeeCompetency updated successfully' },
					data: {
						type: 'object',
						properties: {
							employeeId: { type: 'string', description: 'employeeId' },
							competencyId: { type: 'string', description: 'competencyId' },
							currentProficiency: { type: 'string', nullable: true, description: 'currentProficiency' },
							lastEvaluated: { type: 'string', format: 'date', nullable: true, description: 'lastEvaluated' }
						}
					}
				}
			},

			EmployeeCompetencyDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'EmployeeCompetency deleted successfully' }
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

export default defaultAreaEmployeeCompetencySwagger;
