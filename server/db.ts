import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { admins, reviews, type InsertReview, type Review, type Admin, type InsertAdmin } from "../drizzle/schema";

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
