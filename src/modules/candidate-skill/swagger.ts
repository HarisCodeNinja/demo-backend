import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaCandidateSkillSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea CandidateSkill API',
		version: '1.0.0',
		description: 'API documentation for managing candidate-skills in the default-area area.',
	},
	paths: {
		'/api/default-area/candidate-skills': {
			get: {
				summary: 'Get list of candidate-skills (DefaultArea)',
				description: 'Retrieve a paginated list of candidate-skills with default-area access',
				tags: ['DefaultArea - CandidateSkills'],
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
						description: 'Search term for filtering candidate-skills',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'candidateId',
						description: 'Filter by candidateId',
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
						name: 'proficiency',
						description: 'Filter by proficiency',
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
						description: 'List of candidate-skills retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateSkillListResponse' }
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
				summary: 'Create a new candidate-skill (DefaultArea)',
				description: 'Add a new candidate-skill to the system',
				tags: ['DefaultArea - CandidateSkills'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateCandidateSkillInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'CandidateSkill created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateSkillCreateResponse' }
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
		'/api/default-area/candidate-skills/{candidateSkillId}': {
			get: {
				summary: 'Get candidate-skill for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific candidate-skill for editing',
				tags: ['DefaultArea - CandidateSkills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'candidateSkillId',
						required: true,
						description: 'ID of the candidate-skill to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'CandidateSkill details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateSkillEditResponse' }
							}
						}
					},
					404: {
						description: 'CandidateSkill not found',
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
				summary: 'Update a candidate-skill (DefaultArea)',
				description: 'Modify an existing candidate-skill in the system',
				tags: ['DefaultArea - CandidateSkills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'candidateSkillId',
						required: true,
						description: 'ID of the candidate-skill to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateCandidateSkillInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'CandidateSkill updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateSkillUpdateResponse' }
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
						description: 'CandidateSkill not found',
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
				summary: 'Delete a candidate-skill (DefaultArea)',
				description: 'Remove a candidate-skill from the system',
				tags: ['DefaultArea - CandidateSkills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'candidateSkillId',
						required: true,
						description: 'ID of the candidate-skill to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'CandidateSkill deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateSkillDeleteResponse' }
							}
						}
					},
					404: {
						description: 'CandidateSkill not found',
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
		'/api/default-area/candidate-skills/detail/{candidateSkillId}': {
			get: {
				summary: 'Get detailed candidate-skill information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific candidate-skill',
				tags: ['DefaultArea - CandidateSkills'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'candidateSkillId',
						required: true,
						description: 'ID of the candidate-skill to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'CandidateSkill details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateSkillDetailResponse' }
							}
						}
					},
					404: {
						description: 'CandidateSkill not found',
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
			CandidateSkillListItem: {
				type: 'object',
				properties: {
					candidateSkillId: { type: 'string', format: 'uuid', description: 'candidateSkillId' },
					candidateId: { type: 'string', description: 'candidateId' },
					skillId: { type: 'string', description: 'skillId' },
					proficiency: { type: 'string', description: 'proficiency' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['candidateSkillId', ' candidateId', ' skillId', ' createdAt', ' updatedAt']
			},

			CandidateSkillListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/CandidateSkillListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of candidate-skills' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			CandidateSkillDetailResponse: {
				type: 'object',
				properties: {
					candidateSkillId: { type: 'string', format: 'uuid', description: 'candidateSkillId' },
					candidateId: { type: 'string', description: 'candidateId' },
					skillId: { type: 'string', description: 'skillId' },
					proficiency: { type: 'string', nullable: true, description: 'proficiency' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			CandidateSkillEditResponse: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', description: 'candidateId' },
					skillId: { type: 'string', description: 'skillId' },
					proficiency: { type: 'string', nullable: true, description: 'proficiency' }
				}
			},

			CreateCandidateSkillInput: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', description: 'candidateId' },
					skillId: { type: 'string', description: 'skillId' },
					proficiency: { type: 'string', description: 'proficiency', example: 'proficiency Option' }
				},
				required: ['candidateId', 'skillId']
			},

			CandidateSkillCreateResponse: {
				type: 'object',
				properties: {
					candidateSkillId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateCandidateSkillInput: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', description: 'candidateId' },
					skillId: { type: 'string', description: 'skillId' },
					proficiency: { type: 'string', description: 'proficiency' }
				},
				required: ['candidateId', 'skillId']
			},

			CandidateSkillUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'CandidateSkill updated successfully' },
					data: {
						type: 'object',
						properties: {
							candidateId: { type: 'string', description: 'candidateId' },
							skillId: { type: 'string', description: 'skillId' },
							proficiency: { type: 'string', nullable: true, description: 'proficiency' }
						}
					}
				}
			},

			CandidateSkillDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'CandidateSkill deleted successfully' }
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

export default defaultAreaCandidateSkillSwagger;
