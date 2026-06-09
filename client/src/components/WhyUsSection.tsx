/*
 * DESIGN: Heritage British Trade Signage
 * Dark section with alternating gold-bordered feature panels.
 * Circular gold badge icons, Playfair Display headings, Lora body.
 */

import { useEffect, useRef, useState } from "react";
import { Clock, Shield, Star, MapPin, ThumbsUp, Banknote } from "lucide-react";

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

const REASONS = [
  {
    icon: <Shield size={26} />,
    title: "Qualified & Accredited",
    body: "City & Guilds qualified with ACIPHE associate membership. You can be confident that all work meets current regulations and industry best practice.",
  },
  {
    icon: <Clock size={26} />,
    title: "Prompt & Reliable",
    body: "Jason respects your time. He arrives when he says he will, keeps you informed throughout, and completes work to schedule.",
  },
  {
    icon: <MapPin size={26} />,
    title: "Truly Local",
    body: "Based in the local area, Jason understands the community he serves. Fast response times and a genuine commitment to local customers.",
  },
  {
    icon: <Star size={26} />,
    title: "Quality Workmanship",
    body: "Every job is finished to a high standard. No shortcuts, no bodge jobs — just clean, professional plumbing work that lasts.",
  },
  {
    icon: <ThumbsUp size={26} />,
    title: "Friendly & Approachable",
    body: "No jargon, no hard sell. Jason explains what needs doing and why, so you can make an informed decision with confidence.",
  },
  {
    icon: <Banknote size={26} />,
    title: "Honest, Fair Pricing",
    body: "Transparent quotes with no hidden charges. Free estimates available, and competitive rates that reflect the quality of work provided.",
  },
];

function ReasonCard({ reason, index }: { reason: typeof REASONS[0]; index: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className="gold-card p-7 flex flex-col gap-4"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s cubic-bezier(0.23,1,0.32,1) ${index * 80}ms, transform 0.55s cubic-bezier(0.23,1,0.32,1) ${index * 80}ms`,
      }}
    >
      <div
        className="w-12 h-12 flex items-center justify-center"
        style={{
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.5)",
          color: "#C9A84C",
          background: "rgba(201,168,76,0.07)",
          flexShrink: 0,
        }}
      >
        {reason.icon}
      </div>
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.0625rem",
          fontWeight: 700,
          color: "#F0EAD6",
        }}
      >
        {reason.title}
      </h3>
      <p
        style={{
          fontFamily: "'Lora', serif",
          fontSize: "0.875rem",
          color: "#9A8A6A",
          lineHeight: 1.75,
        }}
      >
        {reason.body}
      </p>
    </div>
  );
}

export default function WhyUsSection() {
  const { ref: headRef, inView: headIn } = useInView();

  return (
    <section id="why-us" style={{ background: "#161616", padding: "6rem 0" }}>
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
          <div className="section-label mb-4">The Jason Clark Difference</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#F0EAD6",
              marginBottom: "1rem",
            }}
          >
            Why Choose Us?
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
            Choosing the right plumber matters. Here is why hundreds of local customers
            trust Jason Clark Plumbing for their homes and businesses.
          </p>
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason, i) => (
            <ReasonCard key={reason.title} reason={reason} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
