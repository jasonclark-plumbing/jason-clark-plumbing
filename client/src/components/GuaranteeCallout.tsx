/*
 * DESIGN: Heritage British Trade Signage
 * Gold-bordered callout box highlighting 12-month guarantee on work + manufacturer guarantee on parts
 */

import { CheckCircle } from "lucide-react";

export default function GuaranteeCallout() {
  return (
    <div
      id="guarantee"
      className="py-8 md:py-12"
      style={{
        background: "rgba(201,168,76,0.05)",
        borderTop: "1px solid rgba(201,168,76,0.2)",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
      }}
    >
      <div className="container">
        <div
          className="max-w-3xl mx-auto p-6 md:p-8"
          style={{
            border: "2px solid rgba(201,168,76,0.4)",
            background: "rgba(12,12,12,0.6)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#E8C96B",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Our Guarantee
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <CheckCircle size={24} />,
                title: "12 Months on Work",
                description:
                  "All workmanship is guaranteed for 12 months from completion against defective work.",
              },
              {
                icon: <CheckCircle size={24} />,
                title: "Manufacturer's Guarantee on Parts",
                description:
                  "All parts supplied come with the full manufacturer's warranty and protection.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div style={{ color: "#C9A84C", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#F0EAD6",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Lora', serif",
                      fontSize: "0.9rem",
                      color: "#C0B0A0",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "0.85rem",
              color: "#9A8A6A",
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(201,168,76,0.2)",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Peace of mind on every job. Professional work, professional guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
