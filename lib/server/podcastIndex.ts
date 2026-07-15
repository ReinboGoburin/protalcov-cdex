import crypto from "node:crypto"

export function podcastIndexHeaders(): Record<string, string> {
  const key = process.env.PODCAST_INDEX_KEY ?? ""
  const secret = process.env.PODCAST_INDEX_SECRET ?? ""
  const apiHeaderTime = Math.floor(Date.now() / 1000)
  const hash = crypto
    .createHash("sha1")
    .update(key + secret + apiHeaderTime)
    .digest("hex")

  return {
    "X-Auth-Key": key,
    "X-Auth-Date": String(apiHeaderTime),
    Authorization: hash,
    "User-Agent": "Alcove/0.1 (hugapi@fea.st)",
  }
}
