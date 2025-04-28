/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password (hashed)
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         name: John Doe
 *         email: john@example.com
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         token:
 *           type: string
 *           description: JWT token for authentication
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         name: John Doe
 *         email: john@example.com
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *   securitySchemes:
 *     customAuth:
 *       type: apiKey
 *       in: header
 *       name: token
 *       description: Enter your auth token
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/auth:
 *   post:
 *     summary: Authenticate user and get token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Bad request (missing fields)
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request (missing fields or user already exists)
 */

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user (clear token)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User logged out successfully
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - customAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: User not found
 *
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - customAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: New Name
 *               email:
 *                 type: string
 *                 format: email
 *                 example: new@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: User profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: User not found
 */
