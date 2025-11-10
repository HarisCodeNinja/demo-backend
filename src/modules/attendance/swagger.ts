import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaAttendanceSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Attendance API',
		version: '1.0.0',
		description: 'API documentation for managing attendances in the default-area area.',
	},
	paths: {
		'/api/default-area/attendances': {
			get: {
				summary: 'Get list of attendances (DefaultArea)',
				description: 'Retrieve a paginated list of attendances with default-area access',
				tags: ['DefaultArea - Attendances'],
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
						description: 'Search term for filtering attendances',
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
						name: 'attendanceDate',
						description: 'Filter by attendanceDate',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'checkInTime',
						description: 'Filter by checkInTime',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'checkOutTime',
						description: 'Filter by checkOutTime',
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
						name: 'totalHour',
						description: 'Filter by totalHours',
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
						description: 'List of attendances retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AttendanceListResponse' }
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
				summary: 'Create a new attendance (DefaultArea)',
				description: 'Add a new attendance to the system',
				tags: ['DefaultArea - Attendances'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateAttendanceInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Attendance created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AttendanceCreateResponse' }
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
		'/api/default-area/attendances/{attendanceId}': {
			get: {
				summary: 'Get attendance for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific attendance for editing',
				tags: ['DefaultArea - Attendances'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'attendanceId',
						required: true,
						description: 'ID of the attendance to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Attendance details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AttendanceEditResponse' }
							}
						}
					},
					404: {
						description: 'Attendance not found',
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
				summary: 'Update a attendance (DefaultArea)',
				description: 'Modify an existing attendance in the system',
				tags: ['DefaultArea - Attendances'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'attendanceId',
						required: true,
						description: 'ID of the attendance to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateAttendanceInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Attendance updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AttendanceUpdateResponse' }
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
						description: 'Attendance not found',
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
				summary: 'Delete a attendance (DefaultArea)',
				description: 'Remove a attendance from the system',
				tags: ['DefaultArea - Attendances'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'attendanceId',
						required: true,
						description: 'ID of the attendance to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Attendance deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AttendanceDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Attendance not found',
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
		'/api/default-area/attendances/detail/{attendanceId}': {
			get: {
				summary: 'Get detailed attendance information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific attendance',
				tags: ['DefaultArea - Attendances'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'attendanceId',
						required: true,
						description: 'ID of the attendance to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Attendance details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AttendanceDetailResponse' }
							}
						}
					},
					404: {
						description: 'Attendance not found',
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
			AttendanceListItem: {
				type: 'object',
				properties: {
					attendanceId: { type: 'string', format: 'uuid', description: 'attendanceId' },
					employeeId: { type: 'string', description: 'employeeId' },
					attendanceDate: { type: 'string', format: 'date', description: 'attendanceDate' },
					checkInTime: { type: 'string', format: 'date-time', description: 'checkInTime' },
					checkOutTime: { type: 'string', format: 'date-time', description: 'checkOutTime' },
					status: { type: 'string', description: 'status' },
					totalHour: { type: 'number', description: 'totalHours' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['attendanceId', ' employeeId', ' attendanceDate', ' status', ' createdAt', ' updatedAt']
			},

			AttendanceListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/AttendanceListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of attendances' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			AttendanceDetailResponse: {
				type: 'object',
				properties: {
					attendanceId: { type: 'string', format: 'uuid', description: 'attendanceId' },
					employeeId: { type: 'string', description: 'employeeId' },
					attendanceDate: { type: 'string', format: 'date', description: 'attendanceDate' },
					checkInTime: { type: 'string', format: 'date-time', description: 'checkInTime' },
					checkOutTime: { type: 'string', format: 'date-time', nullable: true, description: 'checkOutTime' },
					status: { type: 'string', description: 'status' },
					totalHour: { type: 'number', nullable: true, description: 'totalHours' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			AttendanceEditResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					attendanceDate: { type: 'string', format: 'date', description: 'attendanceDate' },
					checkInTime: { type: 'string', format: 'date-time', description: 'checkInTime' },
					checkOutTime: { type: 'string', format: 'date-time', nullable: true, description: 'checkOutTime' },
					status: { type: 'string', description: 'status' }
				}
			},

			CreateAttendanceInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					attendanceDate: { type: 'string', format: 'date', description: 'attendanceDate', example: '2024-01-01' },
					checkInTime: { type: 'string', format: 'date-time', description: 'checkInTime', example: '2024-01-01T12:00:00Z' },
					checkOutTime: { type: 'string', format: 'date-time', description: 'checkOutTime', example: '2024-01-01T12:00:00Z' },
					status: { type: 'string', description: 'status', example: 'status Option' }
				},
				required: ['employeeId', 'attendanceDate', 'status']
			},

			AttendanceCreateResponse: {
				type: 'object',
				properties: {
					attendanceId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateAttendanceInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					attendanceDate: { type: 'string', format: 'date', description: 'attendanceDate' },
					checkInTime: { type: 'string', format: 'date-time', description: 'checkInTime' },
					checkOutTime: { type: 'string', format: 'date-time', description: 'checkOutTime' },
					status: { type: 'string', description: 'status' }
				},
				required: ['employeeId', 'attendanceDate', 'status']
			},

			AttendanceUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Attendance updated successfully' },
					data: {
						type: 'object',
						properties: {
							employeeId: { type: 'string', description: 'employeeId' },
							attendanceDate: { type: 'string', format: 'date', description: 'attendanceDate' },
							checkInTime: { type: 'string', format: 'date-time', description: 'checkInTime' },
							checkOutTime: { type: 'string', format: 'date-time', nullable: true, description: 'checkOutTime' },
							status: { type: 'string', description: 'status' }
						}
					}
				}
			},

			AttendanceDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Attendance deleted successfully' }
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

export default defaultAreaAttendanceSwagger;
