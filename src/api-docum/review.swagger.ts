/**
 * @openapi
 * /api/itineraries/community/{itineraryId}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get public reviews for a published itinerary
 *     description: Returns visible reviews for one published itinerary with pagination and sorting.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: rating
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *       - in: query
 *         name: search
 *         required: false
 *         description: Search by itinerary title or reviewer full name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [titleAsc, titleDesc, createdAtDesc, createdAtAsc, ratingAsc, ratingDesc]
 *           default: createdAtDesc
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *     responses:
 *       200:
 *         description: Reviews fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Reviews fetched successfully
 *               data:
 *                 items:
 *                   - reviewId: 55555555-5555-5555-5555-555555555555
 *                     itineraryId: 11111111-1111-1111-1111-111111111111
 *                     reviewerUserId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                     rating: 5
 *                     comment: Sangat membantu untuk first trip ke Bali
 *                     isHidden: false
 *                     createdAt: 2026-06-01T09:00:00.000Z
 *                     updatedAt: 2026-06-01T09:00:00.000Z
 *                     itinerary:
 *                       itineraryId: 11111111-1111-1111-1111-111111111111
 *                       title: 3D2N Bali Healing Trip
 *                       visibilityStatus: PUBLISHED
 *                     reviewer:
 *                       userId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                       fullName: Andi Pratama
 *                       photoUrl: https://cdn.example.com/users/andi.jpg
 *                 metadata:
 *                   page: 1
 *                   limit: 12
 *                   totalItems: 1
 *                   totalPages: 1
 *                   hasNextPage: false
 *                   hasPrevPage: false
 *       400:
 *         description: Invalid query parameter.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Published itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review for a published itinerary
 *     description: The authenticated user can submit one review per published itinerary, except for their own itinerary.
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *           example:
 *             rating: 5
 *             comment: Sangat membantu untuk first trip ke Bali
 *     responses:
 *       201:
 *         description: Review created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Review created successfully
 *               data:
 *                 reviewId: 55555555-5555-5555-5555-555555555555
 *                 itineraryId: 11111111-1111-1111-1111-111111111111
 *                 reviewerUserId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                 rating: 5
 *                 comment: Sangat membantu untuk first trip ke Bali
 *                 isHidden: false
 *                 createdAt: 2026-06-01T09:00:00.000Z
 *                 updatedAt: 2026-06-01T09:00:00.000Z
 *                 itinerary:
 *                   itineraryId: 11111111-1111-1111-1111-111111111111
 *                   title: 3D2N Bali Healing Trip
 *                   visibilityStatus: PUBLISHED
 *                 reviewer:
 *                   userId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                   fullName: Andi Pratama
 *                   photoUrl: https://cdn.example.com/users/andi.jpg
 *       400:
 *         description: Invalid payload or the user is reviewing their own itinerary.
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
 *         description: Published itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: The user has already reviewed this itinerary.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: You have already reviewed this itinerary
 *
 * /api/itineraries/community/{itineraryId}/reviews/{reviewId}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update the authenticated user's review
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewRequest'
 *           example:
 *             rating: 4
 *             comment: Setelah dicoba, ada beberapa spot yang saya ubah
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid payload.
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
 *       403:
 *         description: Forbidden. Review does not belong to the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Review not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete the authenticated user's review
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden. Review does not belong to the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Review not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
