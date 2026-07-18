import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import MobileQuickActions from "../MobileQuickActions";

describe("MobileQuickActions", () => {
  it("renders mobile-first contact shortcuts", () => {
    const html = renderToStaticMarkup(<MobileQuickActions />);

    expect(html).toContain("Call");
    expect(html).toContain("WhatsApp");
    expect(html).toContain("Enquire");
  });
});
