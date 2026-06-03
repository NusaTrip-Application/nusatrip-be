/**
 * @openapi
 * /api/locations/provinces:
 *   get:
 *     tags: [Locations]
 *     summary: Get active provinces
 *     security: []
 *     responses:
 *       200:
 *         description: Provinces fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Provinces fetched successfully
 *               data:
 *                 - provinceId: 11111111-1111-1111-1111-111111111111
 *                   provinceName: Bali
 *                 - provinceId: 22222222-2222-2222-2222-222222222222
 *                   provinceName: Yogyakarta
 *                 - provinceId: 33333333-3333-3333-3333-333333333333
 *                   provinceName: East Java
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Internal server error
 *
 * /api/locations/options:
 *   get:
 *     tags: [Locations]
 *     summary: Get active location options
 *     security: []
 *     responses:
 *       200:
 *         description: Location options fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Location options fetched successfully
 *               data:
 *                 - locationId: 44444444-4444-4444-4444-444444444444
 *                   locationName: Ubud
 *                   provinceName: Bali
 *                 - locationId: 55555555-5555-5555-5555-555555555555
 *                   locationName: Sleman
 *                   provinceName: Yogyakarta
 *                 - locationId: 66666666-6666-6666-6666-666666666666
 *                   locationName: Malang
 *                   provinceName: East Java
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Internal server error
 *
 * /api/locations:
 *   get:
 *     tags: [Locations]
 *     summary: Get public locations
 *     description: Returns active locations for public discovery with search, province, and pagination support.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: bali
 *       - in: query
 *         name: provinceId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [nameAsc, nameDesc, createdAtAsc, createdAtDesc]
 *           default: nameAsc
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
 *         description: Locations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Locations fetched successfully
 *               data:
 *                 items:
 *                   - locationId: 44444444-4444-4444-4444-444444444444
 *                     provinceId: 11111111-1111-1111-1111-111111111111
 *                     locationName: Ubud
 *                     description: Kawasan wisata budaya dan alam
 *                     imageUrl: https://cdn.example.com/ubud.jpg
 *                     isActive: true
 *                     createdAt: 2026-05-01T10:00:00.000Z
 *                     updatedAt: 2026-05-05T10:00:00.000Z
 *                     province:
 *                       provinceId: 11111111-1111-1111-1111-111111111111
 *                       provinceName: Bali
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
 *
 * /api/locations/{locationId}:
 *   get:
 *     tags: [Locations]
 *     summary: Get public location detail
 *     security: []
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Location fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Location fetched successfully
 *               data:
 *                 locationId: 44444444-4444-4444-4444-444444444444
 *                 provinceId: 11111111-1111-1111-1111-111111111111
 *                 locationName: Ubud
 *                 description: Kawasan wisata budaya dan alam di Bali
 *                 imageUrl: https://cdn.example.com/ubud.jpg
 *                 isActive: true
 *                 createdAt: 2026-01-01T00:00:00.000Z
 *                 updatedAt: 2026-05-01T00:00:00.000Z
 *                 province:
 *                   provinceId: 11111111-1111-1111-1111-111111111111
 *                   provinceName: Bali
 *       404:
 *         description: Active location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Active location not found
 *
 * /api/admin/locations/summary:
 *   get:
 *     tags: [Admin Locations]
 *     summary: Get admin location summary
 *     responses:
 *       200:
 *         description: Location summary fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Location summary fetched
 *               data:
 *                 totalLocations: 50
 *                 activeLocations: 40
 *                 inactiveLocations: 10
 *                 topLocation:
 *                   locationId: 44444444-4444-4444-4444-444444444444
 *                   locationName: Ubud
 *                   placeCount: 25
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
 * /api/admin/locations:
 *   get:
 *     tags: [Admin Locations]
 *     summary: Get admin locations
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: provinceId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [nameAsc, nameDesc, createdAtAsc, createdAtDesc]
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
 *         description: Locations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Locations fetched
 *               data:
 *                 items:
 *                   - locationId: 44444444-4444-4444-4444-444444444444
 *                     provinceId: 11111111-1111-1111-1111-111111111111
 *                     locationName: Ubud
 *                     description: Kawasan wisata budaya dan alam
 *                     imageUrl: https://cdn.example.com/ubud.jpg
 *                     isActive: true
 *                     createdAt: 2026-01-01T00:00:00.000Z
 *                     updatedAt: 2026-05-01T00:00:00.000Z
 *                     province:
 *                       provinceId: 11111111-1111-1111-1111-111111111111
 *                       provinceName: Bali
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
 *   post:
 *     tags: [Admin Locations]
 *     summary: Create a location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLocationRequest'
 *           example:
 *             provinceId: 11111111-1111-1111-1111-111111111111
 *             locationName: Ubud
 *             description: Kawasan wisata budaya dan alam
 *             imageUrl: https://cdn.example.com/ubud.jpg
 *     responses:
 *       201:
 *         description: Location created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Location created successfully
 *               data:
 *                 locationId: 44444444-4444-4444-4444-444444444444
 *                 provinceId: 11111111-1111-1111-1111-111111111111
 *                 locationName: Ubud
 *                 description: Kawasan wisata budaya dan alam
 *                 imageUrl: https://cdn.example.com/ubud.jpg
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
 *                 locationName:
 *                   - Location name is required
 *                 provinceId:
 *                   - Province ID is required
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
 * /api/admin/locations/{locationId}:
 *   get:
 *     tags: [Admin Locations]
 *     summary: Get location detail by id
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Location fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Location fetched
 *               data:
 *                 locationId: 44444444-4444-4444-4444-444444444444
 *                 provinceId: 11111111-1111-1111-1111-111111111111
 *                 locationName: Ubud
 *                 description: Kawasan wisata budaya dan alam
 *                 imageUrl: https://cdn.example.com/ubud.jpg
 *                 isActive: true
 *                 createdAt: 2026-01-01T00:00:00.000Z
 *                 updatedAt: 2026-05-01T00:00:00.000Z
 *                 province:
 *                   provinceId: 11111111-1111-1111-1111-111111111111
 *                   provinceName: Bali
 *       404:
 *         description: Location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Location not found
 *
 *   patch:
 *     tags: [Admin Locations]
 *     summary: Update a location
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLocationRequest'
 *           example:
 *             locationName: Ubud Updated
 *             description: Kawasan wisata budaya dan alam di Bali yang terkenal
 *     responses:
 *       200:
 *         description: Location updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Location updated successfully
 *               data:
 *                 locationId: 44444444-4444-4444-4444-444444444444
 *                 provinceId: 11111111-1111-1111-1111-111111111111
 *                 locationName: Ubud Updated
 *                 description: Kawasan wisata budaya dan alam di Bali yang terkenal
 *                 imageUrl: https://cdn.example.com/ubud.jpg
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
 *                 locationName:
 *                   - Location name must be at least 3 characters
 *       404:
 *         description: Location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Location not found
 *
 *   delete:
 *     tags: [Admin Locations]
 *     summary: Delete a location
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Location deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Location deleted successfully
 *               data: null
 *       404:
 *         description: Location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Location not found
 *
 * /api/admin/locations/{locationId}/status:
 *   patch:
 *     tags: [Admin Locations]
 *     summary: Change location active status
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeLocationStatusRequest'
 *           example:
 *             isActive: false
 *     responses:
 *       200:
 *         description: Location status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Location status updated successfully
 *               data:
 *                 locationId: 44444444-4444-4444-4444-444444444444
 *                 provinceId: 11111111-1111-1111-1111-111111111111
 *                 locationName: Ubud
 *                 description: Kawasan wisata budaya dan alam
 *                 imageUrl: https://cdn.example.com/ubud.jpg
 *                 isActive: false
 *                 createdAt: 2026-01-01T00:00:00.000Z
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
 *                 isActive:
 *                   - Required
 *       404:
 *         description: Location not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Location not found
 */