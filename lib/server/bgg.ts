import { XMLParser } from "fast-xml-parser"

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
})

const BGG_USER_AGENT = "Alcove/0.1 (hugapi@fea.st)"

export class BggRetryExhaustedError extends Error {
  constructor() {
    super("BGG n'a pas répondu après plusieurs tentatives")
  }
}

export async function bggFetchXml(url: string): Promise<unknown> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": BGG_USER_AGENT } })
    if (res.status === 202) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      continue
    }
    if (!res.ok) {
      throw new Error(`BGG a répondu avec le statut ${res.status}`)
    }
    const text = await res.text()
    if (!text.trim()) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      continue
    }
    return parser.parse(text)
  }
  throw new BggRetryExhaustedError()
}

export function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}
