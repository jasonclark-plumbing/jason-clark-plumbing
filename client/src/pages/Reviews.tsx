import { useEffect, useState } from "react";
import { testimonials } from "@/data/testimonials";
import ReviewSubmitForm from "@/components/ReviewSubmitForm";
import { Star, ArrowLeft } from "lucide-react";

interface DatabaseReview {
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

export default function Reviews() {
  const [approvedReviews, setApprovedReviews] = useState<DatabaseReview[]>([]);
  const [replies, setReplies] = useState<Record<number, Reply[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const fetchReplies = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/trpc/reviews.getReplies?input=${encodeURIComponent(JSON.stringify({ reviewId }))}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      if (data.result?.data) {
        setReplies((prev) => ({
          ...prev,
          [reviewId]: data.result.data,
        }));
      }
    } catch (err) {
      console.error("Error fetching replies:", err);
    }
  };

  const fetchApprovedReviews = async () => {
    try {
      setLoading(true);
      setError("");

      // Call tRPC endpoint with proper format
      const response = await fetch("/api/trpc/reviews.getApproved", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // tRPC returns data in result.data format
      const reviews = data.result?.data || [];
      setApprovedReviews(reviews);
      
      // Fetch replies for each review
      for (const review of reviews) {
        fetchReplies(review.id);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      // Don't show error to user - just use static testimonials
      setError("");
    } finally {
      setLoading(false);
    }
  };

  // Combine static testimonials with database reviews
  const allReviews = [
    ...testimonials.map((t) => ({
      id: `static-${t.id}` as any,
      customerName: t.name,
      customerEmail: "",
      rating: 5,
      text: t.text,
      status: "approved" as const,
      submittedAt: t.date,
      isStatic: true,
    })),
    ...approvedReviews.map((r: DatabaseReview) => ({
      ...r,
      id: `db-${r.id}`,
      isStatic: false,
    })),
  ];

  return (
    <div className="min-h-screen bg-black text-cream pb-20">
      {/* Navigation Bar */}
      <nav className="bg-black border-b border-gold/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </a>
          <h2 className="text-2xl font-playfair text-gold">Reviews</h2>
          <div className="w-24"></div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 mb-16 pt-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-playfair text-gold mb-4">
            Customer Reviews
          </h1>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto">
            What our satisfied customers have to say about Jason Clark Plumbing
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-cream/60">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : allReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cream/60">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            allReviews.map((review) => (
              <div
                key={review.id}
                className="border-2 border-gold/40 p-8 hover:border-gold/80 transition-colors"
              >
                {/* Quote Mark */}
                <div className="text-5xl text-gold/30 mb-4 leading-none">"</div>

                {/* Review Text */}
                <p className="text-lg text-cream mb-6 leading-relaxed italic">
                  {review.text}
                </p>

                {/* Admin Reply */}
                {!review.isStatic && replies[review.id] && replies[review.id].length > 0 && (
                  <div className="mt-6 p-4 bg-gold/5 border border-gold/20 rounded">
                    <p className="text-sm font-semibold text-gold mb-2">Jason Clark's Response:</p>
                    {replies[review.id].map((reply) => (
                      <div key={reply.id}>
                        <p className="text-cream/80 text-sm mb-2">{reply.text}</p>
                        <p className="text-cream/40 text-xs">
                          {new Date(reply.createdAt).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Customer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                  <div>
                    <p className="text-gold font-semibold">{review.customerName}</p>
                    <p className="text-cream/60 text-sm">
                      {new Date(review.submittedAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < review.rating ? "fill-gold text-gold" : "text-gold/30"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Review Submission Form */}
        <div className="mt-16 mb-16">
          <ReviewSubmitForm />
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center border-t-2 border-gold/30 pt-12">
          <h2 className="text-2xl font-playfair text-gold mb-4">
            Ready to Experience Quality Plumbing?
          </h2>
          <p className="text-cream/80 mb-6">
            Join our growing list of satisfied customers in Huntingdon and surrounding areas
          </p>
          <a
            href="/#contact"
            className="inline-block px-8 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 font-semibold"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
