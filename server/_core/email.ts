import { notifyOwner } from "./notification";

export async function sendReviewNotification(
  customerName: string,
  customerEmail: string,
  rating: number,
  reviewText: string
): Promise<boolean> {
  try {
    const message = `
New Review Submission
=====================

Customer: ${customerName}
Email: ${customerEmail}
Rating: ${rating}/5 stars

Review:
${reviewText}

Action Required:
Please log in to your admin dashboard to approve or reject this review.
Admin Dashboard: /admin/dashboard
    `.trim();

    const success = await notifyOwner({
      title: `New Review from ${customerName}`,
      content: message,
    });

    return success;
  } catch (error) {
    console.error("[Email] Failed to send review notification:", error);
    return false;
  }
}
