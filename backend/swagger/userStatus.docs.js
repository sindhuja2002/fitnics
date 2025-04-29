/**
 * @swagger
 * /api/user/status:
 *   post:
 *     summary: Create user status
 *     tags:
 *       - UserStatus
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - height
 *               - weight
 *               - age
 *               - gender
 *             properties:
 *               height:
 *                 type: number
 *                 example: 170
 *               weight:
 *                 type: number
 *                 example: 70
 *               goalWeight:
 *                 type: number
 *                 example: 65
 *               age:
 *                 type: integer
 *                 example: 30
 *               gender:
 *                 type: string
 *                 example: "male"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1994-04-29"
 *               activityLevel:
 *                 type: string
 *                 example: "moderate"
 *               goal:
 *                 type: string
 *                 example: "weight_loss"
 *     responses:
 *       201:
 *         description: User status created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatus'
 *       400:
 *         description: Invalid user status data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid user status data
 */

/**
 * @swagger
 * /api/user/status:
 *   get:
 *     summary: Get user status
 *     tags:
 *       - UserStatus
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatus'
 *       404:
 *         description: User status not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User status not found
 */

/**
 * @swagger
 * /api/user/status:
 *   put:
 *     summary: Update user status
 *     tags:
 *       - UserStatus
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: number
 *                 example: 170
 *               weight:
 *                 type: number
 *                 example: 70
 *               goalWeight:
 *                 type: number
 *                 example: 65
 *               age:
 *                 type: integer
 *                 example: 30
 *               gender:
 *                 type: string
 *                 example: "male"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1994-04-29"
 *               activityLevel:
 *                 type: string
 *                 example: "moderate"
 *               goal:
 *                 type: string
 *                 example: "weight_loss"
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatus'
 *       201:
 *         description: User status created (if it did not exist)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatus'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserStatus:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "66300a4d2e9a4e0012a4d123"
 *         user:
 *           type: string
 *           example: "66200a4d2e9a4e0012a4d456"
 *         height:
 *           type: number
 *           example: 170
 *         weight:
 *           type: number
 *           example: 70
 *         goalWeight:
 *           type: number
 *           example: 65
 *         age:
 *           type: integer
 *           example: 30
 *         gender:
 *           type: string
 *           example: "male"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1994-04-29"
 *         activityLevel:
 *           type: string
 *           example: "moderate"
 *         goal:
 *           type: string
 *           example: "weight_loss"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-29T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-29T10:00:00.000Z"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
 */
