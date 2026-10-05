import { afterEach, describe, it, expect, vi } from "vitest";
import { verifyCaptcha } from "./captcha";

describe("CAPTCHA Verification", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should reject test tokens in production", async () => {
    vi.stubEnv("NODE_ENV", "production");

    await expect(verifyCaptcha("test-token")).resolves.toBe(false);
    await expect(verifyCaptcha("dev-token")).resolves.toBe(false);
  });

  it("should accept test tokens outside production", async () => {
    vi.stubEnv("NODE_ENV", "test");

    await expect(verifyCaptcha("test-token")).resolves.toBe(true);
    await expect(verifyCaptcha("dev-token")).resolves.toBe(true);
  });

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
