import { Application } from 'express';
import swaggerJsdoc, { SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

// Swagger imports
import { default as authUserSwagger } from '../modules/user-auth/swagger';
import { default as attendanceSwagger } from '../modules/attendance/swagger';
import { default as auditLogSwagger } from '../modules/audit-log/swagger';
import { default as candidateSwagger } from '../modules/candidate/swagger';
import { default as candidateSkillSwagger } from '../modules/candidate-skill/swagger';
import { default as competencySwagger } from '../modules/competency/swagger';
import { default as departmentSwagger } from '../modules/department/swagger';
import { default as designationSwagger } from '../modules/designation/swagger';
import { default as documentSwagger } from '../modules/document/swagger';
import { default as employeeCompetencySwagger } from '../modules/employee-competency/swagger';
import { default as employeeSwagger } from '../modules/employee/swagger';
import { default as goalSwagger } from '../modules/goal/swagger';
import { default as interviewSwagger } from '../modules/interview/swagger';
import { default as jobLevelSwagger } from '../modules/job-level/swagger';
import { default as jobOpeningSwagger } from '../modules/job-opening/swagger';
import { default as jobOpeningSkillSwagger } from '../modules/job-opening-skill/swagger';
import { default as learningPlanSwagger } from '../modules/learning-plan/swagger';
import { default as leaveApplicationSwagger } from '../modules/leave-application/swagger';
import { default as leaveTypeSwagger } from '../modules/leave-type/swagger';
import { default as locationSwagger } from '../modules/location/swagger';
import { default as offerLetterSwagger } from '../modules/offer-letter/swagger';
import { default as payslipSwagger } from '../modules/payslip/swagger';
import { default as performanceReviewSwagger } from '../modules/performance-review/swagger';
import { default as roleCompetencySwagger } from '../modules/role-competency/swagger';
import { default as salaryStructureSwagger } from '../modules/salary-structure/swagger';
import { default as skillSwagger } from '../modules/skill/swagger';
import { default as userSwagger } from '../modules/user/swagger';

const mergeSwaggerConfigurations = (): SwaggerDefinition => {
  const allConfigs = [
    authUserSwagger,
		attendanceSwagger,
		auditLogSwagger,
		candidateSwagger,
		candidateSkillSwagger,
		competencySwagger,
		departmentSwagger,
		designationSwagger,
		documentSwagger,
		employeeCompetencySwagger,
		employeeSwagger,
		goalSwagger,
		interviewSwagger,
		jobLevelSwagger,
		jobOpeningSwagger,
		jobOpeningSkillSwagger,
		learningPlanSwagger,
		leaveApplicationSwagger,
		leaveTypeSwagger,
		locationSwagger,
		offerLetterSwagger,
		payslipSwagger,
		performanceReviewSwagger,
		roleCompetencySwagger,
		salaryStructureSwagger,
		skillSwagger,
		userSwagger
  ];

  // Merge all paths
  const mergedPaths = {};
  const mergedSchemas = {};

  allConfigs.forEach(config => {
    if (config.paths) {
      Object.assign(mergedPaths, config.paths);
    }
    if (config.components?.schemas) {
      Object.assign(mergedSchemas, config.components.schemas);
    }
  });

  // Create the merged configuration
  const mergedConfig: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'undefined API Documentation',
      version: '1.0.0',
      description: 'Comprehensive API documentation for the undefined application.',
      contact: {
        name: 'API Support',
        email: 'support@sample.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
        description: 'Development server',
      }
    ],
    tags: [],
    paths: mergedPaths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        },
      },
      schemas: mergedSchemas,
    },
    security: [{ bearerAuth: [] }],
  };

  return mergedConfig;
};

// Get the merged swagger configuration from separate files
const mergedSwaggerDefinition = mergeSwaggerConfigurations();

const options = {
  definition: mergedSwaggerDefinition,
  apis: ['./src/controller/*.ts', './src/areas/**/controller/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
  app.use('/documentation', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin-bottom: 20px }
      .swagger-ui .scheme-container { background: #fafafa; padding: 15px; border-radius: 4px; margin-bottom: 20px }
    `,
    customSiteTitle: 'API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
    },
  }));

  // Add a JSON endpoint for the swagger definition
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};