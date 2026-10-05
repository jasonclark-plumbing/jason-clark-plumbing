type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem("jcp-analytics-consent") !== "accepted") return;
  } catch {
    return;
  }

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
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