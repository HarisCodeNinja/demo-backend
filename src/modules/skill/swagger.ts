import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaSkillSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Skill API',
		version: '1.0.0',
		description: 'API documentation for managing skills in the default-area area.',
	},
	paths: {
		'/api/default-area/skills': {
			get: {
				summary: 'Get list of skills (DefaultArea)',
				description: 'Retrieve a paginated list of skills with default-area access',
				tags: ['DefaultArea - Skills'],
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
						description: 'Search term for filtering skills',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'skillName',
						description: 'Filter by skillName',
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
						description: 'List of skills retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SkillListResponse' }
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
				summary: 'Create a new skill (DefaultArea)',
				description: 'Add a new skill to the system',
				tags: ['DefaultArea - Skills'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateSkillInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Skill created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SkillCreateResponse' }
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
		'/api/default-area/skills/select': {
			get: {
				summary: 'Get skills for selection dropdown (DefaultArea)',
				description: 'Retrieve a simplified list of skills for dropdown selection purposes',
				tags: ['DefaultArea - Skills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering skills',
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
						description: 'Skill selection list retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SkillSelectResponse' }
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
		'/api/default-area/skills/{skillId}': {
			get: {
				summary: 'Get skill for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific skill for editing',
				tags: ['DefaultArea - Skills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'skillId',
						required: true,
						description: 'ID of the skill to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Skill details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SkillEditResponse' }
							}
						}
					},
					404: {
						description: 'Skill not found',
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
				summary: 'Update a skill (DefaultArea)',
				description: 'Modify an existing skill in the system',
				tags: ['DefaultArea - Skills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'skillId',
						required: true,
						description: 'ID of the skill to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateSkillInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Skill updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SkillUpdateResponse' }
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
						description: 'Skill not found',
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
				summary: 'Delete a skill (DefaultArea)',
				description: 'Remove a skill from the system',
				tags: ['DefaultArea - Skills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'skillId',
						required: true,
						description: 'ID of the skill to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Skill deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SkillDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Skill not found',
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
		'/api/default-area/skills/detail/{skillId}': {
			get: {
				summary: 'Get detailed skill information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific skill',
				tags: ['DefaultArea - Skills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'skillId',
						required: true,
						description: 'ID of the skill to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Skill details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/SkillDetailResponse' }
							}
						}
					},
					404: {
						description: 'Skill not found',
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
			SkillListItem: {
				type: 'object',
				properties: {
					skillId: { type: 'string', format: 'uuid', description: 'skillId' },
					skillName: { type: 'string', description: 'skillName' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['skillId', ' skillName', ' createdAt', ' updatedAt']
			},

			SkillListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/SkillListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of skills' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			SkillSelectItem: {
				type: 'object',
				properties: {
					value: { type: 'string', format: 'uuid', description: 'Unique skill identifier'},
					label: { type: 'string', description: 'Skill display label'}
				},
				required: ['value', ' label']
			},

			SkillSelectResponse: {
				type: 'array',
				items: { $ref: '#/components/schemas/SkillSelectItem' }
			},

			SkillDetailResponse: {
				type: 'object',
				properties: {
					skillId: { type: 'string', format: 'uuid', description: 'skillId' },
					skillName: { type: 'string', description: 'skillName' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			SkillEditResponse: {
				type: 'object',
				properties: {
					skillName: { type: 'string', description: 'skillName' }
				}
			},

			CreateSkillInput: {
				type: 'object',
				properties: {
					skillName: { type: 'string', description: 'skillName', example: 'Example skillName' }
				},
				required: ['skillName']
			},

			SkillCreateResponse: {
				type: 'object',
				properties: {
					skillId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateSkillInput: {
				type: 'object',
				properties: {
					skillName: { type: 'string', description: 'skillName' }
				},
				required: ['skillName']
			},

			SkillUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Skill updated successfully' },
					data: {
						type: 'object',
						properties: {
							skillName: { type: 'string', description: 'skillName' }
						}
					}
				}
			},

			SkillDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Skill deleted successfully' }
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

export default defaultAreaSkillSwagger;
