import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaDocumentSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea Document API',
		version: '1.0.0',
		description: 'API documentation for managing documents in the default-area area.',
	},
	paths: {
		'/api/default-area/documents': {
			get: {
				summary: 'Get list of documents (DefaultArea)',
				description: 'Retrieve a paginated list of documents with default-area access',
				tags: ['DefaultArea - Documents'],
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
						description: 'Search term for filtering documents',
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
						name: 'documentType',
						description: 'Filter by documentType',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'fileName',
						description: 'Filter by fileName',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'fileUrl',
						description: 'Filter by fileUrl',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'uploadedBy',
						description: 'Filter by uploadedById',
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
						description: 'List of documents retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DocumentListResponse' }
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
				summary: 'Create a new document (DefaultArea)',
				description: 'Add a new document to the system',
				tags: ['DefaultArea - Documents'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateDocumentInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'Document created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DocumentCreateResponse' }
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
		'/api/default-area/documents/{documentId}': {
			get: {
				summary: 'Get document for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific document for editing',
				tags: ['DefaultArea - Documents'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'documentId',
						required: true,
						description: 'ID of the document to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Document details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DocumentEditResponse' }
							}
						}
					},
					404: {
						description: 'Document not found',
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
				summary: 'Update a document (DefaultArea)',
				description: 'Modify an existing document in the system',
				tags: ['DefaultArea - Documents'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'documentId',
						required: true,
						description: 'ID of the document to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateDocumentInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'Document updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DocumentUpdateResponse' }
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
						description: 'Document not found',
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
				summary: 'Delete a document (DefaultArea)',
				description: 'Remove a document from the system',
				tags: ['DefaultArea - Documents'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'documentId',
						required: true,
						description: 'ID of the document to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'Document deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DocumentDeleteResponse' }
							}
						}
					},
					404: {
						description: 'Document not found',
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
		'/api/default-area/documents/detail/{documentId}': {
			get: {
				summary: 'Get detailed document information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific document',
				tags: ['DefaultArea - Documents'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'documentId',
						required: true,
						description: 'ID of the document to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'Document details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/DocumentDetailResponse' }
							}
						}
					},
					404: {
						description: 'Document not found',
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
			DocumentListItem: {
				type: 'object',
				properties: {
					documentId: { type: 'string', format: 'uuid', description: 'documentId' },
					employeeId: { type: 'string', description: 'employeeId' },
					documentType: { type: 'string', description: 'documentType' },
					fileName: { type: 'string', description: 'fileName' },
					fileUrl: { type: 'string', format: 'uri', description: 'fileUrl' },
					uploadedBy: { type: 'string', description: 'uploadedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['documentId', ' employeeId', ' documentType', ' fileName', ' fileUrl', ' uploadedBy', ' createdAt', ' updatedAt']
			},

			DocumentListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/DocumentListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of documents' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			DocumentDetailResponse: {
				type: 'object',
				properties: {
					documentId: { type: 'string', format: 'uuid', description: 'documentId' },
					employeeId: { type: 'string', description: 'employeeId' },
					documentType: { type: 'string', description: 'documentType' },
					fileName: { type: 'string', description: 'fileName' },
					fileUrl: { type: 'string', format: 'uri', description: 'fileUrl' },
					uploadedBy: { type: 'string', description: 'uploadedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			DocumentEditResponse: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					documentType: { type: 'string', description: 'documentType' },
					fileName: { type: 'string', description: 'fileName' },
					fileUrl: { type: 'string', format: 'uri', description: 'fileUrl' }
				}
			},

			CreateDocumentInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					documentType: { type: 'string', description: 'documentType', example: 'Example documentType' },
					fileName: { type: 'string', description: 'fileName', example: 'Example fileName' },
					fileUrl: { type: 'string', format: 'uri', description: 'fileUrl', example: 'https://example.com' }
				},
				required: ['employeeId', 'documentType', 'fileName', 'fileUrl']
			},

			DocumentCreateResponse: {
				type: 'object',
				properties: {
					documentId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateDocumentInput: {
				type: 'object',
				properties: {
					employeeId: { type: 'string', description: 'employeeId' },
					documentType: { type: 'string', description: 'documentType' },
					fileName: { type: 'string', description: 'fileName' },
					fileUrl: { type: 'string', format: 'uri', description: 'fileUrl' }
				},
				required: ['employeeId', 'documentType', 'fileName', 'fileUrl']
			},

			DocumentUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'Document updated successfully' },
					data: {
						type: 'object',
						properties: {
							employeeId: { type: 'string', description: 'employeeId' },
							documentType: { type: 'string', description: 'documentType' },
							fileName: { type: 'string', description: 'fileName' },
							fileUrl: { type: 'string', format: 'uri', description: 'fileUrl' }
						}
					}
				}
			},

			DocumentDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'Document deleted successfully' }
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

export default defaultAreaDocumentSwagger;
