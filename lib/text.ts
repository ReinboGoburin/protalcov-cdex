/** Truncates to at most maxLength characters, cutting at the last whole word and appending an ellipsis. */
export function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  const sliced = text.slice(0, maxLength)
  const lastSpace = sliced.lastIndexOf(" ")
  const truncated = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced
  return `${truncated.trimEnd()}…`
}
