import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaRoleCompetencySwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea RoleCompetency API',
		version: '1.0.0',
		description: 'API documentation for managing role-competencies in the default-area area.',
	},
	paths: {
		'/api/default-area/role-competencies': {
			get: {
				summary: 'Get list of role-competencies (DefaultArea)',
				description: 'Retrieve a paginated list of role-competencies with default-area access',
				tags: ['DefaultArea - RoleCompetencies'],
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
						description: 'Search term for filtering role-competencies',
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
						name: 'competencyId',
						description: 'Filter by competencyId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'requiredProficiency',
						description: 'Filter by requiredProficiency',
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
						description: 'List of role-competencies retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/RoleCompetencyListResponse' }
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
				summary: 'Create a new role-competency (DefaultArea)',
				description: 'Add a new role-competency to the system',
				tags: ['DefaultArea - RoleCompetencies'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateRoleCompetencyInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'RoleCompetency created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/RoleCompetencyCreateResponse' }
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
		'/api/default-area/role-competencies/{roleCompetencyId}': {
			get: {
				summary: 'Get role-competency for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific role-competency for editing',
				tags: ['DefaultArea - RoleCompetencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'roleCompetencyId',
						required: true,
						description: 'ID of the role-competency to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'RoleCompetency details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/RoleCompetencyEditResponse' }
							}
						}
					},
					404: {
						description: 'RoleCompetency not found',
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
				summary: 'Update a role-competency (DefaultArea)',
				description: 'Modify an existing role-competency in the system',
				tags: ['DefaultArea - RoleCompetencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'roleCompetencyId',
						required: true,
						description: 'ID of the role-competency to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateRoleCompetencyInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'RoleCompetency updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/RoleCompetencyUpdateResponse' }
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
						description: 'RoleCompetency not found',
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
				summary: 'Delete a role-competency (DefaultArea)',
				description: 'Remove a role-competency from the system',
				tags: ['DefaultArea - RoleCompetencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'roleCompetencyId',
						required: true,
						description: 'ID of the role-competency to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'RoleCompetency deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/RoleCompetencyDeleteResponse' }
							}
						}
					},
					404: {
						description: 'RoleCompetency not found',
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
		'/api/default-area/role-competencies/detail/{roleCompetencyId}': {
			get: {
				summary: 'Get detailed role-competency information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific role-competency',
				tags: ['DefaultArea - RoleCompetencies'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'roleCompetencyId',
						required: true,
						description: 'ID of the role-competency to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'RoleCompetency details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/RoleCompetencyDetailResponse' }
							}
						}
					},
					404: {
						description: 'RoleCompetency not found',
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
			RoleCompetencyListItem: {
				type: 'object',
				properties: {
					roleCompetencyId: { type: 'string', format: 'uuid', description: 'roleCompetencyId' },
					designationId: { type: 'string', description: 'designationId' },
					competencyId: { type: 'string', description: 'competencyId' },
					requiredProficiency: { type: 'string', description: 'requiredProficiency' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['roleCompetencyId', ' designationId', ' competencyId', ' createdAt', ' updatedAt']
			},

			RoleCompetencyListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/RoleCompetencyListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of role-competencies' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			RoleCompetencyDetailResponse: {
				type: 'object',
				properties: {
					roleCompetencyId: { type: 'string', format: 'uuid', description: 'roleCompetencyId' },
					designationId: { type: 'string', description: 'designationId' },
					competencyId: { type: 'string', description: 'competencyId' },
					requiredProficiency: { type: 'string', nullable: true, description: 'requiredProficiency' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			RoleCompetencyEditResponse: {
				type: 'object',
				properties: {
					designationId: { type: 'string', description: 'designationId' },
					competencyId: { type: 'string', description: 'competencyId' },
					requiredProficiency: { type: 'string', nullable: true, description: 'requiredProficiency' }
				}
			},

			CreateRoleCompetencyInput: {
				type: 'object',
				properties: {
					designationId: { type: 'string', description: 'designationId' },
					competencyId: { type: 'string', description: 'competencyId' },
					requiredProficiency: { type: 'string', description: 'requiredProficiency', example: 'requiredProficiency Option' }
				},
				required: ['designationId', 'competencyId']
			},

			RoleCompetencyCreateResponse: {
				type: 'object',
				properties: {
					roleCompetencyId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateRoleCompetencyInput: {
				type: 'object',
				properties: {
					designationId: { type: 'string', description: 'designationId' },
					competencyId: { type: 'string', description: 'competencyId' },
					requiredProficiency: { type: 'string', description: 'requiredProficiency' }
				},
				required: ['designationId', 'competencyId']
			},

			RoleCompetencyUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'RoleCompetency updated successfully' },
					data: {
						type: 'object',
						properties: {
							designationId: { type: 'string', description: 'designationId' },
							competencyId: { type: 'string', description: 'competencyId' },
							requiredProficiency: { type: 'string', nullable: true, description: 'requiredProficiency' }
						}
					}
				}
			},

			RoleCompetencyDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'RoleCompetency deleted successfully' }
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

export default defaultAreaRoleCompetencySwagger;
