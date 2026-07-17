import { useEffect, useState } from "react";
import { Star, Check, X, Trash2, Search, ChevronDown } from "lucide-react";

interface Review {
  id: number;
  customerName: string;
  customerEmail: string;
  rating: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

type SortField = "date" | "rating" | "name";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function AdminDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [selectedReviews, setSelectedReviews] = useState<Set<number>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/trpc/reviews.getPending", {
        credentials: "include",
      });

      const data = await response.json();

      // Check for tRPC error
      if (data.error) {
        throw new Error(data.error.message || "Failed to fetch reviews");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      setReviews(data.result?.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // Filter reviews based on search query and status
  const filteredReviews = reviews.filter((review) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      review.customerName.toLowerCase().includes(query) ||
      review.customerEmail.toLowerCase().includes(query) ||
      review.text.toLowerCase().includes(query);
    
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    let compareValue = 0;

    if (sortField === "date") {
      compareValue = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    } else if (sortField === "rating") {
      compareValue = a.rating - b.rating;
    } else if (sortField === "name") {
      compareValue = a.customerName.localeCompare(b.customerName);
    }

    return sortOrder === "asc" ? compareValue : -compareValue;
  });

  const handleApprove = async (reviewId: number) => {
    try {
      setActionLoading(reviewId);
      const response = await fetch("/api/trpc/reviews.approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reviewId }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve review");
      }

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setSelectedReviews((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
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
        body: JSON.stringify({ reviewId }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject review");
      }

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setSelectedReviews((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
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
        body: JSON.stringify({ reviewId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setSelectedReviews((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedReviews.size === 0) return;
    if (!confirm(`Approve ${selectedReviews.size} review(s)?`)) return;

    try {
      setBulkActionLoading(true);
      const reviewIds = Array.from(selectedReviews);

      for (const reviewId of reviewIds) {
        await fetch("/api/trpc/reviews.approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reviewId }),
        });
      }

      setReviews((prev) => prev.filter((r) => !selectedReviews.has(r.id)));
      setSelectedReviews(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to bulk approve reviews");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedReviews.size === 0) return;
    if (!confirm(`Reject ${selectedReviews.size} review(s)?`)) return;

    try {
      setBulkActionLoading(true);
      const reviewIds = Array.from(selectedReviews);

      for (const reviewId of reviewIds) {
        await fetch("/api/trpc/reviews.reject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reviewId }),
        });
      }

      setReviews((prev) => prev.filter((r) => !selectedReviews.has(r.id)));
      setSelectedReviews(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to bulk reject reviews");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const toggleSelectReview = (reviewId: number) => {
    setSelectedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedReviews.size === sortedReviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(sortedReviews.map((r) => r.id)));
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
          <>
            {/* Search and Filter Bar */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-4 flex-wrap">
                {/* Search Input */}
                <div className="flex-1 min-w-64 relative">
                  <Search size={18} className="absolute left-3 top-3 text-gold/60" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or review text..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-gold/30 text-cream px-4 py-2 pl-10 focus:border-gold outline-none transition"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gold/30 text-cream hover:border-gold transition">
                    Sort by {sortField === "date" ? "Date" : sortField === "rating" ? "Rating" : "Name"}
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute top-full left-0 mt-1 bg-black border border-gold/30 rounded hidden group-hover:block z-10">
                    {(["date", "rating", "name"] as SortField[]).map((field) => (
                      <button
                        key={field}
                        onClick={() => setSortField(field)}
                        className="block w-full text-left px-4 py-2 text-cream hover:bg-gold/10 transition"
                      >
                        {field === "date" ? "Date" : field === "rating" ? "Rating" : "Name"}
                      </button>
                    ))}
                  </div>
                </div>

                  {/* Sort Order Toggle */}
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-4 py-2 border border-gold/30 text-cream hover:border-gold transition"
                >
                  {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                </button>

                {/* Status Filter */}
                <div className="flex gap-2">
                  {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 border transition ${
                        statusFilter === status
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-gold/30 text-cream hover:border-gold"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedReviews.size > 0 && (
                <div className="flex gap-3 p-4 bg-gold/5 border border-gold/20 rounded">
                  <span className="text-cream/80">
                    {selectedReviews.size} selected
                  </span>
                  <button
                    onClick={handleBulkApprove}
                    disabled={bulkActionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-600/40 text-green-400 hover:bg-green-600/30 transition disabled:opacity-50"
                  >
                    <Check size={16} />
                    Approve All
                  </button>
                  <button
                    onClick={handleBulkReject}
                    disabled={bulkActionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 border border-yellow-600/40 text-yellow-400 hover:bg-yellow-600/30 transition disabled:opacity-50"
                  >
                    <X size={16} />
                    Reject All
                  </button>
                </div>
              )}

              {/* Results Count */}
              <p className="text-cream/60 text-sm">
                Showing {sortedReviews.length} of {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""}
                {statusFilter !== "all" && ` (${statusFilter})`}
              </p>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {/* Select All Checkbox */}
              {sortedReviews.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-gold/5 border border-gold/20 rounded">
                  <input
                    type="checkbox"
                    checked={selectedReviews.size === sortedReviews.length && sortedReviews.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-cream/80 text-sm">
                    {selectedReviews.size === sortedReviews.length && sortedReviews.length > 0
                      ? "All selected"
                      : "Select all"}
                  </span>
                </div>
              )}

              {sortedReviews.length === 0 ? (
                <div className="text-center py-12 border border-gold/20 rounded">
                  <p className="text-cream/60">
                    {searchQuery ? "No reviews match your search" : "No reviews found"}
                  </p>
                </div>
              ) : (
                sortedReviews.map((review) => (
                  <div
                    key={review.id}
                    className={`bg-black border-2 p-6 transition ${
                      selectedReviews.has(review.id)
                        ? "border-gold/60 bg-gold/5"
                        : "border-gold/30 hover:border-gold/50"
                    }`}
                  >
                    {/* Checkbox and Header */}
                    <div className="flex gap-4 mb-4">
                      <input
                        type="checkbox"
                        checked={selectedReviews.has(review.id)}
                        onChange={() => toggleSelectReview(review.id)}
                        className="w-5 h-5 cursor-pointer mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
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
                        <p className="text-cream mt-4 mb-4 leading-relaxed line-clamp-3">{review.text}</p>

                        {/* Metadata */}
                        <p className="text-cream/40 text-sm mb-4">
                          Submitted: {new Date(review.submittedAt).toLocaleString()}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3 flex-wrap">
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
