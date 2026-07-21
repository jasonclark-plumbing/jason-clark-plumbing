/*
 * DESIGN: Heritage British Trade Signage
 * Deep black footer with gold rule top border, ornamental dividers, badge logo.
 * Three-column layout: brand, links, contact.
 */

import { Phone, MessageCircle, Mail, Facebook } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#080808", borderTop: "1px solid rgba(201,168,76,0.3)" }}>
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/jcp-logo-badge-Qtyi525UFR9GYq476rkjba.webp"
                alt="Jason Clark Plumbing"
                className="w-12 h-12 object-contain"
              />
              <div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#C9A84C",
                  }}
                >
                  Jason Clark
                </div>
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    color: "#9A8A6A",
                    textTransform: "uppercase",
                  }}
                >
                  Plumbing
                </div>
              </div>
            </div>
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "0.875rem",
                color: "#9A8A6A",
                lineHeight: 1.75,
              }}
            >
              Reliable local plumbing services in Huntingdon and the surrounding area. City &amp; Guilds qualified, ACIPHE Associate Member, with contact available by phone, WhatsApp or email.
            </p>
            <div className="flex gap-3 mt-1">
              {[
                { icon: <Phone size={15} />, href: "tel:01480769129", label: "Call" },
                { icon: <MessageCircle size={15} />, href: "https://wa.me/447767910713", label: "WhatsApp" },
                { icon: <Mail size={15} />, href: "mailto:plumbing@jasonclark.online", label: "Email" },
                { icon: <Facebook size={15} />, href: "https://www.facebook.com/JasonClarkPlumbing", label: "Facebook" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="w-9 h-9 flex items-center justify-center transition-colors duration-200"
                  style={{
                    border: "1px solid rgba(201,168,76,0.3)",
                    color: "#9A8A6A",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#C9A84C";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#9A8A6A";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)";
                  }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h4
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A84C",
                marginBottom: "1.25rem",
              }}
            >
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Home", href: "#home", isPage: false },
                { label: "Services", href: "#services", isPage: false },
                { label: "About", href: "#about", isPage: false },
                { label: "Why Choose Us", href: "#why-us", isPage: false },
                { label: "Reviews", href: "/reviews", isPage: true },
                { label: "Contact", href: "#contact", isPage: false },
              ].map((link) => (
                <li key={link.label}>
                  {link.isPage ? (
                    <a
                      href={link.href}
                      className="text-left hover:text-[#C9A84C] transition-colors duration-200"
                      style={{
                        fontFamily: "'Lora', serif",
                        fontSize: "0.875rem",
                        color: "#9A8A6A",
                      }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-left hover:text-[#C9A84C] transition-colors duration-200"
                      style={{
                        fontFamily: "'Lora', serif",
                        fontSize: "0.875rem",
                        color: "#9A8A6A",
                      }}
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A84C",
                marginBottom: "1.25rem",
              }}
            >
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { icon: <Phone size={14} />, text: "01480 769129", href: "tel:01480769129" },
                { icon: <MessageCircle size={14} />, text: "07767 910713 (WhatsApp)", href: "https://wa.me/447767910713" },
                { icon: <Mail size={14} />, text: "plumbing@jasonclark.online", href: "mailto:plumbing@jasonclark.online" },
                { icon: <Facebook size={14} />, text: "Jason Clark Plumbing", href: "https://www.facebook.com/JasonClarkPlumbing" },
              ].map((item) => (
                <li key={item.text}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 hover:text-[#C9A84C] transition-colors duration-200"
                    style={{
                      fontFamily: "'Lora', serif",
                      fontSize: "0.875rem",
                      color: "#9A8A6A",
                    }}
                  >
                    <span style={{ color: "#C9A84C", flexShrink: 0 }}>{item.icon}</span>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: "0.75rem",
                }}
              >
                Hours
              </p>
              <p
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: "0.875rem",
                  color: "#9A8A6A",
                  lineHeight: 1.6,
                }}
              >
                Monday – Friday
                <br />
                0700–1800
                <br />
                <span style={{ fontSize: "0.8rem", color: "#6A5A4A" }}>No emergency after-hours service</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}
        >
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.7rem",
              color: "#9A8A6A",
              letterSpacing: "0.08em",
            }}
          >
            © {year} Jason Clark Plumbing. All rights reserved.
          </p>
          <div className="flex gap-4 flex-wrap justify-center sm:justify-end">
            <a
              href="/privacy"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.7rem",
                color: "#9A8A6A",
                textDecoration: "none",
              }}
              className="hover:text-[#C9A84C] transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <span style={{ color: "rgba(201,168,76,0.2)" }}>|</span>
            <a
              href="/terms"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.7rem",
                color: "#9A8A6A",
                textDecoration: "none",
              }}
              className="hover:text-[#C9A84C] transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
