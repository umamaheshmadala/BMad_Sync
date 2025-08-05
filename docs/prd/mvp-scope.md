# MVP Scope
Core Features (Must Have)
User Authentication & Profiles: Sign up, login, logout (Supabase Auth); profile management (name, avatar, contact info); social presence (online/offline status).

User Dashboard: Dashboard page with navigation, search, city selection, avatar, profile dropdown, notifications, Wishlist; promotional ads; coupon wallet; contacts sidebar.

Social Networking: Find friends (using Name, Contact, email); friend system (requests, accept/decline, most interacted favorites); activity feed (check-ins, coupon redemptions, social actions); share/accept/discard coupons with friends. Public coupon sharing is a future "nice to have".

Coupons: Digital wallet for coupons; coupon discovery and in-store redemption; coupon wallet updates (expiry, friend shares); hot coupon offers and savings advisor.

Wishlist & Favorites: Wishlist products (manual user input); favorite businesses; favorite coupons.

Feedback: Feedback and review system for businesses (recommend or don’t recommend); brief review (30 words).

Web Support: Responsive web app (React, Vite, Tailwind).

Business Authentication: Sign up, login, logout (Supabase Auth); profile management (Business name, Address, Google location, Contact info, Logo); online presence (Open/Close status).

Business Model: Businesses input their category, subcategory, target areas, demographics, average ticket size, high/low seasons.

Business Storefronts: Business profile pages with branding, location, offers, and contact info; list of top trending products (dynamically suggested based on product searches, category searches, coupon categories, user interests, products in user wishlists); coupons if any for Storefront visitors; trending offers. Customization limited to promotional banners, not layout/section arrangement. Products replaced are stored as backup for future usage.

Business Dashboard: Manage business profile, offers, analytics (weekly summarized reviews, coupon utilization summary, peer performance, marketing effectiveness, recommendations); view customer engagement and feedback; identify consumers who drive revenues ("Drivers"). Businesses can send exclusive coupons to Drivers via targeting.

Platform Owner Dashboard: Holistic view of all activities; revenue tracking per monetization stream (coupon generation, promotional banners, push notifications, search ads). Ability to manage business visibility and block spam.

Out of Scope for MVP
Chat feature within contacts sidebar: Not essential for core problem validation in MVP.

Public coupon sharing: Deferred for Phase 2 due to complexity.

AI agent functionality for generating event items in Wishlist: Deferred for Phase 2 due to complexity.

Videos for storefront media-rich formats: Deferred for Phase 2 due to complexity.

User-initiated event creation/hosting (only listing): Not essential for core problem validation in MVP.

Sharing events with friends for co-shopping/co-planning: Not essential for core problem validation in MVP.

Star ratings for feedback/reviews: Not essential for core problem validation in MVP (simplified "recommend/don't recommend" is sufficient).

Manual check-ins for users: Not essential for core problem validation in MVP (GPS-based/coupon redemption check-ins are prioritized for data integrity).

KYC checks for businesses: Deferred for Phase 2 due to complexity.

Mobile or WhatsApp OTPs for mandatory mobile verification: Deferred for Phase 2 due to complexity.

Multi-city support per user or per business: Deferred for Phase 2 due to complexity.

Detailed pricing tier structure beyond initial variable rates: Not essential for core problem validation in MVP (focus is on problem solving until initial user/business numbers are met).

MVP Success Criteria
SynC effectively connects users with Hyperlocal businesses and facilitates social interaction.

Users engage with digital coupons and incentives.

Businesses broaden their target area, penetration, and demographics with minimal expenditure.

The platform achieves its initial monetization goals through variable rates based on features used.

All modules have valid user flows, navigation, logical inputs, and valid fallbacks without any assumptions or logical gaps.

The system operates with fast load times (<2s for main screens) and real-time updates for social/business activity.

Achieves 99.9% uptime with secure authentication and data privacy.
