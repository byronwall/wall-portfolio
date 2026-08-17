/**
 * Client-safe target capture and matching helpers for the development feedback UI.
 *
 * This module does not read `window` or `document` while it is imported. Callers
 * should capture a Selection before opening or focusing the feedback UI, then pass
 * that Selection to `captureTargetMetadata` when possible.
 */

export const DEV_FEEDBACK_IGNORE_SELECTOR = '[data-dev-feedback-ignore]'

const MAX_TEXT_LENGTH = 180
const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6'
const FEEDBACK_ID_ATTRIBUTES = [
  'data-feedback-id',
  'data-dev-feedback-id',
  'data-feedback-target-id',
]

export interface TargetRect {
  x: number
  y: number
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

export interface SelectionAnchor {
  selector?: string
  tag?: string
  offset: number
}

/** Redundant evidence for the element that contains a captured text selection. */
export interface SelectionTargetEvidence {
  selector?: string
  tag?: string
  role?: string
  accessibleLabel?: string
  text?: string
  normalizedText?: string
  headingPath: string[]
  rect?: TargetRect
}

export interface TextSelectionMetadata {
  text: string
  normalizedText: string
  anchor?: SelectionAnchor
  focus?: SelectionAnchor
  container?: SelectionTargetEvidence
  headingPath: string[]
  rect?: TargetRect
}

export interface TargetMetadata {
  /** An explicit data-feedback-id, when present. */
  feedbackId?: string
  /** The element id, when present. */
  id?: string
  selector?: string
  tag?: string
  role?: string
  accessibleLabel?: string
  /** Short, whitespace-normalized visible text. */
  text?: string
  /** Alias kept for consumers that call this field normalizedText. */
  normalizedText?: string
  headingPath: string[]
  rect?: TargetRect
  /** Text selected at activation time. This is first-class matching evidence. */
  selection?: TextSelectionMetadata
}

export interface CaptureTargetOptions {
  /** Pass the Selection or Range captured before the feedback UI receives focus. */
  selection?: Selection | Range | null
  /** Set false when capturing a selection container to avoid nested selection data. */
  includeSelection?: boolean
}

export type TargetMatchStatus = 'matched' | 'ambiguous' | 'missing'
export type TargetMatchConfidence = 'high' | 'medium' | 'low' | 'none'
export type TargetMatchStrategy =
  | 'feedback-id'
  | 'element-id'
  | 'selector-and-text'
  | 'selector'
  | 'role-label-text'
  | 'heading-text'
  | 'none'

export interface TargetMatchResult {
  status: TargetMatchStatus
  confidence: TargetMatchConfidence
  reason: string
  strategy: TargetMatchStrategy
  element?: Element
  candidates: Element[]
}

type DomRoot = Document | Element
type SelectionSource = Selection | Range

function isDocument(value: unknown): value is Document {
  return typeof Document !== 'undefined' && value instanceof Document
}

function normalizeText(value: string | null | undefined, maxLength = MAX_TEXT_LENGTH): string {
  const normalized = (value || '').replace(/\s+/g, ' ').trim()
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1).trimEnd()}…` : normalized
}

function isElement(value: unknown): value is Element {
  return !!value && (value as Node).nodeType === 1
}

function parentElement(node: Node | null): Element | null {
  if (!node) return null
  return isElement(node) ? node : node.parentElement
}

function rootContains(root: DomRoot, element: Element): boolean {
  return isDocument(root) ? root.documentElement.contains(element) : root === element || root.contains(element)
}

function isIgnored(element: Element | null): boolean {
  return !!element?.closest(DEV_FEEDBACK_IGNORE_SELECTOR)
}

function cssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(value)

  return value.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`)
}

function quoteAttribute(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function selectorMatches(root: DomRoot, selector: string): Element[] {
  try {
    const candidates: Element[] = []
    if (isElement(root) && root.matches(selector)) candidates.push(root)
    root.querySelectorAll(selector).forEach((candidate) => candidates.push(candidate))
    return candidates.filter((candidate) => !isIgnored(candidate))
  } catch {
    return []
  }
}

function uniqueElements(elements: Element[]): Element[] {
  return Array.from(new Set(elements))
}

function getFeedbackId(element: Element): string | undefined {
  for (const attribute of FEEDBACK_ID_ATTRIBUTES) {
    const value = normalizeText(element.getAttribute(attribute), 200)
    if (value) return value
  }
  return undefined
}

function getFeedbackIdAttribute(element: Element): string | undefined {
  return FEEDBACK_ID_ATTRIBUTES.find((attribute) => normalizeText(element.getAttribute(attribute), 200))
}

function getRole(element: Element): string | undefined {
  const explicitRole = normalizeText(element.getAttribute('role'), 80)
  if (explicitRole) return explicitRole.split(' ')[0].toLowerCase()

  const tag = element.tagName.toLowerCase()
  if (tag === 'a' && element.hasAttribute('href')) return 'link'
  if (tag === 'button') return 'button'
  if (tag === 'img') return 'img'
  if (tag === 'nav') return 'navigation'
  if (tag === 'main') return 'main'
  if (tag === 'form') return 'form'
  if (tag === 'dialog') return 'dialog'
  if (/^h[1-6]$/.test(tag)) return 'heading'
  if (tag === 'input') {
    const type = (element.getAttribute('type') || 'text').toLowerCase()
    if (type === 'checkbox') return 'checkbox'
    if (type === 'radio') return 'radio'
    if (type === 'range') return 'slider'
    if (type === 'submit' || type === 'button') return 'button'
    return 'textbox'
  }
  if (tag === 'textarea') return 'textbox'
  if (tag === 'select') return 'combobox'
  return undefined
}

function getAccessibleLabel(element: Element): string | undefined {
  const ariaLabel = normalizeText(element.getAttribute('aria-label'), 180)
  if (ariaLabel) return ariaLabel

  const labelledBy = normalizeText(element.getAttribute('aria-labelledby'), 180)
  if (labelledBy) {
    const labels = labelledBy
      .split(/\s+/)
      .map((id) => element.ownerDocument.getElementById(id))
      .filter((label): label is HTMLElement => !!label)
      .map((label) => normalizeText(label.textContent))
      .filter(Boolean)
    if (labels.length) return normalizeText(labels.join(' '))
  }

  const tagName = element.tagName.toLowerCase()
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    if (element.id) {
      const label = element.ownerDocument.querySelector(`label[for="${element.id.replace(/"/g, '\\"')}"]`)
      const labelText = normalizeText(label?.textContent)
      if (labelText) return labelText
    }
    const wrappingLabel = element.closest('label')
    const wrappingLabelText = normalizeText(wrappingLabel?.textContent)
    if (wrappingLabelText) return wrappingLabelText
    const placeholder = normalizeText(element.getAttribute('placeholder'))
    if (placeholder) return placeholder
  }

  const title = normalizeText(element.getAttribute('title'))
  return title || undefined
}

function getRect(element: Element): TargetRect {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.x,
    y: rect.y,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
}

function headingLevel(element: Element): number {
  return Number(element.tagName.slice(1))
}

/** Return the current document outline path leading to an element. */
export function getNearbyHeadingPath(element: Element): string[] {
  const headings = Array.from(element.ownerDocument.querySelectorAll(HEADING_SELECTOR)).filter((heading) => !isIgnored(heading))
  const path: Array<{ level: number; text: string }> = []

  for (const heading of headings) {
    const isTheElement = heading === element
    const relation = isTheElement ? 0 : heading.compareDocumentPosition(element)
    const isBefore = !!(relation & Node.DOCUMENT_POSITION_FOLLOWING)
    if (!isBefore && !isTheElement) continue

    const text = normalizeText(heading.textContent)
    if (!text) continue
    const level = headingLevel(heading)
    while (path.length && path[path.length - 1].level >= level) path.pop()
    path.push({ level, text })
    if (isTheElement) break
  }

  return path.map((heading) => heading.text)
}

function getSelectorSegment(element: Element): string {
  const tag = element.tagName.toLowerCase()
  const feedbackId = getFeedbackId(element)
  const feedbackIdAttribute = getFeedbackIdAttribute(element)
  if (feedbackId && feedbackIdAttribute) return `[${feedbackIdAttribute}=${quoteAttribute(feedbackId)}]`
  if (element.id) return `#${cssEscape(element.id)}`

  const usefulClasses = Array.from(element.classList)
    .filter((className) => className.length > 1 && className.length < 80 && /^[a-zA-Z0-9_-]+$/.test(className))
    .slice(0, 3)
  const classSegment = usefulClasses.map((className) => `.${cssEscape(className)}`).join('')
  if (classSegment) return `${tag}${classSegment}`

  const siblings = element.parentElement
    ? Array.from(element.parentElement.children).filter((sibling) => sibling.tagName === element.tagName)
    : []
  const index = siblings.indexOf(element)
  return `${tag}${siblings.length > 1 && index >= 0 ? `:nth-of-type(${index + 1})` : ''}`
}

/** Build a readable selector, adding ancestors only when needed for uniqueness. */
export function getReasonableSelector(element: Element): string {
  const root = element.ownerDocument
  const segments: string[] = []
  let current: Element | null = element

  while (current && current !== root.documentElement) {
    const segment = getSelectorSegment(current)
    segments.unshift(segment)
    const selector = segments.join(' > ')
    if (selectorMatches(root, selector).length === 1) return selector
    current = current.parentElement
  }

  return segments.join(' > ') || element.tagName.toLowerCase()
}

function isRange(value: unknown): value is Range {
  return typeof Range !== 'undefined' && value instanceof Range
}

function isSelection(value: unknown): value is Selection {
  return typeof Selection !== 'undefined' && value instanceof Selection
}

function selectionRange(selection: SelectionSource): Range | undefined {
  if (isRange(selection)) return selection.collapsed ? undefined : selection
  if (!selection.rangeCount || selection.isCollapsed) return undefined
  try {
    return selection.getRangeAt(0)
  } catch {
    return undefined
  }
}

function selectionIntersectsIgnored(range: Range): boolean {
  const commonAncestor = parentElement(range.commonAncestorContainer)
  // A page-wide selection can end inside the fixed feedback UI. Reject only
  // selections whose common ancestor is itself ignored UI.
  return isIgnored(commonAncestor)
}

function selectionInsideTarget(range: Range, target: Element): boolean {
  if (isIgnored(target)) return false
  try {
    return range.intersectsNode(target)
  } catch {
    return target.contains(parentElement(range.commonAncestorContainer))
  }
}

function getSelectionView(target?: Element | Document): Window | undefined {
  const ownerDocument = isDocument(target) ? target : target?.ownerDocument
  if (ownerDocument?.defaultView) return ownerDocument.defaultView
  if (typeof window !== 'undefined') return window
  return undefined
}

function captureSelectionMetadata(selection: SelectionSource, target?: Element): TextSelectionMetadata | undefined {
  const range = selectionRange(selection)
  const selectedText = normalizeText(range ? range.toString() : '', MAX_TEXT_LENGTH)
  if (!range || !selectedText || selectionIntersectsIgnored(range)) return undefined
  if (target && !selectionInsideTarget(range, target)) return undefined

  const containerElement = parentElement(range.commonAncestorContainer)
  if (!containerElement || isIgnored(containerElement)) return undefined

  const container = captureSelectionTargetEvidence(containerElement)
  const rangeRect = range.getBoundingClientRect?.()
  const anchorNode = isRange(selection) ? range.startContainer : selection.anchorNode
  const focusNode = isRange(selection) ? range.endContainer : selection.focusNode
  const anchorOffset = isRange(selection) ? range.startOffset : selection.anchorOffset
  const focusOffset = isRange(selection) ? range.endOffset : selection.focusOffset
  const anchorElement = parentElement(anchorNode)
  const focusElement = parentElement(focusNode)

  return {
    text: selectedText,
    normalizedText: selectedText,
    anchor: anchorElement
      ? { selector: getReasonableSelector(anchorElement), tag: anchorElement.tagName.toLowerCase(), offset: anchorOffset }
      : undefined,
    focus: focusElement
      ? { selector: getReasonableSelector(focusElement), tag: focusElement.tagName.toLowerCase(), offset: focusOffset }
      : undefined,
    container,
    headingPath: container.headingPath,
    rect: rangeRect
      ? {
          x: rangeRect.x,
          y: rangeRect.y,
          top: rangeRect.top,
          right: rangeRect.right,
          bottom: rangeRect.bottom,
          left: rangeRect.left,
          width: rangeRect.width,
          height: rangeRect.height,
        }
      : container.rect,
  }
}

function captureSelectionTargetEvidence(element: Element): SelectionTargetEvidence {
  const text = normalizeText(element.textContent)
  return {
    selector: getReasonableSelector(element),
    tag: element.tagName.toLowerCase(),
    role: getRole(element),
    accessibleLabel: getAccessibleLabel(element),
    text: text || undefined,
    normalizedText: text || undefined,
    headingPath: getNearbyHeadingPath(element),
    rect: getRect(element),
  }
}

/**
 * Capture the current text selection. Call this before opening a dialog or
 * focusing a feedback control, because those actions can clear the Selection.
 */
export function captureTextSelection(
  target?: Element | Document | Selection | Range | null,
  selection?: Selection | Range | null,
): TextSelectionMetadata | undefined {
  const targetElementOrDocument = isElement(target) || isDocument(target) ? target : undefined
  const view = getSelectionView(targetElementOrDocument)
  let providedSelection: SelectionSource | null | undefined = selection
  if (selection === undefined && (isSelection(target) || isRange(target))) providedSelection = target
  const currentSelection = providedSelection === undefined ? view?.getSelection() : providedSelection
  if (!currentSelection) return undefined
  return captureSelectionMetadata(currentSelection, isElement(targetElementOrDocument) ? targetElementOrDocument : undefined)
}

/** Capture a clicked element and, when it intersects the Selection, its text evidence. */
export function captureTargetMetadata(element: Element, options: CaptureTargetOptions = {}): TargetMetadata | undefined {
  if (!element || isIgnored(element)) return undefined

  const text = normalizeText(element.textContent)
  const metadata: TargetMetadata = {
    feedbackId: getFeedbackId(element),
    id: normalizeText(element.id, 200) || undefined,
    selector: getReasonableSelector(element),
    tag: element.tagName.toLowerCase(),
    role: getRole(element),
    accessibleLabel: getAccessibleLabel(element),
    text: text || undefined,
    normalizedText: text || undefined,
    headingPath: getNearbyHeadingPath(element),
    rect: getRect(element),
  }

  if (options.includeSelection !== false) {
    const selectionMetadata =
      options.selection === undefined
        ? captureTextSelection(element)
        : options.selection
          ? captureSelectionMetadata(options.selection, element)
          : undefined
    if (selectionMetadata) metadata.selection = selectionMetadata
  }

  return metadata
}

function getExpectedText(metadata: TargetMetadata): string | undefined {
  return normalizeText(metadata.text || metadata.normalizedText) || undefined
}

function getExpectedSelectionText(metadata: TargetMetadata): string | undefined {
  return normalizeText(metadata.selection?.normalizedText || metadata.selection?.text) || undefined
}

function elementTextMatches(element: Element, expected: string, allowContaining = false): boolean {
  const text = normalizeText(element.textContent)
  return text === expected || (allowContaining && text.includes(expected))
}

function headingPathMatches(element: Element, expected: string[]): boolean {
  if (!expected.length) return false
  const actual = getNearbyHeadingPath(element)
  if (actual.length !== expected.length) return false
  return actual.every((heading, index) => heading === expected[index])
}

function allElements(root: DomRoot): Element[] {
  const elements: Element[] = []
  if (isElement(root)) elements.push(root)
  root.querySelectorAll('*').forEach((element) => elements.push(element))
  return elements.filter((element) => !isIgnored(element))
}

function matchByStableId(metadata: TargetMetadata, root: DomRoot): TargetMatchResult | undefined {
  const feedbackId = normalizeText(metadata.feedbackId, 200)
  if (feedbackId) {
    const candidates = uniqueElements(
      FEEDBACK_ID_ATTRIBUTES.flatMap((attribute) => selectorMatches(root, `[${attribute}=${quoteAttribute(feedbackId)}]`)),
    )
    if (candidates.length > 1) {
      return { status: 'ambiguous', confidence: 'high', reason: `Feedback id "${feedbackId}" matched multiple elements.`, strategy: 'feedback-id', candidates }
    }
    if (candidates.length === 1) {
      return { status: 'matched', confidence: 'high', reason: 'Matched the explicit feedback id.', strategy: 'feedback-id', element: candidates[0], candidates }
    }
  }

  const id = normalizeText(metadata.id, 200)
  if (id) {
    const candidates = selectorMatches(root, `#${cssEscape(id)}`)
    if (candidates.length > 1) {
      return { status: 'ambiguous', confidence: 'high', reason: `Element id "${id}" matched multiple elements.`, strategy: 'element-id', candidates }
    }
    if (candidates.length === 1) {
      return { status: 'matched', confidence: 'high', reason: 'Matched the stable element id.', strategy: 'element-id', element: candidates[0], candidates }
    }
  }
  return undefined
}

function matchBySelector(metadata: TargetMetadata, root: DomRoot): TargetMatchResult | undefined {
  if (!metadata.selector) return undefined
  const candidates = selectorMatches(root, metadata.selector)
  if (!candidates.length) return undefined

  const expectedText = getExpectedText(metadata)
  const expectedSelection = getExpectedSelectionText(metadata)
  const textCandidates = expectedText
    ? candidates.filter((candidate) => elementTextMatches(candidate, expectedText))
    : candidates
  const selectionCandidates = expectedSelection
    ? textCandidates.filter((candidate) => elementTextMatches(candidate, expectedSelection, true))
    : textCandidates
  const matchingCandidates = selectionCandidates.filter((candidate) => !metadata.tag || candidate.tagName.toLowerCase() === metadata.tag.toLowerCase())

  if (matchingCandidates.length > 1) {
    return { status: 'ambiguous', confidence: 'medium', reason: 'The selector and text evidence matched multiple elements.', strategy: 'selector-and-text', candidates: matchingCandidates }
  }
  if (matchingCandidates.length === 1) {
    return {
      status: 'matched',
      confidence: expectedText || expectedSelection ? 'medium' : 'low',
      reason: expectedText || expectedSelection ? 'Matched the selector with text evidence.' : 'Matched a unique saved selector.',
      strategy: expectedText || expectedSelection ? 'selector-and-text' : 'selector',
      element: matchingCandidates[0],
      candidates: matchingCandidates,
    }
  }
  return undefined
}

function matchByRoleLabelText(metadata: TargetMetadata, root: DomRoot): TargetMatchResult | undefined {
  const expectedRole = normalizeText(metadata.role, 80).toLowerCase()
  const expectedLabel = normalizeText(metadata.accessibleLabel)
  const expectedText = getExpectedText(metadata)
  const expectedSelection = getExpectedSelectionText(metadata)
  if (!expectedRole && !expectedLabel && !expectedText && !expectedSelection) return undefined
  if (!expectedRole && !expectedLabel) return undefined

  const candidates = allElements(root).filter((candidate) => {
    if (expectedRole && getRole(candidate) !== expectedRole) return false
    if (expectedLabel && getAccessibleLabel(candidate) !== expectedLabel) return false
    if (expectedText && !elementTextMatches(candidate, expectedText)) return false
    if (expectedSelection && !elementTextMatches(candidate, expectedSelection, true)) return false
    return true
  })

  if (candidates.length > 1) {
    return { status: 'ambiguous', confidence: 'medium', reason: 'Role, accessible label, and text evidence matched multiple elements.', strategy: 'role-label-text', candidates }
  }
  if (candidates.length === 1) {
    return { status: 'matched', confidence: 'medium', reason: 'Matched role, accessible label, and text evidence.', strategy: 'role-label-text', element: candidates[0], candidates }
  }
  return undefined
}

function matchByHeadingText(metadata: TargetMetadata, root: DomRoot): TargetMatchResult | undefined {
  const headingPath = metadata.selection?.headingPath?.length ? metadata.selection.headingPath : metadata.headingPath
  const expectedText = getExpectedSelectionText(metadata) || getExpectedText(metadata)
  if (!headingPath?.length || !expectedText) return undefined

  const candidates = allElements(root).filter((candidate) => {
    if (metadata.tag && candidate.tagName.toLowerCase() !== metadata.tag.toLowerCase()) return false
    if (!headingPathMatches(candidate, headingPath)) return false
    return elementTextMatches(candidate, expectedText, !!metadata.selection)
  })
  if (candidates.length > 1) {
    return { status: 'ambiguous', confidence: 'low', reason: 'Heading path and selected text matched multiple elements.', strategy: 'heading-text', candidates }
  }
  if (candidates.length === 1) {
    return { status: 'matched', confidence: 'medium', reason: 'Matched nearby headings with selected text evidence.', strategy: 'heading-text', element: candidates[0], candidates }
  }
  return undefined
}

/**
 * Match saved evidence back to the current DOM.
 *
 * The order is explicit feedback id, element id, selector plus text, role/label/
 * text, then heading plus text. Ambiguous evidence is returned as ambiguous;
 * this function never chooses one weak candidate silently.
 */
export function matchTargetMetadata(metadata: TargetMetadata, root?: DomRoot): TargetMatchResult {
  const resolvedRoot = root || (typeof document !== 'undefined' ? document : undefined)
  if (!resolvedRoot) {
    return { status: 'missing', confidence: 'none', reason: 'No DOM is available in this environment.', strategy: 'none', candidates: [] }
  }

  const stable = matchByStableId(metadata, resolvedRoot)
  if (stable) return stable
  const selector = matchBySelector(metadata, resolvedRoot)
  if (selector) return selector
  const roleLabelText = matchByRoleLabelText(metadata, resolvedRoot)
  if (roleLabelText) return roleLabelText
  const headingText = matchByHeadingText(metadata, resolvedRoot)
  if (headingText) return headingText

  return {
    status: 'missing',
    confidence: 'none',
    reason: 'No unique DOM element matched the saved target evidence.',
    strategy: 'none',
    candidates: [],
  }
}

/** Alias for callers that prefer the shorter matching name. */
export const matchTarget = matchTargetMetadata
