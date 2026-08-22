import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev mode blocks cross-origin requests for /_next/* assets by default.
  // Without this, loading the dev server through a forwarded/proxied URL
  // (Codespaces, Gitpod, etc.) silently fails to load the JS bundle at all,
  // which looks like "every button on the page is dead".
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "*.app.github.dev",
    "*.githubpreview.dev",
    "*.preview.app.github.dev",
    "*.gitpod.io",
  ],
};

export default nextConfig;
