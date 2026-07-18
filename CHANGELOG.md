# Changelog

All notable changes to the Jason Clark Plumbing website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-18

### Added
- **Professional Homepage** - Black and gold color scheme with service listings and contact information
- **Full-Stack Review System** - Customers can submit reviews with CAPTCHA protection
- **Admin Dashboard** - Comprehensive moderation interface for managing reviews
  - Search by customer name, email, or review text
  - Sort by date, rating, or name (ascending/descending)
  - Bulk selection and multi-action operations
  - Status filtering (All/Pending/Approved/Rejected)
- **Admin Reply Feature** - Admins can reply directly to customer reviews
- **Rate Limiting** - 5 reviews per IP address per 24 hours to prevent spam
- **Email Notifications** - Automated emails for:
  - New review submissions (to admin)
  - Review approvals (to admin)
  - Review rejections (to admin)
- **Public Reviews Page** - Display approved reviews with admin replies
- **Custom Domain Support** - Live on `https://www.jasonclark.online` and `https://jasonclark.online`
- **Responsive Design** - Mobile-friendly interface across all pages
- **Database Integration** - MySQL/TiDB with Drizzle ORM for data persistence
- **Authentication System** - Manus OAuth for admin access
- **Session Management** - Secure cookie-based sessions with cross-origin support

### Technical Stack
- **Frontend:** React 19, Tailwind CSS 4, TypeScript
- **Backend:** Express 4, tRPC 11, Node.js
- **Database:** MySQL/TiDB with Drizzle ORM
- **Hosting:** Manus with Cloudflare infrastructure
- **Security:** hCaptcha, rate limiting, session cookies, CORS handling
- **Testing:** Vitest for unit tests

### Fixed
- Session cookie forwarding through Vite dev proxy for admin authentication
- tRPC API routing with proper port configuration (frontend: 3000, backend: 3001)
- Admin login form validation for credential submission
- Review submission form validation for proper data handling
- Cross-origin cookie persistence in development environment

### Infrastructure
- Deployed to Manus hosting platform
- DNS configured via IONOS with A record for root domain and CNAME for www subdomain
- SSL certificates provisioned by Manus for both domains
- GitHub repository created for version control and backup

## [Unreleased]

### Planned Features
- [ ] Service booking system
- [ ] Online payment integration (Stripe)
- [ ] Customer testimonials section
- [ ] Photo gallery of completed projects
- [ ] Blog/news section
- [ ] Advanced search and filtering for reviews
- [ ] Review analytics dashboard
- [ ] Multi-language support
- [ ] SMS notifications for admins
- [ ] Review export functionality

---

## Version History

**1.0.0** - Initial production release with complete review system and admin dashboard
