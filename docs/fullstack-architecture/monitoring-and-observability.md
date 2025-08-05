# Monitoring and Observability
Monitoring Stack
Frontend Monitoring: [Inference] Web Vitals (Google Analytics/Lighthouse), error tracking (Sentry/Datadog RUM).

Backend Monitoring: [Inference] Supabase Analytics, Netlify Analytics, custom metrics (e.g., function invocations, execution time, errors) integrated with a centralized monitoring tool (e.g., Prometheus/Grafana, Datadog, New Relic).

Error Tracking: Sentry (or similar service) for real-time error reporting and alerting from both frontend and backend.

Performance Monitoring: [Inference] Integration of APM (Application Performance Monitoring) tools to track end-to-end transaction traces.

Key Metrics
Frontend Metrics: Core Web Vitals (LCP, FID, CLS), JavaScript errors, API response times, User interaction latency, Bundle size.

Backend Metrics: Request rate (RPS), Error rate (%), Average/P99 response time, Database query performance, Serverless function cold starts.

Business Metrics: Daily Active Users (DAU), Monthly Active Users (MAU), Coupon redemption rate, Driver conversion rate, Revenue per user/business.

