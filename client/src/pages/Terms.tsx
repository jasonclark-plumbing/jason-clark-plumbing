import { ArrowLeft } from "lucide-react";

export default function Terms() {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen" style={{ background: "#0C0C0C", color: "#F0EAD6" }}>
      {/* Header */}
      <div style={{ background: "rgba(12, 12, 12, 0.97)", borderBottom: "1px solid rgba(201, 168, 76, 0.2)", padding: "2rem 0" }}>
        <div className="container">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 mb-4"
            style={{ color: "#C9A84C", cursor: "pointer", fontSize: "0.875rem" }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: "#F0EAD6" }}>
            Terms of Service
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-4xl prose prose-invert" style={{ fontFamily: "'Lora', serif", fontSize: "1rem", lineHeight: 1.8 }}>
          <p style={{ fontSize: "0.875rem", color: "#9A8A6A", marginBottom: "2rem" }}>
            Last updated: July 2026
          </p>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By using this website and/or engaging Jason Clark Plumbing for services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our website or services.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              2. Services Offered
            </h2>
            <p>
              Jason Clark Plumbing offers plumbing repair and installation services in Huntingdon and surrounding areas. Services include:
            </p>
            <ul style={{ marginBottom: "1rem", marginLeft: "2rem" }}>
              <li>General plumbing repairs</li>
              <li>Radiator installation and repair</li>
              <li>Bathroom fixture replacement</li>
              <li>Blocked drain clearance</li>
              <li>Leak detection and repair</li>
              <li>Outside tap installation</li>
              <li>Shower installation</li>
              <li>Pipework and re-piping</li>
            </ul>
            <p style={{ color: "#9A8A6A", fontSize: "0.95rem" }}>
              <strong>Note:</strong> We do not offer emergency after-hours service. Business hours are 0700–1800, Monday to Friday.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              3. Quotations and Estimates
            </h2>
            <p>
              Quotations provided are estimates based on information given. Final costs may vary depending on actual work required. Any quotation is valid for 7 days from the date issued unless stated otherwise.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              4. Payment Terms
            </h2>
            <p>
              Payment is required upon completion of work unless alternative arrangements are agreed in writing. We accept cash, bank transfer, and card payments.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              5. Warranty & Guarantee
            </h2>
            <p>
              All work carried out by Jason Clark Plumbing is guaranteed for <strong>12 months from completion</strong> against defective workmanship. Parts supplied are covered by the manufacturers' warranty.
            </p>
            <p>
              This guarantee does not cover damage caused by misuse, accident, or failure to follow maintenance instructions.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              6. Liability
            </h2>
            <p>
              Jason Clark Plumbing takes all reasonable care to protect your property. However, we cannot be held responsible for damage caused by factors outside our control or pre-existing structural defects not identified before work begins.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              7. Cancellation
            </h2>
            <p>
              If you need to cancel a scheduled appointment, please provide at least 24 hours' notice. Cancellations with less notice may incur a cancellation fee.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              8. Website Use
            </h2>
            <p>
              You agree to use this website only for lawful purposes. You may not:
            </p>
            <ul style={{ marginBottom: "1rem", marginLeft: "2rem" }}>
              <li>Harass or cause distress to any person</li>
              <li>Transmit obscene or offensive content</li>
              <li>Interrupt the operation of the website</li>
              <li>Breach any applicable law or regulation</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              9. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, images, and designs, is the property of Jason Clark Plumbing. You may not reproduce, distribute, or transmit content without permission.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              10. Links and Third-Party Sites
            </h2>
            <p>
              This website may contain links to third-party websites. Jason Clark Plumbing is not responsible for the content, accuracy, or practices of external sites.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              11. Changes to Terms
            </h2>
            <p>
              These terms may be updated at any time. Continued use of the website or services constitutes acceptance of updated terms.
            </p>
          </section>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              12. Contact
            </h2>
            <div style={{ background: "rgba(201, 168, 76, 0.1)", padding: "1.5rem", border: "1px solid rgba(201, 168, 76, 0.3)", borderRadius: "4px" }}>
              <p style={{ margin: 0, marginBottom: "0.5rem" }}>
                <strong>Jason Clark Plumbing</strong>
              </p>
              <p style={{ margin: 0, marginBottom: "0.5rem" }}>
                Huntingdon, Cambridgeshire
              </p>
              <p style={{ margin: 0, marginBottom: "0.5rem" }}>
                Email: <a href="mailto:plumbing@jasonclark.online" style={{ color: "#C9A84C", textDecoration: "none" }}>plumbing@jasonclark.online</a>
              </p>
              <p style={{ margin: 0, marginBottom: "0.5rem" }}>
                Phone: <a href="tel:01480769129" style={{ color: "#C9A84C", textDecoration: "none" }}>01480 769129</a>
              </p>
              <p style={{ margin: 0 }}>
                Website: <a href="https://www.jasonclark.online" style={{ color: "#C9A84C", textDecoration: "none" }}>www.jasonclark.online</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
