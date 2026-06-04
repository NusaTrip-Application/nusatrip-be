export interface UserGrowthItem {
	month: string;
	year: number;
	count: number;
}

export interface PopularDestinationItem {
	locationId: string;
	locationName: string;
	provinceName: string;
	imageUrl: string | null;
	itineraryCount: number;
	percentage: number;
}

export interface RecentUser {
	userId: string;
	fullName: string;
	email: string;
	profilePhotoUrl: string | null;
	createdAt: Date;
}

export interface RecentItinerary {
	itineraryId: string;
	title: string;
	bannerImageUrl: string | null;
	locationName: string;
	userFullName: string;
	ratingValue: number;
	savedCount: number;
	createdAt: Date;
}

export interface RecentReview {
	reviewId: string;
	rating: number;
	comment: string | null;
	createdAt: Date;
	itineraryTitle: string;
	reviewerFullName: string;
	reviewerPhotoUrl: string | null;
}

export interface DashboardData {
	summary: {
		totalUsers: number;
		totalLocations: number;
		totalPlaces: number;
		totalPublishedItineraries: number;
	};
	userGrowth: UserGrowthItem[];
	popularDestinations: PopularDestinationItem[];
	recentUsers: RecentUser[];
	recentPublishedItineraries: RecentItinerary[];
	recentReviews: RecentReview[];
}