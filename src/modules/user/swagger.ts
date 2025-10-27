import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaUserSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea User API',
		version: '1.0.0',
		description: 'API documentation for managing users in the default-area area.',
	},
	paths: {
		'/api/default-area/users': {
			get: {
				summary: 'Get list of users (DefaultArea)',
				description: 'Retrieve a paginated list of users with default-area access',
				tags: ['DefaultArea - Users'],
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
						description: 'Search term for filtering users',
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
						name: 'username',
						description: 'Filter by username',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'password',
						description: 'Filter by password',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'role',
						description: 'Filter by role',
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
						description: 'List of users retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/UserListResponse' }
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
				summary: 'Create a new user (DefaultArea)',
				description: 'Add a new user to the system',
				tags: ['DefaultArea - Users'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateUserInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'User created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/UserCreateResponse' }
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
		'/api/default-area/users/select': {
			get: {
				summary: 'Get users for selection dropdown (DefaultArea)',
				description: 'Retrieve a simplified list of users for dropdown selection purposes',
				tags: ['DefaultArea - Users'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'query',
						name: 'search',
						description: 'Search term for filtering users',
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
						description: 'User selection list retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/UserSelectResponse' }
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
		'/api/default-area/users/{userId}': {
			get: {
				summary: 'Get user for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific user for editing',
				tags: ['DefaultArea - Users'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'userId',
						required: true,
						description: 'ID of the user to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'User details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/UserEditResponse' }
							}
						}
					},
					404: {
						description: 'User not found',
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
				summary: 'Update a user (DefaultArea)',
				description: 'Modify an existing user in the system',
				tags: ['DefaultArea - Users'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'userId',
						required: true,
						description: 'ID of the user to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateUserInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'User updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/UserUpdateResponse' }
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
						description: 'User not found',
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
				summary: 'Delete a user (DefaultArea)',
				description: 'Remove a user from the system',
				tags: ['DefaultArea - Users'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'userId',
						required: true,
						description: 'ID of the user to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'User deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/UserDeleteResponse' }
							}
						}
					},
					404: {
						description: 'User not found',
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
		'/api/default-area/users/detail/{userId}': {
			get: {
				summary: 'Get detailed user information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific user',
				tags: ['DefaultArea - Users'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'userId',
						required: true,
						description: 'ID of the user to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'User details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/UserDetailResponse' }
							}
						}
					},
					404: {
						description: 'User not found',
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
			UserListItem: {
				type: 'object',
				properties: {
					userId: { type: 'string', format: 'uuid', description: 'userId' },
					email: { type: 'string', format: 'email', description: 'email' },
					username: { type: 'string', description: 'username' },
					password: { type: 'string', format: 'password', description: 'password' },
					role: { type: 'string', description: 'role' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['userId', ' email', ' username', ' password', ' role', ' createdAt', ' updatedAt']
			},

			UserListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/UserListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of users' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			UserSelectItem: {
				type: 'object',
				properties: {
					value: { type: 'string', format: 'uuid', description: 'Unique user identifier'},
					label: { type: 'string', format: 'email', description: 'User display label'}
				},
				required: ['value', ' label']
			},

			UserSelectResponse: {
				type: 'array',
				items: { $ref: '#/components/schemas/UserSelectItem' }
			},

			UserDetailResponse: {
				type: 'object',
				properties: {
					userId: { type: 'string', format: 'uuid', description: 'userId' },
					email: { type: 'string', format: 'email', description: 'email' },
					username: { type: 'string', description: 'username' },
					password: { type: 'string', format: 'password', description: 'password' },
					role: { type: 'string', description: 'role' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			UserEditResponse: {
				type: 'object',
				properties: {
					email: { type: 'string', format: 'email', description: 'email' },
					username: { type: 'string', description: 'username' },
					password: { type: 'string', format: 'password', description: 'password' },
					role: { type: 'string', description: 'role' }
				}
			},

			CreateUserInput: {
				type: 'object',
				properties: {
					email: { type: 'string', format: 'email', description: 'email', example: 'user@example.com' },
					username: { type: 'string', description: 'username', example: 'Example username' },
					password: { type: 'string', format: 'password', description: 'password', example: 'Example password' },
					role: { type: 'string', description: 'role', example: 'role Option' }
				},
				required: ['email', 'username', 'password', 'role']
			},

			UserCreateResponse: {
				type: 'object',
				properties: {
					userId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateUserInput: {
				type: 'object',
				properties: {
					email: { type: 'string', format: 'email', description: 'email' },
					username: { type: 'string', description: 'username' },
					password: { type: 'string', format: 'password', description: 'password' },
					role: { type: 'string', description: 'role' }
				},
				required: ['email', 'username', 'password', 'role']
			},

			UserUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'User updated successfully' },
					data: {
						type: 'object',
						properties: {
							email: { type: 'string', format: 'email', description: 'email' },
							username: { type: 'string', description: 'username' },
							password: { type: 'string', format: 'password', description: 'password' },
							role: { type: 'string', description: 'role' }
						}
					}
				}
			},

			UserDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'User deleted successfully' }
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

export default defaultAreaUserSwagger;
