type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;

  gtag("event", eventName, params);

  // Ensure lead reporting is emitted for enquiry submissions.
  if (eventName === "contact_form_mailto_submit") {
    const leadParams = {
      channel: "mailto",
      placement: typeof params.placement === "string" ? params.placement : "contact_section",
    };

    gtag("event", "generate_lead", leadParams);

    const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
    if (Array.isArray(dataLayer)) {
      dataLayer.push({
        event: "generate_lead",
        ...leadParams,
      });
    }
  }
}

export function trackContactClick(method: "phone" | "whatsapp" | "email" | "callback", placement: string) {
  trackEvent("contact_click", {
    method,
    placement,
  });
}

export function trackGenerateLead(channel: "mailto" | "phone" | "whatsapp" | "callback", placement: string) {
  trackEvent("generate_lead", {
    channel,
    placement,
  });
}