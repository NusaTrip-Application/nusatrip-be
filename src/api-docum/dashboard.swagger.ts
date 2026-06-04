/**
 * @openapi
 * /api/admin/dashboard:
 *   get:
 *     tags: [Admin Dashboard]
 *     summary: Get admin dashboard data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *             example:
 *               success: true
 *               message: Dashboard data fetched successfully
 *               data:
 *                 summary:
 *                   totalUsers: 150
 *                   totalLocations: 20
 *                   totalPlaces: 250
 *                   totalPublishedItineraries: 80
 *                 userGrowth:
 *                   - month: Jan
 *                     year: 2026
 *                     count: 25
 *                   - month: Feb
 *                     year: 2026
 *                     count: 30
 *                   - month: Mar
 *                     year: 2026
 *                     count: 20
 *                   - month: Apr
 *                     year: 2026
 *                     count: 35
 *                   - month: May
 *                     year: 2026
 *                     count: 40
 *                   - month: Jun
 *                     year: 2026
 *                     count: 0
 *                 popularDestinations:
 *                   - locationId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                     locationName: Bali
 *                     provinceName: Bali
 *                     imageUrl: https://cdn.example.com/bali.jpg
 *                     itineraryCount: 30
 *                     percentage: 100
 *                   - locationId: cccccccc-cccc-cccc-cccc-cccccccccccc
 *                     locationName: Yogyakarta
 *                     provinceName: D.I. Yogyakarta
 *                     imageUrl: https://cdn.example.com/yogyakarta.jpg
 *                     itineraryCount: 25
 *                     percentage: 83
 *                   - locationId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                     locationName: Bandung
 *                     provinceName: Jawa Barat
 *                     imageUrl: https://cdn.example.com/bandung.jpg
 *                     itineraryCount: 20
 *                     percentage: 67
 *                   - locationId: eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee
 *                     locationName: Lombok
 *                     provinceName: Nusa Tenggara Barat
 *                     imageUrl: https://cdn.example.com/lombok.jpg
 *                     itineraryCount: 15
 *                     percentage: 50
 *                   - locationId: ffffffff-ffff-ffff-ffff-ffffffffffff
 *                     locationName: Raja Ampat
 *                     provinceName: Papua Barat
 *                     imageUrl: https://cdn.example.com/rajaampat.jpg
 *                     itineraryCount: 10
 *                     percentage: 33
 *                 recentUsers:
 *                   - userId: 11111111-1111-1111-1111-111111111111
 *                     fullName: Budi Santoso
 *                     email: budi@example.com
 *                     profilePhotoUrl: https://cdn.example.com/users/budi.jpg
 *                     createdAt: 2026-06-01T10:00:00.000Z
 *                   - userId: 22222222-2222-2222-2222-222222222222
 *                     fullName: Sari Wulandari
 *                     email: sari@example.com
 *                     profilePhotoUrl: null
 *                     createdAt: 2026-06-01T09:30:00.000Z
 *                   - userId: 33333333-3333-3333-3333-333333333333
 *                     fullName: Agung Prasetyo
 *                     email: agung@example.com
 *                     profilePhotoUrl: https://cdn.example.com/users/agung.jpg
 *                     createdAt: 2026-06-01T08:45:00.000Z
 *                   - userId: 44444444-4444-4444-4444-444444444444
 *                     fullName: Dina Maharani
 *                     email: dina@example.com
 *                     profilePhotoUrl: null
 *                     createdAt: 2026-05-31T17:20:00.000Z
 *                   - userId: 55555555-5555-5555-5555-555555555555
 *                     fullName: Rendi Hermawan
 *                     email: rendi@example.com
 *                     profilePhotoUrl: https://cdn.example.com/users/rendi.jpg
 *                     createdAt: 2026-05-31T16:00:00.000Z
 *                 recentPublishedItineraries:
 *                   - itineraryId: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
 *                     title: 3D2N Bali Healing Trip
 *                     bannerImageUrl: https://cdn.example.com/bali.jpg
 *                     locationName: Bali
 *                     userFullName: Budi Santoso
 *                     ratingValue: 4.8
 *                     savedCount: 50
 *                     createdAt: 2026-06-01T10:00:00.000Z
 *                   - itineraryId: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
 *                     title: 2D1N Yogyakarta Heritage Tour
 *                     bannerImageUrl: https://cdn.example.com/yogyakarta.jpg
 *                     locationName: Yogyakarta
 *                     userFullName: Sari Wulandari
 *                     ratingValue: 4.5
 *                     savedCount: 35
 *                     createdAt: 2026-05-31T15:00:00.000Z
 *                   - itineraryId: cccccccc-cccc-cccc-cccc-cccccccccccc
 *                     title: Weekend Bandung Culinary
 *                     bannerImageUrl: https://cdn.example.com/bandung.jpg
 *                     locationName: Bandung
 *                     userFullName: Agung Prasetyo
 *                     ratingValue: 4.2
 *                     savedCount: 28
 *                     createdAt: 2026-05-30T14:00:00.000Z
 *                   - itineraryId: dddddddd-dddd-dddd-dddd-dddddddddddd
 *                     title: 4D3N Lombok Adventure
 *                     bannerImageUrl: https://cdn.example.com/lombok.jpg
 *                     locationName: Lombok
 *                     userFullName: Dina Maharani
 *                     ratingValue: 4.9
 *                     savedCount: 42
 *                     createdAt: 2026-05-29T12:00:00.000Z
 *                   - itineraryId: eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee
 *                     title: 5D4N Raja Ampat Expedition
 *                     bannerImageUrl: https://cdn.example.com/rajaampat.jpg
 *                     locationName: Raja Ampat
 *                     userFullName: Rendi Hermawan
 *                     ratingValue: 0
 *                     savedCount: 15
 *                     createdAt: 2026-05-28T10:00:00.000Z
 *                 recentReviews:
 *                   - reviewId: 11111111-1111-1111-1111-111111111111
 *                     rating: 5
 *                     comment: Perjalanan yang luar biasa! Semua tempat yang disarankan sangat indah.
 *                     createdAt: 2026-06-01T10:00:00.000Z
 *                     itineraryTitle: 3D2N Bali Healing Trip
 *                     reviewerFullName: Sari Wulandari
 *                     reviewerPhotoUrl: https://cdn.example.com/users/sari.jpg
 *                   - reviewId: 22222222-2222-2222-2222-222222222222
 *                     rating: 4
 *                     comment: Itinerary yang sangat membantu untuk planning perjalanan.
 *                     createdAt: 2026-05-31T15:00:00.000Z
 *                     itineraryTitle: 2D1N Yogyakarta Heritage Tour
 *                     reviewerFullName: Budi Santoso
 *                     reviewerPhotoUrl: null
 *                   - reviewId: 33333333-3333-3333-3333-333333333333
 *                     rating: 5
 *                     comment: Recommended banget untuk yang pertama kali ke Bandung!
 *                     createdAt: 2026-05-30T14:00:00.000Z
 *                     itineraryTitle: Weekend Bandung Culinary
 *                     reviewerFullName: Dina Maharani
 *                     reviewerPhotoUrl: https://cdn.example.com/users/dina.jpg
 *                   - reviewId: 44444444-4444-4444-4444-444444444444
 *                     rating: 4
 *                     comment: Tempat wisata yang bagus, tapi cuaca kurang mendukung.
 *                     createdAt: 2026-05-29T12:00:00.000Z
 *                     itineraryTitle: 4D3N Lombok Adventure
 *                     reviewerFullName: Agung Prasetyo
 *                     reviewerPhotoUrl: https://cdn.example.com/users/agung.jpg
 *                   - reviewId: 55555555-5555-5555-5555-555555555555
 *                     rating: 5
 *                     comment: Seru banget! Tidak sabar untuk coba itinerary lainnya.
 *                     createdAt: 2026-05-28T10:00:00.000Z
 *                     itineraryTitle: 5D4N Raja Ampat Expedition
 *                     reviewerFullName: Rendi Hermawan
 *                     reviewerPhotoUrl: https://cdn.example.com/users/rendi.jpg
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