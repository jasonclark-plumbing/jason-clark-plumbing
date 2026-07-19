/*
 * DESIGN: Heritage British Trade Signage
 * Service area callout section with local coverage information
 */

export default function AreasCoveredSection() {
  return (
    <section style={{ background: "#0C0C0C", padding: "3rem 0" }}>
      <div className="container">
        <div
          className="rounded-lg p-6 md:p-8"
          style={{
            background: "rgba(201, 168, 76, 0.08)",
            border: "1px solid rgba(201, 168, 76, 0.2)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#C9A84C",
              marginBottom: "0.75rem",
            }}
          >
            Service Coverage
          </h3>
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "1rem",
              color: "#F0EAD6",
              lineHeight: 1.75,
            }}
          >
            <strong style={{ color: "#E8C96B" }}>Areas Covered:</strong> Huntingdon, Godmanchester, St Ives, Brampton, Hartford, Wyton, Fenstanton, Hemingford Grey, Alconbury, Abbots Ripton, and surrounding villages.
          </p>
        </div>
      </div>
    </section>
  );
}
