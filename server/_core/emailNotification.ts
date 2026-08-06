// Mailgun email service configuration
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || "";
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || "mg.jasonclark.online";
const MAILGUN_FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || "noreply@jasonclark.online";

export interface EmailNotificationPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Send email using Mailgun API
 */
export async function sendEmail(payload: EmailNotificationPayload): Promise<boolean> {
  try {
    console.log("[Email] Attempting to send email to:", payload.to);
    console.log("[Email] Subject:", payload.subject);
    console.log("[Email] Mailgun API Key configured:", !!MAILGUN_API_KEY);

    if (!MAILGUN_API_KEY) {
      console.error("[Email] ERROR: Mailgun API key not configured");
      console.error("[Email] MAILGUN_API_KEY:", MAILGUN_API_KEY ? "[SET]" : "[NOT SET]");
      return false;
    }

    console.log("[Email] Sending via Mailgun...");
    
    // Create FormData for Mailgun API
    const formData = new URLSearchParams();
    // For sandbox domain, use postmaster address; for production domain, use custom from address
    const fromAddress = MAILGUN_DOMAIN.includes("sandbox") 
      ? `postmaster@${MAILGUN_DOMAIN}`
      : MAILGUN_FROM_EMAIL;
    formData.append("from", fromAddress);
    console.log("[Email] From address:", fromAddress);
    formData.append("to", payload.to);
    formData.append("subject", payload.subject);
    formData.append("html", payload.html);
    formData.append("text", payload.text);

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Email] ERROR: Failed to send email");
      console.error("[Email] Status:", response.status, response.statusText);
      console.error("[Email] Response:", error);
      return false;
    }

    console.log("[Email] SUCCESS: Email sent to", payload.to);
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
