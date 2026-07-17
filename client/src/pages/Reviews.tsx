import { testimonials } from "@/data/testimonials";

export default function Reviews() {
  return (
    <div className="min-h-screen bg-black text-cream pt-20 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
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
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="border-2 border-gold/40 p-8 hover:border-gold/80 transition-colors"
            >
              {/* Quote Mark */}
              <div className="text-5xl text-gold/30 mb-4 leading-none">"</div>

              {/* Testimonial Text */}
              <p className="text-lg text-cream mb-6 leading-relaxed italic">
                {testimonial.text}
              </p>

              {/* Customer Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                <div>
                  <p className="text-gold font-semibold">{testimonial.name}</p>
                  <p className="text-cream/60 text-sm">
                    {new Date(testimonial.date).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Star Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gold text-xl">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
