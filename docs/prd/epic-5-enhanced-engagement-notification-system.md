# Epic 5: Enhanced Engagement & Notification System
Epic Goal: Implement comprehensive user feedback mechanisms, a robust real-time notification system, and refine personalized user experiences to deepen engagement and retention.

Story 5.1: User Feedback & Review Submission (Priority: High)
As a user,

I want to provide feedback and brief reviews for businesses,

so that I can share my experiences and contribute to business insights.

Acceptance Criteria:

User can submit feedback for businesses using only two options: "recommend" (Thumbs up) or "don't recommend (thumbs down)".

User can submit a brief review for a business, limited to a maximum of 30 words.

Users are only eligible to leave a review for a business if they have a recorded check-in (GPS-based or coupon redemption-triggered) at that business.

User can view their own submitted reviews.

BusinessReviews table is populated with business_id, user_id, recommend_status, review_text, and checked_in_at.

Local Testability: API endpoint POST /api/business/{business_id}/reviews submits a review, returning 201 Created. Verification by querying SELECT review_text, recommend_status FROM public.BusinessReviews WHERE business_id = '{business_id}' AND user_id = '{user_id}'.

Story 5.2: Real-time Offer & Promotion Notifications (Priority: High)
As a user,

I want to receive real-time notifications about instant offers and business promotions,

so that I don't miss out on relevant deals.

Acceptance Criteria:

User receives real-time notifications for new instant offers from businesses they follow or that match their interests/location.

User receives real-time notifications for new business promotions from business they follow or that match their interests/location.

Notifications include deep links directly to the relevant coupons or storefronts.

Notification messages are limited to a maximum length of 20 words.

Notifications table is populated with recipient_user_id, sender_business_id, notification_type ('offer_update', 'business_promotion'), message, deep_link_url.

Local Testability: Simulate a notification trigger (e.g., via backend script/function) and verify a new entry in Notifications table for the target recipient_user_id.

Story 5.3: Real-time Social & Activity Notifications (Priority: High)
As a user,

I want to receive real-time notifications about social events and friend activities,

so that I stay connected with my network.

Acceptance Criteria:

User receives real-time notifications for new friend requests.

User receives real-time notifications when friends accept their shared coupons.

User receives real-time notifications when a shared coupon is accepted or declined by the receiver, notifying the sender.

User receives real-time notifications when a coupon they shared is redeemed by a direct friend.

User receives real-time notifications when a coupon they shared is redeemed by a 2nd, 3rd, or subsequent connection, labeled as "coupon redeemed by [number]th connection", where the number indicates how many users the coupon has been shared with.

Notifications table is populated with recipient_user_id, notification_type ('friend_request', 'coupon_share_accepted', 'coupon_share_declined', 'coupon_redeemed_by_friend', 'coupon_redeemed_by_nth_connection').

Local Testability: Simulate social events (e.g., friend request, coupon share acceptance) via backend calls/scripts and verify corresponding entries in Notifications table.

Story 5.4: User Notification Preferences & Control (Priority: High)
As a user,

I want to control the notifications I receive,

so that I can manage my communication preferences.

Acceptance Criteria:

User can enable or disable direct notifications from a business they follow, without unfollowing the business.

User can set preferences for the frequency and type of promotional ads (e.g., only "hot offers," exclude certain categories).

The notification system throttles or groups similar notifications based on industry best practices.

The platform owner has the option to change the notification throttling and grouping settings dynamically.

BusinessFollows table receive_notifications flag is updated.

Users table privacy_settings JSONB field stores granular notification preferences for ad/promotion types.

Local Testability: API endpoint PUT /api/users/{user_id}/notifications/preferences updates notification settings. Verification by querying SELECT receive_notifications FROM public.BusinessFollows WHERE user_id = '{user_id}' AND business_id = '{business_id}' and SELECT privacy_settings FROM public.Users WHERE user_id = '{user_id}'.

Story 5.5: User Profile Activity Sharing Control (Priority: High)
As a user,

I want to control which of my activities are shared,

so that I can manage my privacy.

Acceptance Criteria:

User can choose to share or keep private their own activity in the activity feed, except for coupon sharing activity.

Coupon sharing activity cannot be opted out of, though a user can choose not to receive shared coupons until they accept them.

Users table privacy_settings JSONB field stores preferences for general activity sharing (e.g., check-ins, coupon redemptions for self-use, reviews, ad interactions).

Local Testability: API endpoint PUT /api/users/{user_id}/privacy/activity updates activity sharing settings. Verification by querying SELECT privacy_settings FROM public.Users WHERE user_id = '{user_id}'.

Story 5.6: Wishlist Offer & Coupon Matching Notifications (Priority: High)
As a user,

I want to be notified when items on my Wishlist match new offers or coupons,

so that I can capitalize on potential savings.

Acceptance Criteria:

The system identifies when a Wishlist item's categorization matches an active offer or coupon from a business.

User receives a notification when a match is found.

The notification links directly to the relevant coupon or business storefront.

User can tag the matched coupon or offer to the Wishlist item for future reference.

WishlistMatches table tracks wishlist_item_id, coupon_id/offer_id, business_id, matched_at, and notification_sent_at.

Local Testability: Simulate a Wishlist match event via backend script/function and verify a new entry in WishlistMatches and Notifications tables for the target user_id.

