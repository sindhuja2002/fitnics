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
 * /api/user/meal-plan:
 *   post:
 *     summary: Create a user meal plan
 *     tags:
 *       - MealPlan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-04-29"
 *               meal1:
 *                 type: string
 *                 example: "Oatmeal with fruit"
 *               meal2:
 *                 type: string
 *                 example: "Chicken salad"
 *               meal3:
 *                 type: string
 *                 example: "Grilled fish and veggies"
 *               meal4:
 *                 type: string
 *                 example: "Yogurt"
 *               meal5:
 *                 type: string
 *                 example: "Soup"
 *               snacks:
 *                 type: string
 *                 example: "Nuts and apple"
 *     responses:
 *       201:
 *         description: Meal plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMealPlan'
 *       400:
 *         description: Invalid user meal plan data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid user meal plan data
 */

/**
 * @swagger
 * /api/user/meal-plan/{date}:
 *   get:
 *     summary: Get user meal plan for a specific date
 *     tags:
 *       - MealPlan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of the meal plan (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Meal plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMealPlan'
 *       404:
 *         description: User meal plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User meal plan not found
 */

/**
 * @swagger
 * /api/user/meal-plan/{date}:
 *   put:
 *     summary: Update user meal plan for a specific date
 *     tags:
 *       - MealPlan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of the meal plan (YYYY-MM-DD)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               meal1:
 *                 type: string
 *                 example: "Oatmeal with fruit"
 *               meal2:
 *                 type: string
 *                 example: "Chicken salad"
 *               meal3:
 *                 type: string
 *                 example: "Grilled fish and veggies"
 *               meal4:
 *                 type: string
 *                 example: "Yogurt"
 *               meal5:
 *                 type: string
 *                 example: "Soup"
 *               snacks:
 *                 type: string
 *                 example: "Nuts and apple"
 *     responses:
 *       200:
 *         description: Meal plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMealPlan'
 *       201:
 *         description: Meal plan created (if it did not exist)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserMealPlan'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserMealPlan:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "661f2f5f3b9c2a0012a4d123"
 *         userId:
 *           type: string
 *           example: "661f2f5f3b9c2a0012a4d456"
 *         date:
 *           type: string
 *           format: date
 *           example: "2024-04-29"
 *         meal1:
 *           type: string
 *           example: "Oatmeal with fruit"
 *         meal2:
 *           type: string
 *           example: "Chicken salad"
 *         meal3:
 *           type: string
 *           example: "Grilled fish and veggies"
 *         meal4:
 *           type: string
 *           example: "Yogurt"
 *         meal5:
 *           type: string
 *           example: "Soup"
 *         snacks:
 *           type: string
 *           example: "Nuts and apple"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-29T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-29T10:00:00.000Z"
 */

