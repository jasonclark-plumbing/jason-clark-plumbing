import { useEffect, useState } from "react";
import { Link } from "wouter";

interface Review {
  id: string;
  customerName: string;
  text: string;
  rating: number;
  submittedAt: string;
}

export default function TestimonialsSection() {
  const [latestReview, setLatestReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestReview = async () => {
      try {
        const response = await fetch("/api/trpc/reviews.getApproved");
        const data = await response.json();
        
        if (data.result?.data && data.result.data.length > 0) {
          // Get the most recent review (last in the array since they're ordered ascending)
          const latest = data.result.data[data.result.data.length - 1];
          setLatestReview({
            id: latest.id,
            customerName: latest.customerName,
            text: latest.text,
            rating: latest.rating,
            submittedAt: latest.submittedAt,
          });
        }
      } catch (error) {
        console.error("Failed to fetch latest review:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestReview();
  }, []);

  // Use latest review from database, or fallback to placeholder
  const featuredTestimonial = latestReview || {
    id: "placeholder",
    customerName: "Customer Review",
    text: "Loading latest customer review...",
    rating: 5,
    submittedAt: new Date().toISOString(),
  };

  return (
    <section className="bg-black text-cream py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-playfair text-gold mb-4">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="border-l-4 border-gold pl-8 py-8">
            {/* Quote Mark */}
            <div className="text-6xl text-gold/30 mb-4 leading-none">"</div>

            {/* Testimonial Text */}
            <p className="text-xl text-cream mb-6 leading-relaxed italic">
              {isLoading ? "Loading latest review..." : featuredTestimonial.text}
            </p>

            {/* Customer Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gold font-playfair text-lg font-semibold">
                  {featuredTestimonial.customerName}
                </p>
                <p className="text-cream/60 text-sm">
                  {new Date(featuredTestimonial.submittedAt).toLocaleDateString(
                    "en-GB",
                    {
                      year: "numeric",
                      month: "long",
                    }
                  )}
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex gap-1">
                {[...Array(featuredTestimonial.rating)].map((_, i) => (
                  <span key={i} className="text-gold text-2xl">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* View All Reviews Link */}
        <div className="text-center">
          <Link href="/reviews" className="inline-block px-8 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 font-semibold">
            Read All Reviews
          </Link>
        </div>
      </div>
    </section>
  );
}
