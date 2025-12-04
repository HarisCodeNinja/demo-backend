import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaLeaveApplicationSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea LeaveApplication API',
		version: '1.0.0',
		description: 'API documentation for managing leave-applications in the default-area area.',
	},
	paths: {
		'/api/default-area/leave-applications': {
			get: {
				summary: 'Get list of leave-applications (DefaultArea)',
				description: 'Retrieve a paginated list of leave-applications with default-area access',
				tags: ['DefaultArea - LeaveApplications'],
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
						description: 'Search term for filtering leave-applications',
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
						name: 'leaveTypeId',
						description: 'Filter by leaveTypeId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'startDate',
						description: 'Filter by startDate',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'endDate',
						description: 'Filter by endDate',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'numberOfDay',
						description: 'Filter by numberOfDays',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'reason',
						description: 'Filter by reason',
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
						name: 'appliedBy',
						description: 'Filter by appliedById',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'approvedBy',
						description: 'Filter by approvedById',
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
						description: 'List of leave-applications retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveApplicationListResponse' }
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
				summary: 'Create a new leave-application (DefaultArea)',
				description: 'Add a new leave-application to the system',
				tags: ['DefaultArea - LeaveApplications'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateLeaveApplicationInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'LeaveApplication created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveApplicationCreateResponse' }
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
		'/api/default-area/leave-applications/{leaveApplicationId}': {
			get: {
				summary: 'Get leave-application for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific leave-application for editing',
				tags: ['DefaultArea - LeaveApplications'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'leaveApplicationId',
						required: true,
						description: 'ID of the leave-application to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'LeaveApplication details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveApplicationEditResponse' }
							}
						}
					},
					404: {
						description: 'LeaveApplication not found',
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
				summary: 'Update a leave-application (DefaultArea)',
				description: 'Modify an existing leave-application in the system',
				tags: ['DefaultArea - LeaveApplications'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'leaveApplicationId',
						required: true,
						description: 'ID of the leave-application to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateLeaveApplicationInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'LeaveApplication updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveApplicationUpdateResponse' }
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
						description: 'LeaveApplication not found',
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
				summary: 'Delete a leave-application (DefaultArea)',
				description: 'Remove a leave-application from the system',
				tags: ['DefaultArea - LeaveApplications'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'leaveApplicationId',
						required: true,
						description: 'ID of the leave-application to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'LeaveApplication deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveApplicationDeleteResponse' }
							}
						}
					},
					404: {
						description: 'LeaveApplication not found',
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
		'/api/default-area/leave-applications/detail/{leaveApplicationId}': {
			get: {
				summary: 'Get detailed leave-application information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific leave-application',
				tags: ['DefaultArea - LeaveApplications'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'leaveApplicationId',
						required: true,
						description: 'ID of the leave-application to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'LeaveApplication details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LeaveApplicationDetailResponse' }
							}
						}
					},
					404: {
						description: 'LeaveApplication not found',
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
			LeaveApplicationListItem: {
				type: 'object',
				properties: {
					leaveApplicationId: { type: 'string', format: 'uuid', description: 'leaveApplicationId' },
					employeeId: { type: 'string', description: 'employeeId' },
					leaveTypeId: { type: 'string', description: 'leaveTypeId' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					numberOfDay: { type: 'number', description: 'numberOfDays' },
					reason: { type: 'string', description: 'reason' },
					status: { type: 'string', description: 'status' },
					appliedBy: { type: 'string', description: 'appliedById' },
					approvedBy: { type: 'string', description: 'approvedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['leaveApplicationId', ' employeeId', ' leaveTypeId', ' startDate', ' endDate', ' numberOfDay', ' reason', ' status', ' appliedBy', ' createdAt', ' updatedAt']
			},

			LeaveApplicationListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/LeaveApplicationListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of leave-applications' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			LeaveApplicationDetailResponse: {
				type: 'object',
				properties: {
					leaveApplicationId: { type: 'string', format: 'uuid', description: 'leaveApplicationId' },
					employeeId: { type: 'string', description: 'employeeId' },
					leaveTypeId: { type: 'string', description: 'leaveTypeId' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					numberOfDay: { type: 'number', description: 'numberOfDays' },
					reason: { type: 'string', description: 'reason' },
					status: { type: 'string', description: 'status' },
					appliedBy: { type: 'string', description: 'appliedById' },
					approvedBy: { type: 'string', nullable: true, description: 'approvedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			LeaveApplicationEditResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					leaveTypeId: { type: 'string', description: 'leaveTypeId' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					reason: { type: 'string', description: 'reason' },
					status: { type: 'string', description: 'status' },
					approvedBy: { type: 'string', nullable: true, description: 'approvedById' }
				}
			},

			CreateLeaveApplicationInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					leaveTypeId: { type: 'string', description: 'leaveTypeId' },
					startDate: { type: 'string', format: 'date', description: 'startDate', example: '2024-01-01' },
					endDate: { type: 'string', format: 'date', description: 'endDate', example: '2024-01-01' },
					reason: { type: 'string', description: 'reason' },
					status: { type: 'string', description: 'status', example: 'status Option' },
					approvedBy: { type: 'string', description: 'approvedById' }
				},
				required: ['employeeId', 'leaveTypeId', 'startDate', 'endDate', 'reason', 'status']
			},

			LeaveApplicationCreateResponse: {
				type: 'object',
				properties: {
					leaveApplicationId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateLeaveApplicationInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					leaveTypeId: { type: 'string', description: 'leaveTypeId' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					reason: { type: 'string', description: 'reason' },
					status: { type: 'string', description: 'status' },
					approvedBy: { type: 'string', description: 'approvedById' }
				},
				required: ['employeeId', 'leaveTypeId', 'startDate', 'endDate', 'reason', 'status']
			},

			LeaveApplicationUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'LeaveApplication updated successfully' },
					data: {
						type: 'object',
						properties: {
							employeeId: { type: 'string', description: 'employeeId' },
							leaveTypeId: { type: 'string', description: 'leaveTypeId' },
							startDate: { type: 'string', format: 'date', description: 'startDate' },
							endDate: { type: 'string', format: 'date', description: 'endDate' },
							reason: { type: 'string', description: 'reason' },
							status: { type: 'string', description: 'status' },
							approvedBy: { type: 'string', nullable: true, description: 'approvedById' }
						}
					}
				}
			},

			LeaveApplicationDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'LeaveApplication deleted successfully' }
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

export default defaultAreaLeaveApplicationSwagger;
