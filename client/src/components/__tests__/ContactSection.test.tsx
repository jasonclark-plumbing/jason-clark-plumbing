import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ContactSection from "../ContactSection";

describe("ContactSection", () => {
  it("highlights a rapid response message for urgent enquiries", () => {
    const html = renderToStaticMarkup(<ContactSection />);

    expect(html).toContain("Fast response");
    expect(html).toContain("urgent plumbing issues");
  });
});
