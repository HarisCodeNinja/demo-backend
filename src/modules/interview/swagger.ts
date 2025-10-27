import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaInterviewSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Interview API',
		version: '1.0.0',
		description: 'API documentation for managing interviews in the default-area area.',
	},
	paths: {
		'/api/default-area/interviews': {
			get: {
				summary: 'Get list of interviews (DefaultArea)',
				description: 'Retrieve a paginated list of interviews with default-area access',
				tags: ['DefaultArea - Interviews'],
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
						description: 'Search term for filtering interviews',
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
						name: 'jobOpeningId',
						description: 'Filter by jobOpeningId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'interviewerId',
						description: 'Filter by interviewerId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'interviewDate',
						description: 'Filter by interviewDate',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'feedback',
						description: 'Filter by feedback',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'rating',
						description: 'Filter by rating',
						schema: { type: 'integer' }
					},
					{
						in: 'query',
						name: 'status',
						description: 'Filter by status',
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
						description: 'List of interviews retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/InterviewListResponse' }
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
				summary: 'Create a new interview (DefaultArea)',
				description: 'Add a new interview to the system',
				tags: ['DefaultArea - Interviews'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateInterviewInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Interview created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/InterviewCreateResponse' }
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
		'/api/default-area/interviews/{interviewId}': {
			get: {
				summary: 'Get interview for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific interview for editing',
				tags: ['DefaultArea - Interviews'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'interviewId',
						required: true,
						description: 'ID of the interview to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Interview details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/InterviewEditResponse' }
							}
						}
					},
					404: {
						description: 'Interview not found',
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
				summary: 'Update a interview (DefaultArea)',
				description: 'Modify an existing interview in the system',
				tags: ['DefaultArea - Interviews'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'interviewId',
						required: true,
						description: 'ID of the interview to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateInterviewInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Interview updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/InterviewUpdateResponse' }
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
						description: 'Interview not found',
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
				summary: 'Delete a interview (DefaultArea)',
				description: 'Remove a interview from the system',
				tags: ['DefaultArea - Interviews'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'interviewId',
						required: true,
						description: 'ID of the interview to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Interview deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/InterviewDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Interview not found',
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
		'/api/default-area/interviews/detail/{interviewId}': {
			get: {
				summary: 'Get detailed interview information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific interview',
				tags: ['DefaultArea - Interviews'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'interviewId',
						required: true,
						description: 'ID of the interview to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Interview details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/InterviewDetailResponse' }
							}
						}
					},
					404: {
						description: 'Interview not found',
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
			InterviewListItem: {
				type: 'object',
				properties: {
					interviewId: { type: 'string', format: 'uuid', description: 'interviewId' },
					candidateId: { type: 'string', description: 'candidateId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					interviewerId: { type: 'string', description: 'interviewerId' },
					interviewDate: { type: 'string', format: 'date-time', description: 'interviewDate' },
					feedback: { type: 'string', description: 'feedback' },
					rating: { type: 'integer', description: 'rating' },
					status: { type: 'string', description: 'status' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['interviewId', ' candidateId', ' jobOpeningId', ' interviewerId', ' interviewDate', ' status', ' createdAt', ' updatedAt']
			},

			InterviewListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/InterviewListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of interviews' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			InterviewDetailResponse: {
				type: 'object',
				properties: {
					interviewId: { type: 'string', format: 'uuid', description: 'interviewId' },
					candidateId: { type: 'string', description: 'candidateId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					interviewerId: { type: 'string', description: 'interviewerId' },
					interviewDate: { type: 'string', format: 'date-time', description: 'interviewDate' },
					feedback: { type: 'string', nullable: true, description: 'feedback' },
					rating: { type: 'integer', nullable: true, description: 'rating' },
					status: { type: 'string', description: 'status' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			InterviewEditResponse: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', description: 'candidateId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					interviewerId: { type: 'string', description: 'interviewerId' },
					interviewDate: { type: 'string', format: 'date-time', description: 'interviewDate' },
					feedback: { type: 'string', nullable: true, description: 'feedback' },
					rating: { type: 'integer', nullable: true, description: 'rating' },
					status: { type: 'string', description: 'status' }
				}
			},

			CreateInterviewInput: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', description: 'candidateId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					interviewerId: { type: 'string', description: 'interviewerId' },
					interviewDate: { type: 'string', format: 'date-time', description: 'interviewDate', example: '2024-01-01T12:00:00Z' },
					feedback: { type: 'string', description: 'feedback' },
					rating: { type: 'integer', description: 'rating', example: 123 },
					status: { type: 'string', description: 'status', example: 'status Option' }
				},
				required: ['candidateId', 'jobOpeningId', 'interviewerId', 'interviewDate', 'status']
			},

			InterviewCreateResponse: {
				type: 'object',
				properties: {
					interviewId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateInterviewInput: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', description: 'candidateId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					interviewerId: { type: 'string', description: 'interviewerId' },
					interviewDate: { type: 'string', format: 'date-time', description: 'interviewDate' },
					feedback: { type: 'string', description: 'feedback' },
					rating: { type: 'integer', description: 'rating' },
					status: { type: 'string', description: 'status' }
				},
				required: ['candidateId', 'jobOpeningId', 'interviewerId', 'interviewDate', 'status']
			},

			InterviewUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Interview updated successfully' },
					data: {
						type: 'object',
						properties: {
							candidateId: { type: 'string', description: 'candidateId' },
							jobOpeningId: { type: 'string', description: 'jobOpeningId' },
							interviewerId: { type: 'string', description: 'interviewerId' },
							interviewDate: { type: 'string', format: 'date-time', description: 'interviewDate' },
							feedback: { type: 'string', nullable: true, description: 'feedback' },
							rating: { type: 'integer', nullable: true, description: 'rating' },
							status: { type: 'string', description: 'status' }
						}
					}
				}
			},

			InterviewDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Interview deleted successfully' }
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

export default defaultAreaInterviewSwagger;
