# API Specification
The system will primarily expose a RESTful API through Serverless Functions (Supabase Edge Functions and Netlify Functions).

Example API Endpoints (Conceptual)
User Authentication:

POST /api/auth/signup: User registration.

Request: { email: "string", password: "string" }

Response: 200 OK { user_id, session_token }

POST /api/auth/login: User login.

Request: { email: "string", password: "string" }

Response: 200 OK { user_id, session_token }

User Profile & Dashboard:

PUT /api/users/{userId}/profile: Update user profile.

Request: { full_name?, preferred_name?, avatar_url?, city?, interests? }

Response: 200 OK

GET /api/users/{userId}/dashboard: Retrieve personalized dashboard data.

Response: 200 OK { hotOffers: Coupon[], trendingOffers: Coupon[], ads: Ad[], ... }

Coupon Management:

POST /api/users/{userId}/coupons/collect: Collect a new coupon.

Request: { coupon_id: "string" }

Response: 201 Created { user_coupon_id }

POST /api/business/{businessId}/redeem: Redeem a coupon in-store.

Request: { unique_code: "string" }

Response: 200 OK { status: "redeemed", checkin_recorded: true }

Coupon Sharing:

POST /api/users/{userId}/coupons/{userCouponId}/share: Share a coupon with a friend.

Request: { friend_id: "string" }

Response: 201 Created { share_id, new_user_coupon_id }

POST /api/users/{userId}/coupons/shared/{shareId}/accept: Accept a shared coupon.

POST /api/users/{userId}/coupons/shared/{shareId}/decline: Decline a shared coupon.

POST /api/users/{userId}/coupons/shared/{shareId}/cancel: Sender cancels pending shared coupon.
