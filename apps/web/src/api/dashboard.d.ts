export declare const getDashboardData: (userId: string, city: string) => Promise<{
    user: {
        user_id: any;
        email: any;
        city: any;
        interests: any;
        privacy_settings: any;
    };
    hotOffers: {
        id: number;
        title: string;
        description: string;
    }[];
    trendingOffers: {
        id: number;
        title: string;
        description: string;
    }[];
    promotionalAds: {
        id: number;
        title: string;
        imageUrl: string;
    }[];
}>;
//# sourceMappingURL=dashboard.d.ts.map