import { SwaggerDefinition } from 'swagger-jsdoc';

const defaultAreaOfferLetterSwagger: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'DefaultArea OfferLetter API',
		version: '1.0.0',
		description: 'API documentation for managing offer-letters in the default-area area.',
	},
	paths: {
		'/api/default-area/offer-letters': {
			get: {
				summary: 'Get list of offer-letters (DefaultArea)',
				description: 'Retrieve a paginated list of offer-letters with default-area access',
				tags: ['DefaultArea - OfferLetters'],
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
						description: 'Search term for filtering offer-letters',
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
						name: 'salaryOffered',
						description: 'Filter by salaryOffered',
						schema: { type: 'number' }
					},
					{
						in: 'query',
						name: 'joiningDate',
						description: 'Filter by joiningDate',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'termsAndCondition',
						description: 'Filter by termsAndConditions',
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
						name: 'issuedBy',
						description: 'Filter by issuedById',
						schema: { type: 'string' }
					},
					{
						in: 'query',
						name: 'approvedBy',
						description: 'Filter by approvedById',
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
						description: 'List of offer-letters retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/OfferLetterListResponse' }
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
				summary: 'Create a new offer-letter (DefaultArea)',
				description: 'Add a new offer-letter to the system',
				tags: ['DefaultArea - OfferLetters'],
				security: [{ bearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/CreateOfferLetterInput' }
						}
					}
				},
				responses: {
					201: {
						description: 'OfferLetter created successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/OfferLetterCreateResponse' }
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
		'/api/default-area/offer-letters/{offerLetterId}': {
			get: {
				summary: 'Get offer-letter for editing (DefaultArea)',
				description: 'Retrieve detailed information about a specific offer-letter for editing',
				tags: ['DefaultArea - OfferLetters'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'offerLetterId',
						required: true,
						description: 'ID of the offer-letter to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'OfferLetter details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/OfferLetterEditResponse' }
							}
						}
					},
					404: {
						description: 'OfferLetter not found',
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
				summary: 'Update a offer-letter (DefaultArea)',
				description: 'Modify an existing offer-letter in the system',
				tags: ['DefaultArea - OfferLetters'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'offerLetterId',
						required: true,
						description: 'ID of the offer-letter to update',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/UpdateOfferLetterInput' }
						}
					}
				},
				responses: {
					200: {
						description: 'OfferLetter updated successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/OfferLetterUpdateResponse' }
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
						description: 'OfferLetter not found',
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
				summary: 'Delete a offer-letter (DefaultArea)',
				description: 'Remove a offer-letter from the system',
				tags: ['DefaultArea - OfferLetters'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'offerLetterId',
						required: true,
						description: 'ID of the offer-letter to delete',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					202: {
						description: 'OfferLetter deletion accepted',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/OfferLetterDeleteResponse' }
							}
						}
					},
					404: {
						description: 'OfferLetter not found',
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
		'/api/default-area/offer-letters/detail/{offerLetterId}': {
			get: {
				summary: 'Get detailed offer-letter information (DefaultArea)',
				description: 'Retrieve comprehensive details about a specific offer-letter',
				tags: ['DefaultArea - OfferLetters'],
				security: [{ bearerAuth: [] }],
				parameters: [
					{
						in: 'path',
						name: 'offerLetterId',
						required: true,
						description: 'ID of the offer-letter to retrieve',
						schema: { type: 'string', format: 'uuid' }
					}
				],
				responses: {
					200: {
						description: 'OfferLetter details retrieved successfully',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/OfferLetterDetailResponse' }
							}
						}
					},
					404: {
						description: 'OfferLetter not found',
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
			OfferLetterListItem: {
				type: 'object',
				properties: {
					offerLetterId: { type: 'string', format: 'uuid', description: 'offerLetterId' },
					candidateId: { type: 'string', description: 'candidateId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					salaryOffered: { type: 'number', description: 'salaryOffered' },
					joiningDate: { type: 'string', format: 'date', description: 'joiningDate' },
					termsAndCondition: { type: 'string', description: 'termsAndConditions' },
					status: { type: 'string', description: 'status' },
					issuedBy: { type: 'string', description: 'issuedById' },
					approvedBy: { type: 'string', description: 'approvedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				},
				required: ['offerLetterId', ' candidateId', ' jobOpeningId', ' salaryOffered', ' joiningDate', ' status', ' issuedBy', ' createdAt', ' updatedAt']
			},

			OfferLetterListResponse: {
				type: 'object',
				properties: {
					data: {
						type: 'array',
						items: { $ref: '#/components/schemas/OfferLetterListItem' }
					},
					meta: {
						type: 'object',
						properties: {
							total: { type: 'integer', description: 'Total number of offer-letters' },
							page: { type: 'integer', description: 'Current page number' },
							pageSize: { type: 'integer', description: 'Number of items per page' }
						}
					}
				},
				required: ['data', 'meta']
			},

			OfferLetterDetailResponse: {
				type: 'object',
				properties: {
					offerLetterId: { type: 'string', format: 'uuid', description: 'offerLetterId' },
					candidateId: { type: 'string', description: 'candidateId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					salaryOffered: { type: 'number', description: 'salaryOffered' },
					joiningDate: { type: 'string', format: 'date', description: 'joiningDate' },
					termsAndCondition: { type: 'string', nullable: true, description: 'termsAndConditions' },
					status: { type: 'string', description: 'status' },
					issuedBy: { type: 'string', description: 'issuedById' },
					approvedBy: { type: 'string', nullable: true, description: 'approvedById' },
					createdAt: { type: 'string', format: 'date-time', description: 'createdAt' },
					updatedAt: { type: 'string', format: 'date-time', description: 'updatedAt' }
				}
			},

			OfferLetterEditResponse: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', description: 'candidateId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					salaryOffered: { type: 'number', description: 'salaryOffered' },
					joiningDate: { type: 'string', format: 'date', description: 'joiningDate' },
					termsAndCondition: { type: 'string', nullable: true, description: 'termsAndConditions' },
					status: { type: 'string', description: 'status' },
					approvedBy: { type: 'string', nullable: true, description: 'approvedById' }
				}
			},

			CreateOfferLetterInput: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', description: 'candidateId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					salaryOffered: { type: 'number', description: 'salaryOffered', example: 99.99 },
					joiningDate: { type: 'string', format: 'date', description: 'joiningDate', example: '2024-01-01' },
					termsAndCondition: { type: 'string', description: 'termsAndConditions' },
					status: { type: 'string', description: 'status', example: 'status Option' },
					approvedBy: { type: 'string', description: 'approvedById' }
				},
				required: ['candidateId', 'jobOpeningId', 'salaryOffered', 'joiningDate', 'status']
			},

			OfferLetterCreateResponse: {
				type: 'object',
				properties: {
					offerLetterId: { type: 'string', format: 'uuid' }
				}
			},

			UpdateOfferLetterInput: {
				type: 'object',
				properties: {
					candidateId: { type: 'string', description: 'candidateId' },
					jobOpeningId: { type: 'string', description: 'jobOpeningId' },
					salaryOffered: { type: 'number', description: 'salaryOffered' },
					joiningDate: { type: 'string', format: 'date', description: 'joiningDate' },
					termsAndCondition: { type: 'string', description: 'termsAndConditions' },
					status: { type: 'string', description: 'status' },
					approvedBy: { type: 'string', description: 'approvedById' }
				},
				required: ['candidateId', 'jobOpeningId', 'salaryOffered', 'joiningDate', 'status']
			},

			OfferLetterUpdateResponse: {
				type: 'object',
				properties: {
					message: { type: 'string', example: 'OfferLetter updated successfully' },
					data: {
						type: 'object',
						properties: {
							candidateId: { type: 'string', description: 'candidateId' },
							jobOpeningId: { type: 'string', description: 'jobOpeningId' },
							salaryOffered: { type: 'number', description: 'salaryOffered' },
							joiningDate: { type: 'string', format: 'date', description: 'joiningDate' },
							termsAndCondition: { type: 'string', nullable: true, description: 'termsAndConditions' },
							status: { type: 'string', description: 'status' },
							approvedBy: { type: 'string', nullable: true, description: 'approvedById' }
						}
					}
				}
			},

			OfferLetterDeleteResponse: {
				type: 'object',
				properties: {
					messageCode: { type: 'string' },
					message: { type: 'string', example: 'OfferLetter deleted successfully' }
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

export default defaultAreaOfferLetterSwagger;
