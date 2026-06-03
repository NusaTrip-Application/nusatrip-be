/**
 * @openapi
 * /api/itineraries/community:
 *   get:
 *     tags: [Community]
 *     summary: Get published itineraries for the community feed
 *     description: Returns only published itineraries. Supports keyword search by itinerary title or location name, with recent or popular filtering.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         description: Search by itinerary title or location name.
 *         schema:
 *           type: string
 *           example: bali
 *       - in: query
 *         name: filter
 *         required: false
 *         description: Sort published itineraries by popularity or recency.
 *         schema:
 *           type: string
 *           enum: [popular, recent]
 *           default: recent
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
 *         description: Community itineraries fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Community itineraries fetched
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
 *                 filter:
 *                   - Invalid option
 *
 * /api/itineraries/community/{itineraryId}/summary:
 *   get:
 *     tags: [Community]
 *     summary: Get review and save summary for a published itinerary
 *     description: Returns average rating, total reviewers, total comments, and total saves for one published itinerary.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Community summary fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Community summary fetched
 *               data:
 *                 averageRating: 4.75
 *                 ratingCount: 12
 *                 totalReviews: 12
 *                 totalComments: 9
 *                 totalSaves: 20
 *       404:
 *         description: Published itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Published itinerary not found
 *
 * /api/itineraries/{itineraryId}/save:
 *   post:
 *     tags: [Community]
 *     summary: Save a published itinerary to SavedReference
 *     description: Saves a published itinerary as a reference for the authenticated user. The same itinerary cannot be saved twice by the same user.
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Itinerary saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary saved
 *               data:
 *                 saved: true
 *                 itineraryId: 11111111-1111-1111-1111-111111111111
 *       400:
 *         description: User tries to save their own itinerary.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: You cannot save your own itinerary
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
 *         description: Published itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: The itinerary has already been saved by the current user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Itinerary is already saved
 *
 * /api/itineraries/saved:
 *   get:
 *     tags: [Community]
 *     summary: Get saved published itineraries
 *     description: Returns the authenticated user's saved references. Only saved references whose source itinerary is still published will appear.
 *     parameters:
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
 *         description: Saved itineraries fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Saved itineraries fetched
 *               data:
 *                 items:
 *                   - savedReferenceId: cccccccc-cccc-cccc-cccc-cccccccccccc
 *                     savedAt: 2026-06-01T10:15:00.000Z
 *                     itineraryId: 11111111-1111-1111-1111-111111111111
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
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *
 * /api/itineraries/{itineraryId}/duplicate:
 *   post:
 *     tags: [Community]
 *     summary: Duplicate a published itinerary into My Plans
 *     description: Creates a private copy of a published itinerary for the authenticated user so it can be edited independently.
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       201:
 *         description: Itinerary duplicated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Itinerary duplicated successfully
 *               data:
 *                 itineraryId: 22222222-2222-2222-2222-222222222222
 *                 userId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                 locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                 title: Copy of 3D2N Bali Healing Trip
 *                 description: Santai ke Ubud dan sekitarnya
 *                 bannerImageUrl: https://cdn.example.com/bali.jpg
 *                 startDate: 2026-06-10T00:00:00.000Z
 *                 endDate: 2026-06-12T00:00:00.000Z
 *                 travelerCount: 2
 *                 budgetPreference: 1500000
 *                 visibilityStatus: PRIVATE
 *                 estimatedTotalBudget: 2200000
 *                 createdAt: 2026-06-01T10:20:00.000Z
 *                 updatedAt: 2026-06-01T10:20:00.000Z
 *                 location:
 *                   locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                   locationName: Bali
 *                 user:
 *                   userId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                   fullName: Andi Pratama
 *                   photoUrl: https://cdn.example.com/users/andi.jpg
 *                 interestCategories:
 *                   - categoryId: eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee
 *                     categoryName: Nature
 *                 itineraryItemsByDay:
 *                   "2026-06-10":
 *                     - itineraryItemId: ffffffff-ffff-ffff-ffff-ffffffffffff
 *                       visitDate: 2026-06-10T00:00:00.000Z
 *                       visitTime: "09:00"
 *                       notes: Berangkat pagi
 *                       place:
 *                         placeId: 99999999-9999-9999-9999-999999999999
 *                         placeName: Tegallalang Rice Terrace
 *                         shortDescription: Sawah terasering populer di Ubud
 *                         address: Gianyar, Bali
 *                         priceMin: 50000
 *                         priceMax: 100000
 *                         priceDescription: tiket masuk
 *                         ratingValue: 4.6
 *                         categories:
 *                           - Nature
 *       400:
 *         description: User tries to duplicate their own itinerary.
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
 *         description: The itinerary was already duplicated by the current user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: You have already duplicated this itinerary
 *
 * /api/itineraries/community/{itineraryId}/author-others:
 *   get:
 *     tags: [Community]
 *     summary: Get other published itineraries from the same author
 *     description: Returns other published itineraries created by the same author, excluding the itinerary currently being viewed.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: itineraryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *         description: Other author itineraries fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Other itineraries fetched
 *               data:
 *                 items:
 *                   - itineraryId: 33333333-3333-3333-3333-333333333333
 *                     userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                     locationId: 44444444-4444-4444-4444-444444444444
 *                     title: Jogja Food and Culture Trip
 *                     description: Kuliner dan wisata budaya 2 hari
 *                     bannerImageUrl: https://cdn.example.com/jogja.jpg
 *                     startDate: 2026-07-01T00:00:00.000Z
 *                     endDate: 2026-07-02T00:00:00.000Z
 *                     travelerCount: 3
 *                     budgetPreference: 1200000
 *                     visibilityStatus: PUBLISHED
 *                     estimatedTotalBudget: 1800000
 *                     createdAt: 2026-05-20T08:10:00.000Z
 *                     updatedAt: 2026-05-21T09:20:00.000Z
 *                     location:
 *                       locationId: 44444444-4444-4444-4444-444444444444
 *                       locationName: Yogyakarta
 *                     user:
 *                       userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                       fullName: Budi Santoso
 *                       photoUrl: https://cdn.example.com/users/budi.jpg
 *                     ratingValue: 4.5
 *                     ratingCount: 8
 *                     savedCount: 10
 *                     itemCount: 6
 *                 metadata:
 *                   page: 1
 *                   limit: 6
 *                   totalItems: 1
 *                   totalPages: 1
 *                   hasNextPage: false
 *                   hasPrevPage: false
 *       404:
 *         description: Published itinerary not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
