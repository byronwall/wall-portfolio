import { NextResponse } from "next/server"

const loopbackHostPattern = /^(?:localhost|127\.0\.0\.1)(?::\d+)?\.?$/i
const loopbackIpv6Pattern = /^(?:\[::1\]|::1)(?::\d+)?$/i

export function devFeedbackAccessError(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const host = request.headers.get("host")?.trim() ?? ""
  if (!loopbackHostPattern.test(host) && !loopbackIpv6Pattern.test(host)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return null
}

export async function readJsonObject(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return { error: NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 }) }
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: NextResponse.json({ error: "Request body must be a JSON object" }, { status: 400 }) }
  }

  return { value: body as Record<string, unknown> }
}

export function validationError(error: unknown) {
  const message = error instanceof Error ? error.message : "Invalid request"
  return NextResponse.json({ error: message }, { status: 400 })
}

export function jsonRecord(record: unknown, status = 200) {
  return NextResponse.json({ record }, { status })
}
