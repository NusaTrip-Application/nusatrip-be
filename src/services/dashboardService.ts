import DashboardRepository from "../repositories/dashboardRepository";
import type { DashboardData } from "../types/dashboardType";

class DashboardService {
	static async getDashboardData(): Promise<DashboardData> {
		const [
			totalUsers,
			totalLocations,
			totalPlaces,
			totalPublishedItineraries,
			userGrowth,
			popularDestinations,
			recentUsers,
			recentPublishedItineraries,
			recentReviews,
		] = await Promise.all([
			DashboardRepository.getTotalUsers(),
			DashboardRepository.getTotalLocations(),
			DashboardRepository.getTotalPlaces(),
			DashboardRepository.getTotalPublishedItineraries(),
			DashboardRepository.getUserGrowth(6),
			DashboardRepository.getPopularDestinations(5),
			DashboardRepository.getRecentUsers(5),
			DashboardRepository.getRecentPublishedItineraries(5),
			DashboardRepository.getRecentReviews(5),
		]);

		return {
			summary: {
				totalUsers,
				totalLocations,
				totalPlaces,
				totalPublishedItineraries,
			},
			userGrowth,
			popularDestinations,
			recentUsers,
			recentPublishedItineraries,
			recentReviews,
		};
	}
}

export default DashboardService;