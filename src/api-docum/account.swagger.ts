/**
 * @openapi
 * /api/accounts/register:
 *   post:
 *     tags: [Accounts]
 *     summary: Register account
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAccountRequest'
 *           example:
 *             fullName: Budi Santoso
 *             email: budi@example.com
 *             password: password123
 *     responses:
 *       201:
 *         description: Account registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Account registered successfully
 *               data:
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 fullName: Budi Santoso
 *                 email: budi@example.com
 *                 accountStatus: ACTIVE
 *                 createdAt: 2026-06-01T10:00:00.000Z
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
 *                 email:
 *                   - Invalid email format
 *                 password:
 *                   - Password must be at least 8 characters
 *       409:
 *         description: Email already in use.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: Email already in use
 *
 * /api/accounts/me:
 *   get:
 *     tags: [Accounts]
 *     summary: Get my profile
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Profile fetched
 *               data:
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 fullName: Budi Santoso
 *                 email: budi@example.com
 *                 phoneNumber: "08123456789"
 *                 instagramUsername: budi.santoso
 *                 profilePhotoUrl: https://cdn.example.com/users/budi.jpg
 *                 accountStatus: ACTIVE
 *                 createdAt: 2026-01-15T08:00:00.000Z
 *                 updatedAt: 2026-05-20T12:00:00.000Z
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
 *   patch:
 *     tags: [Accounts]
 *     summary: Update my profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAccountRequest'
 *           example:
 *             fullName: Budi Santoso Updated
 *             phoneNumber: "081234567890"
 *             instagramUsername: budi.santoso_
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Profile updated successfully
 *               data:
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 fullName: Budi Santoso Updated
 *                 email: budi@example.com
 *                 phoneNumber: "081234567890"
 *                 instagramUsername: budi.santoso_
 *                 profilePhotoUrl: https://cdn.example.com/users/budi.jpg
 *                 accountStatus: ACTIVE
 *                 createdAt: 2026-01-15T08:00:00.000Z
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
 *                 fullName:
 *                   - Full name must be at least 3 characters
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
 * /api/accounts/{userId}:
 *   get:
 *     tags: [Accounts]
 *     summary: Get public profile
 *     description: Requires authentication and returns public profile data for another user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Profile fetched
 *               data:
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 fullName: Budi Santoso
 *                 profilePhotoUrl: https://cdn.example.com/users/budi.jpg
 *                 instagramUsername: budi.santoso
 *                 accountStatus: ACTIVE
 *                 createdAt: 2026-01-15T08:00:00.000Z
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
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: User not found
 *
 * /api/admin/accounts/users:
 *   post:
 *     tags: [Admin Accounts]
 *     summary: Admin create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminCreateUserRequest'
 *           example:
 *             fullName: Siti Nurhaliza
 *             email: siti@example.com
 *             password: password123
 *             phoneNumber: "081234567891"
 *             instagramUsername: siti.nurhaliza
 *             accountStatus: ACTIVE
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: User created successfully
 *               data:
 *                 userId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                 fullName: Siti Nurhaliza
 *                 email: siti@example.com
 *                 phoneNumber: "081234567891"
 *                 instagramUsername: siti.nurhaliza
 *                 profilePhotoUrl: null
 *                 accountStatus: ACTIVE
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
 *                 email:
 *                   - Invalid email format
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
 *   get:
 *     tags: [Admin Accounts]
 *     summary: Admin list users
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [nameAsc, nameDesc, createdAtAsc, createdAtDesc]
 *           default: createdAtDesc
 *       - in: query
 *         name: accountStatus
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, BANNED]
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
 *         description: User accounts fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: User accounts fetched
 *               data:
 *                 items:
 *                   - userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                     fullName: Budi Santoso
 *                     email: budi@example.com
 *                     phoneNumber: "08123456789"
 *                     instagramUsername: budi.santoso
 *                     profilePhotoUrl: https://cdn.example.com/users/budi.jpg
 *                     accountStatus: ACTIVE
 *                     createdAt: 2026-01-15T08:00:00.000Z
 *                     updatedAt: 2026-05-20T12:00:00.000Z
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
 * /api/admin/accounts/users/{userId}:
 *   get:
 *     tags: [Admin Accounts]
 *     summary: Admin get user by id
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User account fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: User account fetched
 *               data:
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 fullName: Budi Santoso
 *                 email: budi@example.com
 *                 phoneNumber: "08123456789"
 *                 instagramUsername: budi.santoso
 *                 profilePhotoUrl: https://cdn.example.com/users/budi.jpg
 *                 accountStatus: ACTIVE
 *                 createdAt: 2026-01-15T08:00:00.000Z
 *                 updatedAt: 2026-05-20T12:00:00.000Z
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
 *       404:
 *         description: User not found.
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiError'
 *               example:
 *                 success: false
 *                 message: User not found
 *
 *   patch:
 *     tags: [Admin Accounts]
 *     summary: Admin update user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAccountRequest'
 *           example:
 *             fullName: Budi Santoso Updated
 *             phoneNumber: "081234567890"
 *     responses:
 *       200:
 *         description: User account updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: User account updated successfully
 *               data:
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 fullName: Budi Santoso Updated
 *                 email: budi@example.com
 *                 phoneNumber: "081234567890"
 *                 instagramUsername: budi.santoso
 *                 profilePhotoUrl: https://cdn.example.com/users/budi.jpg
 *                 accountStatus: ACTIVE
 *                 createdAt: 2026-01-15T08:00:00.000Z
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
 *                 email:
 *                   - Invalid email format
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: User not found
 *
 * /api/admin/accounts/users/{userId}/status:
 *   patch:
 *     tags: [Admin Accounts]
 *     summary: Admin change user status
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeUserStatusRequest'
 *           example:
 *             accountStatus: INACTIVE
 *     responses:
 *       200:
 *         description: User account status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: User account status updated successfully
 *               data:
 *                 userId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                 fullName: Budi Santoso
 *                 email: budi@example.com
 *                 phoneNumber: "08123456789"
 *                 instagramUsername: budi.santoso
 *                 profilePhotoUrl: https://cdn.example.com/users/budi.jpg
 *                 accountStatus: INACTIVE
 *                 createdAt: 2026-01-15T08:00:00.000Z
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
 *                 accountStatus:
 *                   - Invalid account status value
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               success: false
 *               message: User not found
 */