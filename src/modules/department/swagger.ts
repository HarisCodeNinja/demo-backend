import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaDepartmentSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Department API',
		version: '1.0.0',
		description: 'API documentation for managing departments in the default-area area.',
	},
	paths: {
		'/api/default-area/departments': {
			get: {
				summary: 'Get list of departments (DefaultArea)',
				description: 'Retrieve a paginated list of departments with default-area access',
				tags: ['DefaultArea - Departments'],
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
						description: 'Search term for filtering departments',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'departmentName',
						description: 'Filter by departmentName',
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
						description: 'List of departments retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DepartmentListResponse' }
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
				summary: 'Create a new department (DefaultArea)',
				description: 'Add a new department to the system',
				tags: ['DefaultArea - Departments'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateDepartmentInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Department created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DepartmentCreateResponse' }
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
		'/api/default-area/departments/select': {
			get: {
				summary: 'Get departments for selection dropdown (DefaultArea)',
				description: 'Retrieve a simplified list of departments for dropdown selection purposes',
				tags: ['DefaultArea - Departments'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering departments',
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
						description: 'Department selection list retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DepartmentSelectResponse' }
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
		'/api/default-area/departments/{departmentId}': {
			get: {
				summary: 'Get department for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific department for editing',
				tags: ['DefaultArea - Departments'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'departmentId',
						required: true,
						description: 'ID of the department to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Department details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DepartmentEditResponse' }
							}
						}
					},
					404: {
						description: 'Department not found',
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
				summary: 'Update a department (DefaultArea)',
				description: 'Modify an existing department in the system',
				tags: ['DefaultArea - Departments'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'departmentId',
						required: true,
						description: 'ID of the department to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateDepartmentInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Department updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DepartmentUpdateResponse' }
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
						description: 'Department not found',
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
				summary: 'Delete a department (DefaultArea)',
				description: 'Remove a department from the system',
				tags: ['DefaultArea - Departments'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'departmentId',
						required: true,
						description: 'ID of the department to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Department deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DepartmentDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Department not found',
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
		'/api/default-area/departments/detail/{departmentId}': {
			get: {
				summary: 'Get detailed department information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific department',
				tags: ['DefaultArea - Departments'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'departmentId',
						required: true,
						description: 'ID of the department to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Department details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DepartmentDetailResponse' }
							}
						}
					},
					404: {
						description: 'Department not found',
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
			DepartmentListItem: {
				type: 'object',
				properties: {
					departmentId: { type: 'string', format: 'uuid', description: 'departmentId' },
					departmentName: { type: 'string', description: 'departmentName' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['departmentId', ' departmentName', ' createdAt', ' updatedAt']
			},

			DepartmentListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/DepartmentListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of departments' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			DepartmentSelectItem: {
				type: 'object',
				properties: {
					value: { type: 'string', format: 'uuid', description: 'Unique department identifier'},
					label: { type: 'string', description: 'Department display label'}
				},
				required: ['value', ' label']
			},

			DepartmentSelectResponse: {
				type: 'array',
				items: { $ref: '#/components/schemas/DepartmentSelectItem' }
			},

			DepartmentDetailResponse: {
				type: 'object',
				properties: {
					departmentId: { type: 'string', format: 'uuid', description: 'departmentId' },
					departmentName: { type: 'string', description: 'departmentName' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			DepartmentEditResponse: {
				type: 'object',
				properties: {
					departmentName: { type: 'string', description: 'departmentName' }
				}
			},

			CreateDepartmentInput: {
				type: 'object',
				properties: {
					departmentName: { type: 'string', description: 'departmentName', example: 'Example departmentName' }
				},
				required: ['departmentName']
			},

			DepartmentCreateResponse: {
				type: 'object',
				properties: {
					departmentId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateDepartmentInput: {
				type: 'object',
				properties: {
					departmentName: { type: 'string', description: 'departmentName' }
				},
				required: ['departmentName']
			},

			DepartmentUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Department updated successfully' },
					data: {
						type: 'object',
						properties: {
							departmentName: { type: 'string', description: 'departmentName' }
						}
					}
				}
			},

			DepartmentDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Department deleted successfully' }
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

export default defaultAreaDepartmentSwagger;
