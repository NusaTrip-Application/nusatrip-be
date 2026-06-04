/**
 * @openapi
 * /api/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get public reviews
 *     description: Returns visible reviews with pagination and sorting.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: itineraryId
 *         required: false
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
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [createdAtDesc, createdAtAsc, ratingAsc, ratingDesc]
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
 *                       userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                     reviewerUser:
 *                       userId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                       fullName: Andi Pratama
 *                       profilePhotoUrl: https://cdn.example.com/users/andi.jpg
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
 *
 * /api/reviews/{reviewId}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update the authenticated user's review
 *     parameters:
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
 *             example:
 *               success: true
 *               message: Review updated successfully
 *               data:
 *                 reviewId: 55555555-5555-5555-5555-555555555555
 *                 itineraryId: 11111111-1111-1111-1111-111111111111
 *                 reviewerUserId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                 rating: 4
 *                 comment: Setelah dicoba, ada beberapa spot yang saya ubah
 *                 isHidden: false
 *                 createdAt: 2026-06-01T09:00:00.000Z
 *                 updatedAt: 2026-06-01T10:00:00.000Z
 *                 itinerary:
 *                   itineraryId: 11111111-1111-1111-1111-111111111111
 *                   title: 3D2N Bali Healing Trip
 *                   visibilityStatus: PUBLISHED
 *                   userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 reviewerUser:
 *                   userId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                   fullName: Andi Pratama
 *                   profilePhotoUrl: https://cdn.example.com/users/andi.jpg
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
 *             example:
 *               success: true
 *               message: Review deleted successfully
 *               data: null
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
 * /api/reviews/itineraries/{itineraryId}:
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
 *                   userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 reviewerUser:
 *                   userId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                   fullName: Andi Pratama
 *                   profilePhotoUrl: https://cdn.example.com/users/andi.jpg
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
 * /api/admin/reviews/summary:
 *   get:
 *     tags: [Admin Reviews]
 *     summary: Get review summary for admin dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review summary fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Review summary fetched
 *               data:
 *                 totalReviews: 150
 *                 totalActiveReviews: 140
 *                 totalInactiveReviews: 10
 *                 averageRating: 4.5
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Token not found
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Admin access required
 *
 * /api/admin/reviews:
 *   get:
 *     tags: [Admin Reviews]
 *     summary: Get all reviews for admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: itineraryId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: query
 *         name: search
 *         required: false
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
 *         description: Admin reviews fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Admin reviews fetched
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
 *                       userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                     reviewerUser:
 *                       userId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                       fullName: Andi Pratama
 *                       profilePhotoUrl: https://cdn.example.com/users/andi.jpg
 *                   - reviewId: 66666666-6666-6666-6666-666666666666
 *                     itineraryId: 22222222-2222-2222-2222-222222222222
 *                     reviewerUserId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                     rating: 4
 *                     comment: Itinerary yang sangat membantu untuk planning perjalanan
 *                     isHidden: false
 *                     createdAt: 2026-05-31T15:00:00.000Z
 *                     updatedAt: 2026-05-31T15:00:00.000Z
 *                     itinerary:
 *                       itineraryId: 22222222-2222-2222-2222-222222222222
 *                       title: 2D1N Yogyakarta Heritage Tour
 *                       visibilityStatus: PUBLISHED
 *                       userId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                     reviewerUser:
 *                       userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                       fullName: Budi Santoso
 *                       profilePhotoUrl: https://cdn.example.com/users/budi.jpg
 *                   - reviewId: 77777777-7777-7777-7777-777777777777
 *                     itineraryId: 33333333-3333-3333-3333-333333333333
 *                     reviewerUserId: cccccccc-cccc-cccc-cccc-cccccccccccc
 *                     rating: 3
 *                     comment: Tempat wisata yang bagus, tapi cuaca kurang mendukung
 *                     isHidden: true
 *                     createdAt: 2026-05-30T14:00:00.000Z
 *                     updatedAt: 2026-05-30T14:00:00.000Z
 *                     itinerary:
 *                       itineraryId: 33333333-3333-3333-3333-333333333333
 *                       title: Weekend Bandung Culinary
 *                       visibilityStatus: PUBLISHED
 *                       userId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                     reviewerUser:
 *                       userId: cccccccc-cccc-cccc-cccc-cccccccccccc
 *                       fullName: Sari Wulandari
 *                       profilePhotoUrl: null
 *                 metadata:
 *                   page: 1
 *                   limit: 12
 *                   totalItems: 3
 *                   totalPages: 1
 *                   hasNextPage: false
 *                   hasPrevPage: false
 *       400:
 *         description: Invalid query parameter.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Validation error
 *               errors:
 *                 status:
 *                   - Invalid status value
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Token not found
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Admin access required
 */