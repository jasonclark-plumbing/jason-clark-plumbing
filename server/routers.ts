import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { sendNewReviewNotification, sendReviewApprovedNotification, sendReviewRejectedNotification } from "./_core/emailNotification";
import { verifyCaptcha } from "./captcha";
import { checkReviewRateLimit } from "./_core/rateLimit";
import {
  submitReview,
  getPendingReviews,
  getApprovedReviews,
  approveReview,
  rejectReview,
  deleteReview,
  getAdminByEmail,
  createAdmin,
  getReviewById,
  getAllReviews,
  createReply,
  getRepliesForReview,
  deleteReply,
} from "./db";

export const appRouter = router({
  // Public: Submit a review
  reviews: router({
    submit: publicProcedure
      .input(
        z.object({
          customerName: z.string().min(1, "Name is required"),
          customerEmail: z.string().email("Valid email required"),
          rating: z.number().min(1).max(5),
          text: z.string().min(10, "Review must be at least 10 characters"),
          captchaToken: z.string().min(1, "CAPTCHA verification required"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Get client IP address
          const clientIp =
            (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
            ctx.req.ip ||
            "unknown";

          // Check rate limit
          const { allowed, remaining } = checkReviewRateLimit(clientIp);
          if (!allowed) {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: "Too many reviews submitted from this IP. Please try again in 24 hours.",
            });
          }

          // Verify CAPTCHA token
          const captchaValid = await verifyCaptcha(input.captchaToken);
          if (!captchaValid) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "CAPTCHA verification failed. Please try again.",
            });
          }

          const review = await submitReview({
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            rating: input.rating,
            text: input.text,
            status: "pending",
          });

          if (!review) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to submit review",
            });
          }

          // Send email notification to admin
          try {
            await sendNewReviewNotification(
              "jason@jasonclark.online",
              input.customerName,
              input.customerEmail,
              input.rating,
              input.text
            );
          } catch (emailError) {
            console.error("Failed to send review notification email:", emailError);
            // Don't fail the review submission if email fails
          }

          return { success: true, reviewId: review.id };
        } catch (error) {
          console.error("[tRPC] Review submission error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to submit review",
          });
        }
      }),

    // Public: Get approved reviews
    getApproved: publicProcedure.query(async () => {
      try {
        const reviews = await getApprovedReviews();
        return reviews;
      } catch (error) {
        console.error("[tRPC] Get approved reviews error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch reviews",
        });
      }
    }),

    // Admin: Get pending reviews
    getPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      try {
        const reviews = await getPendingReviews();
        return reviews;
      } catch (error) {
        console.error("[tRPC] Get pending reviews error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch pending reviews",
        });
      }
    }),

    // Admin: Get all reviews with filtering and sorting
    getAll: protectedProcedure
      .input(
        z.object({
          status: z.enum(["all", "pending", "approved", "rejected"]).optional().default("all"),
          sortBy: z.enum(["date", "rating", "name"]).optional().default("date"),
          sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
          searchQuery: z.string().optional(),
        })
      )
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          const reviews = await getAllReviews({
            status: input.status as "pending" | "approved" | "rejected" | "all",
            sortBy: input.sortBy as "date" | "rating" | "name",
            sortOrder: input.sortOrder as "asc" | "desc",
            searchQuery: input.searchQuery,
          });
          return reviews;
        } catch (error) {
          console.error("[tRPC] Get all reviews error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch reviews",
          });
        }
      }),

    // Admin: Approve review
    approve: protectedProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          // Get review details before approving
          const review = await getReviewById(input.reviewId);
          if (!review) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Review not found",
            });
          }

          const success = await approveReview(input.reviewId, ctx.user.id);
          if (!success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to approve review",
            });
          }

          // Send approval notification email
          try {
            await sendReviewApprovedNotification(
              "jason@jasonclark.online",
              review.customerName,
              review.customerEmail,
              review.rating,
              review.text
            );
          } catch (emailError) {
            console.error("Failed to send approval notification email:", emailError);
            // Don't fail the approval if email fails
          }

          return { success: true };
        } catch (error) {
          console.error("[tRPC] Approve review error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to approve review",
          });
        }
      }),

    // Admin: Reject review
    reject: protectedProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          // Get review details before rejecting
          const review = await getReviewById(input.reviewId);
          if (!review) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Review not found",
            });
          }

          const success = await rejectReview(input.reviewId, ctx.user.id);
          if (!success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to reject review",
            });
          }

          // Send rejection notification email
          try {
            await sendReviewRejectedNotification(
              "jason@jasonclark.online",
              review.customerName,
              review.customerEmail,
              review.rating,
              review.text
            );
          } catch (emailError) {
            console.error("Failed to send rejection notification email:", emailError);
            // Don't fail the rejection if email fails
          }

          return { success: true };
        } catch (error) {
          console.error("[tRPC] Reject review error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to reject review",
          });
        }
      }),

    // Admin: Delete review
    delete: protectedProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          const success = await deleteReview(input.reviewId);
          if (!success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to delete review",
            });
          }
          return { success: true };
        } catch (error) {
          console.error("[tRPC] Delete review error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete review",
          });
        }
      }),

    // Admin: Create reply to review
    createReply: protectedProcedure
      .input(
        z.object({
          reviewId: z.number(),
          text: z.string().min(1, "Reply text is required"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          const reply = await createReply({
            reviewId: input.reviewId,
            adminId: ctx.user.id,
            text: input.text,
          });

          if (!reply) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create reply",
            });
          }

          return reply;
        } catch (error) {
          console.error("[tRPC] Create reply error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create reply",
          });
        }
      }),

    // Public: Get replies for a review
    getReplies: publicProcedure
      .input(z.object({ reviewId: z.number() }))
      .query(async ({ input }) => {
        try {
          return await getRepliesForReview(input.reviewId);
        } catch (error) {
          console.error("[tRPC] Get replies error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch replies",
          });
        }
      }),

    // Admin: Delete reply
    deleteReply: protectedProcedure
      .input(z.object({ replyId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
          });
        }

        try {
          const success = await deleteReply(input.replyId);
          if (!success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to delete reply",
            });
          }
          return { success: true };
        } catch (error) {
          console.error("[tRPC] Delete reply error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete reply",
          });
        }
      }),
  }),

  // Admin authentication
  admin: router({
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const admin = await getAdminByEmail(input.email);

          if (!admin) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid credentials",
            });
          }

          const isPasswordValid = await bcrypt.compare(input.password, admin.passwordHash);

          if (!isPasswordValid) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid credentials",
            });
          }

          // Set session
          (ctx.req.session as any).adminId = admin.id;
          (ctx.req.session as any).adminEmail = admin.email;

          return {
            success: true,
            admin: {
              id: admin.id,
              email: admin.email,
            },
          };
        } catch (error) {
          console.error("[tRPC] Admin login error:", error);
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Login failed",
          });
        }
      }),

    logout: protectedProcedure.mutation(async ({ ctx }: any) => {
      return new Promise((resolve, reject) => {
        ctx.req.session.destroy((err: any) => {
          if (err) {
            reject(
              new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Logout failed",
              })
            );
          } else {
            resolve({ success: true });
          }
        });
      });
    }),

    getSession: publicProcedure.query(async ({ ctx }: any) => {
      const adminId = (ctx.req.session as any)?.adminId;
      const adminEmail = (ctx.req.session as any)?.adminEmail;

      if (!adminId || !adminEmail) {
        return null;
      }

      return {
        id: adminId,
        email: adminEmail,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
