# Jason Clark Plumbing - Project TODO

## Core Features - COMPLETED

### Review System Infrastructure
- [x] Database schema for reviews (customer name, email, rating, text, status, timestamps)
- [x] Database schema for admin users (email, password hash)
- [x] tRPC procedures for review submission and retrieval
- [x] tRPC procedures for admin authentication (login/logout/getSession)
- [x] Express session middleware with secure cookie configuration
- [x] Vite proxy configuration for frontend-to-backend communication

### Customer Review Submission
- [x] Review submission form component (ReviewSubmitForm)
- [x] Form validation (name, email, rating, text)
- [x] hCaptcha integration for spam protection
- [x] IP-based rate limiting (5 reviews per 24 hours per IP)
- [x] Database persistence of submitted reviews
- [x] Email notification to admin on new submission
- [x] Client-side error handling and user feedback

### Admin Dashboard
- [x] Admin login page with email/password authentication
- [x] Session-based authentication with secure cookies
- [x] Admin dashboard for review moderation
- [x] Display pending reviews with customer details
- [x] Search functionality (by name, email, review text)
- [x] Sorting options (by date, rating, customer name)
- [x] Sort direction toggle (ascending/descending)
- [x] Status filtering (all, pending, approved, rejected)
- [x] Bulk selection of reviews with checkboxes
- [x] Individual review actions (Approve, Reject, Delete)
- [x] Bulk actions (Approve, Reject multiple reviews)
- [x] Admin logout functionality
- [x] Email notification on review approval
- [x] Email notification on review rejection

### Public Reviews Page
- [x] Reviews page displaying approved reviews from database
- [x] Static testimonials as fallback content
- [x] Review submission form on the same page
- [x] Navigation back to home page
- [x] Responsive design matching site aesthetic

### Email Notifications
- [x] Manus built-in email service integration
- [x] HTML email templates with branding
- [x] New review submission notification (to admin)
- [x] Review approval notification (to admin)
- [x] Review rejection notification (to admin)
- [x] Email helper function (emailNotification.ts)

### Security & Protection
- [x] hCaptcha token verification on backend
- [x] IP-based rate limiting with in-memory store
- [x] Secure password hashing with bcryptjs
- [x] Session cookie security (httpOnly, sameSite, secure in production)
- [x] Protected tRPC procedures for admin-only actions

### Deployment & Configuration
- [x] Express server on port 3001
- [x] Vite frontend on port 3000
- [x] Proxy configuration for API routes (/api -> localhost:3001)
- [x] Cookie forwarding through proxy (onProxyReq/onProxyRes)
- [x] Environment variables for CAPTCHA keys
- [x] Database connection with Drizzle ORM

## Bug Fixes - COMPLETED

### Authentication Persistence Issue (FIXED)
- [x] Identified that main.tsx was missing tRPC provider setup
- [x] Confirmed backend session cookie is being set correctly
- [x] Verified Vite proxy is forwarding cookies properly
- [x] Tested end-to-end login flow with curl
- [x] Confirmed session persists across page reloads
- [x] Admin dashboard now accessible after login

### API Routing Issues (FIXED)
- [x] Fixed port collision (both Vite and Express on 3000)
- [x] Updated dev script to run Express on 3001
- [x] Configured Vite proxy for /api routes
- [x] Fixed tRPC endpoint responses (JSON instead of HTML)

### Form Validation Issues (FIXED)
- [x] Fixed AdminLogin form payload structure
- [x] Fixed ReviewSubmitForm payload structure
- [x] Corrected tRPC input validation

## Testing & Verification

### Manual Testing Completed
- [x] Admin login with valid credentials
- [x] Session persistence across page reloads
- [x] Admin dashboard loads with pending reviews
- [x] Review approval workflow
- [x] Approved review appears on public page
- [x] Review submission form validation
- [x] CAPTCHA protection on review form
- [x] Rate limiting enforcement
- [x] Email notifications sent correctly

### Backend Testing
- [x] curl tests confirm session cookie is set
- [x] curl tests confirm protected endpoints work with cookie
- [x] tRPC procedures return correct data format

## Known Limitations & Future Enhancements

### Not Yet Implemented
- [ ] Vitest unit tests for tRPC procedures
- [ ] Integration tests for review workflow
- [ ] E2E tests for admin dashboard
- [ ] Review editing capability for admins
- [ ] Review filtering by date range
- [ ] Pagination for large review lists
- [ ] Export reviews to CSV
- [ ] Review analytics dashboard
- [ ] Customer notification when review is approved/rejected
- [ ] Admin notification preferences
- [ ] Review moderation queue with priority levels
- [ ] Spam detection beyond rate limiting

### Deployment Notes
- [ ] Ensure HCAPTCHA_SECRET_KEY is set in production
- [ ] Ensure VITE_HCAPTCHA_SITE_KEY is set in production
- [ ] Verify email notifications work in production
- [ ] Test session persistence with production domain
- [ ] Monitor rate limiting effectiveness
- [ ] Set up monitoring for failed email notifications

## Architecture Notes

### Tech Stack
- Frontend: React 19, Tailwind CSS 4, Vite
- Backend: Express 4, tRPC 11, Node.js
- Database: MySQL with Drizzle ORM
- Authentication: Session-based with express-session
- Email: Manus built-in email service
- Spam Protection: hCaptcha + IP-based rate limiting

### Key Files
- `server/routers.ts` - tRPC procedure definitions
- `server/db.ts` - Database query helpers
- `server/index.ts` - Express server setup
- `client/src/pages/AdminLogin.tsx` - Admin login UI
- `client/src/pages/AdminDashboard.tsx` - Admin moderation UI
- `client/src/pages/Reviews.tsx` - Public reviews page
- `server/_core/emailNotification.ts` - Email templates and sending
- `server/_core/rateLimit.ts` - Rate limiting implementation
- `drizzle/schema.ts` - Database schema

## Deployment Status
- ✅ Dev environment: Fully functional
- ✅ Build: Clean, no TypeScript errors
- ⏳ Production: Ready for deployment via Manus Publish button
