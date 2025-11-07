/**
 * @swagger
 * tags:
 *   name: HYPER - Conversational Dashboard
 *   description: Quick access conversational queries for HR dashboard
 */

/**
 * @swagger
 * /hyper/dashboard/headcount-distribution:
 *   get:
 *     summary: Get headcount distribution
 *     description: Returns employee distribution by department, designation, and location
 *     tags: [HYPER - Conversational Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Headcount distribution across various dimensions
 */

/**
 * @swagger
 * /hyper/dashboard/open-positions:
 *   get:
 *     summary: Get open positions
 *     description: Returns all open job positions with applicant counts
 *     tags: [HYPER - Conversational Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: List of open positions with urgency indicators
 */

/**
 * @swagger
 * /hyper/dashboard/recent-hires:
 *   get:
 *     summary: Get recent hires
 *     description: Returns recently joined employees with onboarding status
 *     tags: [HYPER - Conversational Dashboard]
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
 *         description: List of recent hires
 */

/**
 * @swagger
 * /hyper/dashboard/department-summary/{departmentId}:
 *   get:
 *     summary: Get department summary
 *     description: Returns comprehensive statistics for a specific department
 *     tags: [HYPER - Conversational Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Department summary with metrics
 */

/**
 * @swagger
 * /hyper/dashboard/leave-overview:
 *   get:
 *     summary: Get leave overview
 *     description: Returns leave statistics, pending approvals, and upcoming leaves
 *     tags: [HYPER - Conversational Dashboard]
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
 *     responses:
 *       200:
 *         description: Leave overview with statistics
 */

/**
 * @swagger
 * /hyper/dashboard/payroll-summary:
 *   get:
 *     summary: Get payroll summary
 *     description: Returns payroll statistics by department
 *     tags: [HYPER - Conversational Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payroll summary with department breakdown
 */

/**
 * @swagger
 * /hyper/dashboard/performance-snapshot:
 *   get:
 *     summary: Get performance snapshot
 *     description: Returns performance review statistics and top performers
 *     tags: [HYPER - Conversational Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance snapshot with ratings
 */

/**
 * @swagger
 * /hyper/dashboard/goals-stats:
 *   get:
 *     summary: Get goals statistics
 *     description: Returns goals/OKRs completion statistics
 *     tags: [HYPER - Conversational Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Goals statistics by department
 */

/**
 * @swagger
 * /hyper/dashboard/quick-stats:
 *   get:
 *     summary: Get quick stats
 *     description: Returns all-in-one dashboard with key metrics across all modules
 *     tags: [HYPER - Conversational Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comprehensive quick stats dashboard
 */
