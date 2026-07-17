/*
 * DESIGN: Heritage British Trade Signage
 * Sticky top nav, jet black bg, gold rule underline on links, gold CTA button.
 * Montserrat uppercase labels, logo badge left-aligned on desktop.
 */

import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "/reviews" },
  { label: "Why Choose Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/")) {
      // For page routes, use window.location
      window.location.href = href;
    } else {
      // For anchor links, scroll to element
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(12, 12, 12, 0.97)"
          : "rgba(12, 12, 12, 0.85)",
        backdropFilter: "blur(8px)",
        borderBottom: scrolled ? "1px solid rgba(201, 168, 76, 0.3)" : "1px solid transparent",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-3 group"
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/jcp-logo-badge-Qtyi525UFR9GYq476rkjba.webp"
              alt="Jason Clark Plumbing badge"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <div className="hidden sm:block text-left">
              <div
                className="font-bold leading-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.1rem",
                  color: "#C9A84C",
                  letterSpacing: "0.02em",
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
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="relative group text-sm font-medium transition-colors duration-200"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9A8A6A",
                }}
              >
                <span className="group-hover:text-[#C9A84C] transition-colors duration-200">
                  {link.label}
                </span>
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A84C] group-hover:w-full transition-all duration-300"
                />
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:01480769129"
              className="btn-gold text-xs"
            >
              <Phone size={13} />
              01480 769129
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 text-[#C9A84C]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? "400px" : "0",
          borderTop: isOpen ? "1px solid rgba(201, 168, 76, 0.2)" : "none",
        }}
      >
        <div className="container py-4 flex flex-col gap-1" style={{ background: "#0C0C0C" }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-left py-3 px-2 border-b border-[rgba(201,168,76,0.1)] last:border-0"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#9A8A6A",
              }}
            >
              {link.label}
            </button>
          ))}
          <a
            href="tel:01480769129"
            className="btn-gold mt-3 text-xs"
          >
            <Phone size={13} />
            Call 01480 769129
          </a>
        </div>
      </div>
    </header>
  );
}
