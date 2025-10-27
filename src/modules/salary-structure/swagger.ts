import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaSalaryStructureSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea SalaryStructure API',
		version: '1.0.0',
		description: 'API documentation for managing salary-structures in the default-area area.',
	},
	paths: {
		'/api/default-area/salary-structures': {
			get: {
				summary: 'Get list of salary-structures (DefaultArea)',
				description: 'Retrieve a paginated list of salary-structures with default-area access',
				tags: ['DefaultArea - SalaryStructures'],
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
						description: 'Search term for filtering salary-structures',
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
						name: 'basicSalary',
						description: 'Filter by basicSalary',
						schema: { type: 'number' }
					},
					{
						in: 'query',
						name: 'allowance',
						description: 'Filter by allowances',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'deduction',
						description: 'Filter by deductions',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'effectiveDate',
						description: 'Filter by effectiveDate',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'status',
						description: 'Filter by status',
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
						description: 'List of salary-structures retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SalaryStructureListResponse' }
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
				summary: 'Create a new salary-structure (DefaultArea)',
				description: 'Add a new salary-structure to the system',
				tags: ['DefaultArea - SalaryStructures'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateSalaryStructureInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'SalaryStructure created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SalaryStructureCreateResponse' }
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
		'/api/default-area/salary-structures/{salaryStructureId}': {
			get: {
				summary: 'Get salary-structure for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific salary-structure for editing',
				tags: ['DefaultArea - SalaryStructures'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'salaryStructureId',
						required: true,
						description: 'ID of the salary-structure to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'SalaryStructure details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SalaryStructureEditResponse' }
							}
						}
					},
					404: {
						description: 'SalaryStructure not found',
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
				summary: 'Update a salary-structure (DefaultArea)',
				description: 'Modify an existing salary-structure in the system',
				tags: ['DefaultArea - SalaryStructures'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'salaryStructureId',
						required: true,
						description: 'ID of the salary-structure to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateSalaryStructureInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'SalaryStructure updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SalaryStructureUpdateResponse' }
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
						description: 'SalaryStructure not found',
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
				summary: 'Delete a salary-structure (DefaultArea)',
				description: 'Remove a salary-structure from the system',
				tags: ['DefaultArea - SalaryStructures'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'salaryStructureId',
						required: true,
						description: 'ID of the salary-structure to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'SalaryStructure deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SalaryStructureDeleteResponse' }
							}
						}
					},
					404: {
						description: 'SalaryStructure not found',
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
		'/api/default-area/salary-structures/detail/{salaryStructureId}': {
			get: {
				summary: 'Get detailed salary-structure information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific salary-structure',
				tags: ['DefaultArea - SalaryStructures'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'salaryStructureId',
						required: true,
						description: 'ID of the salary-structure to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'SalaryStructure details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SalaryStructureDetailResponse' }
							}
						}
					},
					404: {
						description: 'SalaryStructure not found',
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
			SalaryStructureListItem: {
				type: 'object',
				properties: {
					salaryStructureId: { type: 'string', format: 'uuid', description: 'salaryStructureId' },
					employeeId: { type: 'string', description: 'employeeId' },
					basicSalary: { type: 'number', description: 'basicSalary' },
					allowance: { type: 'string', description: 'allowances' },
					deduction: { type: 'string', description: 'deductions' },
					effectiveDate: { type: 'string', format: 'date', description: 'effectiveDate' },
					status: { type: 'string', description: 'status' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['salaryStructureId', ' employeeId', ' basicSalary', ' effectiveDate', ' status', ' createdAt', ' updatedAt']
			},

			SalaryStructureListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/SalaryStructureListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of salary-structures' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			SalaryStructureDetailResponse: {
				type: 'object',
				properties: {
					salaryStructureId: { type: 'string', format: 'uuid', description: 'salaryStructureId' },
					employeeId: { type: 'string', description: 'employeeId' },
					basicSalary: { type: 'number', description: 'basicSalary' },
					allowance: { type: 'string', nullable: true, description: 'allowances' },
					deduction: { type: 'string', nullable: true, description: 'deductions' },
					effectiveDate: { type: 'string', format: 'date', description: 'effectiveDate' },
					status: { type: 'string', description: 'status' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			SalaryStructureEditResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					basicSalary: { type: 'number', description: 'basicSalary' },
					allowance: { type: 'string', nullable: true, description: 'allowances' },
					deduction: { type: 'string', nullable: true, description: 'deductions' },
					effectiveDate: { type: 'string', format: 'date', description: 'effectiveDate' },
					status: { type: 'string', description: 'status' }
				}
			},

			CreateSalaryStructureInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					basicSalary: { type: 'number', description: 'basicSalary', example: 99.99 },
					allowance: { type: 'string', description: 'allowances' },
					deduction: { type: 'string', description: 'deductions' },
					effectiveDate: { type: 'string', format: 'date', description: 'effectiveDate', example: '2024-01-01' },
					status: { type: 'string', description: 'status', example: 'status Option' }
				},
				required: ['employeeId', 'basicSalary', 'effectiveDate', 'status']
			},

			SalaryStructureCreateResponse: {
				type: 'object',
				properties: {
					salaryStructureId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateSalaryStructureInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					basicSalary: { type: 'number', description: 'basicSalary' },
					allowance: { type: 'string', description: 'allowances' },
					deduction: { type: 'string', description: 'deductions' },
					effectiveDate: { type: 'string', format: 'date', description: 'effectiveDate' },
					status: { type: 'string', description: 'status' }
				},
				required: ['employeeId', 'basicSalary', 'effectiveDate', 'status']
			},

			SalaryStructureUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'SalaryStructure updated successfully' },
					data: {
						type: 'object',
						properties: {
							employeeId: { type: 'string', description: 'employeeId' },
							basicSalary: { type: 'number', description: 'basicSalary' },
							allowance: { type: 'string', nullable: true, description: 'allowances' },
							deduction: { type: 'string', nullable: true, description: 'deductions' },
							effectiveDate: { type: 'string', format: 'date', description: 'effectiveDate' },
							status: { type: 'string', description: 'status' }
						}
					}
				}
			},

			SalaryStructureDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'SalaryStructure deleted successfully' }
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

export default defaultAreaSalaryStructureSwagger;
