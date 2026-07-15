import { defineCloudflareConfig } from "@opennextjs/cloudflare"

const config = defineCloudflareConfig()

// @opennextjs/cloudflare 1.20.1's Turbopack chunk-inlining patch doesn't cover
// API route handler runtime chunks yet (only page/SSR runtime chunks), which
// causes "ChunkLoadError: Not found server/chunks/..." at runtime for every
// app/api/**/route.ts. Next.js 16 defaults `next build` to Turbopack, so the
// Cloudflare build step overrides to Webpack until upstream Turbopack support
// covers route handlers. `next dev`/`npm run build` elsewhere keep Turbopack.
config.buildCommand = "next build --webpack"

export default config
