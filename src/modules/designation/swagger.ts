import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaDesignationSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Designation API',
		version: '1.0.0',
		description: 'API documentation for managing designations in the default-area area.',
	},
	paths: {
		'/api/default-area/designations': {
			get: {
				summary: 'Get list of designations (DefaultArea)',
				description: 'Retrieve a paginated list of designations with default-area access',
				tags: ['DefaultArea - Designations'],
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
						description: 'Search term for filtering designations',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'designationName',
						description: 'Filter by designationName',
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
						description: 'List of designations retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DesignationListResponse' }
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
				summary: 'Create a new designation (DefaultArea)',
				description: 'Add a new designation to the system',
				tags: ['DefaultArea - Designations'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateDesignationInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Designation created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DesignationCreateResponse' }
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
		'/api/default-area/designations/select': {
			get: {
				summary: 'Get designations for selection dropdown (DefaultArea)',
				description: 'Retrieve a simplified list of designations for dropdown selection purposes',
				tags: ['DefaultArea - Designations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering designations',
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
						description: 'Designation selection list retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DesignationSelectResponse' }
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
		'/api/default-area/designations/{designationId}': {
			get: {
				summary: 'Get designation for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific designation for editing',
				tags: ['DefaultArea - Designations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'designationId',
						required: true,
						description: 'ID of the designation to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Designation details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DesignationEditResponse' }
							}
						}
					},
					404: {
						description: 'Designation not found',
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
				summary: 'Update a designation (DefaultArea)',
				description: 'Modify an existing designation in the system',
				tags: ['DefaultArea - Designations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'designationId',
						required: true,
						description: 'ID of the designation to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateDesignationInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Designation updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DesignationUpdateResponse' }
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
						description: 'Designation not found',
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
				summary: 'Delete a designation (DefaultArea)',
				description: 'Remove a designation from the system',
				tags: ['DefaultArea - Designations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'designationId',
						required: true,
						description: 'ID of the designation to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Designation deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DesignationDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Designation not found',
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
		'/api/default-area/designations/detail/{designationId}': {
			get: {
				summary: 'Get detailed designation information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific designation',
				tags: ['DefaultArea - Designations'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'designationId',
						required: true,
						description: 'ID of the designation to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Designation details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DesignationDetailResponse' }
							}
						}
					},
					404: {
						description: 'Designation not found',
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
			DesignationListItem: {
				type: 'object',
				properties: {
					designationId: { type: 'string', format: 'uuid', description: 'designationId' },
					designationName: { type: 'string', description: 'designationName' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['designationId', ' designationName', ' createdAt', ' updatedAt']
			},

			DesignationListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/DesignationListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of designations' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			DesignationSelectItem: {
				type: 'object',
				properties: {
					value: { type: 'string', format: 'uuid', description: 'Unique designation identifier'},
					label: { type: 'string', description: 'Designation display label'}
				},
				required: ['value', ' label']
			},

			DesignationSelectResponse: {
				type: 'array',
				items: { $ref: '#/components/schemas/DesignationSelectItem' }
			},

			DesignationDetailResponse: {
				type: 'object',
				properties: {
					designationId: { type: 'string', format: 'uuid', description: 'designationId' },
					designationName: { type: 'string', description: 'designationName' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			DesignationEditResponse: {
				type: 'object',
				properties: {
					designationName: { type: 'string', description: 'designationName' }
				}
			},

			CreateDesignationInput: {
				type: 'object',
				properties: {
					designationName: { type: 'string', description: 'designationName', example: 'Example designationName' }
				},
				required: ['designationName']
			},

			DesignationCreateResponse: {
				type: 'object',
				properties: {
					designationId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateDesignationInput: {
				type: 'object',
				properties: {
					designationName: { type: 'string', description: 'designationName' }
				},
				required: ['designationName']
			},

			DesignationUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Designation updated successfully' },
					data: {
						type: 'object',
						properties: {
							designationName: { type: 'string', description: 'designationName' }
						}
					}
				}
			},

			DesignationDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Designation deleted successfully' }
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

export default defaultAreaDesignationSwagger;
