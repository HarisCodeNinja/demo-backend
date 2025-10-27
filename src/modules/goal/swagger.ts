import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaGoalSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Goal API',
		version: '1.0.0',
		description: 'API documentation for managing goals in the default-area area.',
	},
	paths: {
		'/api/default-area/goals': {
			get: {
				summary: 'Get list of goals (DefaultArea)',
				description: 'Retrieve a paginated list of goals with default-area access',
				tags: ['DefaultArea - Goals'],
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
						description: 'Search term for filtering goals',
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
						name: 'kpi',
						description: 'Filter by kpis',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'period',
						description: 'Filter by period',
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
						description: 'List of goals retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/GoalListResponse' }
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
				summary: 'Create a new goal (DefaultArea)',
				description: 'Add a new goal to the system',
				tags: ['DefaultArea - Goals'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateGoalInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Goal created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/GoalCreateResponse' }
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
		'/api/default-area/goals/{goalId}': {
			get: {
				summary: 'Get goal for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific goal for editing',
				tags: ['DefaultArea - Goals'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'goalId',
						required: true,
						description: 'ID of the goal to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Goal details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/GoalEditResponse' }
							}
						}
					},
					404: {
						description: 'Goal not found',
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
				summary: 'Update a goal (DefaultArea)',
				description: 'Modify an existing goal in the system',
				tags: ['DefaultArea - Goals'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'goalId',
						required: true,
						description: 'ID of the goal to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateGoalInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Goal updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/GoalUpdateResponse' }
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
						description: 'Goal not found',
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
				summary: 'Delete a goal (DefaultArea)',
				description: 'Remove a goal from the system',
				tags: ['DefaultArea - Goals'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'goalId',
						required: true,
						description: 'ID of the goal to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Goal deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/GoalDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Goal not found',
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
		'/api/default-area/goals/detail/{goalId}': {
			get: {
				summary: 'Get detailed goal information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific goal',
				tags: ['DefaultArea - Goals'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'goalId',
						required: true,
						description: 'ID of the goal to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Goal details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/GoalDetailResponse' }
							}
						}
					},
					404: {
						description: 'Goal not found',
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
			GoalListItem: {
				type: 'object',
				properties: {
					goalId: { type: 'string', format: 'uuid', description: 'goalId' },
					employeeId: { type: 'string', description: 'employeeId' },
					title: { type: 'string', description: 'title' },
					description: { type: 'string', description: 'description' },
					kpi: { type: 'string', description: 'kpis' },
					period: { type: 'string', description: 'period' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					status: { type: 'string', description: 'status' },
					assignedBy: { type: 'string', description: 'assignedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['goalId', ' employeeId', ' title', ' period', ' startDate', ' endDate', ' status', ' assignedBy', ' createdAt', ' updatedAt']
			},

			GoalListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/GoalListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of goals' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			GoalDetailResponse: {
				type: 'object',
				properties: {
					goalId: { type: 'string', format: 'uuid', description: 'goalId' },
					employeeId: { type: 'string', description: 'employeeId' },
					title: { type: 'string', description: 'title' },
					description: { type: 'string', nullable: true, description: 'description' },
					kpi: { type: 'string', nullable: true, description: 'kpis' },
					period: { type: 'string', description: 'period' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					status: { type: 'string', description: 'status' },
					assignedBy: { type: 'string', description: 'assignedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			GoalEditResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					title: { type: 'string', description: 'title' },
					description: { type: 'string', nullable: true, description: 'description' },
					kpi: { type: 'string', nullable: true, description: 'kpis' },
					period: { type: 'string', description: 'period' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					status: { type: 'string', description: 'status' }
				}
			},

			CreateGoalInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					title: { type: 'string', description: 'title', example: 'Example title' },
					description: { type: 'string', description: 'description' },
					kpi: { type: 'string', description: 'kpis' },
					period: { type: 'string', description: 'period', example: 'Example period' },
					startDate: { type: 'string', format: 'date', description: 'startDate', example: '2024-01-01' },
					endDate: { type: 'string', format: 'date', description: 'endDate', example: '2024-01-01' },
					status: { type: 'string', description: 'status', example: 'status Option' }
				},
				required: ['employeeId', 'title', 'period', 'startDate', 'endDate', 'status']
			},

			GoalCreateResponse: {
				type: 'object',
				properties: {
					goalId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateGoalInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					title: { type: 'string', description: 'title' },
					description: { type: 'string', description: 'description' },
					kpi: { type: 'string', description: 'kpis' },
					period: { type: 'string', description: 'period' },
					startDate: { type: 'string', format: 'date', description: 'startDate' },
					endDate: { type: 'string', format: 'date', description: 'endDate' },
					status: { type: 'string', description: 'status' }
				},
				required: ['employeeId', 'title', 'period', 'startDate', 'endDate', 'status']
			},

			GoalUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Goal updated successfully' },
					data: {
						type: 'object',
						properties: {
							employeeId: { type: 'string', description: 'employeeId' },
							title: { type: 'string', description: 'title' },
							description: { type: 'string', nullable: true, description: 'description' },
							kpi: { type: 'string', nullable: true, description: 'kpis' },
							period: { type: 'string', description: 'period' },
							startDate: { type: 'string', format: 'date', description: 'startDate' },
							endDate: { type: 'string', format: 'date', description: 'endDate' },
							status: { type: 'string', description: 'status' }
						}
					}
				}
			},

			GoalDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Goal deleted successfully' }
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

export default defaultAreaGoalSwagger;
