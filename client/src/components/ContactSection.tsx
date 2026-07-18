/*
 * DESIGN: Heritage British Trade Signage
 * Dark contact section with gold-bordered card frame.
 * Two-column: contact details left, enquiry form right.
 * Gold input borders, Playfair Display headings.
 */

import { useEffect, useRef, useState } from "react";
import { Phone, MessageCircle, Mail, Facebook, MapPin } from "lucide-react";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const CONTACT_ITEMS = [
  {
    icon: <Phone size={18} />,
    label: "Telephone",
    value: "01480 769129",
    href: "tel:01480769129",
  },
  {
    icon: <MessageCircle size={18} />,
    label: "WhatsApp",
    value: "07767 910713",
    href: "https://wa.me/447767910713",
  },
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "plumbing@jasonclark.online",
    href: "mailto:plumbing@jasonclark.online",
  },
  {
    icon: <Facebook size={18} />,
    label: "Facebook",
    value: "Jason Clark Plumbing",
    href: "https://www.facebook.com/JasonClarkPlumbing",
  },
  {
    icon: <MapPin size={18} />,
    label: "Area Served",
    value: "Huntingdon & surrounding areas",
    href: null,
  },
];

export default function ContactSection() {
  const { ref: headRef, inView: headIn } = useInView();
  const { ref: leftRef, inView: leftIn } = useInView();
  const { ref: rightRef, inView: rightIn } = useInView();

  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Compose mailto link with form data
    const subject = encodeURIComponent(`Website Enquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:plumbing@jasonclark.online?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(201,168,76,0.3)",
    color: "#F0EAD6",
    fontFamily: "'Lora', serif",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <section id="contact" style={{ background: "#0C0C0C", padding: "6rem 0" }}>
      <div className="container">
        {/* Heading */}
        <div
          ref={headRef}
          className="text-center mb-14"
          style={{
            opacity: headIn ? 1 : 0,
            transform: headIn ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
          }}
        >
          <div className="section-label mb-4">Get In Touch</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#F0EAD6",
              marginBottom: "1rem",
            }}
          >
            Contact Jason
          </h2>
          <div className="gold-divider max-w-xs mx-auto mb-5">
            <div className="gold-divider-diamond" />
          </div>
          <p
            className="max-w-xl mx-auto"
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "1rem",
              color: "#9A8A6A",
              lineHeight: 1.8,
            }}
          >
            Whether you have an emergency or simply want to discuss a project,
            Jason is happy to help. Get in touch for a free, no-obligation quote.
            <span className="mt-3 block text-[#F0EAD6]">
              Fast response for urgent plumbing issues and planned jobs alike.
            </span>
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: contact details */}
          <div
            ref={leftRef}
            className="gold-card p-8 flex flex-col gap-6"
            style={{
              opacity: leftIn ? 1 : 0,
              transform: leftIn ? "translateX(0)" : "translateX(-24px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            {/* Ornamental corner brackets */}
            <div className="absolute top-3 left-3 opacity-40 pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M1 19 L1 1 L19 1" stroke="#C9A84C" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <div className="absolute top-3 right-3 opacity-40 pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19 19 L19 1 L1 1" stroke="#C9A84C" strokeWidth="1" fill="none" />
              </svg>
            </div>

            <div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.375rem",
                  fontWeight: 700,
                  color: "#C9A84C",
                  marginBottom: "0.5rem",
                }}
              >
                Contact Details
              </h3>
              <div className="gold-divider" style={{ maxWidth: "120px" }}>
                <div className="gold-divider-diamond" />
              </div>
            </div>

            <ul className="flex flex-col gap-5">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center mt-0.5"
                    style={{
                      border: "1px solid rgba(201,168,76,0.4)",
                      color: "#C9A84C",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#9A8A6A",
                        marginBottom: "2px",
                      }}
                    >
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="hover:text-[#C9A84C] transition-colors"
                        style={{
                          fontFamily: "'Lora', serif",
                          fontSize: "0.9375rem",
                          color: "#F0EAD6",
                        }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span
                        style={{
                          fontFamily: "'Lora', serif",
                          fontSize: "0.9375rem",
                          color: "#F0EAD6",
                        }}
                      >
                        {item.value}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Credential badges */}
            <div className="mt-4 pt-6" style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>
              <div className="flex flex-wrap gap-3">
                {["City & Guilds Qualified", "ACIPHE Associate Member", "Fully Insured"].map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1.5 text-xs"
                    style={{
                      border: "1px solid rgba(201,168,76,0.4)",
                      color: "#C9A84C",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: enquiry form */}
          <div
            ref={rightRef}
            className="gold-card p-8"
            style={{
              opacity: rightIn ? 1 : 0,
              transform: rightIn ? "translateX(0)" : "translateX(24px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "#C9A84C",
                marginBottom: "0.5rem",
              }}
            >
              Send an Enquiry
            </h3>
            <div className="gold-divider mb-6" style={{ maxWidth: "120px" }}>
              <div className="gold-divider-diamond" />
            </div>

            {submitted ? (
              <div
                className="flex flex-col items-center justify-center gap-4 py-12 text-center"
              >
                <div
                  className="w-14 h-14 flex items-center justify-center"
                  style={{ border: "1px solid #C9A84C", borderRadius: "50%", color: "#C9A84C" }}
                >
                  <Mail size={24} />
                </div>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.125rem",
                    color: "#F0EAD6",
                  }}
                >
                  Thank you for your enquiry!
                </p>
                <p
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "0.875rem",
                    color: "#9A8A6A",
                  }}
                >
                  Your email client should have opened. Jason will be in touch shortly.
                </p>
                <button
                  className="btn-ghost-gold mt-2 text-xs"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#9A8A6A",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Your Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.3)")}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#9A8A6A",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.3)")}
                      placeholder="01480 000000"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#9A8A6A",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.3)")}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#9A8A6A",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    How Can We Help? *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.3)")}
                    placeholder="Please describe the work you need done..."
                  />
                </div>
                <button type="submit" className="btn-gold mt-2">
                  Send Enquiry
                </button>
                <p
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "0.75rem",
                    color: "#9A8A6A",
                    textAlign: "center",
                  }}
                >
                  Or call directly on{" "}
                  <a href="tel:01480769129" className="text-[#C9A84C] hover:underline">
                    01480 769129
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
