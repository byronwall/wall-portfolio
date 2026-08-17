import { randomUUID } from "node:crypto"
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"

import type {
  DevFeedbackAnnotation,
  DevFeedbackAnswer,
  DevFeedbackNote,
  DevFeedbackSelectionContext,
} from "../types"

export type DevFeedbackQueueStatus = "inbox" | "processing" | "completed" | "failed"

const storageRoot = path.join(process.cwd(), ".dev-feedback")

const folders = {
  inbox: path.join(storageRoot, "inbox"),
  processing: path.join(storageRoot, "processing"),
  completed: path.join(storageRoot, "completed"),
  failed: path.join(storageRoot, "failed"),
  annotationsOpen: path.join(storageRoot, "annotations", "open"),
  annotationsResolved: path.join(storageRoot, "annotations", "resolved"),
  answers: path.join(storageRoot, "answers"),
} as const

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function createFeedbackId() {
  return randomUUID()
}

export async function ensureFeedbackStorage() {
  await Promise.all(Object.values(folders).map((folder) => mkdir(folder, { recursive: true })))
}

function fileFor(folder: string, id: string) {
  if (!idPattern.test(id)) {
    throw new Error("Invalid feedback record id")
  }

  return path.join(folder, `${id}.json`)
}

async function writeJsonAtomically(filePath: string, value: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true })
  const temporaryPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${randomUUID()}.tmp`
  )

  try {
    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8")
    await rename(temporaryPath, filePath)
  } finally {
    await rm(temporaryPath, { force: true }).catch(() => undefined)
  }
}

async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const contents = await readFile(filePath, "utf8")
    return JSON.parse(contents) as T
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined
    if (code === "ENOENT") {
      return null
    }
    throw error
  }
}

async function listJson<T>(folder: string) {
  await mkdir(folder, { recursive: true })
  const entries = await readdir(folder, { withFileTypes: true })
  const records: T[] = []

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue
    }

    const record = await readJson<T>(path.join(folder, entry.name))
    if (record) {
      records.push(record)
    }
  }

  return records
}

function byNewest(a: { updatedAt?: string; createdAt?: string }, b: { updatedAt?: string; createdAt?: string }) {
  const aTime = Date.parse(a.updatedAt ?? a.createdAt ?? "") || 0
  const bTime = Date.parse(b.updatedAt ?? b.createdAt ?? "") || 0
  return bTime - aTime
}

const maxSelectionTextLength = 20_000

function validateSelectionText(value: unknown, field: string) {
  if (value === undefined) {
    return
  }

  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`)
  }

  if (value.length > maxSelectionTextLength) {
    throw new Error(`${field} is too long`)
  }
}

function validateSelectionContext(input: Record<string, unknown>) {
  validateSelectionText(input.selectedText, "selectedText")
  validateSelectionText(input.normalizedText, "normalizedText")
  validateSelectionText(input.selectedTextNormalized, "selectedTextNormalized")

  for (const field of ["target", "containingTarget", "targetMetadata", "container"]) {
    const value = input[field]
    if (value !== undefined && (!value || typeof value !== "object" || Array.isArray(value))) {
      throw new Error(`${field} must be a JSON object`)
    }
  }

  const selection = input.selection ?? input.selectionContext
  if (selection === undefined) {
    return
  }

  if (!selection || typeof selection !== "object" || Array.isArray(selection)) {
    throw new Error("selection must be a JSON object")
  }

  const selectionObject = selection as Record<string, unknown>
  validateSelectionText(selectionObject.text, "selection.text")
  validateSelectionText(selectionObject.selectedText, "selection.selectedText")
  validateSelectionText(selectionObject.normalizedText, "selection.normalizedText")
  validateSelectionText(selectionObject.selectedTextNormalized, "selection.selectedTextNormalized")

  for (const field of ["target", "containingTarget", "targetMetadata", "container"]) {
    const value = selectionObject[field]
    if (value !== undefined && (!value || typeof value !== "object" || Array.isArray(value))) {
      throw new Error(`selection.${field} must be a JSON object`)
    }
  }
}

export async function saveNote(input: Record<string, unknown>): Promise<DevFeedbackNote> {
  await ensureFeedbackStorage()
  validateSelectionContext(input)
  const now = new Date().toISOString()
  const id = createFeedbackId()
  const selection = input.selection ?? input.selectionContext
  const content = typeof input.content === "string"
    ? input.content
    : typeof input.note === "string"
      ? input.note
      : typeof input.text === "string"
        ? input.text
        : typeof input.message === "string"
          ? input.message
          : ""
  if (!content.trim()) {
    throw new Error("content must not be empty")
  }

  const note: DevFeedbackNote = {
    ...input,
    id,
    type: "note",
    route: typeof input.route === "string" ? input.route : "",
    content,
    status: "inbox",
    createdAt: now,
    updatedAt: now,
    ...(selection !== undefined ? { selection: selection as DevFeedbackSelectionContext } : {}),
  }

  await writeJsonAtomically(fileFor(folders.inbox, id), note)
  return note
}

export async function saveAnnotation(input: Record<string, unknown>): Promise<DevFeedbackAnnotation> {
  await ensureFeedbackStorage()
  const now = new Date().toISOString()
  const id = createFeedbackId()
  const question = typeof input.question === "string"
    ? input.question
    : typeof input.text === "string"
      ? input.text
      : typeof input.message === "string"
        ? input.message
        : typeof input.content === "string"
          ? input.content
          : ""
  if (!question.trim()) {
    throw new Error("question must not be empty")
  }

  const annotation: DevFeedbackAnnotation = {
    ...input,
    id,
    type: "annotation",
    route: typeof input.route === "string"
      ? input.route
      : typeof input.pathname === "string"
        ? input.pathname
        : "",
    text: question,
    question,
    status: "open",
    createdAt: now,
    updatedAt: now,
  }

  await writeJsonAtomically(fileFor(folders.annotationsOpen, id), annotation)
  return annotation
}

export async function listNotes() {
  await ensureFeedbackStorage()

  const entries = await Promise.all(
    (Object.entries({
      inbox: folders.inbox,
      processing: folders.processing,
      completed: folders.completed,
      failed: folders.failed,
    }) as Array<[DevFeedbackQueueStatus, string]>).map(async ([status, folder]) => {
      const notes = await listJson<DevFeedbackNote>(folder)
      return notes.map((note) => ({
        ...note,
        status,
        queueStatus: status,
      }))
    }),
  )

  const records = entries.flat().sort(byNewest)
  const queue = {
    inbox: records.filter((record) => record.status === "inbox"),
    processing: records.filter((record) => record.status === "processing"),
    completed: records.filter((record) => record.status === "completed"),
    failed: records.filter((record) => record.status === "failed"),
  }

  return {
    records,
    queue,
    counts: Object.fromEntries(
      Object.entries(queue).map(([status, values]) => [status, values.length]),
    ) as Record<DevFeedbackQueueStatus, number>,
  }
}

async function findAnnotationFile(id: string) {
  const openPath = fileFor(folders.annotationsOpen, id)
  const resolvedPath = fileFor(folders.annotationsResolved, id)
  const open = await readJson<DevFeedbackAnnotation>(openPath)

  if (open) {
    return { annotation: open, filePath: openPath, state: "open" as const }
  }

  const resolved = await readJson<DevFeedbackAnnotation>(resolvedPath)
  if (resolved) {
    return { annotation: resolved, filePath: resolvedPath, state: "resolved" as const }
  }

  return null
}

export async function getAnnotation(id: string) {
  return findAnnotationFile(id)
}

export async function listAnnotations(route?: string, scope: "current" | "all" = "current") {
  await ensureFeedbackStorage()
  const open = await listJson<DevFeedbackAnnotation>(folders.annotationsOpen)
  const resolved = scope === "all"
    ? await listJson<DevFeedbackAnnotation>(folders.annotationsResolved)
    : []

  const unique = new Map<string, DevFeedbackAnnotation>()
  for (const annotation of [...resolved, ...open]) {
    if (route !== undefined && annotation.route !== route) {
      continue
    }

    // Prefer the open copy when a resolved record has been reopened.
    unique.set(annotation.id, annotation)
  }

  return Array.from(unique.values()).sort(byNewest)
}

export async function listAnswers(annotationId?: string) {
  const answers = await listJson<DevFeedbackAnswer>(folders.answers)
  return answers
    .filter((answer) => annotationId === undefined || answer.annotationId === annotationId)
    .sort(byNewest)
}

export async function saveAnswer(
  annotationId: string,
  input: Record<string, unknown>
): Promise<DevFeedbackAnswer | null> {
  await ensureFeedbackStorage()
  const annotation = await findAnnotationFile(annotationId)
  if (!annotation) {
    return null
  }

  const now = new Date().toISOString()
  const id = createFeedbackId()
  const answer: DevFeedbackAnswer = {
    ...input,
    id,
    type: "answer",
    route: annotation.annotation.route,
    annotationId,
    answer: typeof input.answer === "string"
      ? input.answer
      : typeof input.text === "string"
        ? input.text
        : typeof input.content === "string"
          ? input.content
          : "",
    status: "open",
    createdAt: now,
    updatedAt: now,
  }

  await writeJsonAtomically(fileFor(folders.answers, id), answer)
  return answer
}

export async function completeAnnotation(id: string) {
  await ensureFeedbackStorage()
  const found = await findAnnotationFile(id)
  if (!found) {
    return null
  }

  if (found.state === "resolved") {
    return found.annotation
  }

  const now = new Date().toISOString()
  const completed: DevFeedbackAnnotation = {
    ...found.annotation,
    status: "completed",
    completedAt: now,
    updatedAt: now,
  }
  const resolvedPath = fileFor(folders.annotationsResolved, id)
  // Update the open record before the atomic move. A concurrent reopen can
  // then either observe the completed state or win after the move.
  await writeJsonAtomically(found.filePath, completed)
  await rename(found.filePath, resolvedPath)
  return completed
}

export async function reopenAnnotation(id: string) {
  await ensureFeedbackStorage()
  const found = await findAnnotationFile(id)
  if (!found) {
    return null
  }

  if (found.state === "open") {
    return found.annotation
  }

  const now = new Date().toISOString()
  const reopened: DevFeedbackAnnotation = {
    ...found.annotation,
    status: "open",
    completedAt: undefined,
    ...(found.annotation.completedAt
      ? { reopenedFromCompletedAt: found.annotation.completedAt }
      : {}),
    reopenedAt: now,
    updatedAt: now,
  }
  await writeJsonAtomically(fileFor(folders.annotationsOpen, id), reopened)

  // Keep the resolved file as a durable record of the prior completion.
  return reopened
}

export async function storageExists() {
  try {
    await stat(storageRoot)
    return true
  } catch {
    return false
  }
}
