export declare const favoriteBusiness: (userId: string, businessId: string) => Promise<unknown>;
export declare const unfavoriteBusiness: (userId: string, businessId: string) => Promise<unknown>;
export declare const favoriteCoupon: (userId: string, couponId: string) => Promise<unknown>;
export declare const unfavoriteCoupon: (userId: string, couponId: string) => Promise<unknown>;
export declare const getFavorites: (userId: string) => Promise<{
    businesses: string[];
    coupons: string[];
}>;
//# sourceMappingURL=favorites.d.ts.map