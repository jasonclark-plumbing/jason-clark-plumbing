import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import session from "express-session";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/trpc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CANONICAL_DOMAIN = "https://jasonclark.online";
const DEFAULT_TITLE = "Jason Clark Plumbing | Reliable Local Plumbing in Huntingdon";
const DEFAULT_DESCRIPTION =
  "Reliable local plumbing services in Huntingdon and surrounding areas. Call 01480 769129 or WhatsApp 07767 910713.";

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
  "/contact": {
    title: "Contact Us | Jason Clark Plumbing",
    description: "Get in touch with Jason Clark Plumbing. Call 01480 769129 or fill out our contact form for a quick response.",
    robots: "index, follow",
  },
  "/privacy": {
    title: "Privacy Policy | Jason Clark Plumbing",
    description: "Privacy Policy for Jason Clark Plumbing. Learn how we protect your personal data.",
    robots: "index, follow",
  },
  "/terms": {
    title: "Terms of Service | Jason Clark Plumbing",
    description: "Terms of Service for Jason Clark Plumbing. Read our service agreement and guarantee.",
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

function escapeHtmlAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function renderIndexHtml(template: string, pathname: string) {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "") || "/";
  const meta = ROUTE_META[normalizedPath] || ROUTE_META["/404"];
  const canonicalUrl = `${CANONICAL_DOMAIN}${normalizedPath === "/" ? "/" : normalizedPath}`;

  return template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttribute(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/i, `<meta name="description" content="${escapeHtmlAttribute(meta.description)}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/i, `<meta name="robots" content="${escapeHtmlAttribute(meta.robots)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${escapeHtmlAttribute(canonicalUrl)}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${escapeHtmlAttribute(meta.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${escapeHtmlAttribute(meta.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${escapeHtmlAttribute(canonicalUrl)}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/i, `<meta name="twitter:title" content="${escapeHtmlAttribute(meta.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/i, `<meta name="twitter:description" content="${escapeHtmlAttribute(meta.description)}" />`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Session middleware
  app.use(
    session({
      secret: process.env.JWT_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Use false for development (HTTP)
        httpOnly: true,
        sameSite: false, // Disable SameSite for development
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  // Health check endpoint (before static files)
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // tRPC middleware (before static files and catch-all)
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");
  const indexHtmlPath = path.join(staticPath, "index.html");

  app.use(express.static(staticPath));

  // Handle client-side routing for known public routes and return a real 404 for unknown paths.
  app.get("*", (req, res, next) => {
    const pathname = req.path === "/" ? "/" : req.path.replace(/\/+$/, "") || "/";

    if (pathname.startsWith("/api/") || pathname.startsWith("/__manus__/") || pathname.startsWith("/manus-storage")) {
      return next();
    }

    const knownRoutes = Object.keys(ROUTE_META);
    const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname);

    if (req.path.length > 1 && /\/+$/i.test(req.path)) {
      return res.redirect(301, pathname);
    }

    if (knownRoutes.includes(pathname) || !hasFileExtension) {
      try {
        const html = fs.readFileSync(indexHtmlPath, "utf-8");
        const renderedHtml = renderIndexHtml(html, pathname);
        return res.status(knownRoutes.includes(pathname) ? 200 : 404).type("html").send(renderedHtml);
      } catch (error) {
        return next(error);
      }
    }

    return res.status(404).type("text/plain").send("404 - Page not found");
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
