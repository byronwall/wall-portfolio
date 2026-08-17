import { NextResponse } from "next/server"
import { devFeedbackAccessError, jsonRecord, readJsonObject, validationError } from "app/dev-feedback/server/request"
import { listNotes, saveNote } from "app/dev-feedback/server/storage"

export const runtime = "nodejs"

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function normalizeNoteInput(input: Record<string, unknown>) {
  const context = isObject(input.context) ? input.context : {}
  const content = typeof input.content === "string"
    ? input.content
    : typeof input.note === "string"
      ? input.note
      : typeof input.text === "string"
        ? input.text
        : undefined

  return {
    ...input,
    ...context,
    ...(content !== undefined ? { content } : {}),
  }
}

export async function GET(request: Request) {
  const accessError = devFeedbackAccessError(request)
  if (accessError) {
    return accessError
  }

  const result = await listNotes()
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const accessError = devFeedbackAccessError(request)
  if (accessError) {
    return accessError
  }

  const body = await readJsonObject(request)
  if (body.error) {
    return body.error
  }

  try {
    return jsonRecord(await saveNote(normalizeNoteInput(body.value)), 201)
  } catch (error) {
    return validationError(error)
  }
}
