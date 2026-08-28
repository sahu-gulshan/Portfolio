// Google Analytics 4 (GA4) helper for tracking page views, case studies, and interactions

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const getGaId = (): string => {
  try {
    return (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || "G-W8HXJ3JB3E";
  } catch {
    return "G-W8HXJ3JB3E";
  }
};

export function initGoogleAnalytics(customId?: string) {
  const measurementId = customId || getGaId();
  if (!measurementId || typeof window === "undefined") return;

  // Prevent duplicate script injection
  if (document.getElementById("ga-gtag-script")) return;

  const script = document.createElement("script");
  script.id = "ga-gtag-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: true,
  });

  console.log(`[Analytics] Google Analytics initialized with ID: ${measurementId}`);
}

export function track(eventName: string, params?: Record<string, any>) {
  // Dispatches to Google Analytics gtag if initialized
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params || {});
  }
}

export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    const measurementId = getGaId();
    if (measurementId) {
      window.gtag("config", measurementId, {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
    }
  }
}
