/**
 * Type definitions shared between client and server
 */

export interface DatabaseReview {
  id: number;
  customerName: string;
  customerEmail: string;
  rating: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export interface AdminUser {
  id: number;
  email: string;
  passwordHash: string;
  createdAt: string;
}
