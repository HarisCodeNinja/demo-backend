import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaEmployeeSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Employee API',
		version: '1.0.0',
		description: 'API documentation for managing employees in the default-area area.',
	},
	paths: {
		'/api/default-area/employees': {
			get: {
				summary: 'Get list of employees (DefaultArea)',
				description: 'Retrieve a paginated list of employees with default-area access',
				tags: ['DefaultArea - Employees'],
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
						description: 'Search term for filtering employees',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'userId',
						description: 'Filter by userId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'employeeUniqueId',
						description: 'Filter by employeeUniqueId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'firstName',
						description: 'Filter by firstName',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'lastName',
						description: 'Filter by lastName',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'dateOfBirth',
						description: 'Filter by dateOfBirth',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'gender',
						description: 'Filter by gender',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'phoneNumber',
						description: 'Filter by phoneNumber',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'address',
						description: 'Filter by address',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'personalEmail',
						description: 'Filter by personalEmail',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'employmentStartDate',
						description: 'Filter by employmentStartDate',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'employmentEndDate',
						description: 'Filter by employmentEndDate',
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
						name: 'reportingManagerId',
						description: 'Filter by reportingManagerId',
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
						description: 'List of employees retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeListResponse' }
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
				summary: 'Create a new employee (DefaultArea)',
				description: 'Add a new employee to the system',
				tags: ['DefaultArea - Employees'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateEmployeeInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Employee created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeCreateResponse' }
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
		'/api/default-area/employees/select': {
			get: {
				summary: 'Get employees for selection dropdown (DefaultArea)',
				description: 'Retrieve a simplified list of employees for dropdown selection purposes',
				tags: ['DefaultArea - Employees'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering employees',
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
						description: 'Employee selection list retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeSelectResponse' }
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
		'/api/default-area/employees/{employeeId}': {
			get: {
				summary: 'Get employee for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific employee for editing',
				tags: ['DefaultArea - Employees'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'employeeId',
						required: true,
						description: 'ID of the employee to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Employee details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeEditResponse' }
							}
						}
					},
					404: {
						description: 'Employee not found',
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
				summary: 'Update a employee (DefaultArea)',
				description: 'Modify an existing employee in the system',
				tags: ['DefaultArea - Employees'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'employeeId',
						required: true,
						description: 'ID of the employee to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateEmployeeInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Employee updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeUpdateResponse' }
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
						description: 'Employee not found',
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
				summary: 'Delete a employee (DefaultArea)',
				description: 'Remove a employee from the system',
				tags: ['DefaultArea - Employees'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'employeeId',
						required: true,
						description: 'ID of the employee to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Employee deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Employee not found',
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
		'/api/default-area/employees/detail/{employeeId}': {
			get: {
				summary: 'Get detailed employee information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific employee',
				tags: ['DefaultArea - Employees'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'employeeId',
						required: true,
						description: 'ID of the employee to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Employee details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/EmployeeDetailResponse' }
							}
						}
					},
					404: {
						description: 'Employee not found',
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
			EmployeeListItem: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', format: 'uuid', description: 'employeeId' },
					userId: { type: 'string', description: 'userId' },
					employeeUniqueId: { type: 'string', description: 'employeeUniqueId' },
					firstName: { type: 'string', description: 'firstName' },
					lastName: { type: 'string', description: 'lastName' },
					dateOfBirth: { type: 'string', format: 'date', description: 'dateOfBirth' },
					gender: { type: 'string', description: 'gender' },
					phoneNumber: { type: 'string', description: 'phoneNumber' },
					address: { type: 'string', description: 'address' },
					personalEmail: { type: 'string', format: 'email', description: 'personalEmail' },
					employmentStartDate: { type: 'string', format: 'date', description: 'employmentStartDate' },
					employmentEndDate: { type: 'string', format: 'date', description: 'employmentEndDate' },
					departmentId: { type: 'string', description: 'departmentId' },
					designationId: { type: 'string', description: 'designationId' },
					reportingManagerId: { type: 'string', description: 'reportingManagerId' },
					status: { type: 'string', description: 'status' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['employeeId', ' userId', ' employeeUniqueId', ' firstName', ' lastName', ' employmentStartDate', ' departmentId', ' designationId', ' status', ' createdAt', ' updatedAt']
			},

			EmployeeListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/EmployeeListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of employees' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			EmployeeSelectItem: {
				type: 'object',
				properties: {
					value: { type: 'string', format: 'uuid', description: 'Unique employee identifier'},
					label: { type: 'string', description: 'Employee display label'}
				},
				required: ['value', ' label']
			},

			EmployeeSelectResponse: {
				type: 'array',
				items: { $ref: '#/components/schemas/EmployeeSelectItem' }
			},

			EmployeeDetailResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', format: 'uuid', description: 'employeeId' },
					userId: { type: 'string', description: 'userId' },
					employeeUniqueId: { type: 'string', description: 'employeeUniqueId' },
					firstName: { type: 'string', description: 'firstName' },
					lastName: { type: 'string', description: 'lastName' },
					dateOfBirth: { type: 'string', format: 'date', nullable: true, description: 'dateOfBirth' },
					gender: { type: 'string', nullable: true, description: 'gender' },
					phoneNumber: { type: 'string', nullable: true, description: 'phoneNumber' },
					address: { type: 'string', nullable: true, description: 'address' },
					personalEmail: { type: 'string', format: 'email', nullable: true, description: 'personalEmail' },
					employmentStartDate: { type: 'string', format: 'date', description: 'employmentStartDate' },
					employmentEndDate: { type: 'string', format: 'date', nullable: true, description: 'employmentEndDate' },
					departmentId: { type: 'string', description: 'departmentId' },
					designationId: { type: 'string', description: 'designationId' },
					reportingManagerId: { type: 'string', nullable: true, description: 'reportingManagerId' },
					status: { type: 'string', description: 'status' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			EmployeeEditResponse: {
				type: 'object',
				properties: {
					userId: { type: 'string', description: 'userId' },
					firstName: { type: 'string', description: 'firstName' },
					lastName: { type: 'string', description: 'lastName' },
					dateOfBirth: { type: 'string', format: 'date', nullable: true, description: 'dateOfBirth' },
					gender: { type: 'string', nullable: true, description: 'gender' },
					phoneNumber: { type: 'string', nullable: true, description: 'phoneNumber' },
					address: { type: 'string', nullable: true, description: 'address' },
					personalEmail: { type: 'string', format: 'email', nullable: true, description: 'personalEmail' },
					employmentStartDate: { type: 'string', format: 'date', description: 'employmentStartDate' },
					employmentEndDate: { type: 'string', format: 'date', nullable: true, description: 'employmentEndDate' },
					departmentId: { type: 'string', description: 'departmentId' },
					designationId: { type: 'string', description: 'designationId' },
					reportingManagerId: { type: 'string', nullable: true, description: 'reportingManagerId' },
					status: { type: 'string', description: 'status' }
				}
			},

			CreateEmployeeInput: {
				type: 'object',
				properties: {
					userId: { type: 'string', description: 'userId' },
					firstName: { type: 'string', description: 'firstName', example: 'Example firstName' },
					lastName: { type: 'string', description: 'lastName', example: 'Example lastName' },
					dateOfBirth: { type: 'string', format: 'date', description: 'dateOfBirth', example: '2024-01-01' },
					gender: { type: 'string', description: 'gender', example: 'gender Option' },
					phoneNumber: { type: 'string', description: 'phoneNumber', example: 'Example phoneNumber' },
					address: { type: 'string', description: 'address' },
					personalEmail: { type: 'string', format: 'email', description: 'personalEmail', example: 'user@example.com' },
					employmentStartDate: { type: 'string', format: 'date', description: 'employmentStartDate', example: '2024-01-01' },
					employmentEndDate: { type: 'string', format: 'date', description: 'employmentEndDate', example: '2024-01-01' },
					departmentId: { type: 'string', description: 'departmentId' },
					designationId: { type: 'string', description: 'designationId' },
					reportingManagerId: { type: 'string', description: 'reportingManagerId' },
					status: { type: 'string', description: 'status', example: 'status Option' }
				},
				required: ['userId', 'firstName', 'lastName', 'employmentStartDate', 'departmentId', 'designationId', 'status']
			},

			EmployeeCreateResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateEmployeeInput: {
				type: 'object',
				properties: {
					userId: { type: 'string', description: 'userId' },
					firstName: { type: 'string', description: 'firstName' },
					lastName: { type: 'string', description: 'lastName' },
					dateOfBirth: { type: 'string', format: 'date', description: 'dateOfBirth' },
					gender: { type: 'string', description: 'gender' },
					phoneNumber: { type: 'string', description: 'phoneNumber' },
					address: { type: 'string', description: 'address' },
					personalEmail: { type: 'string', format: 'email', description: 'personalEmail' },
					employmentStartDate: { type: 'string', format: 'date', description: 'employmentStartDate' },
					employmentEndDate: { type: 'string', format: 'date', description: 'employmentEndDate' },
					departmentId: { type: 'string', description: 'departmentId' },
					designationId: { type: 'string', description: 'designationId' },
					reportingManagerId: { type: 'string', description: 'reportingManagerId' },
					status: { type: 'string', description: 'status' }
				},
				required: ['userId', 'firstName', 'lastName', 'employmentStartDate', 'departmentId', 'designationId', 'status']
			},

			EmployeeUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Employee updated successfully' },
					data: {
						type: 'object',
						properties: {
							userId: { type: 'string', description: 'userId' },
							firstName: { type: 'string', description: 'firstName' },
							lastName: { type: 'string', description: 'lastName' },
							dateOfBirth: { type: 'string', format: 'date', nullable: true, description: 'dateOfBirth' },
							gender: { type: 'string', nullable: true, description: 'gender' },
							phoneNumber: { type: 'string', nullable: true, description: 'phoneNumber' },
							address: { type: 'string', nullable: true, description: 'address' },
							personalEmail: { type: 'string', format: 'email', nullable: true, description: 'personalEmail' },
							employmentStartDate: { type: 'string', format: 'date', description: 'employmentStartDate' },
							employmentEndDate: { type: 'string', format: 'date', nullable: true, description: 'employmentEndDate' },
							departmentId: { type: 'string', description: 'departmentId' },
							designationId: { type: 'string', description: 'designationId' },
							reportingManagerId: { type: 'string', nullable: true, description: 'reportingManagerId' },
							status: { type: 'string', description: 'status' }
						}
					}
				}
			},

			EmployeeDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Employee deleted successfully' }
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

export default defaultAreaEmployeeSwagger;
