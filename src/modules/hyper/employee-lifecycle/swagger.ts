/**
 * @swagger
 * tags:
 *   name: HYPER - Employee Lifecycle
 *   description: Employee lifecycle monitoring and management intelligence endpoints
 */

/**
 * @swagger
 * /hyper/employee-lifecycle/missing-documents:
 *   get:
 *     summary: Get employees with missing documents
 *     description: Returns list of employees who have not uploaded required documents
 *     tags: [HYPER - Employee Lifecycle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by department ID
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Number of days to look back
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of employees with missing documents
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /hyper/employee-lifecycle/incomplete-onboarding:
 *   get:
 *     summary: Get employees with incomplete onboarding
 *     description: Returns employees who haven't completed onboarding tasks
 *     tags: [HYPER - Employee Lifecycle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days since joining
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of employees with incomplete onboarding
 */

/**
 * @swagger
 * /hyper/employee-lifecycle/department-changes:
 *   get:
 *     summary: Get department change history
 *     description: Returns recent department changes and pending change requests
 *     tags: [HYPER - Employee Lifecycle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: List of department changes
 */

/**
 * @swagger
 * /hyper/employee-lifecycle/role-mismatches:
 *   get:
 *     summary: Detect role/data mismatches
 *     description: Identifies discrepancies between HRM and Payroll data
 *     tags: [HYPER - Employee Lifecycle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of role mismatches
 */

/**
 * @swagger
 * /hyper/employee-lifecycle/pending-verifications:
 *   get:
 *     summary: Get items pending verification
 *     description: Returns documents and credentials awaiting verification
 *     tags: [HYPER - Employee Lifecycle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of items pending verification
 */

/**
 * @swagger
 * /hyper/employee-lifecycle/new-hires-summary:
 *   get:
 *     summary: Get new hires summary
 *     description: Returns summary of recent hires and their onboarding status
 *     tags: [HYPER - Employee Lifecycle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Summary of new hires
 */

/**
 * @swagger
 * /hyper/employee-lifecycle/offboarding-checklist:
 *   get:
 *     summary: Get offboarding checklist
 *     description: Returns offboarding tasks for exiting employees
 *     tags: [HYPER - Employee Lifecycle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Offboarding checklist items
 */
