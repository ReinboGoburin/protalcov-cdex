import { NextResponse } from "next/server"

export function serviceUnavailable(status = 502) {
  return NextResponse.json(
    { error: "Service temporairement indisponible, réessayez dans quelques instants" },
    { status }
  )
}

export function notFound() {
  return NextResponse.json({ error: "Item introuvable" }, { status: 404 })
}
