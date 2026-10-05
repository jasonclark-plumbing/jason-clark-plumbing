import { describe, it, expect, vi, beforeEach } from "vitest";
const { sendMail } = vi.hoisted(() => {
  process.env.MAILGUN_SMTP_PASS = "test-password";
  return { sendMail: vi.fn() };
});

vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({ sendMail }),
  },
}));

import {
  sendContactEnquiryNotification,
  sendNewReviewNotification,
  sendReviewApprovedNotification,
  sendReviewRejectedNotification,
} from "./_core/emailNotification";

describe("Email Notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendMail.mockResolvedValue({ messageId: "test-message-id" });
  });

  describe("sendNewReviewNotification", () => {
    it("should send email when new review is submitted", async () => {
      const result = await sendNewReviewNotification(
        "admin@example.com",
        "John Doe",
        "john@example.com",
        5,
        "Great service!"
      );

      expect(result).toBe(true);
      expect(sendMail).toHaveBeenCalledOnce();
      expect(sendMail.mock.calls[0][0].to).toBe("admin@example.com");
    });

    it("should include customer details in email", async () => {
      await sendNewReviewNotification(
        "admin@example.com",
        "Jane Smith",
        "jane@example.com",
        4,
        "Good work"
      );

      const email = sendMail.mock.calls[0][0];
      expect(email.html).toContain("Jane Smith");
      expect(email.html).toContain("jane@example.com");
      expect(email.html).toContain("★★★★☆");
      expect(email.html).toContain("Good work");
    });

    it("should handle email service errors gracefully", async () => {
      sendMail.mockRejectedValueOnce(new Error("SMTP unavailable"));

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
      const result = await sendReviewApprovedNotification(
        "admin@example.com",
        "John Doe",
        "john@example.com",
        5,
        "Great service!"
      );

      expect(result).toBe(true);
      const email = sendMail.mock.calls[0][0];
      expect(email.subject).toContain("Review Approved");
      expect(email.html).toContain("now live on your website");
    });
  });

  describe("sendReviewRejectedNotification", () => {
    it("should send rejection email", async () => {
      const result = await sendReviewRejectedNotification(
        "admin@example.com",
        "John Doe",
        "john@example.com",
        2,
        "Bad service"
      );

      expect(result).toBe(true);
      const email = sendMail.mock.calls[0][0];
      expect(email.subject).toContain("Review Rejected");
      expect(email.html).toContain("has been rejected");
    });
  });

  describe("sendContactEnquiryNotification", () => {
    it("sends the enquiry to Jason and sets the customer as reply-to", async () => {
      const result = await sendContactEnquiryNotification({
        name: "Alex Customer",
        email: "alex@example.com",
        phone: "01480 123456",
        message: "Please repair a leaking tap.",
      });

      expect(result).toBe(true);
      const email = sendMail.mock.calls[0][0];
      expect(email.to).toBe("plumbing@jasonclark.online");
      expect(email.replyTo).toBe("alex@example.com");
      expect(email.text).toContain("Please repair a leaking tap.");
    });

    it("escapes customer content before adding it to the HTML email", async () => {
      await sendContactEnquiryNotification({
        name: "<img src=x>",
        email: "alex@example.com",
        message: "<script>alert(1)</script>",
      });

      const email = sendMail.mock.calls[0][0];
      expect(email.html).not.toContain("<img src=x>");
      expect(email.html).not.toContain("<script>");
      expect(email.html).toContain("&lt;script&gt;");
    });
  });
});
