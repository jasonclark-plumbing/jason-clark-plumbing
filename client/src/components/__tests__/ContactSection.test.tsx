import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ContactSection from "../ContactSection";

describe("ContactSection", () => {
  it("makes emergency availability clear", () => {
    const html = renderToStaticMarkup(<ContactSection />);

    expect(html).toContain("Monday to Friday, 07:00–18:00");
    expect(html).toContain("No out-of-hours emergency service");
  });
});
