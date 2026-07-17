import { testimonials } from "@/data/testimonials";
import { Link } from "wouter";

export default function TestimonialsSection() {
  // Get the most recent testimonial
  const featuredTestimonial = testimonials[0];

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
              {featuredTestimonial.text}
            </p>

            {/* Customer Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gold font-playfair text-lg font-semibold">
                  {featuredTestimonial.name}
                </p>
                <p className="text-cream/60 text-sm">
                  {new Date(featuredTestimonial.date).toLocaleDateString(
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
                {[...Array(5)].map((_, i) => (
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
