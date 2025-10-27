import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaPayslipSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Payslip API',
		version: '1.0.0',
		description: 'API documentation for managing payslips in the default-area area.',
	},
	paths: {
		'/api/default-area/payslips': {
			get: {
				summary: 'Get list of payslips (DefaultArea)',
				description: 'Retrieve a paginated list of payslips with default-area access',
				tags: ['DefaultArea - Payslips'],
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
						description: 'Search term for filtering payslips',
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
						name: 'payPeriodStart',
						description: 'Filter by payPeriodStart',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'payPeriodEnd',
						description: 'Filter by payPeriodEnd',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'grossSalary',
						description: 'Filter by grossSalary',
						schema: { type: 'number' }
					},
					{
						in: 'query',
						name: 'netSalary',
						description: 'Filter by netSalary',
						schema: { type: 'number' }
					},
					{
						in: 'query',
						name: 'deductionsAmount',
						description: 'Filter by deductionsAmount',
						schema: { type: 'number' }
					},
					{
						in: 'query',
						name: 'allowancesAmount',
						description: 'Filter by allowancesAmount',
						schema: { type: 'number' }
					},
					{
						in: 'query',
						name: 'pdfUrl',
						description: 'Filter by pdfUrl',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'generatedBy',
						description: 'Filter by generatedById',
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
						description: 'List of payslips retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PayslipListResponse' }
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
				summary: 'Create a new payslip (DefaultArea)',
				description: 'Add a new payslip to the system',
				tags: ['DefaultArea - Payslips'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreatePayslipInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Payslip created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PayslipCreateResponse' }
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
		'/api/default-area/payslips/{payslipId}': {
			get: {
				summary: 'Get payslip for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific payslip for editing',
				tags: ['DefaultArea - Payslips'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'payslipId',
						required: true,
						description: 'ID of the payslip to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Payslip details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PayslipEditResponse' }
							}
						}
					},
					404: {
						description: 'Payslip not found',
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
				summary: 'Update a payslip (DefaultArea)',
				description: 'Modify an existing payslip in the system',
				tags: ['DefaultArea - Payslips'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'payslipId',
						required: true,
						description: 'ID of the payslip to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdatePayslipInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Payslip updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PayslipUpdateResponse' }
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
						description: 'Payslip not found',
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
				summary: 'Delete a payslip (DefaultArea)',
				description: 'Remove a payslip from the system',
				tags: ['DefaultArea - Payslips'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'payslipId',
						required: true,
						description: 'ID of the payslip to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Payslip deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PayslipDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Payslip not found',
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
		'/api/default-area/payslips/detail/{payslipId}': {
			get: {
				summary: 'Get detailed payslip information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific payslip',
				tags: ['DefaultArea - Payslips'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'payslipId',
						required: true,
						description: 'ID of the payslip to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Payslip details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PayslipDetailResponse' }
							}
						}
					},
					404: {
						description: 'Payslip not found',
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
			PayslipListItem: {
				type: 'object',
				properties: {
					payslipId: { type: 'string', format: 'uuid', description: 'payslipId' },
					employeeId: { type: 'string', description: 'employeeId' },
					payPeriodStart: { type: 'string', format: 'date', description: 'payPeriodStart' },
					payPeriodEnd: { type: 'string', format: 'date', description: 'payPeriodEnd' },
					grossSalary: { type: 'number', description: 'grossSalary' },
					netSalary: { type: 'number', description: 'netSalary' },
					deductionsAmount: { type: 'number', description: 'deductionsAmount' },
					allowancesAmount: { type: 'number', description: 'allowancesAmount' },
					pdfUrl: { type: 'string', format: 'uri', description: 'pdfUrl' },
					generatedBy: { type: 'string', description: 'generatedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['payslipId', ' employeeId', ' payPeriodStart', ' payPeriodEnd', ' grossSalary', ' netSalary', ' deductionsAmount', ' allowancesAmount', ' pdfUrl', ' generatedBy', ' createdAt', ' updatedAt']
			},

			PayslipListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/PayslipListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of payslips' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			PayslipDetailResponse: {
				type: 'object',
				properties: {
					payslipId: { type: 'string', format: 'uuid', description: 'payslipId' },
					employeeId: { type: 'string', description: 'employeeId' },
					payPeriodStart: { type: 'string', format: 'date', description: 'payPeriodStart' },
					payPeriodEnd: { type: 'string', format: 'date', description: 'payPeriodEnd' },
					grossSalary: { type: 'number', description: 'grossSalary' },
					netSalary: { type: 'number', description: 'netSalary' },
					deductionsAmount: { type: 'number', description: 'deductionsAmount' },
					allowancesAmount: { type: 'number', description: 'allowancesAmount' },
					pdfUrl: { type: 'string', format: 'uri', description: 'pdfUrl' },
					generatedBy: { type: 'string', description: 'generatedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			PayslipEditResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					payPeriodStart: { type: 'string', format: 'date', description: 'payPeriodStart' },
					payPeriodEnd: { type: 'string', format: 'date', description: 'payPeriodEnd' },
					grossSalary: { type: 'number', description: 'grossSalary' },
					netSalary: { type: 'number', description: 'netSalary' },
					deductionsAmount: { type: 'number', description: 'deductionsAmount' },
					allowancesAmount: { type: 'number', description: 'allowancesAmount' },
					pdfUrl: { type: 'string', format: 'uri', description: 'pdfUrl' }
				}
			},

			CreatePayslipInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					payPeriodStart: { type: 'string', format: 'date', description: 'payPeriodStart', example: '2024-01-01' },
					payPeriodEnd: { type: 'string', format: 'date', description: 'payPeriodEnd', example: '2024-01-01' },
					grossSalary: { type: 'number', description: 'grossSalary', example: 99.99 },
					netSalary: { type: 'number', description: 'netSalary', example: 99.99 },
					deductionsAmount: { type: 'number', description: 'deductionsAmount', example: 99.99 },
					allowancesAmount: { type: 'number', description: 'allowancesAmount', example: 99.99 },
					pdfUrl: { type: 'string', format: 'uri', description: 'pdfUrl', example: 'https://example.com' }
				},
				required: ['employeeId', 'payPeriodStart', 'payPeriodEnd', 'grossSalary', 'netSalary', 'deductionsAmount', 'allowancesAmount', 'pdfUrl']
			},

			PayslipCreateResponse: {
				type: 'object',
				properties: {
					payslipId: { type: 'string', format: 'uuid' }
				}
			},

			UpdatePayslipInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					payPeriodStart: { type: 'string', format: 'date', description: 'payPeriodStart' },
					payPeriodEnd: { type: 'string', format: 'date', description: 'payPeriodEnd' },
					grossSalary: { type: 'number', description: 'grossSalary' },
					netSalary: { type: 'number', description: 'netSalary' },
					deductionsAmount: { type: 'number', description: 'deductionsAmount' },
					allowancesAmount: { type: 'number', description: 'allowancesAmount' },
					pdfUrl: { type: 'string', format: 'uri', description: 'pdfUrl' }
				},
				required: ['employeeId', 'payPeriodStart', 'payPeriodEnd', 'grossSalary', 'netSalary', 'deductionsAmount', 'allowancesAmount', 'pdfUrl']
			},

			PayslipUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Payslip updated successfully' },
					data: {
						type: 'object',
						properties: {
							employeeId: { type: 'string', description: 'employeeId' },
							payPeriodStart: { type: 'string', format: 'date', description: 'payPeriodStart' },
							payPeriodEnd: { type: 'string', format: 'date', description: 'payPeriodEnd' },
							grossSalary: { type: 'number', description: 'grossSalary' },
							netSalary: { type: 'number', description: 'netSalary' },
							deductionsAmount: { type: 'number', description: 'deductionsAmount' },
							allowancesAmount: { type: 'number', description: 'allowancesAmount' },
							pdfUrl: { type: 'string', format: 'uri', description: 'pdfUrl' }
						}
					}
				}
			},

			PayslipDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Payslip deleted successfully' }
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

export default defaultAreaPayslipSwagger;
