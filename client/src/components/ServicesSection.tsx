/*
 * DESIGN: Heritage British Trade Signage
 * Dark section (#111111 bg), gold-bordered service cards in staggered asymmetric grid.
 * Playfair Display headings, Lora body text, Montserrat labels.
 * Service images from generated assets.
 */

import { useEffect, useRef, useState } from "react";
import {
  Wrench,
  Flame,
  Droplets,
  Bath,
  AlertTriangle,
  Thermometer,
  ShowerHead,
  PipetteIcon,
} from "lucide-react";

const SERVICES = [
  {
    icon: <Wrench size={22} />,
    title: "General Plumbing Repairs",
    description:
      "From dripping taps and leaking pipes to faulty valves and running cisterns, Jason handles all general plumbing repairs with care and precision.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/pipe-repair-fRGhh9bjJQAPj7Lw8ajZBo.webp",
    featured: false,
  },
  {
    icon: <Flame size={22} />,
    title: "Radiator Installation & Repair",
    description:
      "New radiator installations, replacements, bleeding, and balancing to keep your home warm and your heating system running at its best.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/radiator-installation-v3-JZHgWuNViwCGsvdm55oGCm.webp",
    featured: false,
  },
  {
    icon: <Bath size={22} />,
    title: "Bathroom Installations",
    description:
      "Bath, sink, and toilet replacements — professional removal and installation of bathroom fixtures with all associated plumbing connections.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/bathroom-install-SLCaLJdCJEteJX296cS4tc.webp",
    featured: false,
  },
  {
    icon: <AlertTriangle size={22} />,
    title: "Blocked Sinks & Drains",
    description:
      "Stubborn blockages in sinks, baths, showers, and drains cleared quickly and efficiently.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/blocked-drains-v3-Thfy36tMvTrpVitkMrgiuW.webp",
    featured: false,
  },
  {
    icon: <Thermometer size={22} />,
    title: "Outside Tap Installation",
    description:
      "Professional installation of outdoor taps and garden water points. Perfect for gardens, patios, and utility areas. Frost-proof fittings and proper drainage included.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/outside-tap-installation-v2-ZwT4BFUrKhvbCAqA8yuLxP.webp",
    featured: false,
  },
  {
    icon: <Droplets size={22} />,
    title: "Leak Repair",
    description:
      "Identifying and fixing hidden leaks before they cause damage. Quick and efficient repairs to restore your plumbing to full working order.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/leak-repair-underground-ZyG62o8AsyozaqjtPUz3tv.webp",
    featured: false,
  },
  {
    icon: <ShowerHead size={22} />,
    title: "Shower Installations",
    description:
      "Mixer and power shower installations, including enclosure fitting and all associated plumbing connections.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/shower-installation-v2-5jEgp5jXZrhX9q4D7jNibV.webp",
    featured: false,
  },
  {
    icon: <PipetteIcon size={22} />,
    title: "Pipework & Re-piping",
    description:
      "New pipework runs, re-piping older properties, and upgrading from lead or iron pipes to modern copper or plastic systems.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/pipework-copper-joints-fm3LHPcCNqJw9kXFWnEveU.webp",
    featured: false,
  },
];

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

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className="gold-card overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s cubic-bezier(0.23,1,0.32,1) ${index * 70}ms, transform 0.55s cubic-bezier(0.23,1,0.32,1) ${index * 70}ms`,
      }}
    >
      {service.image && (
        <div className="relative overflow-hidden" style={{ height: "180px" }}>
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(12,12,12,0.7) 0%, transparent 60%)" }}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center"
            style={{ color: "#C9A84C", border: "1px solid rgba(201,168,76,0.4)" }}
          >
            {service.icon}
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: "#F0EAD6",
              lineHeight: 1.3,
            }}
          >
            {service.title}
          </h3>
        </div>
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "0.875rem",
            color: "#9A8A6A",
            lineHeight: 1.7,
          }}
        >
          {service.description}
        </p>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const { ref: headingRef, inView: headingInView } = useInView();

  return (
    <section id="services" style={{ background: "#111111", padding: "6rem 0" }}>
      <div className="container">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center mb-14"
          style={{
            opacity: headingInView ? 1 : 0,
            transform: headingInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
          }}
        >
          <div className="section-label mb-4">What We Do</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#F0EAD6",
              marginBottom: "1rem",
            }}
          >
            Our Services
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
            Jason Clark Plumbing provides dependable plumbing services for homes and properties in Huntingdon and the surrounding area, including emergency call-outs, general repairs, bathroom installations and more. Gas work and boiler servicing are not currently offered.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
