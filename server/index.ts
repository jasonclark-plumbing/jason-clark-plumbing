import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/trpc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  app.use(express.static(staticPath));

  // Handle client-side routing for known public routes and return a real 404 for unknown paths.
  app.get("*", (req, res, next) => {
    const pathname = req.path;

    if (pathname.startsWith("/api/") || pathname.startsWith("/__manus__/") || pathname.startsWith("/manus-storage")) {
      return next();
    }

    const knownRoutes = ["/", "/reviews", "/admin/login", "/admin/dashboard", "/404"];
    const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname);

    if (knownRoutes.includes(pathname) || !hasFileExtension) {
      return res.sendFile(path.join(staticPath, "index.html"));
    }

    return res.status(404).type("text/plain").send("404 - Page not found");
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
