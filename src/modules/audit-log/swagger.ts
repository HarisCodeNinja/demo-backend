import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaAuditLogSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea AuditLog API',
		version: '1.0.0',
		description: 'API documentation for managing audit-logs in the default-area area.',
	},
	paths: {
		'/api/default-area/audit-logs': {
			get: {
				summary: 'Get list of audit-logs (DefaultArea)',
				description: 'Retrieve a paginated list of audit-logs with default-area access',
				tags: ['DefaultArea - AuditLogs'],
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
						description: 'Search term for filtering audit-logs',
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
						name: 'action',
						description: 'Filter by action',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'tableName',
						description: 'Filter by tableName',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'recordId',
						description: 'Filter by recordId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'oldValue',
						description: 'Filter by oldValue',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'newValue',
						description: 'Filter by newValue',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'ipAddress',
						description: 'Filter by ipAddress',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'timestamp',
						description: 'Filter by timestamp',
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
						description: 'List of audit-logs retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuditLogListResponse' }
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
				summary: 'Create a new audit-log (DefaultArea)',
				description: 'Add a new audit-log to the system',
				tags: ['DefaultArea - AuditLogs'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateAuditLogInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'AuditLog created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuditLogCreateResponse' }
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
		'/api/default-area/audit-logs/{auditLogId}': {
			get: {
				summary: 'Get audit-log for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific audit-log for editing',
				tags: ['DefaultArea - AuditLogs'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'auditLogId',
						required: true,
						description: 'ID of the audit-log to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'AuditLog details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuditLogEditResponse' }
							}
						}
					},
					404: {
						description: 'AuditLog not found',
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
				summary: 'Update a audit-log (DefaultArea)',
				description: 'Modify an existing audit-log in the system',
				tags: ['DefaultArea - AuditLogs'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'auditLogId',
						required: true,
						description: 'ID of the audit-log to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateAuditLogInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'AuditLog updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuditLogUpdateResponse' }
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
						description: 'AuditLog not found',
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
				summary: 'Delete a audit-log (DefaultArea)',
				description: 'Remove a audit-log from the system',
				tags: ['DefaultArea - AuditLogs'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'auditLogId',
						required: true,
						description: 'ID of the audit-log to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'AuditLog deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuditLogDeleteResponse' }
							}
						}
					},
					404: {
						description: 'AuditLog not found',
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
		'/api/default-area/audit-logs/detail/{auditLogId}': {
			get: {
				summary: 'Get detailed audit-log information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific audit-log',
				tags: ['DefaultArea - AuditLogs'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'auditLogId',
						required: true,
						description: 'ID of the audit-log to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'AuditLog details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AuditLogDetailResponse' }
							}
						}
					},
					404: {
						description: 'AuditLog not found',
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
			AuditLogListItem: {
				type: 'object',
				properties: {
					auditLogId: { type: 'string', format: 'uuid', description: 'auditLogId' },
					userId: { type: 'string', description: 'userId' },
					action: { type: 'string', description: 'action' },
					tableName: { type: 'string', description: 'tableName' },
					recordId: { type: 'string', description: 'recordId' },
					oldValue: { type: 'string', description: 'oldValue' },
					newValue: { type: 'string', description: 'newValue' },
					ipAddress: { type: 'string', description: 'ipAddress' },
					timestamp: { type: 'string', format: 'date-time', description: 'timestamp' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['auditLogId', ' userId', ' action', ' tableName', ' recordId', ' timestamp', ' createdAt', ' updatedAt']
			},

			AuditLogListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/AuditLogListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of audit-logs' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			AuditLogDetailResponse: {
				type: 'object',
				properties: {
					auditLogId: { type: 'string', format: 'uuid', description: 'auditLogId' },
					userId: { type: 'string', description: 'userId' },
					action: { type: 'string', description: 'action' },
					tableName: { type: 'string', description: 'tableName' },
					recordId: { type: 'string', description: 'recordId' },
					oldValue: { type: 'string', nullable: true, description: 'oldValue' },
					newValue: { type: 'string', nullable: true, description: 'newValue' },
					ipAddress: { type: 'string', nullable: true, description: 'ipAddress' },
					timestamp: { type: 'string', format: 'date-time', description: 'timestamp' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			AuditLogEditResponse: {
				type: 'object',
				properties: {
					userId: { type: 'string', description: 'userId' },
					action: { type: 'string', description: 'action' },
					tableName: { type: 'string', description: 'tableName' },
					recordId: { type: 'string', description: 'recordId' },
					oldValue: { type: 'string', nullable: true, description: 'oldValue' },
					newValue: { type: 'string', nullable: true, description: 'newValue' }
				}
			},

			CreateAuditLogInput: {
				type: 'object',
				properties: {
					userId: { type: 'string', description: 'userId' },
					action: { type: 'string', description: 'action', example: 'Example action' },
					tableName: { type: 'string', description: 'tableName', example: 'Example tableName' },
					recordId: { type: 'string', description: 'recordId', example: 'Example recordId' },
					oldValue: { type: 'string', description: 'oldValue' },
					newValue: { type: 'string', description: 'newValue' }
				},
				required: ['userId', 'action', 'tableName', 'recordId']
			},

			AuditLogCreateResponse: {
				type: 'object',
				properties: {
					auditLogId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateAuditLogInput: {
				type: 'object',
				properties: {
					userId: { type: 'string', description: 'userId' },
					action: { type: 'string', description: 'action' },
					tableName: { type: 'string', description: 'tableName' },
					recordId: { type: 'string', description: 'recordId' },
					oldValue: { type: 'string', description: 'oldValue' },
					newValue: { type: 'string', description: 'newValue' }
				},
				required: ['userId', 'action', 'tableName', 'recordId']
			},

			AuditLogUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'AuditLog updated successfully' },
					data: {
						type: 'object',
						properties: {
							userId: { type: 'string', description: 'userId' },
							action: { type: 'string', description: 'action' },
							tableName: { type: 'string', description: 'tableName' },
							recordId: { type: 'string', description: 'recordId' },
							oldValue: { type: 'string', nullable: true, description: 'oldValue' },
							newValue: { type: 'string', nullable: true, description: 'newValue' }
						}
					}
				}
			},

			AuditLogDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'AuditLog deleted successfully' }
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

export default defaultAreaAuditLogSwagger;
