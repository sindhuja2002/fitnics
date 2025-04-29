/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
 */

/**
 * @swagger
 * /api/analytics/track/{userId}:
 *   post:
 *     summary: Track a new metric for a user
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: User ID (optional, defaults to authenticated user)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - metric_type
 *               - value
 *             properties:
 *               metric_type:
 *                 type: string
 *                 example: steps
 *               value:
 *                 type: number
 *                 example: 10000
 *               metadata:
 *                 type: object
 *                 example: { "device": "fitbit" }
 *     responses:
 *       200:
 *         description: Metric tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Response from analytics microservice
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid metric_type
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Failed to track metric
 */

/**
 * @swagger
 * /api/analytics/user/{userId}:
 *   get:
 *     summary: Get analytics data for a user
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: User ID (optional, defaults to authenticated user)
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics (YYYY-MM-DD)
 *       - in: query
 *         name: metric_type
 *         schema:
 *           type: string
 *         description: Filter by metric type
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Response from analytics microservice
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Failed to get analytics
 */

/**
 * @swagger
 * /api/analytics/generate-sample/{userId}:
 *   post:
 *     summary: Generate sample analytics data for a user
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: User ID (optional, defaults to authenticated user)
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to generate data for
 *     responses:
 *       200:
 *         description: Sample data generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Response from analytics microservice
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Failed to generate sample data
 */

/**
 * @swagger
 * /api/analytics/user/{userId}/weekly:
 *   get:
 *     summary: Get weekly analytics data for a user
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: User ID (optional, defaults to authenticated user)
 *       - in: query
 *         name: week_start
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the week (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Weekly analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Response from analytics microservice
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Failed to get weekly analytics
 */
