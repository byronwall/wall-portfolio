export type DevFeedbackScope = "current" | "all"

export type DevFeedbackStatus = "inbox" | "processing" | "failed" | "open" | "completed"

export interface DevFeedbackRecord {
  id: string
  type: string
  route: string
  status: DevFeedbackStatus
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

export interface DevFeedbackAnnotation extends DevFeedbackRecord {
  type: "annotation"
  status: "open" | "completed"
  text: string
  question?: string
  selector?: string | null
  completedAt?: string
  reopenedAt?: string
}

export interface DevFeedbackAnswer extends DevFeedbackRecord {
  type: "answer"
  annotationId: string
  answer: string
}

export interface DevFeedbackNote extends DevFeedbackRecord {
  type: "note"
  status: "inbox" | "processing" | "failed" | "completed"
  content: string
  selectedText?: string
  normalizedText?: string
  selectedTextNormalized?: string
  target?: Record<string, unknown>
  containingTarget?: Record<string, unknown>
  targetMetadata?: Record<string, unknown>
  container?: Record<string, unknown>
  selection?: DevFeedbackSelectionContext
}

export interface DevFeedbackSelectionContext {
  text?: string
  normalizedText?: string
  target?: Record<string, unknown>
  containingTarget?: Record<string, unknown>
  [key: string]: unknown
}

export interface DevFeedbackListResult {
  annotations: Array<DevFeedbackAnnotation & { answers?: DevFeedbackAnswer[] }>
  scope: DevFeedbackScope
  route?: string
}
