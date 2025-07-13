PRODUCT REQUIREMENTS DOCUMENT (PRD)
Product Name: SynC
Date: 13-07-2025
Version: 2.0
Author: Umamahesh Madala
________________________________________
1. Purpose
SYNC is a cross-platform (web and mobile) application designed to connect users with local businesses, manage social interactions, and provide loyalty and coupon-based incentives. The platform aims to enhance user engagement with businesses through social networking, gamification, and personalized offers.
________________________________________
2. Background & Motivation
Consumers increasingly seek personalized experiences and rewards from local businesses. SynC bridges the gap between businesses and users by providing a unified platform for discovery, engagement, and rewards, leveraging social features to drive organic growth and retention.
________________________________________
3. Target Users
•	Primary:
•	General consumers seeking deals, instant updates on sale, EOSS, offers and social engagement. Consumers will be able to choose to follow the businesses that really matter to them and only get updates from the businesses that matter to them. 
•	Local brick and motor business owners aiming to promote their storefronts, share updates on sale, EOSS, offers instantly and engage customers with bulls eye marketing technique.
________________________________________
4. Product Scope
4.1. Core Features
4.1.1. User Authentication & Profiles
•	Sign up, login, and logout (Supabase Auth).
•	Profile management (name, preferred name, avatar, contact info).
•	Social presence (online/offline status).
4.1.2. Business Storefronts
•	Business profile pages with branding, offers, and contact info.
•	Business discovery and search.
•	Business dashboard for managing offers and analytics.
4.1.3. Social Networking
•	Friend system (requests, accept/decline, most interacted).
•	Activity feed (check-ins, coupon redemptions, social actions).
•	Notifications (friend requests, offer updates, friends’ activity).
4.1.4. Loyalty & Coupons
•	Digital wallet for coupons.
•	Coupon discovery, saving, and redemption.
•	Hot offers and savings tracker.
4.1.5. Wishlist & Favorites
•	Wishlist for events, businesses, and offers.
•	Favorite businesses and coupons.
4.1.6. Feedback
•	Feedback and review system for businesses and offers.
4.1.7. Admin/Business Dashboard
•	Manage business profile, offers, and analytics.
•	View customer engagement and feedback.
4.1.8. Mobile & Web Support
•	Responsive web app (React, Vite, Tailwind).
•	Mobile app (React Native/Expo).
________________________________________
4.2. Non-Functional Requirements
•	Performance:
•	Fast load times (<2s for main screens).
•	Real-time updates for social and business activity.
•	Security:
•	Secure authentication (Supabase).
•	Data privacy and compliance (GDPR/CCPA placeholder).
•	Scalability:
•	Support for 10,000+ concurrent users.
•	Modular backend (Supabase, serverless functions).
•	Reliability:
•	99.9% uptime.
•	Automated backups and disaster recovery.
•	Branding/UI:
•	Consistent color scheme (see constants/Colors.ts).
•	Modern, accessible UI (WCAG 2.1 AA).
________________________________________
5. User Stories
5.1. Consumer
•	As a user, I can sign up and create a profile.
•	As a user, I can select my interests to get updates on what matters
•	As a user, I can search for and follow businesses.
•	As a user, I can add friends and see their activity.
•	As a user, I can save and redeem coupons.
•	As a user, I can plan events and create Wishlist items from it
•	As a user, I can leave feedback for businesses.
5.2. Business Owner
•	As a business, I can create and manage my storefront.
•	As a business, I can publish offers and coupons based on customer demographics
•	As a business, I can view analytics and summarized customer feedback.
•	As a business, I can interact with customers via notifications.
•	As a business, I can show ads in the app
•	As a business, I can create coupons, customize distribution and issue.
•	As a business, I can update the utilized coupons
________________________________________
6. Functional Requirements
6.1. Authentication
•	Email/password and social login (placeholder).
•	Password reset and email verification.
6.2. Social Features
•	Friend requests, acceptance, and removal.
•	Activity feed with filtering and sorting.
•	Presence updates (online/offline).
•	Share coupons with friends
•	Share coupons publicly for anyone to pick
•	Recommend or not recommend a businesses
•	Choose to share my activity or keep it private
6.3. Business Features
•	Business profile creation and editing.
•	Offer/coupon management (CRUD).
•	Analytics dashboard with weekly summarized reviews, coupons utilization summary, trends of peers performance, marketing effectiveness, marketing recommendations
6.4. Coupon
•	Coupon discovery, saving, and redemption.
•	Hot offers tracker.
6.5. Notifications
•	Real-time notifications for social and business events.
•	Real-time notifications for instant offers
6.6. Event Planning
•	Event creation and generation of items required for the event and add it to Wishlist
6.7. Feedback & Reviews
•	Leave and view reviews for businesses and offers. Only thumbs up or thumbs down. No star ratings
________________________________________
7. Technical Architecture
•	Frontend:
•	Web: React, Vite, Tailwind CSS
•	Mobile: React Native/Expo
•	Backend:
•	Supabase (Postgres, Auth, Storage, Edge Functions)
•	Serverless functions (Netlify, custom API endpoints)
•	Integrations:
•	Supabase for authentication, database, and storage.
•	Netlify for serverless functions and deployment.
________________________________________
8. Data Model (High-Level)
•	User: id, email, name, phone number, preferred_name, avatar, friends, wishlist, 
•	Business: id, name, description, offers, analytics, reviews
•	Coupon: id, business_id, title, description, is_hot, expiry, usage_count
•	Friendship: user_id, friend_id, status, interaction_count
•	Activity: id, user_id, type, timestamp, metadata
•	Notification: id, user_id, type, content, read_status
________________________________________
9. Milestones & Timeline
________________________________________
10. Open Questions / Placeholders
•	Social login providers: Google
•	Monetization strategy: Charge per coupon generated, ads, premium, pushing instant offers
•	Analytics platform: a freemium model one. Not decided yet
•	Compliance requirements: Only mandatory ones, Not decided yet
•	Third-party integrations:  email, WhatsApp and SMS
•	Detailed business dashboard requirements
________________________________________

