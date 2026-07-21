import { ArrowLeft } from "lucide-react";

export default function Privacy() {
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
            Privacy Policy
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
              1. Introduction
            </h2>
            <p>
              Jason Clark Plumbing ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website or contact us for plumbing services.
            </p>
            <p>
              We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              2. Information We Collect
            </h2>
            <p>We may collect the following information:</p>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#C9A84C", marginBottom: "0.75rem" }}>
              Information you provide directly
            </h3>
            <ul style={{ marginBottom: "1rem", marginLeft: "2rem" }}>
              <li>Name</li>
              <li>Address</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Details about your plumbing issue or service request</li>
              <li>Any information you send via contact forms, email, or messaging</li>
            </ul>

            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#C9A84C", marginBottom: "0.75rem" }}>
              Automatically collected information
            </h3>
            <p>When you visit our website, we may collect:</p>
            <ul style={{ marginBottom: "1rem", marginLeft: "2rem" }}>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Pages visited</li>
              <li>Basic analytics data (e.g., via Google Analytics)</li>
            </ul>

            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: "#C9A84C", marginBottom: "0.75rem" }}>
              Cookies
            </h3>
            <p>
              We may use cookies to improve website performance and user experience. You can disable cookies in your browser settings.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              3. How We Use Your Information
            </h2>
            <p>We use your information to:</p>
            <ul style={{ marginBottom: "1rem", marginLeft: "2rem" }}>
              <li>Respond to enquiries</li>
              <li>Provide plumbing services</li>
              <li>Arrange appointments</li>
              <li>Send invoices or quotes</li>
              <li>Improve our website</li>
              <li>Maintain business records</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              We do not sell or share your data with third parties for marketing.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              4. Lawful Basis for Processing
            </h2>
            <p>We process your personal data under the following lawful bases:</p>
            <ul style={{ marginBottom: "1rem", marginLeft: "2rem" }}>
              <li>Contract – to provide plumbing services you request</li>
              <li>Legitimate interests – to operate and improve our business</li>
              <li>Legal obligation – for accounting, tax, and regulatory requirements</li>
            </ul>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              5. Sharing Your Information
            </h2>
            <p>We may share your information with:</p>
            <ul style={{ marginBottom: "1rem", marginLeft: "2rem" }}>
              <li>Payment processors (e.g., bank or card provider)</li>
              <li>Accounting or bookkeeping services</li>
              <li>Website hosting provider</li>
              <li>Legal or regulatory authorities if required</li>
            </ul>
            <p>
              We never sell your data.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              6. Data Storage & Security
            </h2>
            <p>We store your data securely using:</p>
            <ul style={{ marginBottom: "1rem", marginLeft: "2rem" }}>
              <li>Encrypted devices</li>
              <li>Password-protected systems</li>
              <li>Secure cloud storage</li>
            </ul>
            <p>
              We keep your data only as long as necessary for business, legal, or tax purposes.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              7. Your Rights
            </h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul style={{ marginBottom: "1rem", marginLeft: "2rem" }}>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
            <p>
              To exercise any of these rights, contact us using the details below.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              8. Third-Party Links
            </h2>
            <p>
              Our website may contain links to external sites. We are not responsible for their privacy practices.
            </p>
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. The latest version will always be available on our website.
            </p>
          </section>

          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 700, color: "#E8C96B", marginBottom: "1rem" }}>
              10. Contact Us
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
