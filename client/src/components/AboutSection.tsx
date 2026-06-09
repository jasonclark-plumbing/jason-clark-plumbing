/*
 * DESIGN: Heritage British Trade Signage
 * Asymmetric two-column layout: large image left, text + credential badges right.
 * Gold credential seals, Playfair Display headings, Lora body text.
 * Scroll-triggered fade-up animations.
 */

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

function useInView(threshold = 0.15) {
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

const CREDENTIALS = [
  "City & Guilds Qualified",
  "ACIPHE Associate Member",
  "Fully Insured",
  "Free Quotes Available",
];

export default function AboutSection() {
  const { ref: leftRef, inView: leftIn } = useInView();
  const { ref: rightRef, inView: rightIn } = useInView();

  return (
    <section id="about" style={{ background: "#0C0C0C", padding: "6rem 0" }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: image with ornamental frame */}
          <div
            ref={leftRef}
            className="relative"
            style={{
              opacity: leftIn ? 1 : 0,
              transform: leftIn ? "translateX(0)" : "translateX(-30px)",
              transition: "opacity 0.65s ease, transform 0.65s ease",
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{ border: "1px solid rgba(201,168,76,0.3)" }}
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/pipe-repair-fRGhh9bjJQAPj7Lw8ajZBo.webp"
                alt="Jason Clark at work"
                className="w-full object-cover"
                style={{ height: "480px" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(12,12,12,0.5) 0%, transparent 50%)" }}
              />
            </div>
            {/* Offset ornamental corner */}
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 pointer-events-none"
              style={{ border: "1px solid rgba(201,168,76,0.25)" }}
            />

          </div>

          {/* Right: text content */}
          <div
            ref={rightRef}
            style={{
              opacity: rightIn ? 1 : 0,
              transform: rightIn ? "translateX(0)" : "translateX(30px)",
              transition: "opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s",
            }}
          >
            <div className="section-label mb-4">About Jason</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: "#F0EAD6",
                lineHeight: 1.2,
                marginBottom: "1.25rem",
              }}
            >
              A Tradesman You Can Trust
            </h2>
            <div className="gold-divider mb-6" style={{ maxWidth: "200px" }}>
              <div className="gold-divider-diamond" />
            </div>
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "0.9375rem",
                color: "#9A8A6A",
                lineHeight: 1.85,
                marginBottom: "1.25rem",
              }}
            >
              Jason Clark is a City &amp; Guilds qualified plumber bringing professional,
              reliable service to the local area. As an ACIPHE Associate Member, Jason upholds
              the highest professional standards in every job — from a simple tap repair to a
              complete bathroom renovation.
            </p>
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "0.9375rem",
                color: "#9A8A6A",
                lineHeight: 1.85,
                marginBottom: "2rem",
              }}
            >
              Every job is approached with the same level of care and attention to detail.
              Jason takes pride in arriving on time, working cleanly, and leaving your home
              exactly as he found it — only with the problem fixed.
            </p>

            {/* Credentials list */}
            <ul className="flex flex-col gap-3">
              {CREDENTIALS.map((cred) => (
                <li key={cred} className="flex items-center gap-3">
                  <CheckCircle2 size={17} style={{ color: "#C9A84C", flexShrink: 0 }} />
                  <span
                    style={{
                      fontFamily: "'Lora', serif",
                      fontSize: "0.9rem",
                      color: "#F0EAD6",
                    }}
                  >
                    {cred}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-gold"
              >
                Get a Free Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
