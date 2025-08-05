# Epic 3: Gamified Coupon Lifecycle & Social Sharing
Epic Goal: Implement the full coupon lifecycle, including business generation, user collection, gamified sharing, and in-store redemption, integrated with social features and check-ins to drive engagement.

Story 3.1: Business Offer & Coupon Creation (Priority: High)
As a business owner,

I want to create and publish offers and generate coupons with defined terms and conditions,

so that I can attract and incentivize users.

Acceptance Criteria:

Business owner can access an interface to create new offers.

Business owner can generate coupons linked to specific offers, defining quantity, start/end dates, and terms/conditions.

The system handles billing for coupon generation on a postpaid basis, following the Google Ads model (validating card and keeping it for postpaid bills).

Error messages related to payment issues will follow Google Ads examples (e.g., "Issue with the payment. Please update the payment method").

Business owner can define minimum number of coupons (e.g., 50 coupons) and minimum batch size of 100 for generation.

Coupons table is populated with business_id, title, description, terms_and_conditions, value, start_date, end_date, total_quantity, cost_per_coupon.

Local Testability: API endpoint POST /api/business/offers creates an offer and POST /api/business/offers/{offer_id}/coupons generates coupons, both returning 201 Created. Verification by querying SELECT * FROM public.Coupons WHERE business_id = '{business_id}' AND title = '{coupon_title}'.

Story 3.2: User Coupon Discovery & Collection (Priority: High)
As a user,

I want to discover available coupons from businesses and add them to my digital wallet,

so that I can manage my savings.

Acceptance Criteria:

User can browse and search for coupons from business storefronts or a dedicated coupon discovery section.

User can add available digital coupons to their personal coupon wallet.

The digital coupon wallet displays collected coupons.

UserCoupons table stores coupon_id, user_id, unique_code, collected_at.

Local Testability: API endpoint POST /api/users/{user_id}/coupons/collect adds a coupon to user's wallet. Verification by querying SELECT * FROM public.UserCoupons WHERE user_id = '{user_id}' AND coupon_id = '{coupon_id}'.

Story 3.3: User Profile Social Presence & Friend System (Find/Request) (Priority: High)
As a user,

I want to manage my social presence and find friends,

so that I can connect with my network on SynC.

Acceptance Criteria:

User can see their own and friends' online/offline status.

User can search for other users by name, contact, or email.

User can send friend requests to other users.

Users table is_online status is updated.

Friends table is updated with user_id, friend_id, status ('pending').

Local Testability: API endpoint POST /api/users/{user_id}/friends/request sends a friend request. Verification by querying SELECT status FROM public.Friends WHERE user_id = '{user_id}' AND friend_id = '{friend_id}'.

Story 3.4: Friend System (Accept/Decline/Remove/Block) & Basic Activity Feed (Priority: High)
As a user,

I want to manage my friend requests and existing friends, and see basic activity,

so that I can control my social network.

Acceptance Criteria:

User can accept or decline pending friend requests.

User can view a list of their accepted friends.

User can remove or block existing friends.

User can mark friends as 'most interacted favorites'.

A basic activity feed displays friend requests and new friend connections.

Friends table status is updated ('accepted', 'blocked'), accepted_at is set.

Local Testability: API endpoint PUT /api/users/{user_id}/friends/{friend_id} updates friend status. Verification by querying SELECT status FROM public.Friends WHERE user_id = '{user_id}' AND friend_id = '{friend_id}'.

Story 3.5: Gamified Coupon Sharing (User to User) (Priority: High)
As a user,

I want to share coupons with my friends,

so that we can both benefit and I can earn "Driver" mileage.

Acceptance Criteria:

User can select a coupon from their wallet to share with a chosen friend.

User can share up to 3 coupons per friend per day.

A new unique coupon instance (shared_coupon_instance_id) is created in the backend for the receiver upon sharing, fundamentally linked to the original offer and business.

The sharer's original coupon instance (original_user_coupon_id) is marked as transferred/nullified, making it unusable by the sharer post-transfer.

The receiver is notified of the shared coupon and can choose to accept or decline it. A shared coupon cannot be discarded without first accepting it.

If a coupon is declined, it will be returned to the sender's wallet, and a notification will be sent to the sender about the rejection. This event will be updated in the backend database as part of the coupon's lifecycle for analytics.

Sender can cancel a pending shared coupon before the receiver accepts it.

A confirmation message "Share to [friends name]?" or similar is displayed before final sharing to prevent accidental sharing.

User activity (coupon sharing) is tracked for "Driver" status calculation.

CouponShares table is populated with original_user_coupon_id, sharer_user_id, receiver_user_id, shared_coupon_instance_id, shared_at.

UserCoupons table current_owner_id is updated, and transfer_count is incremented for the original coupon.

Local Testability: API endpoint POST /api/users/{user_id}/coupons/{coupon_id}/share initiates a coupon share. Verification by querying SELECT * FROM public.CouponShares WHERE sharer_user_id = '{user_id}'.

Local Testability: API endpoint POST /api/users/{user_id}/coupons/shared/{share_id}/cancel allows sender to cancel a pending share, returning 200 OK and updating UserCoupons ownership.

Story 3.6: In-Store Coupon Redemption & Auto Check-in (Priority: High)
As a user,

I want to redeem my digital coupons at physical stores,

so that I can avail offers, and my visit is recorded for analytics.

Acceptance Criteria:

User can present a unique digital coupon code (from UserCoupons.unique_code) for in-store redemption.

Upon successful redemption, the coupon is marked as 'redeemed' and becomes unusable (single use only).

The system automatically records a check-in for the user at the business when a coupon is redeemed.

All data about the redeemed coupon is stored for future references, metrics, and analytics.

UserCoupons table is_redeemed and redeemed_at are updated.

UserActivities table is updated with activity_type 'coupon_redeemed' and relevant entity_id (coupon_id, business_id) and activity_data including redeemed_at.

Upon successful redemption, the user is redirected to the business's storefront with an option to leave a review.

Local Testability: API endpoint POST /api/business/{business_id}/redeem processes coupon redemption, returning 200 OK. Verification by querying SELECT is_redeemed, redeemed_at FROM public.UserCoupons JOIN public.Coupons ON UserCoupons.coupon_id = Coupons.coupon_id WHERE UserCoupons.unique_code = '{unique_code}' AND Coupons.business_id = '{business_id}'.

Story 3.7: GPS-Based Check-in (Priority: High)
As a user,

I want to check-in to a business via GPS,

so that my visit is recorded and I am eligible to leave a review.

Acceptance Criteria:

User can initiate a GPS-based check-in at a business.

System verifies user's proximity to the business's registered location using GPS.

Upon successful GPS verification, a check-in is recorded for the user at the business.

Only users with recorded check-ins (GPS-based or coupon redemption-triggered) are eligible to leave reviews for that business.

UserActivities table is updated with activity_type 'check_in' and relevant entity_id (business_id) and activity_data including occurred_at.

Local Testability: API endpoint POST /api/users/{user_id}/checkin/gps records a GPS check-in, returning 200 OK. Verification by querying SELECT * FROM public.UserActivities WHERE user_id = '{user_id}' AND activity_type = 'check_in'.

Story 3.8: Driver Status Calculation & Display (Priority: High)
As a user,

I want my activities to contribute to a "Driver" status,

so that I can achieve privileged recognition and access exclusive benefits.

Acceptance Criteria:

The system calculates a user's "Driver" status based on coupon collections, sharing coupons, business check-ins, review writing, business recommendations (to friends), and ad/top product interactions.

All specified activities (collections, sharing, check-ins, reviews, recommendations, ad/product interactions) contribute equally to "Driver" status calculation by default.

Users who fall within the top 10% of active users in their city (based on these metrics) are marked as "Drivers".

A "shining gold ring Driver’s avatar" is displayed on the user's profile to indicate their privileged status.

The platform owner can dynamically change the weightage of each metric used for "Driver" status calculation.

Users table is_driver flag and driver_score are updated periodically.

Local Testability: A serverless function (e.g., cron-job) triggers the Driver calculation logic. Verification by executing the function and checking is_driver and driver_score for sample users in the Users table.
