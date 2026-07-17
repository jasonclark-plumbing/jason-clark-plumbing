import { useState, useRef } from "react";
import { Star } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function ReviewSubmitForm() {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    text: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const captchaRef = useRef<HCaptcha>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get CAPTCHA token
      const captchaToken = captchaRef.current?.getResponse();
      if (!captchaToken) {
        throw new Error("Please complete the CAPTCHA verification");
      }

      const response = await fetch("/api/trpc/reviews.submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: {
            ...form,
            captchaToken,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.error?.message || "Failed to submit review";
        
        // Handle rate limit error specifically
        if (data.error?.code === "TOO_MANY_REQUESTS") {
          throw new Error(
            "You've reached the maximum number of reviews (5 per 24 hours). Please try again tomorrow."
          );
        }
        
        throw new Error(errorMessage);
      }

      setSubmitted(true);
      setForm({ customerName: "", customerEmail: "", rating: 5, text: "" });
      captchaRef.current?.resetCaptcha();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-black border-2 border-gold/40 p-8">
      <h3 className="text-2xl font-playfair text-gold mb-6">Share Your Experience</h3>

      {submitted && (
        <div className="mb-6 p-4 bg-gold/10 border border-gold/40 text-gold rounded">
          ✓ Thank you! Your review has been submitted and is awaiting approval.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 text-red-400 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gold text-sm font-semibold mb-2">Your Name *</label>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              required
              className="w-full bg-black/50 border border-gold/30 text-cream px-4 py-2 focus:border-gold outline-none transition"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-gold text-sm font-semibold mb-2">Email Address *</label>
            <input
              type="email"
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
              required
              className="w-full bg-black/50 border border-gold/30 text-cream px-4 py-2 focus:border-gold outline-none transition"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-gold text-sm font-semibold mb-2">Rating *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                className="transition"
              >
                <Star
                  size={28}
                  className={star <= form.rating ? "fill-gold text-gold" : "text-gold/30"}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gold text-sm font-semibold mb-2">Your Review *</label>
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            required
            rows={5}
            className="w-full bg-black/50 border border-gold/30 text-cream px-4 py-2 focus:border-gold outline-none transition resize-none"
            placeholder="Tell us about your experience with Jason Clark Plumbing..."
          />
        </div>

        {/* hCaptcha Widget */}
        {import.meta.env.VITE_HCAPTCHA_SITE_KEY && (
          <div className="flex justify-center py-4">
            <HCaptcha
              ref={captchaRef}
              sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
              theme="dark"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 font-semibold disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
