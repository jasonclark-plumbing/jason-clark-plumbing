import { useEffect, useState } from "react";

const CONSENT_KEY = "jcp-analytics-consent";
const MEASUREMENT_ID = "G-WT2Y2HQCGC";

type ConsentChoice = "accepted" | "rejected" | null;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function enableAnalytics() {
  const analyticsWindow = window as AnalyticsWindow;
  if (analyticsWindow.gtag) {
    analyticsWindow.gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag = (...args: unknown[]) => analyticsWindow.dataLayer?.push(args);
  analyticsWindow.gtag("consent", "update", { analytics_storage: "granted" });
  analyticsWindow.gtag("js", new Date());
  analyticsWindow.gtag("config", MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function disableAnalytics() {
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.gtag?.("consent", "update", { analytics_storage: "denied" });

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=", 1)[0].trim();
    if (name.startsWith("_ga")) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.jasonclark.online; SameSite=Lax`;
    }
  }
}

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState<ConsentChoice>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    let savedChoice: string | null = null;
    try {
      savedChoice = window.localStorage.getItem(CONSENT_KEY);
    } catch {
      return;
    }
    if (savedChoice === "accepted" || savedChoice === "rejected") {
      setChoice(savedChoice);
      if (savedChoice === "accepted") enableAnalytics();
      if (savedChoice === "rejected") disableAnalytics();
    }
  }, []);

  const saveChoice = (nextChoice: Exclude<ConsentChoice, null>) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, nextChoice);
    } catch {
      setPreferencesOpen(false);
      return;
    }
    setChoice(nextChoice);
    setPreferencesOpen(false);
    if (nextChoice === "accepted") {
      enableAnalytics();
    } else {
      disableAnalytics();
    }
  };

  if (choice && !preferencesOpen) {
    return (
      <button
        type="button"
        onClick={() => setPreferencesOpen(true)}
        className="fixed bottom-24 right-4 z-[60] border border-[#C9A84C] bg-[#0C0C0C] px-3 py-2 text-xs text-[#F0EAD6] shadow-lg"
      >
        Privacy settings
      </button>
    );
  }

  return (
    <aside
      aria-label="Optional analytics preferences"
      className="fixed inset-x-3 bottom-24 z-[60] border border-[rgba(201,168,76,0.5)] bg-[#111111] p-4 text-[#F0EAD6] shadow-xl sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-lg"
    >
      <p className="mb-3 text-sm leading-6">
        Optional Google Analytics helps measure site use. It will only load if you accept. You can change this choice in Privacy settings.
        {choice && ` Current choice: ${choice}.`}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => saveChoice("accepted")}
          className="min-h-11 bg-[#C9A84C] px-4 py-2 text-sm font-semibold text-[#0C0C0C]"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => saveChoice("rejected")}
          className="min-h-11 border border-[#C9A84C] px-4 py-2 text-sm font-semibold text-[#F0EAD6]"
        >
          Reject optional analytics
        </button>
      </div>
    </aside>
  );
}
