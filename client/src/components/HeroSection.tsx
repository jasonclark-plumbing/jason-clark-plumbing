/*
 * DESIGN: Heritage British Trade Signage
 * Full-width hero, dark cinematic background image, ornamental badge centred,
 * Playfair Display script heading, gold shimmer on brand name, cream body text.
 * Fade-up entrance animations staggered per element.
 */

import { Phone, MessageCircle, ChevronDown, Mail } from "lucide-react";

export default function HeroSection() {
  const scrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: "80px" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/hero-bg-8MwGcWTbR4BtaMFBfPrzmt.webp)`,
        }}
      />
      {/* Dark overlay with gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(12,12,12,0.75) 0%, rgba(12,12,12,0.55) 50%, rgba(12,12,12,0.9) 100%)",
        }}
      />

      {/* Ornamental corner brackets */}
      <div className="absolute top-24 left-6 md:left-12 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M2 38 L2 2 L38 2" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <div className="absolute top-24 right-6 md:right-12 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M38 38 L38 2 L2 2" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <div className="absolute bottom-20 left-6 md:left-12 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M2 2 L2 38 L38 38" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-6 md:right-12 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M38 2 L38 38 L2 38" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/jcp-logo-badge-Qtyi525UFR9GYq476rkjba.webp"
            alt="Jason Clark Plumbing"
            className="w-28 h-28 md:w-36 md:h-36 object-contain mx-auto"
            style={{ filter: "drop-shadow(0 0 20px rgba(201,168,76,0.4))" }}
          />
        </div>

        {/* Eyebrow */}
        <div
          className="section-label animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          — Serving Huntingdon & Surrounding Areas —
        </div>

        {/* Main heading */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <h1
            className="font-bold leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              color: "#F0EAD6",
            }}
          >
            <span className="italic gold-shimmer-text">Jason Clark</span>
          </h1>
          <div
            className="mt-1"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(1rem, 3vw, 1.75rem)",
              fontWeight: 700,
              letterSpacing: "0.35em",
              color: "#C9A84C",
              textTransform: "uppercase",
            }}
          >
            Plumbing
          </div>
        </div>

        {/* Gold divider */}
        <div
          className="gold-divider w-64 md:w-80 animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <div className="gold-divider-diamond" />
        </div>

        {/* Credentials */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "320ms" }}
        >
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "0.9375rem",
                color: "#F0EAD6",
                letterSpacing: "0.02em",
              }}
            >
              City &amp; Guilds Qualified &nbsp;·&nbsp; ACIPHE Associate Member<br />
              <span style={{ fontSize: "0.875rem", color: "#9A8A6A" }}>Plumbing services in Huntingdon and surrounding areas</span>
            </p>
        </div>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 animate-fade-up w-full"
          style={{ animationDelay: "400ms" }}
        >
          <a
            href="tel:01480769129"
            className="btn-ghost-gold w-full sm:w-48 h-12 flex items-center justify-center gap-2"
            aria-label="Call Jason Clark Plumbing now on 01480 769129"
          >
            <Phone size={15} />
            <span>01480 769129</span>
          </a>
          <a
            href="https://wa.me/447767910713"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-gold w-full sm:w-48 h-12 flex items-center justify-center gap-2"
            aria-label="Message Jason Clark Plumbing on WhatsApp"
          >
            <MessageCircle size={15} />
            <span>WhatsApp</span>
          </a>
          <a
            href="#contact"
            className="btn-ghost-gold w-full sm:w-48 h-12 flex items-center justify-center gap-2"
            aria-label="Request a callback from Jason Clark Plumbing"
          >
            <Mail size={15} />
            <span>Request callback</span>
          </a>
        </div>

        {/* Contact chips */}
        <div
          className="flex flex-wrap justify-center gap-4 mt-1 animate-fade-up"
          style={{ animationDelay: "480ms" }}
        >
          <a
            href="mailto:plumbing@jasonclark.online"
            className="text-[#9A8A6A] hover:text-[#C9A84C] transition-colors text-sm"
            style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.04em" }}
          >
            plumbing@jasonclark.online
          </a>
          <span className="text-[#C9A84C] opacity-40">|</span>
          <a
            href="https://www.facebook.com/JasonClarkPlumbing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9A8A6A] hover:text-[#C9A84C] transition-colors text-sm"
            style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.04em" }}
          >
            Facebook: Jason Clark Plumbing
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#C9A84C] opacity-60 hover:opacity-100 transition-opacity animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
