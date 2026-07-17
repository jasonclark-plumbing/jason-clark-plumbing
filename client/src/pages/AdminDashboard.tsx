"use client";

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
      const queryString = encodeURIComponent(JSON.stringify(input));
      const response = await fetch(`/api/trpc/reviews.getAll?input=${queryString}`, {
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
      setError("");

      // Fetch replies for all reviews
      for (const review of data.result?.data || []) {
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
      const response = await fetch(`/api/trpc/reviews.getReplies?input=${JSON.stringify({ reviewId })}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.result?.data) {
        setReplies((prev) => ({
          ...prev,
          [reviewId]: data.result.data,
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
      setError("");
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

      if (!response.ok) throw new Error("Failed to reject review");

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject review");
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
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
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
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve reviews");
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
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject reviews");
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
    if (selectedReviews.size === reviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(reviews.map((r) => r.id)));
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

  const handleReplySubmit = async () => {
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

      // Fetch updated replies
      await fetchReplies(selectedReviewForReply.id);
      setReplyText("");
      setReplyModalOpen(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create reply");
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

      // Fetch updated replies
      await fetchReplies(reviewId);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete reply");
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
            {/* Controls */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 text-cream/40" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or review text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-gold/20 text-cream placeholder-cream/40 focus:outline-none focus:border-gold/40"
                />
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-gold/20 text-cream hover:border-gold/40 transition"
                  >
                    Sort by {sortField.charAt(0).toUpperCase() + sortField.slice(1)}
                    <ChevronDown size={16} />
                  </button>
                  {sortDropdownOpen && (
                    <div className="absolute top-full mt-1 bg-black border border-gold/20 z-10 min-w-max">
                      {(["date", "rating", "name"] as const).map((field) => (
                        <button
                          key={field}
                          onClick={() => {
                            setSortField(field);
                            setSortDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gold/10 ${
                            sortField === field ? "text-gold" : "text-cream"
                          }`}
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort Direction */}
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-4 py-2 border border-gold/20 text-cream hover:border-gold/40 transition"
                >
                  {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                </button>

                {/* Status Filters */}
                {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 border transition ${
                      statusFilter === status
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-gold/20 text-cream hover:border-gold/40"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Bulk Actions */}
              {selectedReviews.size > 0 && (
                <div className="flex gap-3 p-4 bg-gold/5 border border-gold/20 rounded">
                  <span className="text-cream/80 text-sm">
                    {selectedReviews.size} review{selectedReviews.size !== 1 ? "s" : ""} selected
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
                Showing {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                {statusFilter !== "all" && ` (${statusFilter})`}
              </p>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {/* Select All Checkbox */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-gold/5 border border-gold/20 rounded">
                  <input
                    type="checkbox"
                    checked={selectedReviews.size === reviews.length && reviews.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-cream/80 text-sm">
                    {selectedReviews.size === reviews.length && reviews.length > 0
                      ? "All selected"
                      : "Select all"}
                  </span>
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="text-center py-12 border border-gold/20 rounded">
                  <p className="text-cream/60">
                    {searchQuery ? "No reviews match your search" : "No reviews found"}
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className={`bg-black border-2 p-6 transition ${
                      selectedReviews.has(review.id)
                        ? "border-gold bg-gold/5"
                        : "border-gold/20 hover:border-gold/40"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedReviews.has(review.id)}
                        onChange={() => toggleSelectReview(review.id)}
                        className="w-4 h-4 cursor-pointer mt-1"
                      />

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-cream">{review.customerName}</h3>
                            <p className="text-cream/60 text-sm">{review.customerEmail}</p>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.rating ? "fill-gold text-gold" : "text-gold/20"}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-cream/80 mb-3">{review.text}</p>

                        {/* Display Replies */}
                        {replies[review.id] && replies[review.id].length > 0 && (
                          <div className="mb-4 p-4 bg-gold/5 border border-gold/20 rounded">
                            <p className="text-sm font-semibold text-gold mb-2">Admin Response:</p>
                            {replies[review.id].map((reply) => (
                              <div key={reply.id} className="text-cream/80 text-sm mb-2">
                                <p>{reply.text}</p>
                                <div className="flex justify-between items-center mt-2 text-xs text-cream/60">
                                  <span>{new Date(reply.createdAt).toLocaleString()}</span>
                                  <button
                                    onClick={() => handleDeleteReply(reply.id, review.id)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center text-sm text-cream/60 mb-4">
                          <span>Submitted: {new Date(review.submittedAt).toLocaleString()}</span>
                          <span
                            className={`px-3 py-1 rounded text-xs font-semibold ${
                              review.status === "pending"
                                ? "bg-yellow-600/20 text-yellow-400"
                                : review.status === "approved"
                                ? "bg-green-600/20 text-green-400"
                                : "bg-red-600/20 text-red-400"
                            }`}
                          >
                            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 flex-wrap">
                          {review.status === "pending" && (
                            <>
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
                            </>
                          )}
                          <button
                            onClick={() => {
                              setSelectedReviewForReply(review);
                              setReplyModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-600/40 text-blue-400 hover:bg-blue-600/30 transition"
                          >
                            <MessageSquare size={16} />
                            Reply
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

      {/* Reply Modal */}
      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent className="bg-black border border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-gold">Reply to Review</DialogTitle>
            <DialogDescription className="text-cream/60">
              {selectedReviewForReply?.customerName} - {selectedReviewForReply?.customerEmail}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-gold/5 border border-gold/20 rounded">
              <p className="text-sm text-cream/80">{selectedReviewForReply?.text}</p>
            </div>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your response..."
              className="w-full p-3 bg-black border border-gold/20 text-cream placeholder-cream/40 focus:outline-none focus:border-gold/40 rounded min-h-[120px]"
            />
          </div>

          <DialogFooter>
            <button
              onClick={() => setReplyModalOpen(false)}
              className="px-4 py-2 border border-gold/20 text-cream hover:border-gold/40 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleReplySubmit}
              disabled={replyLoading || !replyText.trim()}
              className="px-4 py-2 bg-blue-600/20 border border-blue-600/40 text-blue-400 hover:bg-blue-600/30 transition disabled:opacity-50"
            >
              {replyLoading ? "Sending..." : "Send Reply"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
