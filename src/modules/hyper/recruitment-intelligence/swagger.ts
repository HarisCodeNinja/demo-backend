/**
 * @swagger
 * tags:
 *   name: HYPER - Recruitment Intelligence
 *   description: Intelligent recruitment analytics and candidate management endpoints
 */

/**
 * @swagger
 * /hyper/recruitment/pending-feedback:
 *   get:
 *     summary: Get interviews pending feedback
 *     description: Returns interviews that are waiting for interviewer feedback
 *     tags: [HYPER - Recruitment Intelligence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of interviews pending feedback
 */

/**
 * @swagger
 * /hyper/recruitment/candidate-matching/{jobOpeningId}:
 *   get:
 *     summary: Get candidate matching scores
 *     description: Returns candidates ranked by skill match for a specific job opening
 *     tags: [HYPER - Recruitment Intelligence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobOpeningId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: minMatchScore
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Minimum match score percentage
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Ranked list of candidates with match scores
 */

/**
 * @swagger
 * /hyper/recruitment/hiring-funnel:
 *   get:
 *     summary: Get hiring funnel statistics
 *     description: Returns candidate distribution across recruitment stages
 *     tags: [HYPER - Recruitment Intelligence]
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
 *         name: jobOpeningId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Hiring funnel statistics
 */

/**
 * @swagger
 * /hyper/recruitment/pipeline-summary:
 *   get:
 *     summary: Get recruitment pipeline summary
 *     description: Returns overview of all job openings with candidate counts
 *     tags: [HYPER - Recruitment Intelligence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed, on_hold]
 *           default: open
 *     responses:
 *       200:
 *         description: Pipeline summary for all job openings
 */

/**
 * @swagger
 * /hyper/recruitment/overdue-interviews:
 *   get:
 *     summary: Get overdue interviews
 *     description: Returns interviews that are overdue for completion or feedback
 *     tags: [HYPER - Recruitment Intelligence]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of overdue interviews
 */

/**
 * @swagger
 * /hyper/recruitment/recruiter-performance:
 *   get:
 *     summary: Get recruiter performance metrics
 *     description: Returns performance statistics for all recruiters
 *     tags: [HYPER - Recruitment Intelligence]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recruiter performance metrics
 */
