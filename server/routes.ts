import express, { type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import { submitReview, getPendingReviews, getApprovedReviews, approveReview, rejectReview, deleteReview, getAdminByEmail, createAdmin } from "./db";
import { type InsertReview } from "../drizzle/schema";
import bcrypt from "bcryptjs";

const router = express.Router();

// Middleware to verify admin session
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminId = (req.session as any)?.adminId;
  if (!adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Public: Submit a review
router.post("/api/reviews/submit", async (req, res) => {
  try {
    const { customerName, customerEmail, rating, text } = req.body;

    if (!customerName || !customerEmail || !rating || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const review: InsertReview = {
      customerName,
      customerEmail,
      rating,
      text,
      status: "pending",
    };

    const result = await submitReview(review);
    if (result) {
      res.json({ success: true, message: "Review submitted successfully and is awaiting approval" });
    } else {
      res.status(500).json({ error: "Failed to submit review" });
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Public: Get approved reviews
router.get("/api/reviews/approved", async (req, res) => {
  try {
    const reviews = await getApprovedReviews();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: Login
router.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const admin = await getAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    (req.session as any).adminId = admin.id;
    res.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: Logout
router.post("/api/admin/logout", (req, res) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// Admin: Get pending reviews
router.get("/api/admin/reviews/pending", requireAdmin, async (req, res) => {
  try {
    const reviews = await getPendingReviews();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: Approve review
router.post("/api/admin/reviews/:id/approve", requireAdmin, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const adminId = (req.session as any).adminId;

    const success = await approveReview(reviewId, adminId);
    if (success) {
      res.json({ success: true, message: "Review approved" });
    } else {
      res.status(500).json({ error: "Failed to approve review" });
    }
  } catch (error) {
    console.error("Error approving review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: Reject review
router.post("/api/admin/reviews/:id/reject", requireAdmin, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const adminId = (req.session as any).adminId;

    const success = await rejectReview(reviewId, adminId);
    if (success) {
      res.json({ success: true, message: "Review rejected" });
    } else {
      res.status(500).json({ error: "Failed to reject review" });
    }
  } catch (error) {
    console.error("Error rejecting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: Delete review
router.delete("/api/admin/reviews/:id", requireAdmin, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);

    const success = await deleteReview(reviewId);
    if (success) {
      res.json({ success: true, message: "Review deleted" });
    } else {
      res.status(500).json({ error: "Failed to delete review" });
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
