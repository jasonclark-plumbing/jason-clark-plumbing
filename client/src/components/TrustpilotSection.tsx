/*
 * DESIGN: Heritage British Trade Signage
 * Trustpilot review invitation section with gold styling
 */

import { Star } from "lucide-react";

export default function TrustpilotSection() {
  return (
    <section style={{ background: "#111111", padding: "4rem 0" }}>
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* Trustpilot Logo */}
          <div className="mb-6 flex justify-center">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 50' width='180'%3E%3Ctext x='10' y='35' font-family='Arial, sans-serif' font-size='24' font-weight='bold' fill='%23C9A84C'%3ETrustpilot%3C/text%3E%3C/svg%3E"
              alt="Trustpilot"
              className="h-8 object-contain"
            />
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 700,
              color: "#F0EAD6",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Share Your Experience
          </h2>

          {/* Gold divider */}
          <div className="gold-divider mb-6 flex justify-center">
            <div className="gold-divider-diamond" />
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "1rem",
              color: "#9A8A6A",
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}
          >
            We'd love to hear about your experience with Jason Clark Plumbing. Leave a review on Trustpilot and help other homeowners find reliable, professional plumbing services.
          </p>

          {/* Star icons */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                fill="#C9A84C"
                color="#C9A84C"
                className="transition-transform duration-300 hover:scale-110"
              />
            ))}
          </div>

          {/* CTA Button */}
          <a
            href="mailto:jasonclark.online+0bd24b486e@invite.trustpilot.com"
            className="btn-gold inline-block"
            style={{
              padding: "0.75rem 2rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "4px",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.95rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 16px rgba(201,168,76,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Write a Review
          </a>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "0.85rem",
              color: "#6B5D4F",
              marginTop: "1.5rem",
            }}
          >
            Click the button above to share your feedback directly with Trustpilot
          </p>
        </div>
      </div>
    </section>
  );
}
