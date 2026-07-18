import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Reviews from "@/pages/Reviews";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const DEFAULT_TITLE = "Jason Clark Plumbing | Reliable Local Plumbing in Huntingdon";
const DEFAULT_DESCRIPTION =
  "Reliable local plumbing services in Huntingdon and surrounding areas. Call 01480 769129 or WhatsApp 07767 910713.";
const CANONICAL_DOMAIN = "https://jasonclark.online";

const ROUTE_META: Record<string, { title: string; description: string; robots: string }> = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    robots: "index, follow",
  },
  "/reviews": {
    title: "Customer Reviews | Jason Clark Plumbing",
    description: "Read recent customer reviews for Jason Clark Plumbing in Huntingdon and surrounding areas.",
    robots: "index, follow",
  },
  "/admin/login": {
    title: "Admin Login | Jason Clark Plumbing",
    description: "Administrator login for Jason Clark Plumbing.",
    robots: "noindex, nofollow",
  },
  "/admin/dashboard": {
    title: "Admin Dashboard | Jason Clark Plumbing",
    description: "Administrator dashboard for Jason Clark Plumbing.",
    robots: "noindex, nofollow",
  },
  "/404": {
    title: "Page Not Found | Jason Clark Plumbing",
    description: "The page you requested could not be found.",
    robots: "noindex, nofollow",
  },
};

function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    const pathname = location || "/";
    const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const meta = ROUTE_META[normalizedPath] || {
      title: "Page Not Found | Jason Clark Plumbing",
      description: "The page you requested could not be found.",
      robots: "noindex, nofollow",
    };

    document.title = meta.title;

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute("content", meta.description);
    }

    const robotsTag = document.querySelector('meta[name="robots"]');
    if (robotsTag) {
      robotsTag.setAttribute("content", meta.robots);
    }

    const canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalTag) {
      canonicalTag.setAttribute(
        "href",
        `${CANONICAL_DOMAIN}${normalizedPath === "/" ? "" : normalizedPath}`
      );
    }

    const ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) {
      ogUrlTag.setAttribute(
        "content",
        `${CANONICAL_DOMAIN}${normalizedPath === "/" ? "" : normalizedPath}`
      );
    }
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/reviews"} component={Reviews} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin/dashboard"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <SeoHead />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
