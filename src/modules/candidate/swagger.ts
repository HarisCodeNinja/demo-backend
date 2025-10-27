import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaCandidateSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Candidate API',
		version: '1.0.0',
		description: 'API documentation for managing candidates in the default-area area.',
	},
	paths: {
		'/api/default-area/candidates': {
			get: {
				summary: 'Get list of candidates (DefaultArea)',
				description: 'Retrieve a paginated list of candidates with default-area access',
				tags: ['DefaultArea - Candidates'],
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
						description: 'Search term for filtering candidates',
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
						name: 'email',
						description: 'Filter by email',
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
						name: 'resumeText',
						description: 'Filter by resumeText',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'source',
						description: 'Filter by source',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'currentStatus',
						description: 'Filter by currentStatus',
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
						name: 'referredByEmployeeId',
						description: 'Filter by referredByEmployeeId',
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
						description: 'List of candidates retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateListResponse' }
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
				summary: 'Create a new candidate (DefaultArea)',
				description: 'Add a new candidate to the system',
				tags: ['DefaultArea - Candidates'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateCandidateInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Candidate created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateCreateResponse' }
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
		'/api/default-area/candidates/select': {
			get: {
				summary: 'Get candidates for selection dropdown (DefaultArea)',
				description: 'Retrieve a simplified list of candidates for dropdown selection purposes',
				tags: ['DefaultArea - Candidates'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering candidates',
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
						description: 'Candidate selection list retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateSelectResponse' }
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
		'/api/default-area/candidates/{candidateId}': {
			get: {
				summary: 'Get candidate for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific candidate for editing',
				tags: ['DefaultArea - Candidates'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'candidateId',
						required: true,
						description: 'ID of the candidate to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Candidate details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateEditResponse' }
							}
						}
					},
					404: {
						description: 'Candidate not found',
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
				summary: 'Update a candidate (DefaultArea)',
				description: 'Modify an existing candidate in the system',
				tags: ['DefaultArea - Candidates'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'candidateId',
						required: true,
						description: 'ID of the candidate to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateCandidateInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Candidate updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateUpdateResponse' }
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
						description: 'Candidate not found',
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
				summary: 'Delete a candidate (DefaultArea)',
				description: 'Remove a candidate from the system',
				tags: ['DefaultArea - Candidates'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'candidateId',
						required: true,
						description: 'ID of the candidate to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Candidate deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Candidate not found',
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
		'/api/default-area/candidates/detail/{candidateId}': {
			get: {
				summary: 'Get detailed candidate information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific candidate',
				tags: ['DefaultArea - Candidates'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'candidateId',
						required: true,
						description: 'ID of the candidate to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Candidate details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CandidateDetailResponse' }
							}
						}
					},
					404: {
						description: 'Candidate not found',
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
			CandidateListItem: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', format: 'uuid', description: 'candidateId' },
					firstName: { type: 'string', description: 'firstName' },
					lastName: { type: 'string', description: 'lastName' },
					email: { type: 'string', format: 'email', description: 'email' },
					phoneNumber: { type: 'string', description: 'phoneNumber' },
					resumeText: { type: 'string', description: 'resumeText' },
					source: { type: 'string', description: 'source' },
					currentStatus: { type: 'string', description: 'currentStatus' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					referredByEmployeeId: { type: 'string', description: 'referredByEmployeeId' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['candidateId', ' firstName', ' lastName', ' email', ' currentStatus', ' createdAt', ' updatedAt']
			},

			CandidateListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/CandidateListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of candidates' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			CandidateSelectItem: {
				type: 'object',
				properties: {
					value: { type: 'string', format: 'uuid', description: 'Unique candidate identifier'},
					label: { type: 'string', description: 'Candidate display label'}
				},
				required: ['value', ' label']
			},

			CandidateSelectResponse: {
				type: 'array',
				items: { $ref: '#/components/schemas/CandidateSelectItem' }
			},

			CandidateDetailResponse: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', format: 'uuid', description: 'candidateId' },
					firstName: { type: 'string', description: 'firstName' },
					lastName: { type: 'string', description: 'lastName' },
					email: { type: 'string', format: 'email', description: 'email' },
					phoneNumber: { type: 'string', nullable: true, description: 'phoneNumber' },
					resumeText: { type: 'string', nullable: true, description: 'resumeText' },
					source: { type: 'string', nullable: true, description: 'source' },
					currentStatus: { type: 'string', description: 'currentStatus' },
					jobOpeningId: { type: 'string', nullable: true, description: 'jobOpeningId' },
					referredByEmployeeId: { type: 'string', nullable: true, description: 'referredByEmployeeId' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			CandidateEditResponse: {
				type: 'object',
				properties: {
					firstName: { type: 'string', description: 'firstName' },
					lastName: { type: 'string', description: 'lastName' },
					email: { type: 'string', format: 'email', description: 'email' },
					phoneNumber: { type: 'string', nullable: true, description: 'phoneNumber' },
					resumeText: { type: 'string', nullable: true, description: 'resumeText' },
					source: { type: 'string', nullable: true, description: 'source' },
					currentStatus: { type: 'string', description: 'currentStatus' },
					jobOpeningId: { type: 'string', nullable: true, description: 'jobOpeningId' },
					referredByEmployeeId: { type: 'string', nullable: true, description: 'referredByEmployeeId' }
				}
			},

			CreateCandidateInput: {
				type: 'object',
				properties: {
					firstName: { type: 'string', description: 'firstName', example: 'Example firstName' },
					lastName: { type: 'string', description: 'lastName', example: 'Example lastName' },
					email: { type: 'string', format: 'email', description: 'email', example: 'user@example.com' },
					phoneNumber: { type: 'string', description: 'phoneNumber', example: 'Example phoneNumber' },
					resumeText: { type: 'string', description: 'resumeText' },
					source: { type: 'string', description: 'source', example: 'Example source' },
					currentStatus: { type: 'string', description: 'currentStatus', example: 'currentStatus Option' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					referredByEmployeeId: { type: 'string', description: 'referredByEmployeeId' }
				},
				required: ['firstName', 'lastName', 'email', 'currentStatus']
			},

			CandidateCreateResponse: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateCandidateInput: {
				type: 'object',
				properties: {
					firstName: { type: 'string', description: 'firstName' },
					lastName: { type: 'string', description: 'lastName' },
					email: { type: 'string', format: 'email', description: 'email' },
					phoneNumber: { type: 'string', description: 'phoneNumber' },
					resumeText: { type: 'string', description: 'resumeText' },
					source: { type: 'string', description: 'source' },
					currentStatus: { type: 'string', description: 'currentStatus' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					referredByEmployeeId: { type: 'string', description: 'referredByEmployeeId' }
				},
				required: ['firstName', 'lastName', 'email', 'currentStatus']
			},

			CandidateUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Candidate updated successfully' },
					data: {
						type: 'object',
						properties: {
							firstName: { type: 'string', description: 'firstName' },
							lastName: { type: 'string', description: 'lastName' },
							email: { type: 'string', format: 'email', description: 'email' },
							phoneNumber: { type: 'string', nullable: true, description: 'phoneNumber' },
							resumeText: { type: 'string', nullable: true, description: 'resumeText' },
							source: { type: 'string', nullable: true, description: 'source' },
							currentStatus: { type: 'string', description: 'currentStatus' },
							jobOpeningId: { type: 'string', nullable: true, description: 'jobOpeningId' },
							referredByEmployeeId: { type: 'string', nullable: true, description: 'referredByEmployeeId' }
						}
					}
				}
			},

			CandidateDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Candidate deleted successfully' }
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

export default defaultAreaCandidateSwagger;
