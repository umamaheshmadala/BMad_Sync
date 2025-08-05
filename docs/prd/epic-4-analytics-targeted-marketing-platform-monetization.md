# Epic 4: Analytics, Targeted Marketing & Platform Monetization
Epic Goal: Deliver the business analytics dashboard, enable targeted marketing capabilities for businesses, and activate the core monetization streams for the platform owner to track revenue.

Story 4.1: Business Analytics Dashboard (Coupons & Reviews Summary) (Priority: High)
As a business owner,

I want to view weekly summaries of my customer reviews and coupon utilization,

so that I can understand customer engagement and the effectiveness of my offers.

Acceptance Criteria:

Business owner can access a dedicated analytics dashboard.

Dashboard displays daily, weekly, quarterly, and custom period summarized customer reviews, indicating counts for "recommend" and "don't recommend".

Dashboard displays weekly summarized coupon utilization, including number of coupons redeemed and overall redemption rate.

Analytics data is calculated and viewable per store, per business category, and can consider other demographics or locations.

Data from BusinessReviews and UserCoupons tables (specifically is_redeemed status) is accurately used for calculations.

Local Testability: API endpoint GET /api/business/{business_id}/analytics/reviews returns review summaries. Verification by querying SELECT recommend_status, review_text FROM public.BusinessReviews WHERE business_id = '{business_id}'.

Local Testability: API endpoint GET /api/business/{business_id}/analytics/coupons returns coupon utilization summaries. Verification by querying SELECT is_redeemed FROM public.UserCoupons JOIN public.Coupons ON UserCoupons.coupon_id = Coupons.coupon_id WHERE Coupons.business_id = '{business_id}'.

Story 4.2: Business Analytics Dashboard (Performance Trends & Recommendations) (Priority: High)
As a business owner,

I want to see trends of my peer's performance and receive marketing recommendations,

so that I can benchmark my business and refine my strategies.

Acceptance Criteria:

Dashboard displays trends of peer's performance for businesses within similar categories.

Dashboard displays marketing effectiveness metrics for all generated ads, offers, promotions, and coupons.

Dashboard provides marketing recommendations based on the analyzed analytics data.

Businesses can use these analytics to take actions such as sending follow-up coupons, creating new offers based on customer response, curating needs/interests, identifying Drivers, and phasing out underperforming marketing.

Data from Ads, Promotions, Coupons tables, and UserActivities (ad views, clicks, impressions, engagement duration, coupon collections, storefront visits, top product interactions) is utilized for these analytics.

Local Testability: API endpoint GET /api/business/{business_id}/analytics/trends returns peer and marketing trends data. Verification by checking returned JSON structure against expected metrics derived from Ads, Promotions, UserActivities data.

Story 4.3: Business Targeted Coupon Issuance (Priority: High)
As a business owner,

I want to issue coupons to selected demographics,

so that I can conduct bullseye marketing campaigns.

Acceptance Criteria:

Business owner can access an interface to define targeting parameters for coupon issuance.

Targeting parameters can be specified based on individual or a combination of: User Interests (utmost priority), Location Interests, Past behavior, Driver status (true/false), checked-in customers, businesses followers, and users who recommended or don’t recommend.

Businesses can issue exclusive coupons specifically to identified "Drivers".

The system ensures that businesses can only target groups/categories of users, not view or target individual Driver profiles by name or personal info.

Coupons table includes fields (e.g., target_parameters JSONB) to store the targeting criteria for each coupon issuance.

Local Testability: API endpoint POST /api/business/coupons/issue-targeted issues coupons based on targeting, returning 200 OK. Verification by querying SELECT coupon_id, target_parameters FROM public.Coupons WHERE business_id = '{business_id}' AND target_parameters IS NOT NULL.

Story 4.4: Business Ad & Promotion Management (Priority: High)
As a business owner,

I want to show my ads and publish promotions in the app,

so that I can increase visibility and reach.

Acceptance Criteria:

Business owner can create and manage promotional banners (ad_type 'banner').

Business owner can manage their storefront (including offers and promotions) on the go.

Business owner pays a cost for displaying ads (currently ₹500/banner/day), managed on a postpaid billing basis following the Google Ads model.

Ads and Promotions tables are populated with business_id, title, description, target_parameters, start_date, end_date. Ads table also includes ad_type, image_url, cost_per_day.

Local Testability: API endpoint POST /api/business/ads creates an ad, returning 201 Created. Verification by querying SELECT * FROM public.Ads WHERE business_id = '{business_id}' AND title = '{ad_title}'.

Story 4.5: Platform Owner Dashboard & Core Revenue Tracking (Priority: High)
As a Platform Owner,

I want a holistic view of platform activities and to track revenue from core monetization streams,

so that I can manage the platform and its financial performance.

Acceptance Criteria:

Platform owner can access a dedicated dashboard with a holistic view of all activities across all modules.

Dashboard displays advanced tracing of revenue from coupon generation.

Dashboard displays advanced tracing of revenue from promotional banners.

Dashboard displays advanced tracing of revenue from showing ads in search results.

Dashboard displays advanced tracing of revenue from push notifications.

The dashboard provides revenue metrics such as weekly, monthly, quarterly, and seasonal reports.

RevenueTracking table accurately records source_type, associated_entity_id, business_id, amount, and transaction_date for each revenue event.

Local Testability: API endpoint GET /api/platform/revenue returns aggregated revenue data. Verification by inspecting the returned JSON for correct revenue breakdowns (e.g., {"coupon_revenue": 10000, "ad_revenue": 5000}).

Story 4.6: Platform Owner Business Management & Pricing Configuration (Priority: High)
As a Platform Owner,

I want to manage business visibility and configure pricing,

so that I can maintain platform quality and control monetization.

Acceptance Criteria:

Platform owner can change the visibility status of any business (e.g., hide from search results).

Platform owner can block spammy businesses from the platform.

Platform owner can configure variable rates for features used, including coupon generation (₹2/coupon), ad banners (₹500/banner/day), and first place in search results (₹500/day).

Platform owner can set and modify pricing for any other future monetization elements as needed.

PlatformConfig table stores configurable pricing key_name and config_value (JSONB).

PlatformOwnerActivities table records actions like change_business_visibility, block_spam, and update_pricing.

Local Testability: API endpoint PUT /api/platform/config/pricing updates pricing configuration. Verification by querying SELECT config_value FROM public.PlatformConfig WHERE key_name = 'pricing_rates'.
