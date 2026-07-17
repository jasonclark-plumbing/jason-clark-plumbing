import { describe, it, expect, beforeEach } from "vitest";
import { checkReviewRateLimit, cleanupRateLimitStore } from "./_core/rateLimit";

describe("Rate Limiting", () => {
  beforeEach(() => {
    // Clean up before each test
    cleanupRateLimitStore();
  });

  it("should allow first 5 submissions from an IP", () => {
    const ip = "192.168.1.1";

    for (let i = 0; i < 5; i++) {
      const result = checkReviewRateLimit(ip);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4 - i);
    }
  });

  it("should block 6th submission from an IP", () => {
    const ip = "192.168.1.2";

    // Submit 5 times (allowed)
    for (let i = 0; i < 5; i++) {
      checkReviewRateLimit(ip);
    }

    // 6th submission should be blocked
    const result = checkReviewRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should track different IPs independently", () => {
    const ip1 = "192.168.1.1";
    const ip2 = "192.168.1.2";

    // Submit 5 times from ip1
    for (let i = 0; i < 5; i++) {
      checkReviewRateLimit(ip1);
    }

    // ip1 should be blocked
    expect(checkReviewRateLimit(ip1).allowed).toBe(false);

    // ip2 should still be allowed
    expect(checkReviewRateLimit(ip2).allowed).toBe(true);
  });

  it("should return correct remaining count", () => {
    const ip = "192.168.1.3";

    let result = checkReviewRateLimit(ip);
    expect(result.remaining).toBe(4);

    result = checkReviewRateLimit(ip);
    expect(result.remaining).toBe(3);

    result = checkReviewRateLimit(ip);
    expect(result.remaining).toBe(2);
  });
});
