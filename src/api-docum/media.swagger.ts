/**
 * @openapi
 * /api/media/presigned-url:
 *   post:
 *     tags: [Media]
 *     summary: Generate presigned upload URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePresignedUrlRequest'
 *           example:
 *             mimetype: image/jpeg
 *             size: 204800
 *             folder: place
 *     responses:
 *       200:
 *         description: Presigned URL generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Presigned URL created
 *               data:
 *                 url: https://example-r2-presigned-url
 *                 tempKey: uploads/temp/place/abc123.jpg
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *
 * /api/media:
 *   delete:
 *     tags: [Media]
 *     summary: Delete uploaded file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteMediaRequest'
 *           example:
 *             fileKey: uploads/temp/place/abc123.jpg
 *     responses:
 *       200:
 *         description: File deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: File not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
