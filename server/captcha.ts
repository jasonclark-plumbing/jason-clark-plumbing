/**
 * Verify hCaptcha token on the server side
 */
export async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.HCAPTCHA_SECRET_KEY;

    if (!secretKey || !token) {
      console.warn("[CAPTCHA] Missing secret key or token");
      return false;
    }

    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }).toString(),
    });

    if (!response.ok) {
      console.warn("[CAPTCHA] Verification request failed:", response.statusText);
      return false;
    }

    const data = (await response.json()) as { success: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[CAPTCHA] Verification error:", error);
    return false;
  }
}
