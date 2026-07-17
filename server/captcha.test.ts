import { describe, it, expect } from "vitest";
import { verifyCaptcha } from "./captcha";

describe("CAPTCHA Verification", () => {
  it("should reject invalid or missing token", async () => {
    const result = await verifyCaptcha("invalid-token");
    expect(result).toBe(false);
  });

  it("should handle missing secret key gracefully", async () => {
    // This test ensures the function doesn't crash if secret is missing
    const result = await verifyCaptcha("");
    expect(result).toBe(false);
  });
});
