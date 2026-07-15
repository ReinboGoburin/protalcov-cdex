import { getCloudflareContext } from "@opennextjs/cloudflare"

/**
 * Secrets/vars (TMDB_BEARER_TOKEN, RAWG_API_KEY, etc.) live in Cloudflare's
 * binding env — set via `.dev.vars` locally or `wrangler secret put` in
 * production — not in `process.env`, which Workers never populates from
 * those bindings. Must be called at request time (inside a route handler),
 * not at module load time.
 */
export function getServerEnv(): Record<string, string | undefined> {
  try {
    return getCloudflareContext().env as unknown as Record<string, string | undefined>
  } catch {
    return process.env as Record<string, string | undefined>
  }
}
