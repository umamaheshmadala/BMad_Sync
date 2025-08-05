# Information Architecture (IA)
Site Map / Screen Inventory
The overall structure of the SynC application is organized around key user and business functions:

Code snippet

graph TD
    A[Public/Auth Screens] --> A1(Login/Signup)
    A1 --> B(User Dashboard)
    A1 --> C(Business Dashboard)

    B --> B1(Hyperlocal Businesses Explore)
    B --> B2(Coupon Wallet)
    B --> B3(Friends & Activity Feed)
    B --> B4(Wishlist & Favorites)
    B --> B5(User Profile Management)
    B --> B6(Notifications Center)
    B --> B7(Feedback & Review Submission)
    B1 --> B1.1(Hyperlocal Business Storefront)
    B1.1 --> B1.1.1(Coupon Collection)
    B1.1 --> B1.1.2(Review Submission)

    C --> C1(Business Storefront Management)
    C --> C2(Offer & Coupon Creation)
    C --> C3(Business Analytics Dashboard)
    C --> C4(Business Profile Management)
    C --> C5(Ad & Promotion Management)

    D[Platform Owner Dashboard] --> D1(Revenue Tracking)
    D --> D2(Business Management)
    D --> D3(Pricing Configuration)

    B --- D(Platform Owner Dashboard)
    C --- D
Navigation Structure
Primary Navigation: Prominent global navigation on both User and Business Dashboards, providing access to core sections (e.g., Explore, Wallet, Friends, Storefront Management, Analytics).

Secondary Navigation: Contextual navigation within major sections (e.g., filters within Coupon Wallet, sub-sections within Analytics Dashboard).

Breadcrumb Strategy: A subtle breadcrumb navigation will be used for deeper pages (e.g., within a business storefront or a specific analytics report) to indicate the user's current location within the hierarchy.
