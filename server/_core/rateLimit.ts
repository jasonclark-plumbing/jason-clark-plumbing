import rateLimit from "express-rate-limit";

/**
 * Rate limiter for review submissions
 * Allows 5 reviews per IP address per 24 hours
 */
export const reviewRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many reviews submitted from this IP address. Please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for admin users (if needed)
    return false;
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For header if behind a proxy, otherwise use req.ip
    const forwardedFor = req.headers["x-forwarded-for"];
    if (typeof forwardedFor === "string") {
      return forwardedFor.split(",")[0].trim();
    }
    return req.ip || "unknown";
  },
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message:
          "Too many reviews submitted from this IP address. Please try again in 24 hours.",
      },
    });
  },
});

/**
 * In-memory store for tracking review submission attempts
 * This is a simple implementation; for production, consider using Redis
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if an IP has exceeded the rate limit
 */
export function checkReviewRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000; // 24 hours
  const maxRequests = 5;

  let entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    // Create new entry
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(ip, entry);
    return { allowed: true, remaining: maxRequests - 1 };
  }

  // Increment count
  entry.count++;

  const allowed = entry.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - entry.count);

  return { allowed, remaining };
}

/**
 * Clean up expired entries from the rate limit store
 * Run this periodically to prevent memory leaks
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  const ipsToDelete: string[] = [];
  rateLimitStore.forEach((entry, ip) => {
    if (now > entry.resetTime) {
      ipsToDelete.push(ip);
    }
  });
  ipsToDelete.forEach((ip) => rateLimitStore.delete(ip));
}

// Run cleanup every hour
setInterval(cleanupRateLimitStore, 60 * 60 * 1000);
