# Requirements
Functional
FR1 (P1: Core MVP): The system shall allow users to sign up, log in, and log out using Supabase Auth.

FR2 (P1: Core MVP): The system shall enable users to manage their profiles, including name, preferred name, avatar, and contact information.

FR3 (P1: Core MVP): The system shall display a user's online/offline social presence.

FR4 (P1: Core MVP): The system shall provide a user dashboard with navigation, search function, city selection (defaulting to sign-up city), avatar, profile dropdown, notification, Wishlist, promotional ads, coupon wallet, and contacts sidebar.

FR5 (P2: Important): The system shall allow users to find friends using name, contact, or email.

FR6 (P2: Important): The system shall implement a friend system with functionalities for sending, accepting, and declining friend requests, and marking most interacted friends as favorites.

FR7 (P2: Important): The system shall display an activity feed showing check-ins (GPS-based or coupon redemption triggered), coupon redemptions, and social actions.

FR8 (P2: Important): The system shall provide notifications for friend requests, offer updates, and friends’ activity.

FR9 (P2: Important): The system shall allow users to share, accept, and discard coupons with friends (cap of 3 coupons/friend/day, depending on available wallet coupons). [Dependencies: FR5, FR6]

FR10 (P1: Core MVP): The system shall provide a digital wallet for users to store coupons.

FR11 (P1: Core MVP): The system shall enable coupon discovery and in-store redemption.

FR12 (P1: Core MVP): The system shall update the coupon wallet with information on expiry, and friend coupon shares.

FR13 (P2: Important): The system shall feature hot coupon offers and a savings advisor.

FR14 (P1: Core MVP): The system shall allow users to create a Wishlist for products, manually inputted by the user.

FR15 (P2: Important): The system shall allow users to add businesses to their favorites list.

FR16 (P2: Important): The system shall allow users to add coupons to their favorite list.

FR17 (P2: Important): The system shall implement a feedback and review system for businesses, allowing users to "recommend" or "don't recommend".

FR18 (P2: Important): The system shall allow users to add a brief review of up to 30 words about a business they have checked in to. [Dependencies: FR42, FR43]

FR19 (P1: Core MVP): The system shall be a responsive web application built with React, Vite, and Tailwind CSS.

FR20 (P1: Core MVP): The system shall allow business owners to sign up, log in, and log out using Supabase Auth.

FR21 (P1: Core MVP): The system shall enable business owners to manage their profiles, including business name, address, Google location, contact info, open/close times, holidays and logo.

FR22 (P1: Core MVP): The system shall display a business's online/offline (Open/Close) status.

FR23 (P1: Core MVP): The system shall allow businesses to define their category, subcategory, target areas, demographics, average ticket size, and high/low seasons during onboarding or profile updates.

FR24 (P1: Core MVP): The system shall provide business profile pages (digital storefronts) with branding, location, offers, and contact info.

FR25 (P1: Core MVP): The system shall display a list of top 10 trending products on business storefronts, dynamically suggested based on product searches, category searches, coupon categories, user interests, and products in user wishlists. Products replaced are stored as backup for future usage.

FR26 (P2: Important): The system shall display available coupons for storefront visitors.

FR27 (P2: Important): The system shall display trending offers on business storefronts.

FR28 (P1: Core MVP): The system shall provide a business dashboard to manage business profile, offers, and analytics.

FR29 (P1: Core MVP): The system shall allow businesses to view customer engagement and feedback.

FR30 (P2: Important): The system shall allow businesses to identify and analyze consumers classified as "Drivers" based on their contribution to business/category growth. [Dependencies: FR59]

FR31 (P1: Core MVP): The system shall provide a platform owner dashboard with a holistic view of all activities across modules.

FR32 (P1: Core MVP): The system shall enable the platform owner to generate revenue from coupon generation at a fixed rate per coupon (₹2/coupon).

FR33 (P1: Core MVP): The system shall enable the platform owner to generate revenue from promotional banners (₹500/banner/day).

FR34 (P1: Core MVP): The system shall enable the platform owner to generate revenue from push notifications.

FR35 (P1: Core MVP): The system shall enable the platform owner to generate revenue from showing ads in search results (₹500/day for first place).

FR36 (P2: Important): The system shall allow users to choose to get updates only on interests that matter to them.

FR37 (P2: Important): The system shall allow users to update their interests at any point in time.

FR38 (P2: Important): The system shall enforce a minimum of five interests chosen by a user during first login.

FR39 (P2: Important): The system shall allow users to follow and add businesses to favorites to get instant updates.

FR40 (P2: Important): The system shall allow users to find relevant businesses by clicking on a Wishlist item, redirecting to a search page. [Dependencies: FR14, FR25]

FR41 (P1: Core MVP): The system shall allow users to utilize digital coupons at physical stores.

FR42 (P1: Core MVP): The system shall only allow GPS-based check-ins and coupon redemption-triggered check-ins to prevent fake reviews.

FR43 (P1: Core MVP): The system shall automatically record check-ins triggered by coupon redemption without explicit user action.

FR44 (P2: Important): The system shall enable businesses to publish offers, share coupons, and share promotions based on customer demographics.

FR45 (P2: Important): The system shall allow businesses to update utilized coupons to avoid redundancy.

FR46 (P2: Important):: The system shall allow businesses to issue coupons to selected demographics. [Dependencies: FR23]

FR47 (P2: Important): The system shall allow businesses to interact with customers via notifications.

FR48 (P2: Important): The system shall allow businesses to show ads in the app for a cost.

FR49 (P2: Important): The system shall allow businesses to generate coupons for a cost, set T&Cs, and customize distribution. [Dependencies: FR32]

FR50 (P2: Important): The system shall facilitate feedback submission for businesses only in two ways: "recommend" or "don't recommend".

FR51 (P2: Important): The system shall allow users to see who redeemed their shared coupon if that person is a direct friend, contributing to "Driver" mileage. [Dependencies: FR9]

FR52 (P2: Important): The system shall notify the original receiving user if a shared coupon is redeemed by a 2nd, 3rd, or subsequent connection, labeled as "coupon redeemed by [number]th connection". [Dependencies: FR9]

FR53 (P2: Important): The system shall track coupon performance from creation to utilization for metrics and analytics. [Dependencies: FR11, FR45]

FR54 (P2: Important): The system shall generate a new unique identity for a coupon in the backend when shared, nullifying its past identity while retaining a fundamental link to the original offer and business via updated ownership metadata. [Dependencies: FR9]

FR55 (P2: Important): The system shall allow businesses to boost a live coupon or offer, but not cancel, pause, or expire it (except under force majeure).

FR56 (P2: Important): The system shall allow users to follow a business without receiving direct notifications, and enable/disable notifications on the go.

FR57 (P2: Important): Real-time notifications shall include deep links to relevant coupons/storefronts, with a maximum length of 20 words for the notification message.

FR58 (P2: Important): The system shall track ad views, clicks, impressions, engagement duration, along with other industry standard metrics for important elements like coupons, offers, storefront visits, and top products.

FR59 (P2: Important): The system shall identify "Drivers" based on equal weighting of coupon collections, sharing coupons, business check-ins, writing reviews, recommending businesses, and ad/top product interactions.

FR60 (P2: Important): The system shall display a "shining gold ring Driver’s avatar" to indicate privileged status for Driver users.

FR61 (P2: Important): The system shall allow businesses to target "Drivers" during marketing.

FR62 (P2: Important): The system shall generate a unique coupon code based on business ID and receiver ID, tracking the coupon's journey from creation to utilization. [Dependencies: FR49]

FR63 (P2: Important): A coupon can only be utilized once. [Dependencies: FR11]

FR64 (P1: Core MVP): The system shall support Email/password, Mobile/OTP, and social login (OAuth) for users.

FR65 (P1: Core MVP): The system shall provide password reset and email verification functionalities.

FR66 (P1: Core MVP): The system shall allow the platform owner to change business visibility or block spammy businesses.

FR67 (P1: Core MVP): The system shall provide a platform owner's dashboard with advanced tracing of revenue from all sources and other important metrics.

FR68 (P2: Important): The system shall store replaced "Top 10 Trending Products" as backup for future usage.

Non Functional
NFR1: The main screens shall load in less than 2 seconds.

NFR2: The system shall provide real-time updates for social and business activity.

NFR3: Authentication shall be securely handled using Supabase.

NFR4: The system shall ensure data privacy and compliance (e.g., GDPR/CCPA placeholder).

NFR5: The backend shall support 10,000+ concurrent users.

NFR6: The backend shall be modular (Supabase, serverless functions).

NFR7: The system shall target 99.9% uptime.

NFR8: The system shall have automated backups and disaster recovery.

NFR9: The UI shall maintain a consistent color scheme (see constants/Colors.ts).

NFR10: The UI shall be modern and visually appealing. Adherence to WCAG 2.1 AA standards is an aspiration, to be pursued if it does not impact budget or time constraints.

NFR11: The notification system shall utilize industry best practices for throttling and grouping similar notifications, with an option for the platform owner to change these settings dynamically.

NFR12: Business account loss shall be recoverable via valid verification and two-factor authentication, following industry best practices.

NFR13: The system shall maintain acceptable resource utilization (CPU, memory, network bandwidth) during normal operations, with defined thresholds for peak load (e.g., CPU < 70%, memory < 80%).

NFR14: The system shall include comprehensive security testing as part of the development lifecycle, encompassing Static Application Security Testing (SAST), Dynamic Application Security Testing (DAST), regular vulnerability scans, and penetration testing prior to major releases.

NFR15: The system shall implement specific fault tolerance mechanisms such as retry mechanisms with exponential backoff for external service calls, circuit breakers for critical third-party integrations, and graceful degradation for non-critical failures.

NFR16: The system shall implement comprehensive logging for diagnostics, centralized monitoring with defined alerting thresholds for key metrics, and support for planned maintenance windows to ensure operational viability and effective issue resolution.
