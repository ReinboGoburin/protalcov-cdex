import type { MediaType } from "./types"

export const UNIVERSAL_PROMPTS = [
  "En un mot :",
  "Je l'ai découvert grâce à",
  "Ça m'a marqué parce que",
  "Ça me rappelle",
  "Je le recommanderais à quelqu'un qui",
]

const SPECIFIC_PROMPTS: Record<MediaType, string> = {
  movie: "La scène qui reste :",
  tv: "La scène qui reste :",
  book: "La phrase que j'ai soulignée :",
  album: "Le morceau qui tue :",
  videogame: "Mon souvenir le plus fort :",
  boardgame: "Mon souvenir le plus fort :",
  podcast: "L'épisode qui m'a accroché :",
}

function shuffled<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Every prompt available for a type, in a fresh random order. */
export function getPromptsFor(type: MediaType): string[] {
  return shuffled([...UNIVERSAL_PROMPTS, SPECIFIC_PROMPTS[type]])
}

/** 3 random chips to show up front, plus the rest of the pool for the "autres…" chip. */
export function getPromptChips(type: MediaType): { visible: string[]; rest: string[] } {
  const pool = getPromptsFor(type)
  return { visible: pool.slice(0, 3), rest: pool.slice(3) }
}
