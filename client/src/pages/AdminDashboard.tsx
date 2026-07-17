import { useState, useEffect } from "react";
import { Star, Check, X, Trash2 } from "lucide-react";

interface Review {
  id: number;
  customerName: string;
  customerEmail: string;
  rating: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export default function AdminDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/trpc/reviews.getPending", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.result?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: number) => {
    try {
      setActionLoading(reviewId);
      const response = await fetch("/api/trpc/reviews.approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          input: { reviewId },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve review");
      }

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reviewId: number) => {
    try {
      setActionLoading(reviewId);
      const response = await fetch("/api/trpc/reviews.reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          input: { reviewId },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject review");
      }

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      setActionLoading(reviewId);
      const response = await fetch("/api/trpc/reviews.delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          input: { reviewId },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/trpc/admin.logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cream pt-20 pb-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-playfair text-gold mb-2">Review Moderation</h1>
            <p className="text-cream/60">Manage customer reviews</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-gold/40 text-cream hover:bg-gold/10 transition"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 text-red-400 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-cream/60">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 border border-gold/20 rounded">
            <p className="text-cream/60">No pending reviews</p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-cream/60">
              {reviews.length} pending review{reviews.length !== 1 ? "s" : ""}
            </p>

            {reviews.map((review) => (
              <div key={review.id} className="bg-black border-2 border-gold/30 p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-cream">{review.customerName}</h3>
                    <p className="text-cream/60 text-sm">{review.customerEmail}</p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? "fill-gold text-gold" : "text-gold/30"}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-cream mb-6 leading-relaxed">{review.text}</p>

                {/* Metadata */}
                <p className="text-cream/40 text-sm mb-6">
                  Submitted: {new Date(review.submittedAt).toLocaleString()}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(review.id)}
                    disabled={actionLoading === review.id}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-600/40 text-green-400 hover:bg-green-600/30 transition disabled:opacity-50"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    disabled={actionLoading === review.id}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 border border-yellow-600/40 text-yellow-400 hover:bg-yellow-600/30 transition disabled:opacity-50"
                  >
                    <X size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={actionLoading === review.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30 transition disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
