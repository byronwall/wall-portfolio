import { devFeedbackAccessError, jsonRecord, readJsonObject } from "app/dev-feedback/server/request"
import { saveAnswer } from "app/dev-feedback/server/storage"

export const runtime = "nodejs"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const accessError = devFeedbackAccessError(request)
  if (accessError) {
    return accessError
  }

  const body = await readJsonObject(request)
  if (body.error) {
    return body.error
  }

  const { id } = await context.params
  const answer = await saveAnswer(id, body.value)
  if (!answer) {
    return jsonRecord({ error: "Annotation not found" }, 404)
  }

  return jsonRecord(answer, 201)
}
