
import { useState, useEffect } from "react";
import { Star, Check, X, Trash2, Search, ChevronDown, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Review {
  id: number;
  customerName: string;
  customerEmail: string;
  rating: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

interface Reply {
  id: number;
  reviewId: number;
  adminId: number;
  text: string;
  createdAt: string;
}

type SortField = "date" | "rating" | "name";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function AdminDashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedReviews, setSelectedReviews] = useState<Set<number>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReviewForReply, setSelectedReviewForReply] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replies, setReplies] = useState<Record<number, Reply[]>>({});

  useEffect(() => {
    // Check if user is authenticated (from localStorage or URL token)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const localToken = localStorage.getItem("adminToken");
    
    const token = urlToken || localToken;
    
    if (!token) {
      // No token, redirect to login
      window.location.href = "/admin/login";
      return;
    }
    
    // Store token in localStorage if it came from URL
    if (urlToken) {
      localStorage.setItem("adminToken", urlToken);
      // Clean up URL by removing token
      window.history.replaceState({}, document.title, "/admin/dashboard");
    }
    
    fetchReviews();
  }, [statusFilter, sortField, sortOrder, searchQuery]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const input = {
        status: statusFilter,
        sortBy: sortField,
        sortOrder: sortOrder,
        searchQuery: searchQuery || "",
      };
      
      // Use GET for tRPC queries with ?input parameter
      const inputStr = encodeURIComponent(JSON.stringify(input));
      const response = await fetch(`/api/trpc/reviews.getAll?input=${inputStr}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();

      // Check for tRPC error
      if (data.error) {
        throw new Error(data.error.message || "Failed to fetch reviews");
      }

      setReviews(data.result || []);
      setError("");

      // Fetch replies for all reviews
      for (const review of data.result || []) {
        fetchReplies(review.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (reviewId: number) => {
    try {
      const inputStr = encodeURIComponent(JSON.stringify({ reviewId }));
      const response = await fetch(`/api/trpc/reviews.getReplies?input=${inputStr}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.result) {
        setReplies((prev) => ({
          ...prev,
          [reviewId]: data.result,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch replies:", err);
    }
  };

  const handleApprove = async (reviewId: number) => {
    try {
      setActionLoading(reviewId);
      const response = await fetch("/api/trpc/reviews.approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reviewId }),
      });

      if (!response.ok) throw new Error("Failed to approve review");

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve review");
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

      if (!response.ok) throw new Error("Failed to reject review");

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      setActionLoading(reviewId);
      const response = await fetch("/api/trpc/reviews.delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reviewId }),
      });

      if (!response.ok) throw new Error("Failed to delete review");

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkApprove = async () => {
    try {
      setBulkActionLoading(true);
      for (const reviewId of Array.from(selectedReviews)) {
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
      alert(err instanceof Error ? err.message : "Failed to approve reviews");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkReject = async () => {
    try {
      setBulkActionLoading(true);
      for (const reviewId of Array.from(selectedReviews)) {
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
      alert(err instanceof Error ? err.message : "Failed to reject reviews");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Use POST for tRPC mutations
      const response = await fetch("/api/trpc/admin.logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
      
      const data = await response.json();
      
      // Check for tRPC error
      if (data.error) {
        console.error("Logout error:", data.error.message);
      }
      
      // Always redirect to login after logout attempt
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Logout failed:", err);
      // Force redirect anyway
      window.location.href = "/admin/login";
    }
  };

  const handleSelectAll = () => {
    if (selectedReviews.size === reviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(reviews.map((r) => r.id)));
    }
  };

  const handleSelectReview = (reviewId: number) => {
    const newSelected = new Set(selectedReviews);
    if (newSelected.has(reviewId)) {
      newSelected.delete(reviewId);
    } else {
      newSelected.add(reviewId);
    }
    setSelectedReviews(newSelected);
  };

  const handleCreateReply = async () => {
    if (!selectedReviewForReply || !replyText.trim()) return;

    try {
      setReplyLoading(true);
      const response = await fetch("/api/trpc/reviews.createReply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reviewId: selectedReviewForReply.id,
          text: replyText,
        }),
      });

      if (!response.ok) throw new Error("Failed to create reply");

      const data = await response.json();
      if (data.result) {
        setReplies((prev) => ({
          ...prev,
          [selectedReviewForReply.id]: [...(prev[selectedReviewForReply.id] || []), data.result],
        }));
        setReplyText("");
        setReplyModalOpen(false);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create reply");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteReply = async (replyId: number, reviewId: number) => {
    try {
      const response = await fetch("/api/trpc/reviews.deleteReply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ replyId }),
      });

      if (!response.ok) throw new Error("Failed to delete reply");

      setReplies((prev) => ({
        ...prev,
        [reviewId]: prev[reviewId].filter((r) => r.id !== replyId),
      }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete reply");
    }
  };

  return (
    <div className="min-h-screen bg-black text-cream p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-playfair text-gold mb-2">Review Moderation</h1>
            <p className="text-cream/60">Manage customer reviews</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-600/40 text-red-400 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-cream/60">Loading reviews...</p>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gold/50" />
                <input
                  type="text"
                  placeholder="Search by name, email, or review text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gold/30 text-cream placeholder-cream/40 focus:border-gold outline-none"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="px-4 py-2 border border-gold/30 text-gold hover:border-gold transition-all flex items-center gap-2"
                  >
                    Sort by {sortField}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {sortDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-black border border-gold/30 z-10">
                      {(["date", "rating", "name"] as SortField[]).map((field) => (
                        <button
                          key={field}
                          onClick={() => {
                            setSortField(field);
                            setSortDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gold/10 text-cream"
                        >
                          {field}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-4 py-2 border border-gold/30 text-gold hover:border-gold transition-all"
                >
                  {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                </button>

                {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 border transition-all ${
                      statusFilter === status
                        ? "border-gold bg-gold/20 text-gold"
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
              <div className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded flex justify-between items-center">
                <span className="text-gold">{selectedReviews.size} selected</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkApprove}
                    disabled={bulkActionLoading}
                    className="px-4 py-2 bg-green-600/20 border border-green-600/40 text-green-400 hover:bg-green-600/30 disabled:opacity-50"
                  >
                    Approve Selected
                  </button>
                  <button
                    onClick={handleBulkReject}
                    disabled={bulkActionLoading}
                    className="px-4 py-2 bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30 disabled:opacity-50"
                  >
                    Reject Selected
                  </button>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={selectedReviews.size === reviews.length && reviews.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-cream/60">Showing {reviews.length} reviews</span>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-cream/60">No reviews found</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-black/50 border border-gold/20 rounded hover:border-gold/40 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedReviews.has(review.id)}
                        onChange={() => handleSelectReview(review.id)}
                        className="w-4 h-4 cursor-pointer mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "fill-gold text-gold" : "text-gold/30"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-cream/60 text-sm">
                            {new Date(review.submittedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-semibold text-cream mb-1">{review.customerName}</h3>
                        <p className="text-cream/80 mb-3">{review.text}</p>

                        {replies[review.id]?.length > 0 && (
                          <div className="mb-3 pl-4 border-l border-gold/30">
                            {replies[review.id].map((reply) => (
                              <div key={reply.id} className="mb-2">
                                <p className="text-sm text-gold/80 font-semibold">Admin Reply:</p>
                                <p className="text-sm text-cream/70">{reply.text}</p>
                                <button
                                  onClick={() => handleDeleteReply(reply.id, review.id)}
                                  className="text-xs text-red-400 hover:text-red-300 mt-1"
                                >
                                  Delete Reply
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          {review.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(review.id)}
                                disabled={actionLoading === review.id}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600/20 border border-green-600/40 text-green-400 hover:bg-green-600/30 disabled:opacity-50 text-sm"
                              >
                                <Check className="w-4 h-4" /> Approve
                              </button>
                              <button
                                onClick={() => handleReject(review.id)}
                                disabled={actionLoading === review.id}
                                className="flex items-center gap-1 px-3 py-1 bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30 disabled:opacity-50 text-sm"
                              >
                                <X className="w-4 h-4" /> Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setSelectedReviewForReply(review);
                              setReplyModalOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 border border-blue-600/40 text-blue-400 hover:bg-blue-600/30 text-sm"
                          >
                            <MessageSquare className="w-4 h-4" /> Reply
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            disabled={actionLoading === review.id}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30 disabled:opacity-50 text-sm"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
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

      {/* Reply Modal */}
      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent className="bg-black border border-gold/30">
          <DialogHeader>
            <DialogTitle className="text-gold">Reply to Review</DialogTitle>
            <DialogDescription className="text-cream/60">
              {selectedReviewForReply?.customerName}
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="w-full h-32 p-3 bg-black/50 border border-gold/30 text-cream placeholder-cream/40 focus:border-gold outline-none rounded"
          />
          <DialogFooter>
            <button
              onClick={() => setReplyModalOpen(false)}
              className="px-4 py-2 border border-gold/30 text-cream hover:border-gold"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateReply}
              disabled={replyLoading || !replyText.trim()}
              className="px-4 py-2 bg-gold text-black hover:bg-gold/90 disabled:opacity-50 font-semibold"
            >
              {replyLoading ? "Sending..." : "Send Reply"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
