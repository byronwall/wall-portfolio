import { devFeedbackAccessError, jsonRecord } from "app/dev-feedback/server/request"
import { completeAnnotation } from "app/dev-feedback/server/storage"

export const runtime = "nodejs"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const accessError = devFeedbackAccessError(request)
  if (accessError) {
    return accessError
  }

  const { id } = await context.params
  const annotation = await completeAnnotation(id)
  if (!annotation) {
    return jsonRecord({ error: "Annotation not found" }, 404)
  }

  return jsonRecord(annotation)
}
