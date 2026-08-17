"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type RefObject,
} from "react";
import {
  AnnotationLayer,
  resolveAnnotationTarget,
  type AnnotationResolution,
  type AnnotationStatus,
  type DevFeedbackAnnotation,
} from "./annotation-layer";
import styles from "./annotation-manager.module.css";

export type AnnotationReviewListProps = {
  open: DevFeedbackAnnotation[];
  unresolved: DevFeedbackAnnotation[];
  completed: DevFeedbackAnnotation[];
  onLocate?: (annotation: DevFeedbackAnnotation) => void;
  onReopen?: (annotation: DevFeedbackAnnotation) => void | Promise<void>;
};

export type AnnotationManagerProps = {
  route: string;
  rootRef?: RefObject<HTMLElement | null>;
  initialAnnotations?: DevFeedbackAnnotation[];
  apiBasePath?: string;
  className?: string;
  onAnnotationsChange?: (annotations: DevFeedbackAnnotation[]) => void;
  showReviewList?: boolean;
};

function normalizeAnnotation(value: Partial<DevFeedbackAnnotation> & { id: string | number }): DevFeedbackAnnotation {
  const raw = value as Partial<DevFeedbackAnnotation> & Record<string, unknown>;
  const status: AnnotationStatus =
    raw.status === "completed" || Boolean(raw.completedAt) ? "completed" : "open";
  const resolution =
    raw.resolution === "missing" || raw.matchStatus === "missing"
      ? "missing"
      : raw.resolution === "ambiguous" || raw.matchStatus === "ambiguous"
        ? "ambiguous"
        : raw.resolution === "matched" || raw.matchStatus === "matched"
          ? "matched"
          : undefined;

  return {
    ...value,
    id: String(value.id),
    question: String(raw.question ?? raw.comment ?? raw.prompt ?? raw.note ?? "Annotation"),
    answer: typeof raw.answer === "string" ? raw.answer : "",
    status,
    resolution,
    matchStatus: resolution,
  };
}

function readAnnotations(payload: unknown): DevFeedbackAnnotation[] {
  if (payload && typeof payload === "object" && !Array.isArray(payload) && "record" in payload) {
    return readAnnotations((payload as { record?: unknown }).record);
  }

  const values = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { annotations?: unknown }).annotations)
      ? (payload as { annotations: unknown[] }).annotations
      : [];

  return values.filter((value): value is Partial<DevFeedbackAnnotation> & { id: string | number } => {
    return Boolean(value && typeof value === "object" && "id" in value);
  }).map(normalizeAnnotation);
}

function isUnresolved(annotation: DevFeedbackAnnotation, resolutions: Record<string, AnnotationResolution>) {
  const resolution = resolutions[annotation.id] ?? annotation.resolution ?? annotation.matchStatus;
  return resolution === "missing" || resolution === "ambiguous";
}

export function AnnotationReviewList({
  open,
  unresolved,
  completed,
  onLocate,
  onReopen,
}: AnnotationReviewListProps) {
  const renderSection = (
    title: string,
    items: DevFeedbackAnnotation[],
    action?: (annotation: DevFeedbackAnnotation) => void,
    actionLabel?: string,
  ) => (
    <section className={styles.section} aria-labelledby={`annotation-list-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <h3 className={styles.sectionTitle} id={`annotation-list-${title.replace(/\s+/g, "-").toLowerCase()}`}>
        {title} <span className={styles.count}>({items.length})</span>
      </h3>
      {items.length ? (
        <ul className={styles.list}>
          {items.map((annotation) => (
            <li className={styles.item} key={annotation.id}>
              <span className={styles.itemCopy}>
                <span className={styles.itemQuestion} title={annotation.question}>{annotation.question}</span>
                <span className={styles.itemMeta}>
                  #{annotation.id}
                  {title === "Unresolved" ? " · target needs review" : ""}
                </span>
              </span>
              {action ? (
                <button className={styles.itemAction} type="button" onClick={() => action(annotation)}>
                  {actionLabel}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>None.</p>
      )}
    </section>
  );

  return (
    <div className={styles.list} aria-label="Annotation review list">
      {renderSection("Current page", open, onLocate, "Locate")}
      {renderSection("Unresolved", unresolved)}
      {renderSection("Completed", completed, onReopen, "Reopen")}
    </div>
  );
}

export function AnnotationManager({
  route,
  rootRef,
  initialAnnotations,
  apiBasePath = "/api/dev-feedback/annotations",
  className,
  onAnnotationsChange,
  showReviewList = true,
}: AnnotationManagerProps) {
  const [annotations, setAnnotations] = useState<DevFeedbackAnnotation[]>(
    () => initialAnnotations?.map(normalizeAnnotation) ?? [],
  );
  const [resolutions, setResolutions] = useState<Record<string, AnnotationResolution>>(() =>
    Object.fromEntries(
      (initialAnnotations ?? []).map((annotation) => [
        String(annotation.id),
        annotation.resolution ?? annotation.matchStatus,
      ]).filter((entry): entry is [string, AnnotationResolution] => Boolean(entry[1])),
    ),
  );
  const [loading, setLoading] = useState(!initialAnnotations);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);

  const replaceAnnotations = useCallback((next: DevFeedbackAnnotation[]) => {
    setAnnotations(next);
    onAnnotationsChange?.(next);
  }, [onAnnotationsChange]);

  const loadAnnotations = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ scope: "current", route });
      const response = await fetch(`${apiBasePath}?${params.toString()}`, {
        signal,
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Could not load annotations (${response.status}).`);
      replaceAnnotations(readAnnotations(await response.json()));
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setError(reason instanceof Error ? reason.message : "Could not load annotations.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [apiBasePath, replaceAnnotations, route]);

  useEffect(() => {
    if (initialAnnotations) return;
    const controller = new AbortController();
    void loadAnnotations(controller.signal);
    return () => controller.abort();
  }, [initialAnnotations, loadAnnotations]);

  const updateResolution = useCallback((id: string, resolution: AnnotationResolution) => {
    setResolutions((current) => current[id] === resolution ? current : { ...current, [id]: resolution });
  }, []);

  const withPending = useCallback(async (id: string, task: () => Promise<void>) => {
    setPendingIds((current) => new Set(current).add(id));
    setError(null);
    try {
      await task();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update annotation.");
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }, []);

  const post = useCallback(async (id: string, action: "answer" | "complete" | "reopen", body?: Record<string, unknown>) => {
    const response = await fetch(`${apiBasePath}/${encodeURIComponent(id)}/${action}`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body ?? {}),
    });
    if (!response.ok) throw new Error(`Could not ${action} annotation (${response.status}).`);
    return response;
  }, [apiBasePath]);

  const saveAnswer = useCallback((annotation: DevFeedbackAnnotation, answer: string) => {
    return withPending(annotation.id, async () => {
      await post(annotation.id, "answer", { answer });
      replaceAnnotations(annotations.map((item) => item.id === annotation.id ? { ...item, answer } : item));
    });
  }, [annotations, post, replaceAnnotations, withPending]);

  const complete = useCallback((annotation: DevFeedbackAnnotation, answer: string) => {
    return withPending(annotation.id, async () => {
      const current = annotations.find((item) => item.id === annotation.id);
      if ((current?.answer ?? "") !== answer) await post(annotation.id, "answer", { answer });
      await post(annotation.id, "complete");
      replaceAnnotations(annotations.map((item) => item.id === annotation.id
        ? { ...item, answer, status: "completed", completedAt: new Date().toISOString() }
        : item));
    });
  }, [annotations, post, replaceAnnotations, withPending]);

  const reopen = useCallback((annotation: DevFeedbackAnnotation) => {
    return withPending(annotation.id, async () => {
      await post(annotation.id, "reopen");
      replaceAnnotations(annotations.map((item) => item.id === annotation.id
        ? { ...item, status: "open", completedAt: null }
        : item));
    });
  }, [annotations, post, replaceAnnotations, withPending]);

  const open = useMemo(
    () => annotations.filter((annotation) => annotation.status !== "completed" && !isUnresolved(annotation, resolutions)),
    [annotations, resolutions],
  );
  const unresolved = useMemo(() => annotations.filter((annotation) => isUnresolved(annotation, resolutions)), [annotations, resolutions]);
  const completed = useMemo(
    () => annotations.filter((annotation) => annotation.status === "completed" && !isUnresolved(annotation, resolutions)),
    [annotations, resolutions],
  );

  const locate = useCallback((annotation: DevFeedbackAnnotation) => {
    setActiveAnnotationId(annotation.id);
    const target = resolveAnnotationTarget(annotation, rootRef?.current ?? document).element;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [rootRef]);

  return (
    <div className={[styles.manager, className].filter(Boolean).join(" ")} data-dev-feedback-ignore="true">
      {showReviewList ? (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>Page annotations</h2>
            <span className={styles.count}>{loading ? "Loading…" : `${annotations.length} total`}</span>
          </div>
          {error ? (
            <div>
              <p className={styles.error} role="alert">{error}</p>
              <button className={styles.retry} type="button" onClick={() => void loadAnnotations()}>Retry</button>
            </div>
          ) : null}
          <AnnotationReviewList open={open} unresolved={unresolved} completed={completed} onLocate={locate} onReopen={reopen} />
        </>
      ) : null}
      <AnnotationLayer
        annotations={annotations}
        rootRef={rootRef}
        activeAnnotationId={activeAnnotationId}
        pendingAnnotationIds={pendingIds}
        onResolutionChange={updateResolution}
        onLocate={locate}
        onSaveAnswer={saveAnswer}
        onComplete={complete}
      />
    </div>
  );
}
