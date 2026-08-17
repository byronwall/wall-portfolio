"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./dev-feedback-overlay.module.css";
import { AnnotationManager } from "./annotation-manager";
import {
  captureTargetMetadata,
  captureTextSelection,
  type TargetMetadata,
  type TextSelectionMetadata,
} from "./targeting";

type DevFeedbackSelection = TextSelectionMetadata;
type DevFeedbackTarget = TargetMetadata;

type DevFeedbackContext = {
  route: string;
  title: string;
  viewport: {
    width: number;
    height: number;
  };
  scroll: {
    x: number;
    y: number;
  };
  selection?: DevFeedbackSelection;
  target?: DevFeedbackTarget;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

const OVERLAY_SELECTOR = "[data-dev-feedback-overlay]";

function isOverlayElement(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(OVERLAY_SELECTOR));
}

function getElementFromTarget(target: EventTarget | null): Element | null {
  if (!(target instanceof Element) || isOverlayElement(target)) {
    return null;
  }

  if (target === document.documentElement || target === document.body) {
    return null;
  }

  return target;
}

function getSelectionContext(): { selection?: DevFeedbackSelection; target?: DevFeedbackTarget } {
  if (typeof window === "undefined") {
    return {};
  }

  const browserSelection = window.getSelection();
  const capturedSelection = captureTextSelection(document, browserSelection);
  if (!capturedSelection) {
    return {};
  }

  let implicitTarget: DevFeedbackTarget | undefined;
  if (browserSelection?.rangeCount) {
    try {
      const commonAncestor = browserSelection.getRangeAt(0).commonAncestorContainer;
      const container = commonAncestor instanceof Element ? commonAncestor : commonAncestor.parentElement;
      if (container) {
        implicitTarget = captureTargetMetadata(container, { includeSelection: false });
      }
    } catch {
      implicitTarget = undefined;
    }
  }

  return { selection: capturedSelection, target: implicitTarget };
}

function formatTarget(target: DevFeedbackTarget): string {
  const identity = target.id ? `#${target.id}` : target.selector || target.tag || "element";
  const role = target.role ? `[role=${target.role}]` : "";
  return `${identity}${role}`;
}

function getErrorMessage(value: unknown): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  for (const key of ["error", "message", "detail"]) {
    if (typeof record[key] === "string" && record[key]) {
      return record[key] as string;
    }
  }

  return undefined;
}

function getResponseError(value: unknown): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  for (const key of ["error", "detail"]) {
    if (typeof record[key] === "string" && record[key]) {
      return record[key] as string;
    }
  }

  return undefined;
}

export function DevFeedbackOverlay() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [note, setNote] = useState("");
  const [selection, setSelection] = useState<DevFeedbackSelection>();
  const [target, setTarget] = useState<DevFeedbackTarget>();
  const [targetSource, setTargetSource] = useState<"selection" | "explicit">();
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hoveredElementRef = useRef<HTMLElement | SVGElement | null>(null);
  const previousHoverStyleRef = useRef<{
    outline: string;
    outlineOffset: string;
  } | null>(null);
  const latestSelectionRef = useRef<{ selection?: DevFeedbackSelection; target?: DevFeedbackTarget } | undefined>(undefined);
  const activationSelectionRef = useRef<{ selection?: DevFeedbackSelection; target?: DevFeedbackTarget } | undefined>(undefined);

  const clearHoverOutline = useCallback(() => {
    const element = hoveredElementRef.current;
    const previousStyle = previousHoverStyleRef.current;

    if (element && previousStyle) {
      element.style.outline = previousStyle.outline;
      element.style.outlineOffset = previousStyle.outlineOffset;
    }

    hoveredElementRef.current = null;
    previousHoverStyleRef.current = null;
  }, []);

  const highlightElement = useCallback(
    (element: Element | null) => {
      if (!element || isOverlayElement(element)) {
        clearHoverOutline();
        return;
      }

      if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
        clearHoverOutline();
        return;
      }

      if (hoveredElementRef.current === element) {
        return;
      }

      clearHoverOutline();
      hoveredElementRef.current = element;
      previousHoverStyleRef.current = {
        outline: element.style.outline,
        outlineOffset: element.style.outlineOffset,
      };
      element.style.outline = "2px solid #2f536c";
      element.style.outlineOffset = "2px";
    },
    [clearHoverOutline]
  );

  const cancelPicking = useCallback(() => {
    clearHoverOutline();
    setIsPicking(false);
    setStatusMessage("");
  }, [clearHoverOutline]);

  const captureActivationSelection = useCallback(() => {
    if (activationSelectionRef.current?.selection || activationSelectionRef.current?.target) {
      return activationSelectionRef.current;
    }

    const captured = getSelectionContext();
    const buffered = captured.selection || captured.target ? captured : latestSelectionRef.current ?? captured;
    activationSelectionRef.current = buffered;
    return buffered;
  }, []);

  useEffect(() => {
    const rememberPageSelection = () => {
      const selectedText = window.getSelection()?.toString();
      if (!selectedText) {
        return;
      }

      const captured = getSelectionContext();
      latestSelectionRef.current = captured.selection || captured.target ? captured : undefined;
    };

    document.addEventListener("selectionchange", rememberPageSelection);
    return () => document.removeEventListener("selectionchange", rememberPageSelection);
  }, []);

  const openPanel = useCallback(() => {
    const captured = activationSelectionRef.current ?? captureActivationSelection();
    activationSelectionRef.current = undefined;
    latestSelectionRef.current = undefined;

    if (captured?.selection) {
      setSelection(captured.selection);
    }
    if (captured?.target) {
      setTarget(captured.target);
      setTargetSource("selection");
    }

    setIsOpen(true);
    setIsPicking(false);
    setSubmissionState("idle");
    setStatusMessage("");
  }, [captureActivationSelection]);

  const closePanel = useCallback(() => {
    const currentSelection = getSelectionContext();
    activationSelectionRef.current = undefined;

    if (currentSelection.selection) {
      setSelection(currentSelection.selection);
      latestSelectionRef.current = currentSelection;
      if (targetSource === "selection") {
        setTarget(currentSelection.target);
        setTargetSource(currentSelection.target ? "selection" : undefined);
      }
    } else {
      setSelection(undefined);
      latestSelectionRef.current = undefined;
      if (targetSource === "selection") {
        setTarget(undefined);
        setTargetSource(undefined);
      }
    }

    cancelPicking();
    setIsOpen(false);
    setStatusMessage("");
  }, [cancelPicking, targetSource]);

  const handleTogglePressStart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | React.PointerEvent<HTMLButtonElement>) => {
      if (!isOpen) {
        captureActivationSelection();
        event.preventDefault();
      }
    },
    [captureActivationSelection, isOpen]
  );

  const handleToggleFocus = useCallback(() => {
    if (!isOpen) {
      captureActivationSelection();
    }
  }, [captureActivationSelection, isOpen]);

  const handleToggleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!isOpen && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        captureActivationSelection();
        openPanel();
      }
    },
    [captureActivationSelection, isOpen, openPanel]
  );

  useEffect(() => {
    const handleNativePressStart = (event: PointerEvent | MouseEvent) => {
      if (isOpen || !(event.target instanceof Element)) {
        return;
      }

      const trigger = event.target.closest("[data-dev-feedback-trigger]");
      if (trigger !== triggerRef.current) {
        return;
      }

      captureActivationSelection();
      event.preventDefault();
    };

    document.addEventListener("pointerdown", handleNativePressStart, true);
    document.addEventListener("mousedown", handleNativePressStart, true);
    return () => {
      document.removeEventListener("pointerdown", handleNativePressStart, true);
      document.removeEventListener("mousedown", handleNativePressStart, true);
    };
  }, [captureActivationSelection, isOpen]);

  const handleToggleClick = useCallback(() => {
    if (isOpen) {
      closePanel();
      return;
    }

    openPanel();
  }, [closePanel, isOpen, openPanel]);

  const selectElement = useCallback(
    (element: Element) => {
      const capturedTarget = captureTargetMetadata(element, { includeSelection: false });
      if (capturedTarget) {
        setTarget(capturedTarget);
        setTargetSource("explicit");
      }
      cancelPicking();
      setStatusMessage("Element attached to this note.");
    },
    [cancelPicking]
  );

  useEffect(() => {
    if (isOpen && !isPicking) {
      textareaRef.current?.focus();
    }
  }, [isOpen, isPicking]);

  useEffect(() => {
    if (!isPicking) {
      clearHoverOutline();
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (isOverlayElement(event.target)) {
        clearHoverOutline();
        return;
      }

      highlightElement(getElementFromTarget(event.target));
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || isOverlayElement(event.target)) {
        return;
      }

      const element = getElementFromTarget(event.target);
      if (!element) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      selectElement(element);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelPicking();
        textareaRef.current?.focus();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, true);
    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      clearHoverOutline();
    };
  }, [cancelPicking, clearHoverOutline, highlightElement, isPicking, selectElement]);

  useEffect(() => {
    if (!isOpen || isPicking) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePanel, isOpen, isPicking]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedNote = note.trim();

    if (!trimmedNote) {
      setSubmissionState("error");
      setStatusMessage("Add a short note before sending.");
      textareaRef.current?.focus();
      return;
    }

    const context: DevFeedbackContext = {
      route: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      title: document.title,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
      },
      selection,
      target,
    };

    setSubmissionState("submitting");
    setStatusMessage("Sending note…");

    try {
      const response = await fetch("/api/dev-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmedNote, context }),
      });
      const responseText = await response.text();
      let responseData: unknown;

      try {
        responseData = responseText ? JSON.parse(responseText) : undefined;
      } catch {
        responseData = undefined;
      }

      const responseRecord =
        responseData && typeof responseData === "object" && !Array.isArray(responseData)
          ? (responseData as Record<string, unknown>)
          : undefined;
      const explicitError = getResponseError(responseData);
      const explicitFailure =
        responseRecord?.success === false || responseRecord?.ok === false;

      if (!response.ok || explicitFailure || explicitError) {
        throw new Error(
          explicitError || getErrorMessage(responseData) || responseText || "The note could not be sent."
        );
      }

      setNote("");
      setSelection(undefined);
      setTarget(undefined);
      setTargetSource(undefined);
      setSubmissionState("success");
      setStatusMessage("Note saved. Thanks for the signal.");
    } catch (error) {
      setSubmissionState("error");
      setStatusMessage(
        error instanceof Error ? error.message : "The note could not be sent. Your draft is safe."
      );
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const statusClassName =
    submissionState === "error"
      ? `${styles.status} ${styles.statusError}`
      : submissionState === "success"
        ? `${styles.status} ${styles.statusSuccess}`
        : styles.status;

  return (
    <div className={styles.overlay} data-dev-feedback-ignore data-dev-feedback-overlay>
      {pathname ? (
        <AnnotationManager
          className={styles.annotationManager}
          route={pathname}
          showReviewList={false}
        />
      ) : null}
      {isOpen ? (
        <section className={styles.panel} aria-labelledby="dev-feedback-title" role="dialog">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>Development capture</p>
              <h2 className={styles.title} id="dev-feedback-title">
                Leave a note
              </h2>
            </div>
            <button
              aria-label="Close feedback capture"
              className={styles.closeButton}
              onClick={closePanel}
              type="button"
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
              </svg>
            </button>
          </div>

          <p className={styles.contextNote}>Route, viewport, scroll, and page title attach automatically.</p>

          <a
            className={styles.reviewLink}
            href="/dev/feedback"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                window.location.assign("/dev/feedback");
              }
            }}
          >
            Review saved notes
          </a>

          {selection || target ? (
            <div className={styles.contextStack} aria-label="Captured page context">
              {selection ? (
                <div className={styles.contextChip}>
                  <span className={styles.contextChipLabel}>Selected</span>
                  <span className={styles.contextChipText} title={selection.text}>
                    {selection.text}
                  </span>
                  <button
                    aria-label="Remove selected text context"
                    className={styles.removeButton}
                    onClick={() => {
                      setSelection(undefined);
                      latestSelectionRef.current = undefined;
                      activationSelectionRef.current = undefined;
                      if (targetSource === "selection") {
                        setTarget(undefined);
                        setTargetSource(undefined);
                      }
                    }}
                    type="button"
                  >
                    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
                      <path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
                    </svg>
                  </button>
                </div>
              ) : null}
              {target ? (
                <div className={styles.targetChip}>
                  <span className={styles.contextChipLabel}>Target</span>
                  <span className={styles.targetChipText} title={target.text || formatTarget(target)}>
                    {formatTarget(target)}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}

          {isPicking ? (
            <div className={styles.pickerStatus} role="status">
              <span className={styles.pickerStatusText}>Move over the page, then click an element.</span>
              <button className={styles.pickerCancel} onClick={cancelPicking} type="button">
                Cancel
              </button>
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <label className={styles.fieldLabel} htmlFor="dev-feedback-note">
              Note
            </label>
            <textarea
              aria-describedby="dev-feedback-status"
              autoComplete="off"
              className={styles.textarea}
              disabled={submissionState === "submitting"}
              id="dev-feedback-note"
              onChange={(event) => setNote(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="What should change, break, or stand out?"
              ref={textareaRef}
              rows={4}
              value={note}
            />
            <div className={styles.formFooter}>
              <span className={styles.shortcut}>
                <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd>
              </span>
              <div className={styles.actions}>
                <button
                  className={styles.secondaryButton}
                  disabled={submissionState === "submitting"}
                  onClick={() => {
                    setIsPicking(true);
                    setSubmissionState("idle");
                    setStatusMessage("");
                  }}
                  type="button"
                >
                  Pick element
                </button>
                <button className={styles.primaryButton} disabled={submissionState === "submitting"} type="submit">
                  {submissionState === "submitting" ? "Sending…" : "Send note"}
                </button>
              </div>
            </div>
          </form>

          <p aria-live="polite" className={statusClassName} id="dev-feedback-status">
            {statusMessage}
          </p>
        </section>
      ) : null}

      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close feedback capture" : "Open feedback capture"}
        className={styles.trigger}
        data-dev-feedback-trigger
        onClick={handleToggleClick}
        onFocusCapture={handleToggleFocus}
        onKeyDown={handleToggleKeyDown}
        onMouseDownCapture={handleTogglePressStart}
        onPointerDownCapture={handleTogglePressStart}
        ref={triggerRef}
        title="Leave development feedback"
        type="button"
      >
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <rect height="11" rx="4" stroke="currentColor" strokeWidth="1.8" width="7" x="8.5" y="3" />
          <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      </button>
    </div>
  );
}
