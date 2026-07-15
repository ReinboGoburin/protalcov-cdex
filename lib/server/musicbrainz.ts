export const MUSICBRAINZ_USER_AGENT = "Alcove/0.1 (hugapi@fea.st)"

let lastRequestAt = 0
let chain: Promise<unknown> = Promise.resolve()

async function run(url: string): Promise<Response> {
  const now = Date.now()
  const wait = Math.max(0, lastRequestAt + 1100 - now)
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
  lastRequestAt = Date.now()
  return fetch(url, {
    headers: {
      "User-Agent": MUSICBRAINZ_USER_AGENT,
      Accept: "application/json",
    },
  })
}

export function musicbrainzFetch(url: string): Promise<Response> {
  const result = chain.then(() => run(url))
  chain = result.catch(() => undefined)
  return result
}
