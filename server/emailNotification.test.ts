import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendNewReviewNotification,
  sendReviewApprovedNotification,
  sendReviewRejectedNotification,
} from "./_core/emailNotification";

// Mock the fetch function
global.fetch = vi.fn();

describe("Email Notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendNewReviewNotification", () => {
    it("should send email when new review is submitted", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(""),
      });

      const result = await sendNewReviewNotification(
        "admin@example.com",
        "John Doe",
        "john@example.com",
        5,
        "Great service!"
      );

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledOnce();
      const call = (global.fetch as any).mock.calls[0];
      expect(call[0]).toContain("/v1/email/send");
      expect(call[1].method).toBe("POST");
    });

    it("should include customer details in email", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(""),
      });

      await sendNewReviewNotification(
        "admin@example.com",
        "Jane Smith",
        "jane@example.com",
        4,
        "Good work"
      );

      const call = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body.html).toContain("Jane Smith");
      expect(body.html).toContain("jane@example.com");
      expect(body.html).toContain("★★★★☆");
      expect(body.html).toContain("Good work");
    });

    it("should handle email service errors gracefully", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        text: vi.fn().mockResolvedValueOnce("Service error"),
      });

      const result = await sendNewReviewNotification(
        "admin@example.com",
        "John Doe",
        "john@example.com",
        5,
        "Great service!"
      );

      expect(result).toBe(false);
    });
  });

  describe("sendReviewApprovedNotification", () => {
    it("should send approval email", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(""),
      });

      const result = await sendReviewApprovedNotification(
        "admin@example.com",
        "John Doe",
        "john@example.com",
        5,
        "Great service!"
      );

      expect(result).toBe(true);
      const call = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body.subject).toContain("Review Approved");
      expect(body.html).toContain("now live on your website");
    });
  });

  describe("sendReviewRejectedNotification", () => {
    it("should send rejection email", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValueOnce(""),
      });

      const result = await sendReviewRejectedNotification(
        "admin@example.com",
        "John Doe",
        "john@example.com",
        2,
        "Bad service"
      );

      expect(result).toBe(true);
      const call = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body.subject).toContain("Review Rejected");
      expect(body.html).toContain("has been rejected");
    });
  });
});
