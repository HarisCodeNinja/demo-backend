import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaJobOpeningSkillSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea JobOpeningSkill API',
		version: '1.0.0',
		description: 'API documentation for managing job-opening-skills in the default-area area.',
	},
	paths: {
		'/api/default-area/job-opening-skills': {
			get: {
				summary: 'Get list of job-opening-skills (DefaultArea)',
				description: 'Retrieve a paginated list of job-opening-skills with default-area access',
				tags: ['DefaultArea - JobOpeningSkills'],
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
						description: 'Search term for filtering job-opening-skills',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'jobOpeningId',
						description: 'Filter by jobOpeningId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'skillId',
						description: 'Filter by skillId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'requiredLevel',
						description: 'Filter by requiredLevel',
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
						description: 'List of job-opening-skills retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningSkillListResponse' }
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
				summary: 'Create a new job-opening-skill (DefaultArea)',
				description: 'Add a new job-opening-skill to the system',
				tags: ['DefaultArea - JobOpeningSkills'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateJobOpeningSkillInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'JobOpeningSkill created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningSkillCreateResponse' }
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
		'/api/default-area/job-opening-skills/{jobOpeningSkillId}': {
			get: {
				summary: 'Get job-opening-skill for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific job-opening-skill for editing',
				tags: ['DefaultArea - JobOpeningSkills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobOpeningSkillId',
						required: true,
						description: 'ID of the job-opening-skill to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'JobOpeningSkill details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningSkillEditResponse' }
							}
						}
					},
					404: {
						description: 'JobOpeningSkill not found',
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
				summary: 'Update a job-opening-skill (DefaultArea)',
				description: 'Modify an existing job-opening-skill in the system',
				tags: ['DefaultArea - JobOpeningSkills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobOpeningSkillId',
						required: true,
						description: 'ID of the job-opening-skill to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateJobOpeningSkillInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'JobOpeningSkill updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningSkillUpdateResponse' }
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
						description: 'JobOpeningSkill not found',
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
				summary: 'Delete a job-opening-skill (DefaultArea)',
				description: 'Remove a job-opening-skill from the system',
				tags: ['DefaultArea - JobOpeningSkills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobOpeningSkillId',
						required: true,
						description: 'ID of the job-opening-skill to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'JobOpeningSkill deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningSkillDeleteResponse' }
							}
						}
					},
					404: {
						description: 'JobOpeningSkill not found',
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
		'/api/default-area/job-opening-skills/detail/{jobOpeningSkillId}': {
			get: {
				summary: 'Get detailed job-opening-skill information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific job-opening-skill',
				tags: ['DefaultArea - JobOpeningSkills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'jobOpeningSkillId',
						required: true,
						description: 'ID of the job-opening-skill to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'JobOpeningSkill details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/JobOpeningSkillDetailResponse' }
							}
						}
					},
					404: {
						description: 'JobOpeningSkill not found',
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
			JobOpeningSkillListItem: {
				type: 'object',
				properties: {
					jobOpeningSkillId: { type: 'string', format: 'uuid', description: 'jobOpeningSkillId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					skillId: { type: 'string', description: 'skillId' },
					requiredLevel: { type: 'string', description: 'requiredLevel' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['jobOpeningSkillId', ' jobOpeningId', ' skillId', ' createdAt', ' updatedAt']
			},

			JobOpeningSkillListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/JobOpeningSkillListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of job-opening-skills' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			JobOpeningSkillDetailResponse: {
				type: 'object',
				properties: {
					jobOpeningSkillId: { type: 'string', format: 'uuid', description: 'jobOpeningSkillId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					skillId: { type: 'string', description: 'skillId' },
					requiredLevel: { type: 'string', nullable: true, description: 'requiredLevel' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			JobOpeningSkillEditResponse: {
				type: 'object',
				properties: {
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					skillId: { type: 'string', description: 'skillId' },
					requiredLevel: { type: 'string', nullable: true, description: 'requiredLevel' }
				}
			},

			CreateJobOpeningSkillInput: {
				type: 'object',
				properties: {
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					skillId: { type: 'string', description: 'skillId' },
					requiredLevel: { type: 'string', description: 'requiredLevel', example: 'requiredLevel Option' }
				},
				required: ['jobOpeningId', 'skillId']
			},

			JobOpeningSkillCreateResponse: {
				type: 'object',
				properties: {
					jobOpeningSkillId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateJobOpeningSkillInput: {
				type: 'object',
				properties: {
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					skillId: { type: 'string', description: 'skillId' },
					requiredLevel: { type: 'string', description: 'requiredLevel' }
				},
				required: ['jobOpeningId', 'skillId']
			},

			JobOpeningSkillUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'JobOpeningSkill updated successfully' },
					data: {
						type: 'object',
						properties: {
							jobOpeningId: { type: 'string', description: 'jobOpeningId' },
							skillId: { type: 'string', description: 'skillId' },
							requiredLevel: { type: 'string', nullable: true, description: 'requiredLevel' }
						}
					}
				}
			},

			JobOpeningSkillDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'JobOpeningSkill deleted successfully' }
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

export default defaultAreaJobOpeningSkillSwagger;
