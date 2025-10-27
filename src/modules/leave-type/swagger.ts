import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaLeaveTypeSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea LeaveType API',
		version: '1.0.0',
		description: 'API documentation for managing leave-types in the default-area area.',
	},
	paths: {
		'/api/default-area/leave-types': {
			get: {
				summary: 'Get list of leave-types (DefaultArea)',
				description: 'Retrieve a paginated list of leave-types with default-area access',
				tags: ['DefaultArea - LeaveTypes'],
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
						description: 'Search term for filtering leave-types',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'typeName',
						description: 'Filter by typeName',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'maxDaysPerYear',
						description: 'Filter by maxDaysPerYear',
						schema: { type: 'integer' }
					},
					{
						in: 'query',
						name: 'isPaid',
						description: 'Filter by isPaid',
						schema: { type: 'boolean' }
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
						description: 'List of leave-types retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveTypeListResponse' }
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
				summary: 'Create a new leave-type (DefaultArea)',
				description: 'Add a new leave-type to the system',
				tags: ['DefaultArea - LeaveTypes'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateLeaveTypeInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'LeaveType created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveTypeCreateResponse' }
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
		'/api/default-area/leave-types/select': {
			get: {
				summary: 'Get leave-types for selection dropdown (DefaultArea)',
				description: 'Retrieve a simplified list of leave-types for dropdown selection purposes',
				tags: ['DefaultArea - LeaveTypes'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering leave-types',
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
						description: 'LeaveType selection list retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveTypeSelectResponse' }
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
		'/api/default-area/leave-types/{leaveTypeId}': {
			get: {
				summary: 'Get leave-type for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific leave-type for editing',
				tags: ['DefaultArea - LeaveTypes'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'leaveTypeId',
						required: true,
						description: 'ID of the leave-type to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'LeaveType details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveTypeEditResponse' }
							}
						}
					},
					404: {
						description: 'LeaveType not found',
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
				summary: 'Update a leave-type (DefaultArea)',
				description: 'Modify an existing leave-type in the system',
				tags: ['DefaultArea - LeaveTypes'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'leaveTypeId',
						required: true,
						description: 'ID of the leave-type to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateLeaveTypeInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'LeaveType updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveTypeUpdateResponse' }
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
						description: 'LeaveType not found',
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
				summary: 'Delete a leave-type (DefaultArea)',
				description: 'Remove a leave-type from the system',
				tags: ['DefaultArea - LeaveTypes'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'leaveTypeId',
						required: true,
						description: 'ID of the leave-type to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'LeaveType deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveTypeDeleteResponse' }
							}
						}
					},
					404: {
						description: 'LeaveType not found',
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
		'/api/default-area/leave-types/detail/{leaveTypeId}': {
			get: {
				summary: 'Get detailed leave-type information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific leave-type',
				tags: ['DefaultArea - LeaveTypes'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'leaveTypeId',
						required: true,
						description: 'ID of the leave-type to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'LeaveType details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveTypeDetailResponse' }
							}
						}
					},
					404: {
						description: 'LeaveType not found',
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
			LeaveTypeListItem: {
				type: 'object',
				properties: {
					leaveTypeId: { type: 'string', format: 'uuid', description: 'leaveTypeId' },
					typeName: { type: 'string', description: 'typeName' },
					maxDaysPerYear: { type: 'integer', description: 'maxDaysPerYear' },
					isPaid: { type: 'boolean', description: 'isPaid' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['leaveTypeId', ' typeName', ' maxDaysPerYear', ' isPaid', ' createdAt', ' updatedAt']
			},

			LeaveTypeListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/LeaveTypeListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of leave-types' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			LeaveTypeSelectItem: {
				type: 'object',
				properties: {
					value: { type: 'string', format: 'uuid', description: 'Unique leaveType identifier'},
					label: { type: 'string', description: 'LeaveType display label'}
				},
				required: ['value', ' label']
			},

			LeaveTypeSelectResponse: {
				type: 'array',
				items: { $ref: '#/components/schemas/LeaveTypeSelectItem' }
			},

			LeaveTypeDetailResponse: {
				type: 'object',
				properties: {
					leaveTypeId: { type: 'string', format: 'uuid', description: 'leaveTypeId' },
					typeName: { type: 'string', description: 'typeName' },
					maxDaysPerYear: { type: 'integer', description: 'maxDaysPerYear' },
					isPaid: { type: 'boolean', description: 'isPaid' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			LeaveTypeEditResponse: {
				type: 'object',
				properties: {
					typeName: { type: 'string', description: 'typeName' },
					maxDaysPerYear: { type: 'integer', description: 'maxDaysPerYear' },
					isPaid: { type: 'boolean', description: 'isPaid' }
				}
			},

			CreateLeaveTypeInput: {
				type: 'object',
				properties: {
					typeName: { type: 'string', description: 'typeName', example: 'Example typeName' },
					maxDaysPerYear: { type: 'integer', description: 'maxDaysPerYear', example: 123 },
					isPaid: { type: 'boolean', description: 'isPaid', example: true }
				},
				required: ['typeName', 'maxDaysPerYear', 'isPaid']
			},

			LeaveTypeCreateResponse: {
				type: 'object',
				properties: {
					leaveTypeId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateLeaveTypeInput: {
				type: 'object',
				properties: {
					typeName: { type: 'string', description: 'typeName' },
					maxDaysPerYear: { type: 'integer', description: 'maxDaysPerYear' },
					isPaid: { type: 'boolean', description: 'isPaid' }
				},
				required: ['typeName', 'maxDaysPerYear', 'isPaid']
			},

			LeaveTypeUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'LeaveType updated successfully' },
					data: {
						type: 'object',
						properties: {
							typeName: { type: 'string', description: 'typeName' },
							maxDaysPerYear: { type: 'integer', description: 'maxDaysPerYear' },
							isPaid: { type: 'boolean', description: 'isPaid' }
						}
					}
				}
			},

			LeaveTypeDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'LeaveType deleted successfully' }
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

export default defaultAreaLeaveTypeSwagger;
