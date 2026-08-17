"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./feedback.module.css";

type RecordKind = "note" | "annotation";
type RecordStatus =
  | "inbox"
  | "processing"
  | "completed"
  | "failed"
  | "open"
  | "unresolved"
  | "resolved"
  | "unknown";
type TypeFilter = "all" | RecordKind;
type StateFilter = "all" | Exclude<RecordStatus, "unknown">;

type FeedbackRecord = {
  id: string;
  kind: RecordKind;
  title: string;
  body: string;
  route?: string;
  href?: string;
  status: RecordStatus;
  statusLabel: string;
  createdAt?: string;
  updatedAt?: string;
  answer?: string;
  raw: Record<string, unknown>;
};

type QueueCounts = Record<Exclude<RecordStatus, "unknown">, number>;

const API_ROOT = "/api/dev-feedback";
const queueStatuses: Array<Exclude<RecordStatus, "unknown">> = [
  "inbox",
  "processing",
  "completed",
  "failed",
];
const annotationStatuses: Array<Exclude<RecordStatus, "unknown">> = [
  "open",
  "unresolved",
  "resolved",
];

const emptyCounts: QueueCounts = {
  inbox: 0,
  processing: 0,
  completed: 0,
  failed: 0,
  open: 0,
  unresolved: 0,
  resolved: 0,
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" || typeof value === "boolean") return String(value);
  }
  return undefined;
}

function booleanValue(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function firstArray(value: unknown, keys: string[]): unknown[] {
  if (Array.isArray(value)) return value;
  if (!isObject(value)) return [];

  for (const key of keys) {
    const candidate = value[key];
    if (Array.isArray(candidate)) return candidate;
  }

  for (const key of ["data", "result", "payload"]) {
    if (isObject(value[key])) {
      const nested = firstArray(value[key], keys);
      if (nested.length) return nested;
    }
  }

  return [];
}

function normalizeStatus(value: unknown, record: Record<string, unknown>): RecordStatus {
  if (booleanValue(record.resolved) || booleanValue(record.isResolved)) return "resolved";
  if (booleanValue(record.completed) || booleanValue(record.isComplete)) return "completed";

  const normalized = stringValue(value)?.toLowerCase().replace(/[_-]+/g, " ");
  if (!normalized) return "unknown";
  if (["inbox", "new", "pending", "queued"].includes(normalized)) return "inbox";
  if (["processing", "in progress", "working"].includes(normalized)) return "processing";
  if (["completed", "complete", "done", "closed"].includes(normalized)) return "completed";
  if (["failed", "error"].includes(normalized)) return "failed";
  if (["open", "active"].includes(normalized)) return "open";
  if (["unresolved", "unanswered"].includes(normalized)) return "unresolved";
  if (["resolved", "reopened"].includes(normalized)) return normalized === "reopened" ? "open" : "resolved";
  return "unknown";
}

function statusLabel(status: RecordStatus, rawStatus?: string): string {
  if (status !== "unknown") return status[0].toUpperCase() + status.slice(1);
  return rawStatus || "Unclassified";
}

function routeValue(record: Record<string, unknown>): string | undefined {
  const route = record.route || record.pathname || record.path || record.location;
  if (isObject(route)) return stringValue(route.href, route.pathname, route.path, route.url);
  return stringValue(route, record.url, record.href, record.page);
}

function normalizeRecord(value: unknown, fallbackKind: RecordKind, index: number): FeedbackRecord | null {
  if (!isObject(value)) return null;

  const explicitKind = stringValue(value.kind, value.type, value.category)?.toLowerCase();
  const kind: RecordKind = explicitKind?.includes("annot") || value.annotationId ? "annotation" : fallbackKind;
  const id = stringValue(value.id, value.annotationId, value.noteId, value.key) || `${kind}-${index}`;
  const route = routeValue(value);
  const rawStatus = stringValue(value.status, value.state, value.lifecycle);
  const status = normalizeStatus(rawStatus, value);
  const nestedAnswers = Array.isArray(value.answers) ? value.answers : [];
  const latestAnswer = isObject(nestedAnswers[0]) ? nestedAnswers[0] : undefined;

  return {
    id,
    kind,
    title:
      stringValue(value.title, value.label, value.subject) ||
      (kind === "annotation" ? "Page annotation" : "Feedback note"),
    body:
      stringValue(value.body, value.message, value.text, value.content, value.note, value.description) ||
      "No description was provided.",
    route,
    href: route,
    status,
    statusLabel: statusLabel(status, rawStatus),
    createdAt: stringValue(value.createdAt, value.created_at, value.timestamp, value.date),
    updatedAt: stringValue(value.updatedAt, value.updated_at),
    answer: stringValue(value.answer, value.response, value.reply, latestAnswer?.answer, latestAnswer?.text, latestAnswer?.content),
    raw: value,
  };
}

function normalizeRecords(values: unknown[], fallbackKind: RecordKind): FeedbackRecord[] {
  return values
    .map((value, index) => normalizeRecord(value, fallbackKind, index))
    .filter((record): record is FeedbackRecord => Boolean(record));
}

function findNumber(value: unknown, aliases: string[], depth = 0): number | undefined {
  if (depth > 4 || !isObject(value)) return undefined;
  const matchingKey = Object.keys(value).find((key) => aliases.includes(key.toLowerCase()));
  const matchingValue = matchingKey ? value[matchingKey] : undefined;
  if (typeof matchingValue === "number") return matchingValue;

  for (const child of Object.values(value)) {
    const result = findNumber(child, aliases, depth + 1);
    if (result !== undefined) return result;
  }
  return undefined;
}

function countRecords(records: FeedbackRecord[]): QueueCounts {
  return records.reduce((counts, record) => {
    if (record.status !== "unknown") counts[record.status] += 1;
    return counts;
  }, { ...emptyCounts });
}

function getSummary(payload: unknown, records: FeedbackRecord[]): QueueCounts {
  const recordCounts = countRecords(records);
  const aliases: Record<Exclude<RecordStatus, "unknown">, string[]> = {
    inbox: ["inbox", "inboxcount", "queued", "queuedcount"],
    processing: ["processing", "processingcount", "inprogress", "inprogresscount"],
    completed: ["completed", "completedcount", "complete", "completecount", "done", "donecount"],
    failed: ["failed", "failedcount", "errors", "errorcount"],
    open: ["open", "opencount", "active", "activecount"],
    unresolved: ["unresolved", "unresolvedcount", "unanswered", "unansweredcount"],
    resolved: ["resolved", "resolvedcount", "closed", "closedcount"],
  };

  return (Object.keys(emptyCounts) as Array<Exclude<RecordStatus, "unknown">>).reduce((counts, status) => {
    const apiCount = findNumber(payload, aliases[status]);
    counts[status] = Math.max(recordCounts[status], apiCount || 0);
    return counts;
  }, { ...emptyCounts });
}

function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function isResolved(record: FeedbackRecord) {
  return record.status === "resolved" || record.status === "completed";
}

function matchesState(record: FeedbackRecord, filter: StateFilter) {
  if (filter === "all") return true;
  return record.status === filter;
}

function routeLabel(record: FeedbackRecord) {
  return record.route || "Route not recorded";
}

async function fetchJson(path: string): Promise<{ ok: true; payload: unknown } | { ok: false; error: string }> {
  try {
    const response = await fetch(path, { cache: "no-store" });
    const text = await response.text();
    let payload: unknown = {};
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { message: text };
      }
    }
    if (!response.ok) {
      const message = isObject(payload) ? stringValue(payload.message, payload.error) : undefined;
      return { ok: false, error: message || `${response.status} ${response.statusText}` };
    }
    return { ok: true, payload };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "The request failed." };
  }
}

export default function FeedbackManager() {
  const [records, setRecords] = useState<FeedbackRecord[]>([]);
  const [counts, setCounts] = useState<QueueCounts>(emptyCounts);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();
  const [partialError, setPartialError] = useState<string>();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [query, setQuery] = useState("");
  const [answerId, setAnswerId] = useState<string>();
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [actionId, setActionId] = useState<string>();
  const [actionError, setActionError] = useState<string>();
  const [actionErrorId, setActionErrorId] = useState<string>();

  const loadRecords = useCallback(async (isRefresh = false) => {
    setLoading(!isRefresh);
    setRefreshing(isRefresh);
    setError(undefined);
    setPartialError(undefined);

    const [notesResult, annotationsResult] = await Promise.all([
      fetchJson(API_ROOT),
      fetchJson(`${API_ROOT}/annotations?scope=all`),
    ]);

    const notes = notesResult.ok
      ? normalizeRecords(firstArray(notesResult.payload, ["notes", "feedback", "records", "items", "entries", "queue"]), "note")
      : [];
    const annotations = annotationsResult.ok
      ? normalizeRecords(firstArray(annotationsResult.payload, ["annotations", "records", "items", "entries"]), "annotation")
      : [];
    const nextRecords = [...notes, ...annotations];

    if (!notesResult.ok && !annotationsResult.ok) {
      setError(`Feedback could not be loaded. ${notesResult.error}`);
    } else {
      setRecords(nextRecords);
      setCounts(getSummary(notesResult.ok ? notesResult.payload : annotationsResult.ok ? annotationsResult.payload : {}, nextRecords));
      const errors = [
        !notesResult.ok ? `notes: ${notesResult.error}` : "",
        !annotationsResult.ok ? `annotations: ${annotationsResult.error}` : "",
      ].filter(Boolean);
      if (errors.length) setPartialError(`Some data could not be loaded — ${errors.join("; ")}`);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return records.filter((record) => {
      if (typeFilter !== "all" && record.kind !== typeFilter) return false;
      if (!matchesState(record, stateFilter)) return false;
      if (!normalizedQuery) return true;
      return [record.title, record.body, record.route, record.statusLabel].some((value) =>
        value?.toLowerCase().includes(normalizedQuery),
      );
    });
  }, [query, records, stateFilter, typeFilter]);

  const stateOptions = useMemo(() => {
    const available = new Set(records.map((record) => record.status));
    return [...queueStatuses, ...annotationStatuses].filter(
      (status, index, statuses) => statuses.indexOf(status) === index && available.has(status),
    );
  }, [records]);

  async function handleAnnotationAction(
    event: FormEvent<HTMLFormElement> | undefined,
    record: FeedbackRecord,
    action: "answer" | "complete" | "reopen",
  ) {
    event?.preventDefault();
    setActionId(record.id);
    setActionError(undefined);
    setActionErrorId(undefined);
    const body = action === "answer" ? JSON.stringify({ answer: answerDrafts[record.id]?.trim() || "" }) : undefined;
    try {
      const response = await fetch(`${API_ROOT}/annotations/${encodeURIComponent(record.id)}/${action}`, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body,
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `${response.status} ${response.statusText}`);
      }
      setAnswerId(undefined);
      setAnswerDrafts((drafts) => ({ ...drafts, [record.id]: "" }));
      await loadRecords(true);
    } catch (actionErrorValue) {
      setActionErrorId(record.id);
      setActionError(actionErrorValue instanceof Error ? actionErrorValue.message : "The annotation action failed.");
    } finally {
      setActionId(undefined);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Development workspace</p>
          <h1>Feedback manager</h1>
          <p className={styles.lede}>
            Triage notes and annotations from every route. Resolved records stay here so the review history remains intact.
          </p>
        </div>
        <button className={styles.refreshButton} type="button" onClick={() => void loadRecords(true)} disabled={loading || refreshing}>
          <span aria-hidden="true">↻</span> {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      {error ? (
        <section className={styles.errorState} role="alert">
          <strong>Could not reach the feedback API</strong>
          <p>{error}</p>
          <button type="button" onClick={() => void loadRecords(true)}>Try again</button>
        </section>
      ) : (
        <>
          <section className={styles.summary} aria-labelledby="feedback-summary-heading">
            <div className={styles.summaryHeading}>
              <h2 id="feedback-summary-heading">Queue overview</h2>
              <span>{records.length} loaded records</span>
            </div>
            <div className={styles.summaryGrid}>
              {[
                ...queueStatuses.map((status) => ({ status, label: status[0].toUpperCase() + status.slice(1) })),
                ...annotationStatuses.map((status) => ({ status, label: status[0].toUpperCase() + status.slice(1) })),
              ].map(({ status, label }) => (
                <button
                  className={`${styles.summaryItem}${stateFilter === status ? ` ${styles.summaryItemActive}` : ""}`}
                  key={status}
                  type="button"
                  onClick={() => setStateFilter(stateFilter === status ? "all" : status)}
                >
                  <strong>{counts[status]}</strong>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={styles.toolbar} aria-label="Feedback filters">
            <div className={styles.segmentedControl} role="group" aria-label="Record type">
              {(["all", "note", "annotation"] as TypeFilter[]).map((type) => (
                <button key={type} className={typeFilter === type ? styles.selected : ""} type="button" onClick={() => setTypeFilter(type)}>
                  {type === "all" ? "All records" : type === "note" ? "Notes" : "Annotations"}
                  <span>{type === "all" ? records.length : records.filter((record) => record.kind === type).length}</span>
                </button>
              ))}
            </div>
            <label className={styles.filterField}>
              <span>State</span>
              <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value as StateFilter)}>
                <option value="all">All states</option>
                {stateOptions.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
              </select>
            </label>
            <label className={styles.searchField}>
              <span>Search</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Route, note, or annotation" />
            </label>
          </section>

          {partialError && <p className={styles.partialError} role="status">{partialError}</p>}

          <section className={styles.records} aria-labelledby="feedback-records-heading">
            <div className={styles.recordsHeading}>
              <div>
                <p className={styles.kicker}>Review queue</p>
                <h2 id="feedback-records-heading">{loading ? "Loading records" : `${filteredRecords.length} ${filteredRecords.length === 1 ? "record" : "records"}`}</h2>
              </div>
              {!loading && (query || typeFilter !== "all" || stateFilter !== "all") && (
                <button className={styles.clearButton} type="button" onClick={() => { setQuery(""); setTypeFilter("all"); setStateFilter("all"); }}>
                  Clear filters
                </button>
              )}
            </div>

            {loading ? (
              <div className={styles.loadingList} aria-label="Loading feedback records">
                {[1, 2, 3].map((item) => <div className={styles.loadingRow} key={item}><span /><span /><span /></div>)}
              </div>
            ) : filteredRecords.length ? (
              <div className={styles.recordList}>
                {filteredRecords.map((record) => (
                  <article className={styles.recordRow} key={`${record.kind}-${record.id}`}>
                    <div className={styles.recordMeta}>
                      <span className={`${styles.kindTag} ${record.kind === "annotation" ? styles.annotationTag : ""}`}>
                        {record.kind === "annotation" ? "Annotation" : "Note"}
                      </span>
                      <span className={`${styles.statusTag} ${styles[`status-${record.status}`]}`}>{record.statusLabel}</span>
                      <span className={styles.recordDate}>{formatDate(record.updatedAt || record.createdAt) || "Date not recorded"}</span>
                    </div>
                    <div className={styles.recordContent}>
                      <h3>{record.title}</h3>
                      <p>{record.body}</p>
                      {record.answer && <div className={styles.answer}><span>Answer</span><p>{record.answer}</p></div>}
                    </div>
                    <div className={styles.recordActions}>
                      {record.href && (record.href.startsWith("/") || record.href.startsWith("http")) ? (
                        record.href.startsWith("/") ? <Link href={record.href} target="_blank" rel="noreferrer">Open route ↗</Link> : <a href={record.href} target="_blank" rel="noreferrer">Open route ↗</a>
                      ) : <span className={styles.route}>{routeLabel(record)}</span>}
                      {record.kind === "annotation" && (
                        <>
                          <button type="button" onClick={() => setAnswerId(answerId === record.id ? undefined : record.id)} disabled={actionId === record.id}>
                            {answerId === record.id ? "Close answer" : "Answer"}
                          </button>
                          <button type="button" onClick={() => void handleAnnotationAction(undefined, record, isResolved(record) ? "reopen" : "complete")} disabled={actionId === record.id}>
                            {actionId === record.id ? "Saving…" : isResolved(record) ? "Reopen" : "Complete"}
                          </button>
                        </>
                      )}
                    </div>
                    {record.kind === "annotation" && answerId === record.id && (
                      <form className={styles.answerForm} onSubmit={(event) => void handleAnnotationAction(event, record, "answer")}>
                        <label htmlFor={`answer-${record.id}`}>Answer this annotation</label>
                        <textarea
                          id={`answer-${record.id}`}
                          value={answerDrafts[record.id] ?? ""}
                          onChange={(event) => setAnswerDrafts((drafts) => ({ ...drafts, [record.id]: event.target.value }))}
                          placeholder="Write a response for the person who left this annotation…"
                          rows={3}
                        />
                        <div><button type="submit" disabled={actionId === record.id || !answerDrafts[record.id]?.trim()}>{actionId === record.id ? "Sending…" : "Send answer"}</button></div>
                      </form>
                    )}
                    {actionError && actionId === undefined && actionErrorId === record.id && <p className={styles.actionError} role="alert">{actionError}</p>}
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <strong>{records.length ? "No records match these filters" : "No feedback yet"}</strong>
                <p>{records.length ? "Clear a filter or search for a different route." : "Notes and annotations will appear here when the feedback API receives them."}</p>
                {records.length > 0 && <button type="button" onClick={() => { setQuery(""); setTypeFilter("all"); setStateFilter("all"); }}>Clear filters</button>}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
