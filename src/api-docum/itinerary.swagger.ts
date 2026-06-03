/**
 * @openapi
 * /api/itineraries:
 *   get:
 *     tags: [Itineraries]
 *     summary: Get my itineraries
 *     parameters:
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PRIVATE, PUBLISHED]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [titleAsc, titleDesc, createdAtDesc, createdAtAsc, ratingAsc, ratingDesc]
 *           default: createdAtDesc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *     responses:
 *       200:
 *         description: My itineraries fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: My itineraries fetched
 *               data:
 *                 items:
 *                   - itineraryId: 11111111-1111-1111-1111-111111111111
 *                     userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                     locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                     title: 3D2N Bali Healing Trip
 *                     description: Santai ke Ubud dan sekitarnya
 *                     bannerImageUrl: https://cdn.example.com/bali.jpg
 *                     startDate: 2026-06-10T00:00:00.000Z
 *                     endDate: 2026-06-12T00:00:00.000Z
 *                     travelerCount: 2
 *                     budgetPreference: 1500000
 *                     visibilityStatus: PRIVATE
 *                     estimatedTotalBudget: 2200000
 *                     createdAt: 2026-05-25T08:10:00.000Z
 *                     updatedAt: 2026-05-28T09:20:00.000Z
 *                     location:
 *                       locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                       locationName: Bali
 *                     ratingValue: 4.75
 *                     ratingCount: 0
 *                     savedCount: 0
 *                     itemCount: 8
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
 *             example:
 *               success: false
 *               message: Validation error
 *               errors:
 *                 sortBy:
 *                   - Invalid sort option
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Token not found
 *
 *   post:
 *     tags: [Itineraries]
 *     summary: Create itinerary
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateItineraryRequest'
 *           example:
 *             title: 3D2N Bali Healing Trip
 *             locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *             startDate: 2026-06-10T00:00:00.000Z
 *             endDate: 2026-06-12T00:00:00.000Z
 *             travelerCount: 2
 *             interestSummary:
 *               - eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee
 *             budgetPreference: 1500000
 *     responses:
 *       201:
 *         description: Itinerary created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary created successfully
 *               data:
 *                 itineraryId: 11111111-1111-1111-1111-111111111111
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                 title: 3D2N Bali Healing Trip
 *                 description: null
 *                 bannerImageUrl: null
 *                 startDate: 2026-06-10T00:00:00.000Z
 *                 endDate: 2026-06-12T00:00:00.000Z
 *                 travelerCount: 2
 *                 budgetPreference: 1500000
 *                 visibilityStatus: PRIVATE
 *                 estimatedTotalBudget: 0
 *                 createdAt: 2026-06-01T10:00:00.000Z
 *                 updatedAt: 2026-06-01T10:00:00.000Z
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Validation error
 *               errors:
 *                 title:
 *                   - Title is required
 *                 startDate:
 *                   - Start date is required
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Token not found
 *       404:
 *         description: Referenced location or category not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Location not found
 *
 * /api/itineraries/{itineraryId}:
 *   get:
 *     tags: [Itineraries]
 *     summary: Get itinerary detail
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Itinerary detail fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary detail fetched
 *               data:
 *                 itineraryId: 11111111-1111-1111-1111-111111111111
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                 title: 3D2N Bali Healing Trip
 *                 description: Santai ke Ubud dan sekitarnya
 *                 bannerImageUrl: https://cdn.example.com/bali.jpg
 *                 startDate: 2026-06-10T00:00:00.000Z
 *                 endDate: 2026-06-12T00:00:00.000Z
 *                 travelerCount: 2
 *                 budgetPreference: 1500000
 *                 visibilityStatus: PRIVATE
 *                 estimatedTotalBudget: 2200000
 *                 createdAt: 2026-05-25T08:10:00.000Z
 *                 updatedAt: 2026-05-28T09:20:00.000Z
 *                 location:
 *                   locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                   locationName: Bali
 *                 interestCategories:
 *                   - categoryId: eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee
 *                     categoryName: Nature
 *                 itineraryItemsByDay:
 *                   "2026-06-10":
 *                     - itineraryItemId: ffffffff-ffff-ffff-ffff-ffffffffffff
 *                       placeId: 33333333-3333-3333-3333-333333333333
 *                       visitDate: 2026-06-10T00:00:00.000Z
 *                       visitTime: "09:00"
 *                       notes: Berangkat pagi
 *                       place:
 *                         placeId: 33333333-3333-3333-3333-333333333333
 *                         placeName: Tegallalang Rice Terrace
 *                         shortDescription: Sawah terasering populer di Ubud
 *                         address: Gianyar, Bali
 *                         priceMin: 50000
 *                         priceMax: 100000
 *                         priceDescription: tiket masuk
 *                         ratingValue: 4.6
 *                         categories:
 *                           - Nature
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
 *               message: You do not have permission to view this itinerary
 *       404:
 *         description: Itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Itinerary not found
 *
 *   patch:
 *     tags: [Itineraries]
 *     summary: Update itinerary
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
 *             $ref: '#/components/schemas/UpdateItineraryRequest'
 *           example:
 *             title: 3D2N Bali Healing Trip Updated
 *             description: Santai ke Ubud dan sekitarnya dengan tambahan aktivitas yoga
 *             visibilityStatus: PUBLISHED
 *     responses:
 *       200:
 *         description: Itinerary updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary updated successfully
 *               data:
 *                 itineraryId: 11111111-1111-1111-1111-111111111111
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                 title: 3D2N Bali Healing Trip Updated
 *                 description: Santai ke Ubud dan sekitarnya dengan tambahan aktivitas yoga
 *                 bannerImageUrl: https://cdn.example.com/bali.jpg
 *                 startDate: 2026-06-10T00:00:00.000Z
 *                 endDate: 2026-06-12T00:00:00.000Z
 *                 travelerCount: 2
 *                 budgetPreference: 1500000
 *                 visibilityStatus: PUBLISHED
 *                 estimatedTotalBudget: 2200000
 *                 createdAt: 2026-05-25T08:10:00.000Z
 *                 updatedAt: 2026-06-01T10:30:00.000Z
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Validation error
 *               errors:
 *                 visibilityStatus:
 *                   - Invalid visibility status
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: You do not have permission to update this itinerary
 *       404:
 *         description: Itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Itinerary not found
 *
 *   delete:
 *     tags: [Itineraries]
 *     summary: Delete itinerary
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Itinerary deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary deleted successfully
 *               data: null
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: You do not have permission to delete this itinerary
 *       404:
 *         description: Itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Itinerary not found
 *
 * /api/itineraries/{itineraryId}/budget:
 *   patch:
 *     tags: [Itineraries]
 *     summary: Update itinerary estimated total budget
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
 *             $ref: '#/components/schemas/UpdateBudgetRequest'
 *           example:
 *             estimatedTotalBudget: 2200000
 *     responses:
 *       200:
 *         description: Itinerary budget updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary budget updated successfully
 *               data:
 *                 itineraryId: 11111111-1111-1111-1111-111111111111
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                 title: 3D2N Bali Healing Trip
 *                 description: Santai ke Ubud dan sekitarnya
 *                 bannerImageUrl: https://cdn.example.com/bali.jpg
 *                 startDate: 2026-06-10T00:00:00.000Z
 *                 endDate: 2026-06-12T00:00:00.000Z
 *                 travelerCount: 2
 *                 budgetPreference: 1500000
 *                 visibilityStatus: PRIVATE
 *                 estimatedTotalBudget: 2200000
 *                 createdAt: 2026-05-25T08:10:00.000Z
 *                 updatedAt: 2026-06-01T11:00:00.000Z
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Validation error
 *               errors:
 *                 estimatedTotalBudget:
 *                   - Estimated total budget is required
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: You do not have permission to update this itinerary
 *       404:
 *         description: Itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Itinerary not found
 *
 * /api/itineraries/{itineraryId}/items:
 *   post:
 *     tags: [Itineraries]
 *     summary: Create itinerary item
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
 *             $ref: '#/components/schemas/CreateItineraryItemRequest'
 *           example:
 *             placeId: 33333333-3333-3333-3333-333333333333
 *             visitDate: 2026-06-10T00:00:00.000Z
 *             visitTime: "09:00"
 *             notes: Berangkat pagi
 *     responses:
 *       201:
 *         description: Itinerary item created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary item created successfully
 *               data:
 *                 itineraryItemId: ffffffff-ffff-ffff-ffff-ffffffffffff
 *                 itineraryId: 11111111-1111-1111-1111-111111111111
 *                 placeId: 33333333-3333-3333-3333-333333333333
 *                 visitDate: 2026-06-10T00:00:00.000Z
 *                 visitTime: "09:00"
 *                 notes: Berangkat pagi
 *                 place:
 *                   placeId: 33333333-3333-3333-3333-333333333333
 *                   placeName: Tegallalang Rice Terrace
 *                   shortDescription: Sawah terasering populer di Ubud
 *                   address: Gianyar, Bali
 *                   priceMin: 50000
 *                   priceMax: 100000
 *                   priceDescription: tiket masuk
 *                   ratingValue: 4.6
 *       400:
 *         description: Invalid request body or place does not belong to itinerary location.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Place does not belong to itinerary location
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: You do not have permission to add items to this itinerary
 *       404:
 *         description: Itinerary or place not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Itinerary not found
 *       409:
 *         description: Schedule conflict.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Schedule conflict with existing item at 09:00 on 2026-06-10
 *
 * /api/itineraries/{itineraryId}/items/{itineraryItemId}:
 *   patch:
 *     tags: [Itineraries]
 *     summary: Update itinerary item
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: itineraryItemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateItineraryItemRequest'
 *           example:
 *             visitTime: "10:00"
 *             notes: Berangkat lebih siang karena yoga pagi
 *     responses:
 *       200:
 *         description: Itinerary item updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary item updated successfully
 *               data:
 *                 itineraryItemId: ffffffff-ffff-ffff-ffff-ffffffffffff
 *                 itineraryId: 11111111-1111-1111-1111-111111111111
 *                 placeId: 33333333-3333-3333-3333-333333333333
 *                 visitDate: 2026-06-10T00:00:00.000Z
 *                 visitTime: "10:00"
 *                 notes: Berangkat lebih siang karena yoga pagi
 *                 place:
 *                   placeId: 33333333-3333-3333-3333-333333333333
 *                   placeName: Tegallalang Rice Terrace
 *                   shortDescription: Sawah terasering populer di Ubud
 *                   address: Gianyar, Bali
 *                   priceMin: 50000
 *                   priceMax: 100000
 *                   priceDescription: tiket masuk
 *                   ratingValue: 4.6
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Validation error
 *               errors:
 *                 visitTime:
 *                   - Invalid time format
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: You do not have permission to update this item
 *       404:
 *         description: Itinerary item not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Itinerary item not found
 *       409:
 *         description: Schedule conflict.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Schedule conflict with existing item at 10:30 on 2026-06-10
 *
 *   delete:
 *     tags: [Itineraries]
 *     summary: Delete itinerary item
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: itineraryItemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Itinerary item deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary item deleted successfully
 *               data: null
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: You do not have permission to delete this item
 *       404:
 *         description: Itinerary item not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Itinerary item not found
 *
 * /api/admin/itineraries/summary:
 *   get:
 *     tags: [Admin Itineraries]
 *     summary: Get itinerary summary for admin dashboard
 *     responses:
 *       200:
 *         description: Itinerary summary fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary summary fetched
 *               data:
 *                 totalItineraries: 200
 *                 publishedItineraries: 150
 *                 privateItineraries: 50
 *                 avgRating: 4.5
 *                 topItinerary:
 *                   itineraryId: 11111111-1111-1111-1111-111111111111
 *                   title: 3D2N Bali Healing Trip
 *                   ratingValue: 4.9
 *                   savedCount: 50
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
 * /api/admin/itineraries:
 *   get:
 *     tags: [Admin Itineraries]
 *     summary: Get all itineraries for admin
 *     parameters:
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PRIVATE, PUBLISHED]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [titleAsc, titleDesc, createdAtDesc, createdAtAsc, ratingAsc, ratingDesc]
 *           default: createdAtDesc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *     responses:
 *       200:
 *         description: Admin itineraries fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Admin itineraries fetched
 *               data:
 *                 items:
 *                   - itineraryId: 11111111-1111-1111-1111-111111111111
 *                     userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                     locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                     title: 3D2N Bali Healing Trip
 *                     description: Santai ke Ubud dan sekitarnya
 *                     bannerImageUrl: https://cdn.example.com/bali.jpg
 *                     startDate: 2026-06-10T00:00:00.000Z
 *                     endDate: 2026-06-12T00:00:00.000Z
 *                     travelerCount: 2
 *                     budgetPreference: 1500000
 *                     visibilityStatus: PUBLISHED
 *                     estimatedTotalBudget: 2200000
 *                     createdAt: 2026-05-25T08:10:00.000Z
 *                     updatedAt: 2026-05-28T09:20:00.000Z
 *                     location:
 *                       locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                       locationName: Bali
 *                     user:
 *                       userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                       fullName: Budi Santoso
 *                       photoUrl: https://cdn.example.com/users/budi.jpg
 *                     ratingValue: 4.75
 *                     ratingCount: 12
 *                     savedCount: 20
 *                     itemCount: 8
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
 *             example:
 *               success: false
 *               message: Validation error
 *               errors:
 *                 status:
 *                   - Invalid status value
 */