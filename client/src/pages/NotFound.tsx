import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "#0C0C0C" }}
    >
      <div
        className="w-full max-w-2xl mx-4 p-8 md:p-12 text-center"
        style={{
          border: "2px solid rgba(201,168,76,0.3)",
          background: "rgba(12,12,12,0.8)",
        }}
      >
        {/* Logo/Badge */}
        <div className="flex justify-center mb-6">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663746061583/JZGjRQ39WvQmto8RQcSvRP/jcp-logo-badge-Qtyi525UFR9GYq476rkjba.webp"
            alt="Jason Clark Plumbing"
            className="w-20 h-20 object-contain opacity-75"
          />
        </div>

        {/* 404 Error Code */}
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "4rem",
            fontWeight: 700,
            color: "#C9A84C",
            marginBottom: "0.5rem",
            letterSpacing: "0.1em",
          }}
        >
          404
        </div>

        {/* Page Not Found Heading */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "2rem",
            fontWeight: 700,
            color: "#F0EAD6",
            marginBottom: "1rem",
          }}
        >
          Page Not Found
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontSize: "1rem",
            color: "#C0B0A0",
            lineHeight: 1.8,
            marginBottom: "2rem",
          }}
        >
          Sorry, the page you're looking for doesn't exist. It may have been moved or deleted.
        </p>

        {/* Gold Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(201,168,76,0.3)",
            margin: "2rem 0",
          }}
        />

        {/* Contact Info */}
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.85rem",
              color: "#9A8A6A",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Looking for something? Contact us:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:01480769129"
              style={{
                fontFamily: "'Lora', serif",
                color: "#C9A84C",
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
              className="hover:text-[#E8C96B] transition-colors"
            >
              01480 769129
            </a>
            <span style={{ color: "rgba(201,168,76,0.2)" }}>•</span>
            <a
              href="mailto:plumbing@jasonclark.online"
              style={{
                fontFamily: "'Lora', serif",
                color: "#C9A84C",
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
              className="hover:text-[#E8C96B] transition-colors"
            >
              plumbing@jasonclark.online
            </a>
          </div>
        </div>

        {/* Go Home Button */}
        <button
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 px-8 py-3 transition-all duration-200"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.9rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#C9A84C",
            border: "2px solid rgba(201,168,76,0.5)",
            background: "transparent",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(201,168,76,0.1)";
            el.style.borderColor = "rgba(201,168,76,0.8)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.borderColor = "rgba(201,168,76,0.5)";
          }}
        >
          <Home size={18} />
          Go Home
        </button>
      </div>
    </div>
  );
}
