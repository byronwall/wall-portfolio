import { NextResponse } from "next/server"
import { devFeedbackAccessError, jsonRecord, readJsonObject, validationError } from "app/dev-feedback/server/request"
import { listAnswers, listAnnotations, saveAnnotation } from "app/dev-feedback/server/storage"
import type { DevFeedbackScope, DevFeedbackListResult } from "app/dev-feedback/types"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const accessError = devFeedbackAccessError(request)
  if (accessError) {
    return accessError
  }

  const url = new URL(request.url)
  const requestedScope = url.searchParams.get("scope") ?? "current"
  if (requestedScope !== "current" && requestedScope !== "all") {
    return jsonRecord({ error: "scope must be current or all" }, 400)
  }
  const scope: DevFeedbackScope = requestedScope === "all" ? "all" : "current"
  const route = url.searchParams.get("route") ?? undefined
  const annotations = await listAnnotations(route, scope)
  const result: DevFeedbackListResult = {
    annotations: await Promise.all(
      annotations.map(async (annotation) => ({
        ...annotation,
        answers: await listAnswers(annotation.id),
      }))
    ),
    scope,
    ...(route === undefined ? {} : { route }),
  }

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
    return jsonRecord(await saveAnnotation(body.value), 201)
  } catch (error) {
    return validationError(error)
  }
}
