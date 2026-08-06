import nodemailer from "nodemailer";

// Mailgun SMTP configuration
const SMTP_HOST = process.env.MAILGUN_SMTP_HOST || "smtp.eu.mailgun.org";
const SMTP_PORT = parseInt(process.env.MAILGUN_SMTP_PORT || "587");
const SMTP_USER = process.env.MAILGUN_SMTP_USER || "reviews@jasonclark.online";
const SMTP_PASS = process.env.MAILGUN_SMTP_PASS || "";
const FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || "noreply@jasonclark.online";

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // TLS (not SSL)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export interface EmailNotificationPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Send email using Mailgun SMTP
 */
export async function sendEmail(payload: EmailNotificationPayload): Promise<boolean> {
  try {
    console.log("[Email] Attempting to send email to:", payload.to);
    console.log("[Email] Subject:", payload.subject);

    if (!SMTP_PASS) {
      console.error("[Email] ERROR: Mailgun SMTP password not configured");
      return false;
    }

    console.log("[Email] Sending via Mailgun SMTP...");
    console.log("[Email] SMTP Host:", SMTP_HOST);
    console.log("[Email] From address:", FROM_EMAIL);

    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    console.log("[Email] SUCCESS: Email sent");
    console.log("[Email] Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("[Email] ERROR: Email service exception:", error);
    return false;
  }
}

/**
 * Send notification when a new review is submitted
 */
export async function sendNewReviewNotification(
  adminEmail: string,
  customerName: string,
  customerEmail: string,
  rating: number,
  reviewText: string
): Promise<boolean> {
  const subject = `New Review Submitted - ${customerName} (${rating}★)`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d4af37;">New Review Submitted</h2>
      <p>A new customer review has been submitted and is awaiting your approval.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;">
        <p><strong>Customer Name:</strong> ${escapeHtml(customerName)}</p>
        <p><strong>Customer Email:</strong> ${escapeHtml(customerEmail)}</p>
        <p><strong>Rating:</strong> ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
        <p><strong>Review:</strong></p>
        <p>${escapeHtml(reviewText).replace(/\n/g, "<br>")}</p>
      </div>
      
      <p style="margin-top: 20px;">
        <a href="https://jasonclark.online/admin/dashboard" style="background-color: #d4af37; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Review in Admin Dashboard
        </a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">Jason Clark Plumbing Review System</p>
    </div>
  `;

  const text = `
New Review Submitted

Customer: ${customerName}
Email: ${customerEmail}
Rating: ${rating}/5
Review: ${reviewText}

Log in to your admin dashboard to approve or reject this review.
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
    text,
  });
}

/**
 * Send notification when a review is approved
 */
export async function sendReviewApprovedNotification(
  adminEmail: string,
  customerName: string,
  customerEmail: string,
  rating: number,
  reviewText: string
): Promise<boolean> {
  const subject = `Review Approved - ${customerName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d4af37;">Review Approved</h2>
      <p>You have approved the following review. It is now live on your website.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;">
        <p><strong>Customer Name:</strong> ${escapeHtml(customerName)}</p>
        <p><strong>Customer Email:</strong> ${escapeHtml(customerEmail)}</p>
        <p><strong>Rating:</strong> ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
        <p><strong>Review:</strong></p>
        <p>${escapeHtml(reviewText).replace(/\n/g, "<br>")}</p>
      </div>
      
      <p style="margin-top: 20px; color: #27ae60; font-weight: bold;">✓ This review is now visible on your website</p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">Jason Clark Plumbing Review System</p>
    </div>
  `;

  const text = `
Review Approved

Customer: ${customerName}
Email: ${customerEmail}
Rating: ${rating}/5
Review: ${reviewText}

This review is now live on your website.
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
    text,
  });
}

/**
 * Send notification when a review is rejected
 */
export async function sendReviewRejectedNotification(
  adminEmail: string,
  customerName: string,
  customerEmail: string,
  rating: number,
  reviewText: string
): Promise<boolean> {
  const subject = `Review Rejected - ${customerName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d4af37;">Review Rejected</h2>
      <p>You have rejected the following review. It will not be displayed on your website.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;">
        <p><strong>Customer Name:</strong> ${escapeHtml(customerName)}</p>
        <p><strong>Customer Email:</strong> ${escapeHtml(customerEmail)}</p>
        <p><strong>Rating:</strong> ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
        <p><strong>Review:</strong></p>
        <p>${escapeHtml(reviewText).replace(/\n/g, "<br>")}</p>
      </div>
      
      <p style="margin-top: 20px; color: #e74c3c; font-weight: bold;">✗ This review has been rejected</p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">Jason Clark Plumbing Review System</p>
    </div>
  `;

  const text = `
Review Rejected

Customer: ${customerName}
Email: ${customerEmail}
Rating: ${rating}/5
Review: ${reviewText}

This review has been rejected and will not appear on your website.
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
    text,
  });
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
