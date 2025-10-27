import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaPerformanceReviewSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea PerformanceReview API',
		version: '1.0.0',
		description: 'API documentation for managing performance-reviews in the default-area area.',
	},
	paths: {
		'/api/default-area/performance-reviews': {
			get: {
				summary: 'Get list of performance-reviews (DefaultArea)',
				description: 'Retrieve a paginated list of performance-reviews with default-area access',
				tags: ['DefaultArea - PerformanceReviews'],
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
						description: 'Search term for filtering performance-reviews',
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
						name: 'reviewerId',
						description: 'Filter by reviewerId',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'reviewPeriod',
						description: 'Filter by reviewPeriod',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'reviewDate',
						description: 'Filter by reviewDate',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'selfAssessment',
						description: 'Filter by selfAssessment',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'managerFeedback',
						description: 'Filter by managerFeedback',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'overallRating',
						description: 'Filter by overallRating',
						schema: { type: 'integer' }
					},
					{
						in: 'query',
						name: 'recommendation',
						description: 'Filter by recommendations',
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
						description: 'List of performance-reviews retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PerformanceReviewListResponse' }
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
				summary: 'Create a new performance-review (DefaultArea)',
				description: 'Add a new performance-review to the system',
				tags: ['DefaultArea - PerformanceReviews'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreatePerformanceReviewInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'PerformanceReview created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PerformanceReviewCreateResponse' }
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
		'/api/default-area/performance-reviews/{performanceReviewId}': {
			get: {
				summary: 'Get performance-review for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific performance-review for editing',
				tags: ['DefaultArea - PerformanceReviews'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'performanceReviewId',
						required: true,
						description: 'ID of the performance-review to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'PerformanceReview details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PerformanceReviewEditResponse' }
							}
						}
					},
					404: {
						description: 'PerformanceReview not found',
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
				summary: 'Update a performance-review (DefaultArea)',
				description: 'Modify an existing performance-review in the system',
				tags: ['DefaultArea - PerformanceReviews'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'performanceReviewId',
						required: true,
						description: 'ID of the performance-review to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdatePerformanceReviewInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'PerformanceReview updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PerformanceReviewUpdateResponse' }
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
						description: 'PerformanceReview not found',
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
				summary: 'Delete a performance-review (DefaultArea)',
				description: 'Remove a performance-review from the system',
				tags: ['DefaultArea - PerformanceReviews'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'performanceReviewId',
						required: true,
						description: 'ID of the performance-review to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'PerformanceReview deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PerformanceReviewDeleteResponse' }
							}
						}
					},
					404: {
						description: 'PerformanceReview not found',
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
		'/api/default-area/performance-reviews/detail/{performanceReviewId}': {
			get: {
				summary: 'Get detailed performance-review information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific performance-review',
				tags: ['DefaultArea - PerformanceReviews'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'performanceReviewId',
						required: true,
						description: 'ID of the performance-review to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'PerformanceReview details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/PerformanceReviewDetailResponse' }
							}
						}
					},
					404: {
						description: 'PerformanceReview not found',
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
			PerformanceReviewListItem: {
				type: 'object',
				properties: {
					performanceReviewId: { type: 'string', format: 'uuid', description: 'performanceReviewId' },
					employeeId: { type: 'string', description: 'employeeId' },
					reviewerId: { type: 'string', description: 'reviewerId' },
					reviewPeriod: { type: 'string', description: 'reviewPeriod' },
					reviewDate: { type: 'string', format: 'date', description: 'reviewDate' },
					selfAssessment: { type: 'string', description: 'selfAssessment' },
					managerFeedback: { type: 'string', description: 'managerFeedback' },
					overallRating: { type: 'integer', description: 'overallRating' },
					recommendation: { type: 'string', description: 'recommendations' },
					status: { type: 'string', description: 'status' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['performanceReviewId', ' employeeId', ' reviewerId', ' reviewPeriod', ' reviewDate', ' status', ' createdAt', ' updatedAt']
			},

			PerformanceReviewListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/PerformanceReviewListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of performance-reviews' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			PerformanceReviewDetailResponse: {
				type: 'object',
				properties: {
					performanceReviewId: { type: 'string', format: 'uuid', description: 'performanceReviewId' },
					employeeId: { type: 'string', description: 'employeeId' },
					reviewerId: { type: 'string', description: 'reviewerId' },
					reviewPeriod: { type: 'string', description: 'reviewPeriod' },
					reviewDate: { type: 'string', format: 'date', description: 'reviewDate' },
					selfAssessment: { type: 'string', nullable: true, description: 'selfAssessment' },
					managerFeedback: { type: 'string', nullable: true, description: 'managerFeedback' },
					overallRating: { type: 'integer', nullable: true, description: 'overallRating' },
					recommendation: { type: 'string', nullable: true, description: 'recommendations' },
					status: { type: 'string', description: 'status' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			PerformanceReviewEditResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					reviewerId: { type: 'string', description: 'reviewerId' },
					reviewPeriod: { type: 'string', description: 'reviewPeriod' },
					reviewDate: { type: 'string', format: 'date', description: 'reviewDate' },
					selfAssessment: { type: 'string', nullable: true, description: 'selfAssessment' },
					managerFeedback: { type: 'string', nullable: true, description: 'managerFeedback' },
					overallRating: { type: 'integer', nullable: true, description: 'overallRating' },
					recommendation: { type: 'string', nullable: true, description: 'recommendations' },
					status: { type: 'string', description: 'status' }
				}
			},

			CreatePerformanceReviewInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					reviewerId: { type: 'string', description: 'reviewerId' },
					reviewPeriod: { type: 'string', description: 'reviewPeriod', example: 'Example reviewPeriod' },
					reviewDate: { type: 'string', format: 'date', description: 'reviewDate', example: '2024-01-01' },
					selfAssessment: { type: 'string', description: 'selfAssessment' },
					managerFeedback: { type: 'string', description: 'managerFeedback' },
					overallRating: { type: 'integer', description: 'overallRating', example: 123 },
					recommendation: { type: 'string', description: 'recommendations' },
					status: { type: 'string', description: 'status', example: 'status Option' }
				},
				required: ['employeeId', 'reviewerId', 'reviewPeriod', 'reviewDate', 'status']
			},

			PerformanceReviewCreateResponse: {
				type: 'object',
				properties: {
					performanceReviewId: { type: 'string', format: 'uuid' }
				}
			},

			UpdatePerformanceReviewInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					reviewerId: { type: 'string', description: 'reviewerId' },
					reviewPeriod: { type: 'string', description: 'reviewPeriod' },
					reviewDate: { type: 'string', format: 'date', description: 'reviewDate' },
					selfAssessment: { type: 'string', description: 'selfAssessment' },
					managerFeedback: { type: 'string', description: 'managerFeedback' },
					overallRating: { type: 'integer', description: 'overallRating' },
					recommendation: { type: 'string', description: 'recommendations' },
					status: { type: 'string', description: 'status' }
				},
				required: ['employeeId', 'reviewerId', 'reviewPeriod', 'reviewDate', 'status']
			},

			PerformanceReviewUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'PerformanceReview updated successfully' },
					data: {
						type: 'object',
						properties: {
							employeeId: { type: 'string', description: 'employeeId' },
							reviewerId: { type: 'string', description: 'reviewerId' },
							reviewPeriod: { type: 'string', description: 'reviewPeriod' },
							reviewDate: { type: 'string', format: 'date', description: 'reviewDate' },
							selfAssessment: { type: 'string', nullable: true, description: 'selfAssessment' },
							managerFeedback: { type: 'string', nullable: true, description: 'managerFeedback' },
							overallRating: { type: 'integer', nullable: true, description: 'overallRating' },
							recommendation: { type: 'string', nullable: true, description: 'recommendations' },
							status: { type: 'string', description: 'status' }
						}
					}
				}
			},

			PerformanceReviewDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'PerformanceReview deleted successfully' }
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

export default defaultAreaPerformanceReviewSwagger;
