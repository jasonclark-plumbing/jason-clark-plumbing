type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    try {
      gtag("event", eventName, params);
      return;
    } catch {
      // Fall through to dataLayer fallback for generate_lead below.
    }
  }

  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
  if (Array.isArray(dataLayer) && eventName === "generate_lead") {
    dataLayer.push({
      event: "generate_lead",
      ...params,
    });
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