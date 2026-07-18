import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HeroSection from "../HeroSection";

describe("HeroSection", () => {
  it("renders a mobile-friendly enquiry callout for urgent plumbing needs", () => {
    const html = renderToStaticMarkup(<HeroSection />);

    expect(html).toContain("Call now");
    expect(html).toContain("WhatsApp");
    expect(html).toContain("Request a callback");
  });
});
