/**
 * @openapi
 * /api/places/recommendations:
 *   get:
 *     tags: [Places]
 *     summary: Get place recommendations
 *     description: Returns active places filtered by location, categories, and budget preference.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: categories
 *         description: Comma-separated PlaceCategoryEnum values.
 *         schema:
 *           type: string
 *           example: FOOD,SHOPPING
 *       - in: query
 *         name: budgetPreference
 *         schema:
 *           type: number
 *           minimum: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *     responses:
 *       200:
 *         description: Recommendations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Recommendations fetched
 *               data:
 *                 items:
 *                   - placeId: 33333333-3333-3333-3333-333333333333
 *                     locationId: 22222222-2222-2222-2222-222222222222
 *                     placeName: Tegallalang Rice Terrace
 *                     shortDescription: Sawah terasering populer di Ubud
 *                     address: Gianyar, Bali
 *                     priceMin: 50000
 *                     priceMax: 100000
 *                     priceDescription: tiket masuk
 *                     websiteUrl: https://example.com
 *                     contactPhoneNumber: "08123456789"
 *                     ratingValue: 4.6
 *                     ratingCount: 1200
 *                     isActive: true
 *                     categories:
 *                       - categoryId: 55555555-5555-5555-5555-555555555555
 *                         categoryName: Nature
 *                         categoryIcon: landscape
 *                     images:
 *                       - imageUrl: https://cdn.example.com/places/tegalalang-1.jpg
 *                         displayOrder: 1
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
 *                 budgetPreference:
 *                   - Must be a positive number
 *
 * /api/places/categories:
 *   get:
 *     tags: [Places]
 *     summary: Get place categories
 *     security: []
 *     responses:
 *       200:
 *         description: Place categories fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Place categories fetched
 *               data:
 *                 - categoryId: 55555555-5555-5555-5555-555555555555
 *                   categoryName: Nature
 *                   categoryIcon: landscape
 *                 - categoryId: 66666666-6666-6666-6666-666666666666
 *                   categoryName: Food
 *                   categoryIcon: restaurant
 *                 - categoryId: 77777777-7777-7777-7777-777777777777
 *                   categoryName: Shopping
 *                   categoryIcon: shopping_bag
 *
 * /api/places/{placeId}:
 *   get:
 *     tags: [Places]
 *     summary: Get public place detail
 *     security: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Place fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Place fetched successfully
 *               data:
 *                 placeId: 33333333-3333-3333-3333-333333333333
 *                 locationId: 22222222-2222-2222-2222-222222222222
 *                 placeName: Tegallalang Rice Terrace
 *                 shortDescription: Sawah terasering populer di Ubud
 *                 address: Gianyar, Bali
 *                 priceMin: 50000
 *                 priceMax: 100000
 *                 priceDescription: tiket masuk
 *                 websiteUrl: https://example.com
 *                 contactPhoneNumber: "08123456789"
 *                 ratingValue: 4.6
 *                 ratingCount: 1200
 *                 isActive: true
 *                 createdAt: 2026-01-01T00:00:00.000Z
 *                 updatedAt: 2026-05-01T00:00:00.000Z
 *                 location:
 *                   locationId: 22222222-2222-2222-2222-222222222222
 *                   locationName: Ubud
 *                 categories:
 *                   - categoryId: 55555555-5555-5555-5555-555555555555
 *                     categoryName: Nature
 *                     categoryIcon: landscape
 *                 images:
 *                   - imageUrl: https://cdn.example.com/places/tegalalang-1.jpg
 *                     displayOrder: 1
 *                   - imageUrl: https://cdn.example.com/places/tegalalang-2.jpg
 *                     displayOrder: 2
 *                 operatingHours:
 *                   - dayOfWeek: MONDAY
 *                     openTime: "08:00"
 *                     closeTime: "18:00"
 *                     isClosed: false
 *                   - dayOfWeek: TUESDAY
 *                     openTime: "08:00"
 *                     closeTime: "18:00"
 *                     isClosed: false
 *       404:
 *         description: Active place not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Active place not found
 *
 * /api/admin/places/summary:
 *   get:
 *     tags: [Admin Places]
 *     summary: Get admin place summary
 *     responses:
 *       200:
 *         description: Place summary fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Place summary fetched
 *               data:
 *                 totalPlaces: 150
 *                 activePlaces: 120
 *                 inactivePlaces: 30
 *                 avgRating: 4.3
 *                 topRatedPlace:
 *                   placeId: 33333333-3333-3333-3333-333333333333
 *                   placeName: Tegallalang Rice Terrace
 *                   ratingValue: 4.9
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
 * /api/admin/places:
 *   get:
 *     tags: [Admin Places]
 *     summary: Get admin places
 *     parameters:
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: categories
 *         description: Comma-separated PlaceCategoryEnum values.
 *         schema:
 *           type: string
 *           example: FOOD,SHOPPING
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [nameAsc, nameDesc, createdAtDesc, createdAtAsc, ratingAsc, ratingDesc]
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
 *         description: Places fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Places fetched
 *               data:
 *                 items:
 *                   - placeId: 33333333-3333-3333-3333-333333333333
 *                     locationId: 22222222-2222-2222-2222-222222222222
 *                     placeName: Tegallalang Rice Terrace
 *                     shortDescription: Sawah terasering populer di Ubud
 *                     address: Gianyar, Bali
 *                     priceMin: 50000
 *                     priceMax: 100000
 *                     priceDescription: tiket masuk
 *                     ratingValue: 4.6
 *                     ratingCount: 1200
 *                     isActive: true
 *                     createdAt: 2026-01-01T00:00:00.000Z
 *                     updatedAt: 2026-05-01T00:00:00.000Z
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
 *
 *   post:
 *     tags: [Admin Places]
 *     summary: Create a place
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlaceRequest'
 *           example:
 *             locationId: 22222222-2222-2222-2222-222222222222
 *             placeName: Tegallalang Rice Terrace
 *             categories:
 *               - 55555555-5555-5555-5555-555555555555
 *             shortDescription: Sawah terasering populer di Ubud
 *             address: Gianyar, Bali
 *             priceMin: 50000
 *             priceMax: 100000
 *             priceDescription: tiket masuk
 *             operatingHours:
 *               - dayOfWeek: MONDAY
 *                 openTime: "08:00"
 *                 closeTime: "18:00"
 *                 isClosed: false
 *             images:
 *               - imageUrl: https://cdn.example.com/places/tegalalang-1.jpg
 *                 displayOrder: 1
 *     responses:
 *       201:
 *         description: Place created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Place created successfully
 *               data:
 *                 placeId: 33333333-3333-3333-3333-333333333333
 *                 locationId: 22222222-2222-2222-2222-222222222222
 *                 placeName: Tegallalang Rice Terrace
 *                 shortDescription: Sawah terasering populer di Ubud
 *                 address: Gianyar, Bali
 *                 priceMin: 50000
 *                 priceMax: 100000
 *                 priceDescription: tiket masuk
 *                 ratingValue: 0
 *                 ratingCount: 0
 *                 isActive: true
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
 *                 placeName:
 *                   - Place name is required
 *                 locationId:
 *                   - Location ID is required
 *
 * /api/admin/places/{placeId}:
 *   get:
 *     tags: [Admin Places]
 *     summary: Get place detail by id
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Place fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Place fetched
 *               data:
 *                 placeId: 33333333-3333-3333-3333-333333333333
 *                 locationId: 22222222-2222-2222-2222-222222222222
 *                 placeName: Tegallalang Rice Terrace
 *                 shortDescription: Sawah terasering populer di Ubud
 *                 address: Gianyar, Bali
 *                 priceMin: 50000
 *                 priceMax: 100000
 *                 priceDescription: tiket masuk
 *                 websiteUrl: https://example.com
 *                 contactPhoneNumber: "08123456789"
 *                 ratingValue: 4.6
 *                 ratingCount: 1200
 *                 isActive: true
 *                 createdAt: 2026-01-01T00:00:00.000Z
 *                 updatedAt: 2026-05-01T00:00:00.000Z
 *                 location:
 *                   locationId: 22222222-2222-2222-2222-222222222222
 *                   locationName: Ubud
 *                 categories:
 *                   - categoryId: 55555555-5555-5555-5555-555555555555
 *                     categoryName: Nature
 *                     categoryIcon: landscape
 *                 images:
 *                   - imageUrl: https://cdn.example.com/places/tegalalang-1.jpg
 *                     displayOrder: 1
 *                 operatingHours:
 *                   - dayOfWeek: MONDAY
 *                     openTime: "08:00"
 *                     closeTime: "18:00"
 *                     isClosed: false
 *       404:
 *         description: Place not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Place not found
 *
 *   patch:
 *     tags: [Admin Places]
 *     summary: Update a place
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePlaceRequest'
 *           example:
 *             placeName: Tegallalang Rice Terrace Updated
 *             shortDescription: Sawah terasering populer di Ubud dengan pemandangan indah
 *             priceMin: 60000
 *             priceMax: 120000
 *     responses:
 *       200:
 *         description: Place updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Place updated successfully
 *               data:
 *                 placeId: 33333333-3333-3333-3333-333333333333
 *                 locationId: 22222222-2222-2222-2222-222222222222
 *                 placeName: Tegallalang Rice Terrace Updated
 *                 shortDescription: Sawah terasering populer di Ubud dengan pemandangan indah
 *                 address: Gianyar, Bali
 *                 priceMin: 60000
 *                 priceMax: 120000
 *                 priceDescription: tiket masuk
 *                 ratingValue: 4.6
 *                 ratingCount: 1200
 *                 isActive: true
 *                 createdAt: 2026-01-01T00:00:00.000Z
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
 *                 priceMin:
 *                   - Must be a positive number
 *       404:
 *         description: Place not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Place not found
 *
 *   delete:
 *     tags: [Admin Places]
 *     summary: Delete a place
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Place deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Place deleted successfully
 *               data: null
 *       400:
 *         description: Place cannot be deleted because it is still referenced.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Place cannot be deleted because it is still referenced
 *       404:
 *         description: Place not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Place not found
 */