# Core Workflows
User Sign-up & First Coupon Collection Sequence
Code snippet

sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant SA as Supabase Auth
    participant SDB as Supabase DB

    U->>F: Navigate to /signup
    F->>U: Display Signup Form
    U->>F: Submit email, password
    F->>B: POST /api/auth/signup (email, password)
    B->>SA: Call Auth Service (create user)
    SA->>B: User created (user_id)
    B->>SDB: Insert initial User profile
    SDB->>B: User profile saved
    B->>F: 200 OK (user_id, session_token)
    F->>U: Redirect to /onboarding/profile
    U->>F: Complete profile form (name, avatar)
    F->>B: PUT /api/users/{user_id}/profile
    B->>SDB: Update User profile
    SDB->>B: Profile updated
    B->>F: 200 OK
    F->>U: Redirect to /onboarding/interests
    U->>F: Select city, interests
    F->>B: PUT /api/users/{user_id}/profile/interests
    B->>SDB: Update User interests
    SDB->>B: Interests saved
    B->>F: 200 OK
    F->>U: Redirect to /dashboard
    U->>F: View Dashboard (hot/trending offers)
    F->>B: GET /api/users/{user_id}/dashboard
    B->>SDB: Fetch personalized offers/ads
    SDB->>B: Data returned
    B->>F: 200 OK (dashboard data)
    F->>U: Display Dashboard
    U->>F: Click "Collect Coupon" on offer
    F->>B: POST /api/users/{user_id}/coupons/collect (coupon_id)
    B->>SDB: Insert UserCoupon instance
    SDB->>B: UserCoupon saved
    B->>F: 201 Created (user_coupon_id)
    F->>U: Display "Coupon Collected!" confirmation