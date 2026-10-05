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
import { assetUrl } from "@/lib/assetUrl";

const SERVICES = [
  {
    icon: <Wrench size={22} />,
    title: "General Plumbing Repairs",
    description:
      "From dripping taps and leaking pipes to faulty valves and running cisterns, Jason handles all general plumbing repairs with care and precision.",
    image: assetUrl("jason-clark-general-repair_a8f6bc7a.png"),
    imageWidth: 1600,
    imageHeight: 1200,
    featured: false,
  },
  {
    icon: <Flame size={22} />,
    title: "Radiator Installation & Repair",
    description:
      "New radiator installations, replacements, bleeding, and balancing to keep your home warm and your heating system running at its best.",
    image: assetUrl("jason-clark-radiator-installation_e9e0ca32.png"),
    imageWidth: 1600,
    imageHeight: 1200,
    featured: false,
  },
  {
    icon: <Bath size={22} />,
    title: "Bathroom Plumbing Installations",
    description:
      "Bath, sink, and toilet replacements with associated plumbing connections. Tiling and carpentry are not included; making good is limited to plumbing work.",
    image: assetUrl("jason-clark-bathroom-installation_573a4449.png"),
    imageWidth: 445,
    imageHeight: 449,
    featured: false,
  },
  {
    icon: <AlertTriangle size={22} />,
    title: "Blocked Sinks, Baths & Showers",
    description:
      "Blockages in sinks, baths, and showers cleared as part of general plumbing work.",
    image: assetUrl("jason-clark-blocked-sink-drain_68fd8452.png"),
    imageWidth: 299,
    imageHeight: 168,
    featured: false,
  },
  {
    icon: <Thermometer size={22} />,
    title: "Outside Tap Installation",
    description:
      "Installation of outdoor taps and garden water points, with associated plumbing connections.",
    image: assetUrl("jason-clark-outside-tap_e77f957d.png"),
    imageWidth: 447,
    imageHeight: 447,
    featured: false,
  },
  {
    icon: <Droplets size={22} />,
    title: "Accessible Plumbing Leak Repairs",
    description:
      "Repairs to accessible leaking pipes and plumbing fittings. Specialist leak detection is not offered.",
    image: assetUrl("jason-clark-hidden-leak_0481336c.png"),
    imageWidth: 1200,
    imageHeight: 1600,
    featured: false,
  },
  {
    icon: <ShowerHead size={22} />,
    title: "Shower Installations",
    description:
      "Mixer and power shower installations, including enclosure fitting and all associated plumbing connections.",
    image: assetUrl("jason-clark-shower-installation_fbaacfbf.png"),
    imageWidth: 643,
    imageHeight: 643,
    featured: false,
  },
  {
    icon: <PipetteIcon size={22} />,
    title: "Pipework & Re-piping",
    description:
      "New pipework runs, re-piping older properties, and upgrading from lead or iron pipes to modern copper or plastic systems.",
    image: assetUrl("jason-clark-pipework-repiping_df8614f2.png"),
    imageWidth: 597,
    imageHeight: 335,
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
            width={service.imageWidth}
            height={service.imageHeight}
            loading="lazy"
            decoding="async"
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
            Jason Clark Plumbing provides plumbing services for homes and properties around Huntingdon. Urgent call-outs are available Monday to Friday, 07:00–18:00. Gas work, boiler servicing, and specialist leak detection are not offered.
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
