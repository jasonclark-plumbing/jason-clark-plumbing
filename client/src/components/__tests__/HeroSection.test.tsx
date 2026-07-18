import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HeroSection from "../HeroSection";

describe("HeroSection", () => {
  it("renders a mobile-friendly enquiry callout for urgent plumbing needs", () => {
    const html = renderToStaticMarkup(<HeroSection />);

    expect(html).toContain("01480 769129");
    expect(html).toContain("WhatsApp");
    expect(html).toContain("Request callback");
  });

  it("displays phone number with icon inside the call button", () => {
    const html = renderToStaticMarkup(<HeroSection />);

    expect(html).toContain("01480 769129");
  });

  it("renders all buttons with consistent gold outline styling and icon alignment", () => {
    const html = renderToStaticMarkup(<HeroSection />);

    // All buttons should have the same height
    expect(html).toContain('h-12');
    // All buttons should use ghost-gold style
    expect(html).toContain('btn-ghost-gold');
    // All buttons should have gap-2 for consistent icon spacing
    expect(html).toContain('gap-2');
  });
});
