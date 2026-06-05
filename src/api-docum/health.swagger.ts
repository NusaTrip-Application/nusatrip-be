/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     security: []
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, timestamp, uptime, environment]
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Server is healthy" }
 *                 timestamp: { type: string, format: date-time }
 *                 uptime: { type: number, example: 123.45 }
 *                 environment: { type: string, example: "development" }
 */