"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { matchTargetMetadata, type TargetMetadata } from "./targeting";
import styles from "./annotation-layer.module.css";

export type AnnotationStatus = "open" | "completed";
export type AnnotationResolution = "matched" | "missing" | "ambiguous";

export type AnnotationTarget = Partial<TargetMetadata> & { key?: string };

export type DevFeedbackAnnotation = {
  id: string;
  question: string;
  note?: string;
  answer?: string | null;
  status?: AnnotationStatus;
  route?: string;
  resolution?: AnnotationResolution;
  matchStatus?: AnnotationResolution;
  selector?: string;
  targetSelector?: string;
  targetId?: string;
  targetText?: string;
  target?: AnnotationTarget | string | null;
  context?: { target?: AnnotationTarget | string | null };
  createdAt?: string;
  completedAt?: string | null;
};

type ResolvedAnnotation = {
  annotation: DevFeedbackAnnotation;
  element: Element;
  rect: DOMRect;
};

export type AnnotationLayerProps = {
  annotations: DevFeedbackAnnotation[];
  rootRef?: RefObject<HTMLElement | null>;
  activeAnnotationId?: string | null;
  pendingAnnotationIds?: ReadonlySet<string>;
  onResolutionChange?: (id: string, resolution: AnnotationResolution) => void;
  onLocate?: (annotation: DevFeedbackAnnotation) => void;
  onSaveAnswer?: (annotation: DevFeedbackAnnotation, answer: string) => void | Promise<void>;
  onComplete?: (annotation: DevFeedbackAnnotation, answer: string) => void | Promise<void>;
};

function getTargetMetadata(annotation: DevFeedbackAnnotation): TargetMetadata {
  const target = annotation.target ?? annotation.context?.target;
  const targetObject: AnnotationTarget = typeof target === "object" && target ? target : {};
  const targetRecord = targetObject as AnnotationTarget & { ariaLabel?: string; tagName?: string };
  const tag = targetObject.tag ?? targetRecord.tagName?.toLowerCase();

  return {
    ...targetObject,
    selector: annotation.selector ?? annotation.targetSelector ?? (typeof target === "string" ? target : targetObject.selector),
    id: annotation.targetId ?? targetObject.id ?? targetObject.key,
    tag,
    accessibleLabel: targetObject.accessibleLabel ?? targetRecord.ariaLabel,
    text: annotation.targetText ?? targetObject.text,
    headingPath: targetObject.headingPath ?? [],
  };
}

export function resolveAnnotationTarget(
  annotation: DevFeedbackAnnotation,
  root?: HTMLElement | Document,
): { element?: Element; resolution: AnnotationResolution } {
  const metadata = getTargetMetadata(annotation);
  if (!metadata.selector && !metadata.id && metadata.text && metadata.tag) {
    metadata.selector = metadata.tag;
  }
  const result = matchTargetMetadata(metadata, root);
  return { element: result.element, resolution: result.status };
}

function isOpen(annotation: DevFeedbackAnnotation) {
  return annotation.status !== "completed" && !annotation.completedAt;
}

function rectToStyle(rect: DOMRect, index: number): CSSProperties {
  const top = Math.max(10, Math.min(rect.top + index * 8, window.innerHeight - 120));
  const left = Math.min(rect.right + 18, window.innerWidth - 350);

  return {
    top: `${top}px`,
    left: `${Math.max(10, left)}px`,
  };
}

export function AnnotationLayer({
  annotations,
  rootRef,
  activeAnnotationId,
  pendingAnnotationIds,
  onResolutionChange,
  onLocate,
  onSaveAnswer,
  onComplete,
}: AnnotationLayerProps) {
  const [resolved, setResolved] = useState<ResolvedAnnotation[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const openAnnotations = useMemo(() => annotations.filter(isOpen), [annotations]);

  const measure = useCallback(() => {
    const root = rootRef?.current ?? document.body;
    const next: ResolvedAnnotation[] = [];

    for (const annotation of openAnnotations) {
      const match = resolveAnnotationTarget(annotation, root);
      onResolutionChange?.(annotation.id, match.resolution);
      if (match.element) {
        next.push({
          annotation,
          element: match.element,
          rect: match.element.getBoundingClientRect(),
        });
      }
    }

    setResolved(next);
  }, [onResolutionChange, openAnnotations, rootRef]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [measure]);

  useEffect(() => {
    setDrafts((current) => {
      const next = { ...current };
      for (const annotation of openAnnotations) {
        if (!(annotation.id in next)) next[annotation.id] = annotation.answer ?? "";
      }
      return next;
    });
  }, [openAnnotations]);

  const locate = (resolvedAnnotation: ResolvedAnnotation) => {
    resolvedAnnotation.element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    onLocate?.(resolvedAnnotation.annotation);
  };

  return (
    <div className={styles.layer} data-dev-feedback-ignore="true" aria-label="Open page annotations">
      {resolved.map(({ annotation, element, rect }, index) => {
        const answer = drafts[annotation.id] ?? annotation.answer ?? "";
        const pending = pendingAnnotationIds?.has(annotation.id) ?? false;
        const active = activeAnnotationId === annotation.id;

        return (
          <div key={annotation.id}>
            <div
              className={styles.targetOutline}
              data-active={active}
              aria-hidden="true"
              style={{
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
              }}
            />
            <section
              className={styles.callout}
              data-active={active}
              aria-labelledby={`annotation-question-${annotation.id}`}
              style={rectToStyle(rect, index)}
            >
              <div className={styles.calloutHeader}>
                <p className={styles.calloutLabel}>Open annotation</p>
                <span className={styles.calloutMeta}>#{annotation.id}</span>
              </div>
              <p className={styles.calloutQuestion} id={`annotation-question-${annotation.id}`}>
                {annotation.question}
              </p>
              <label className={styles.answerLabel} htmlFor={`annotation-answer-${annotation.id}`}>
                Answer
                <textarea
                  className={styles.answer}
                  id={`annotation-answer-${annotation.id}`}
                  value={answer}
                  onChange={(event) =>
                    setDrafts((current) => ({ ...current, [annotation.id]: event.target.value }))
                  }
                />
              </label>
              <div className={styles.actions}>
                <button className={styles.action} type="button" onClick={() => locate({ annotation, element, rect })}>
                  Locate
                </button>
                <button
                  className={styles.action}
                  type="button"
                  disabled={pending}
                  onClick={() => onSaveAnswer?.(annotation, answer)}
                >
                  Save answer
                </button>
                <button
                  className={`${styles.action} ${styles.primaryAction}`}
                  type="button"
                  disabled={pending}
                  onClick={() => onComplete?.(annotation, answer)}
                >
                  Complete
                </button>
              </div>
              {pending ? <span className={styles.status} role="status">Saving annotation…</span> : null}
            </section>
          </div>
        );
      })}
    </div>
  );
}
