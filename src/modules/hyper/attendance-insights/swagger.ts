/**
 * @swagger
 * tags:
 *   name: HYPER - Attendance Insights
 *   description: Intelligent attendance monitoring and anomaly detection endpoints
 */

/**
 * @swagger
 * /hyper/attendance/today-summary:
 *   get:
 *     summary: Get today's attendance summary
 *     description: Returns comprehensive attendance statistics for today
 *     tags: [HYPER - Attendance Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Target date (defaults to today)
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Today's attendance summary with department breakdown
 */

/**
 * @swagger
 * /hyper/attendance/absentee-patterns:
 *   get:
 *     summary: Get absentee patterns
 *     description: Identifies employees with frequent or concerning absence patterns
 *     tags: [HYPER - Attendance Insights]
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
 *         name: minAbsences
 *         schema:
 *           type: integer
 *           default: 3
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of employees with absentee patterns
 */

/**
 * @swagger
 * /hyper/attendance/late-comers:
 *   get:
 *     summary: Get late comers
 *     description: Returns employees who arrived late for work
 *     tags: [HYPER - Attendance Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: minLateMinutes
 *         schema:
 *           type: integer
 *           default: 15
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of late comers with late counts
 */

/**
 * @swagger
 * /hyper/attendance/anomaly-detection:
 *   get:
 *     summary: Detect attendance anomalies
 *     description: Identifies unusual attendance patterns (missing checkouts, unusual hours, weekend logins)
 *     tags: [HYPER - Attendance Insights]
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
 *         description: List of attendance anomalies with severity levels
 */

/**
 * @swagger
 * /hyper/attendance/team-attendance/{managerId}:
 *   get:
 *     summary: Get team attendance for a manager
 *     description: Returns attendance summary for all team members under a specific manager
 *     tags: [HYPER - Attendance Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: managerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Team attendance summary
 */

/**
 * @swagger
 * /hyper/attendance/monthly-trends:
 *   get:
 *     summary: Get monthly attendance trends
 *     description: Returns day-by-day attendance trends for analysis
 *     tags: [HYPER - Attendance Insights]
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
 *         description: Daily attendance trends
 */
