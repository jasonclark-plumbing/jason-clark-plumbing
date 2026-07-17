import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { admins, reviews, replies, type InsertReview, type Review, type Admin, type InsertAdmin, type Reply, type InsertReply } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// Admin functions
export async function createAdmin(email: string, passwordHash: string): Promise<Admin | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(admins).values({ email, passwordHash });
    return { id: result[0].insertId as number, email, passwordHash, createdAt: new Date(), updatedAt: new Date() };
  } catch (error) {
    console.error("[Database] Failed to create admin:", error);
    return null;
  }
}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get admin:", error);
    return null;
  }
}

// Review functions
export async function submitReview(review: InsertReview): Promise<Review | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(reviews).values(review);
    const result = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.customerEmail, review.customerEmail), eq(reviews.text, review.text)))
      .orderBy(reviews.submittedAt)
      .limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to submit review:", error);
    return null;
  }
}

export async function getPendingReviews(): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(reviews).where(eq(reviews.status, "pending")).orderBy(reviews.submittedAt);
  } catch (error) {
    console.error("[Database] Failed to get pending reviews:", error);
    return [];
  }
}

export async function getAllReviews(options?: {
  status?: "pending" | "approved" | "rejected" | "all";
  sortBy?: "date" | "rating" | "name";
  sortOrder?: "asc" | "desc";
  searchQuery?: string;
}): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    let results: Review[] = [];

    // Apply status filter
    if (options?.status && options.status !== "all") {
      results = await db.select().from(reviews).where(eq(reviews.status, options.status));
    } else {
      results = await db.select().from(reviews);
    }

    // Apply search filter (client-side since we're filtering text)
    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.customerEmail.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q)
      );
    }

    // Apply sorting
    if (options?.sortBy) {
      results.sort((a, b) => {
        let compareValue = 0;

        if (options.sortBy === "date") {
          compareValue = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        } else if (options.sortBy === "rating") {
          compareValue = a.rating - b.rating;
        } else if (options.sortBy === "name") {
          compareValue = a.customerName.localeCompare(b.customerName);
        }

        return options.sortOrder === "asc" ? compareValue : -compareValue;
      });
    }

    return results;
  } catch (error) {
    console.error("[Database] Failed to get all reviews:", error);
    return [];
  }
}

export async function getReviewById(reviewId: number): Promise<Review | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get review:", error);
    return null;
  }
}

export async function getApprovedReviews(): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(reviews).where(eq(reviews.status, "approved")).orderBy(reviews.submittedAt);
  } catch (error) {
    console.error("[Database] Failed to get approved reviews:", error);
    return [];
  }
}

export async function approveReview(reviewId: number, adminId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(reviews)
      .set({ status: "approved", reviewedAt: new Date(), reviewedBy: adminId })
      .where(eq(reviews.id, reviewId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to approve review:", error);
    return false;
  }
}

export async function rejectReview(reviewId: number, adminId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(reviews)
      .set({ status: "rejected", reviewedAt: new Date(), reviewedBy: adminId })
      .where(eq(reviews.id, reviewId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to reject review:", error);
    return false;
  }
}

export async function deleteReview(reviewId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(reviews).where(eq(reviews.id, reviewId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete review:", error);
    return false;
  }
}

// Reply functions
export async function createReply(reply: InsertReply): Promise<Reply | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(replies).values(reply);
    const created = await db.select().from(replies).where(eq(replies.id, result[0].insertId as number)).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create reply:", error);
    return null;
  }
}

export async function getRepliesForReview(reviewId: number): Promise<Reply[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(replies).where(eq(replies.reviewId, reviewId)).orderBy(replies.createdAt);
  } catch (error) {
    console.error("[Database] Failed to get replies:", error);
    return [];
  }
}

export async function deleteReply(replyId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(replies).where(eq(replies.id, replyId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete reply:", error);
    return false;
  }
}
