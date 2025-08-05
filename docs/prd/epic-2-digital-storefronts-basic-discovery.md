# Epic 2: Digital Storefronts & Basic Discovery
Epic Goal: Enable businesses to set up their digital storefronts and showcase products, while allowing users to explore businesses, manage their basic preferences, and begin favoriting content within the platform.

Story 2.1: Business Storefront Creation & Content Management (Priority: High)
As a business owner,

I want to create and manage my in-app digital storefront,

so that I can showcase my business and offerings to users.

Acceptance Criteria:

Business owner can access a storefront creation/management interface.

Business can input/update branding information (e.g., description, contact details).

Business can set their online/offline (Open/Close) status.

Business can select from platform-provided storefront themes (seasonal, festival).

Business can customize promotional banners on their storefront.

Changes made by the business owner are reflected instantly on the storefront.

Storefronts table is updated with description, theme, and other relevant branding content.

Local Testability: API endpoint POST /api/business/storefront creates a storefront and returns 201 Created. Verification via Postman with GET /api/business/storefront and confirming data.

Story 2.2: Business Storefront Product Display (Priority: High)
As a business owner,

I want to display my top/new/trending/customer favorite products on my storefront,

so that users can get a brief idea of what to expect.

Acceptance Criteria:

Business owner can manually select and arrange between 4 and 10 products for display on their storefront.

Business owner can change their displayed products anytime.

Each displayed product can have a name, description, and image.

The system provides suggestions for trending products (e.g., based on product searches, category searches, coupon categories, user interests, products in user wish lists) to the business owner.

Products are displayed on the business's storefront page.

StorefrontProducts table is populated with storefront_id, product_name, product_description, product_image_url, display_order, and is_trending flag for suggested items.

Local Testability: API endpoint POST /api/storefronts/{storefront_id}/products adds products, returning 200 OK. Verification by querying SELECT * FROM public.StorefrontProducts WHERE storefront_id = '{storefront_id}'.

Story 2.3: User City & Interest Selection (Priority: High)
As a new user,

I want to select my city and interests,

so that I can receive personalized and relevant updates.

Acceptance Criteria:

Upon first login, the user is prompted to select their primary city.

Upon first login, the user is prompted to choose a minimum of five interests.

User can select/update their interests and city at any point in time from their profile settings.

Selected city and interests are saved to the user's profile.

Users table city and interests fields are updated.

Local Testability: API endpoint PUT /api/users/{user_id}/profile/interests updates interests, returning 200 OK. Verification by querying SELECT city, interests FROM public.Users WHERE user_id = '{user_id}'.

Story 2.4: User Dashboard Display & Basic Personalization (Priority: High)
As a user,

I want to see a personalized dashboard,

so that I can quickly view hot offers, trending content, and relevant ads.

Acceptance Criteria:

The user dashboard page is rendered with a prominent navigation, search function, current city selection, user avatar, and profile dropdown.

The dashboard dynamically displays "hot coupon offers" and "trending offers".

The dashboard displays promotional ads from businesses, targeted based on the user's selected interests and current city.

User can switch between cities to view content relevant to that city.

User can set preferences for the frequency and type of promotional ads (e.g., only "hot offers," exclude certain categories).

Users table privacy_settings JSONB field stores user preferences for ad frequency/type.

Local Testability: API endpoint GET /api/users/{user_id}/dashboard returns dashboard data including personalized offers and ads. Verification via curl or Postman with different user_id and privacy_settings.

Story 2.5: User Favoriting Businesses & Coupons (Priority: High)
As a user,

I want to favorite businesses and coupons,

so that I can easily access them and receive instant updates.

Acceptance Criteria:

User can add/remove businesses to/from their favorites list from a business storefront.

User can add/remove coupons to/from their favorites list from the coupon discovery view or coupon wallet.

Favorited businesses are accessible via a dedicated section/filter on the user dashboard.

Favorited coupons are accessible and clearly marked within the coupon wallet.

BusinessFollows table tracks user_id, business_id, receive_notifications (default TRUE).

UserCoupons table is_favorite flag is updated.

Local Testability: API endpoint POST /api/users/{user_id}/favorites/business adds a business to favorites. Verification by querying SELECT * FROM public.BusinessFollows WHERE user_id = '{user_id}' AND business_id = '{business_id}'.

Story 2.6: Wishlist Item Creation (Manual) & Categorization (Priority: High)
As a user,

I want to manually create items on my Wishlist,

so that I can keep track of desired products and enable finding relevant businesses later.

Acceptance Criteria:

User can add new items to their Wishlist by manually inputting an item name and an optional description.

The system automatically categorizes newly added Wishlist items based on their name/description into a multi-level structure (Category, Subcategory Level 1, Subcategory Level 2).

User can view their created Wishlist items.

When a user clicks a Wishlist item, the system redirects to search page where users see search results of relevant businesses by matching the item's categorization with business product categories.

WishlistItems table stores user_id, item_name, item_description, category (and inferred subcategories).

Local Testability: API endpoint POST /api/users/{user_id}/wishlist adds a new wishlist item. Verification by querying SELECT item_name, category FROM public.WishlistItems WHERE user_id = '{user_id}'.
