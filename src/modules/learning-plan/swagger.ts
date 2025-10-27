import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaLearningPlanSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea LearningPlan API',
		version: '1.0.0',
		description: 'API documentation for managing learning-plans in the default-area area.',
	},
	paths: {
		'/api/default-area/learning-plans': {
			get: {
				summary: 'Get list of learning-plans (DefaultArea)',
				description: 'Retrieve a paginated list of learning-plans with default-area access',
				tags: ['DefaultArea - LearningPlans'],
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
						description: 'Search term for filtering learning-plans',
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
						name: 'title',
						description: 'Filter by title',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'description',
						description: 'Filter by description',
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
						name: 'status',
						description: 'Filter by status',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'assignedBy',
						description: 'Filter by assignedById',
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
						description: 'List of learning-plans retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LearningPlanListResponse' }
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
				summary: 'Create a new learning-plan (DefaultArea)',
				description: 'Add a new learning-plan to the system',
				tags: ['DefaultArea - LearningPlans'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateLearningPlanInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'LearningPlan created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LearningPlanCreateResponse' }
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
		'/api/default-area/learning-plans/{learningPlanId}': {
			get: {
				summary: 'Get learning-plan for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific learning-plan for editing',
				tags: ['DefaultArea - LearningPlans'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'learningPlanId',
						required: true,
						description: 'ID of the learning-plan to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'LearningPlan details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LearningPlanEditResponse' }
							}
						}
					},
					404: {
						description: 'LearningPlan not found',
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
				summary: 'Update a learning-plan (DefaultArea)',
				description: 'Modify an existing learning-plan in the system',
				tags: ['DefaultArea - LearningPlans'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'learningPlanId',
						required: true,
						description: 'ID of the learning-plan to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateLearningPlanInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'LearningPlan updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LearningPlanUpdateResponse' }
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
						description: 'LearningPlan not found',
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
				summary: 'Delete a learning-plan (DefaultArea)',
				description: 'Remove a learning-plan from the system',
				tags: ['DefaultArea - LearningPlans'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'learningPlanId',
						required: true,
						description: 'ID of the learning-plan to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'LearningPlan deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LearningPlanDeleteResponse' }
							}
						}
					},
					404: {
						description: 'LearningPlan not found',
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
		'/api/default-area/learning-plans/detail/{learningPlanId}': {
			get: {
				summary: 'Get detailed learning-plan information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific learning-plan',
				tags: ['DefaultArea - LearningPlans'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'learningPlanId',
						required: true,
						description: 'ID of the learning-plan to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'LearningPlan details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LearningPlanDetailResponse' }
							}
						}
					},
					404: {
						description: 'LearningPlan not found',
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
			LearningPlanListItem: {
				type: 'object',
				properties: {
					learningPlanId: { type: 'string', format: 'uuid', description: 'learningPlanId' },
					employeeId: { type: 'string', description: 'employeeId' },
					title: { type: 'string', description: 'title' },
					description: { type: 'string', description: 'description' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					status: { type: 'string', description: 'status' },
					assignedBy: { type: 'string', description: 'assignedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['learningPlanId', ' employeeId', ' title', ' startDate', ' endDate', ' status', ' assignedBy', ' createdAt', ' updatedAt']
			},

			LearningPlanListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/LearningPlanListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of learning-plans' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			LearningPlanDetailResponse: {
				type: 'object',
				properties: {
					learningPlanId: { type: 'string', format: 'uuid', description: 'learningPlanId' },
					employeeId: { type: 'string', description: 'employeeId' },
					title: { type: 'string', description: 'title' },
					description: { type: 'string', nullable: true, description: 'description' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					status: { type: 'string', description: 'status' },
					assignedBy: { type: 'string', description: 'assignedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			LearningPlanEditResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					title: { type: 'string', description: 'title' },
					description: { type: 'string', nullable: true, description: 'description' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					status: { type: 'string', description: 'status' }
				}
			},

			CreateLearningPlanInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					title: { type: 'string', description: 'title', example: 'Example title' },
					description: { type: 'string', description: 'description' },
					startDate: { type: 'string', format: 'date', description: 'startDate', example: '2024-01-01' },
					endDate: { type: 'string', format: 'date', description: 'endDate', example: '2024-01-01' },
					status: { type: 'string', description: 'status', example: 'status Option' }
				},
				required: ['employeeId', 'title', 'startDate', 'endDate', 'status']
			},

			LearningPlanCreateResponse: {
				type: 'object',
				properties: {
					learningPlanId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateLearningPlanInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					title: { type: 'string', description: 'title' },
					description: { type: 'string', description: 'description' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					status: { type: 'string', description: 'status' }
				},
				required: ['employeeId', 'title', 'startDate', 'endDate', 'status']
			},

			LearningPlanUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'LearningPlan updated successfully' },
					data: {
						type: 'object',
						properties: {
							employeeId: { type: 'string', description: 'employeeId' },
							title: { type: 'string', description: 'title' },
							description: { type: 'string', nullable: true, description: 'description' },
							startDate: { type: 'string', format: 'date', description: 'startDate' },
							endDate: { type: 'string', format: 'date', description: 'endDate' },
							status: { type: 'string', description: 'status' }
						}
					}
				}
			},

			LearningPlanDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'LearningPlan deleted successfully' }
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

export default defaultAreaLearningPlanSwagger;
