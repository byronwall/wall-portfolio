'use client'

import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

type ScenarioKey =
  | 'direct'
  | 'latest'
  | 'derived'
  | 'memo'
  | 'parent'
  | 'captured'
  | 'passed'

type Scenario = {
  key: ScenarioKey
  title: string
  summary: string
  observations: {
    changeSource: string
    refetch: string
    remount: string
  }
  fallback: string
  code: string
}

const delayMs = 1600

const scenarios: Scenario[] = [
  {
    key: 'direct',
    title: 'Direct resource() read',
    summary:
      'Reading resource() under a Suspense boundary makes that boundary own the load state on the initial fetch and later source changes.',
    observations: {
      changeSource:
        'The local fallback should appear again because the source signal changed and resource() is read in render.',
      refetch:
        'The local fallback should also appear during refetch because resource() does not keep stale UI visible.',
      remount:
        'The value returns to undefined and the first-load fallback flashes while the new component instance fetches.',
    },
    fallback: 'loading direct resource() read',
    code: `const [resource] = createResource(trigger, fetchNumber);

<Suspense fallback={<span>loading</span>}>
  <pre>{resource()}</pre>
</Suspense>`,
  },
  {
    key: 'latest',
    title: 'resource.latest',
    summary:
      'The first unresolved read can still suspend because there is no latest value yet. After that, latest keeps the old value visible during refreshes.',
    observations: {
      changeSource:
        'After the first value exists, the old latest value should stay visible while the new source fetches.',
      refetch:
        'A manual refetch should keep showing the stale latest value instead of falling back.',
      remount:
        'A remount clears latest, so this becomes a first load again and the fallback can flash.',
    },
    fallback: 'loading latest for the first time',
    code: `const [resource] = createResource(trigger, fetchNumber);

<Suspense fallback={<span>loading</span>}>
  <pre>{resource.latest}</pre>
</Suspense>`,
  },
  {
    key: 'derived',
    title: 'Derived function',
    summary:
      'A function that calls resource() is still a resource read. Suspense follows the dependency even when it is hidden behind another accessor.',
    observations: {
      changeSource:
        'The fallback should appear because doubled() calls resource() during render.',
      refetch:
        'Refetch should suspend for the same reason; the resource read is just hidden behind a helper.',
      remount:
        'The first render of the new component instance has no resource value, so the derived read flashes.',
    },
    fallback: 'loading derived function',
    code: `const doubled = () => {
  const value = resource();
  return value === undefined ? 0 : value * 2;
};

<Suspense fallback={<span>loading</span>}>
  <pre>{doubled()}</pre>
</Suspense>`,
  },
  {
    key: 'memo',
    title: 'createMemo wrapper',
    summary:
      'A memo can absorb the async read. The rendered memo value may be stale or defaulted, but the render path no longer trips Suspense.',
    observations: {
      changeSource:
        'The memo output should remain visible during the fetch; look for the status changing without the fallback taking over.',
      refetch:
        'Refetch should also avoid the fallback because the render path reads the memo, not resource().',
      remount:
        'The remounted memo starts from its default value, so look for 0 or stale-looking data rather than a Suspense flash.',
    },
    fallback: 'you should not see this fallback',
    code: `const doubledMemo = createMemo(() => {
  const value = resource();
  return value === undefined ? 0 : value * 2;
});

<Suspense fallback={<span>loading</span>}>
  <pre>{doubledMemo()}</pre>
</Suspense>`,
  },
  {
    key: 'parent',
    title: 'Parent sees uncaptured read',
    summary:
      'If no nearer Suspense boundary captures the resource read, a higher boundary can show its fallback for the whole section.',
    observations: {
      changeSource:
        'The parent fallback should replace the mini route because the child resource read is uncaptured.',
      refetch:
        'Refetch should blank the parent section again, demonstrating the larger blast radius.',
      remount:
        'A new uncaptured child starts with no value, so the parent boundary flashes immediately.',
    },
    fallback: 'parent fallback from uncaptured resource',
    code: `<Suspense fallback={<AppFallback />}>
  <RouteChrome />
  <ChildThatReads resource={resource} />
</Suspense>`,
  },
  {
    key: 'captured',
    title: 'Inner boundary captures',
    summary:
      'Put a Suspense boundary close to the resource read and the parent remains visible while the local result area falls back.',
    observations: {
      changeSource:
        'Only the inner result area should fall back; the outer route chrome should stay mounted.',
      refetch:
        'Manual refetch should produce the same local-only fallback.',
      remount:
        'The remounted child starts loading, but the inner boundary contains the flash.',
    },
    fallback: 'inner fallback because it is nearest',
    code: `<Suspense fallback={<AppFallback />}>
  <RouteChrome />

  <Suspense fallback={<LocalFallback />}>
    <ChildThatReads resource={resource} />
  </Suspense>
</Suspense>`,
  },
  {
    key: 'passed',
    title: 'Passed resource, local read',
    summary:
      'The parent can create the resource and pass the accessor down, as long as Suspense sits near the component that actually reads it.',
    observations: {
      changeSource:
        'The parent shell should stay visible while the consuming child falls back locally.',
      refetch:
        'Refetch should prove that passing the resource through props is fine; the boundary location still decides what flashes.',
      remount:
        'The remounted child starts from an unresolved resource, but only the local consumer area should show the fallback.',
    },
    fallback: 'local fallback beside the consuming child',
    code: `function Parent() {
  const [resource] = createResource(trigger, fetchNumber);

  return <Child resource={resource} />;
}

function Child(props) {
  return (
    <Suspense fallback={<LocalFallback />}>
      <pre>{props.resource()}</pre>
    </Suspense>
  );
}`,
  },
]

function formatValue(value: number | undefined) {
  return value === undefined ? 'undefined' : String(value)
}

type EventLogItem = {
  id: number
  message: string
}

export function SolidResourceExplorer() {
  const [activeKey, setActiveKey] = useState<ScenarioKey>('direct')
  const [trigger, setTrigger] = useState(1)
  const [value, setValue] = useState<number | undefined>(undefined)
  const [latest, setLatest] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [eventLog, setEventLog] = useState<EventLogItem[]>([])
  const logId = useRef(0)
  const requestId = useRef(0)

  const active = scenarios.find((scenario) => scenario.key === activeKey)!
  const doubled = value === undefined ? 0 : value * 2
  const memoValue = useMemo(() => {
    return latest === undefined ? 0 : latest * 2
  }, [latest])

  function log(message: string) {
    logId.current += 1
    const id = logId.current
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    setEventLog((items) => [
      {
        id,
        message: `${timestamp} ${message}`,
      },
      ...items,
    ].slice(0, 5))
  }

  function startFetch(nextTrigger: number, reason: string) {
    const id = requestId.current + 1
    requestId.current = id
    setLoading(true)
    setValue(undefined)
    log(`${reason}: fetch started for trigger ${nextTrigger}`)

    window.setTimeout(() => {
      if (requestId.current !== id) return

      const nextValue = nextTrigger * 10
      setValue(nextValue)
      setLatest(nextValue)
      setLoading(false)
      log(`fetch resolved with ${nextValue}`)
    }, delayMs)
  }

  useEffect(() => {
    startFetch(trigger, 'initial load')
    return () => {
      requestId.current += 1
    }
    // Run only once on mount. Button handlers own later fetches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function changeSource() {
    setTrigger((current) => {
      const next = current + 1
      startFetch(next, 'source changed')
      return next
    })
  }

  function refetch() {
    startFetch(trigger, 'manual refetch')
  }

  function remountDemo(reason = 'component remounted') {
    requestId.current += 1
    setTrigger(1)
    setValue(undefined)
    setLatest(undefined)
    setEventLog([])
    startFetch(1, reason)
  }

  function selectScenario(nextKey: ScenarioKey) {
    setActiveKey(nextKey)
    remountDemo('mode changed, component remounted')
  }

  const showsFallback =
    loading &&
    (active.key === 'direct' ||
      active.key === 'derived' ||
      active.key === 'parent' ||
      (active.key === 'latest' && latest === undefined))

  return (
    <div className="not-prose relative left-1/2 my-8 w-[min(92vw,72rem)] -translate-x-1/2 text-neutral-950 dark:text-neutral-50">
      <div className="mb-2 overflow-x-auto">
        <div className="flex w-max items-center gap-1.5">
          {scenarios.map((scenario) => (
            <button
              key={scenario.key}
              type="button"
              onClick={() => selectScenario(scenario.key)}
              className={`shrink-0 rounded-md px-2.5 py-1.5 text-xs transition ${
                activeKey === scenario.key
                  ? 'bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950'
                  : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800'
              }`}
            >
              {scenario.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="min-w-0 bg-neutral-50 px-4 pb-4 pt-2 dark:bg-neutral-900">
          <div>
            <h3 className="!m-0 text-lg font-medium tracking-tight">
              {active.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
              {active.summary}
            </p>
          </div>

          <div className="mt-5 text-sm font-medium">Solid snippet</div>
          <pre className="mt-2 overflow-x-auto !rounded-none !border-0 bg-white/70 p-3 text-sm leading-6 dark:bg-neutral-950/35">
            <code>{active.code}</code>
          </pre>

          <div className="mt-5 text-sm">
            <div className="text-sm font-medium">What to look for</div>
            <dl className="mt-3 space-y-3">
              <div>
                <dt className="font-medium">Change source</dt>
                <dd className="mt-1 leading-6 text-neutral-700 dark:text-neutral-300">
                  {active.observations.changeSource}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Call refetch()</dt>
                <dd className="mt-1 leading-6 text-neutral-700 dark:text-neutral-300">
                  {active.observations.refetch}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Force re-mount</dt>
                <dd className="mt-1 leading-6 text-neutral-700 dark:text-neutral-300">
                  {active.observations.remount}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="min-w-0 bg-neutral-50 px-4 pb-4 pt-2 dark:bg-neutral-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={changeSource}
              className="rounded-md bg-neutral-950 px-3 py-2 text-sm text-white dark:bg-neutral-50 dark:text-neutral-950"
            >
              Change source: {trigger}
            </button>
            <button
              type="button"
              onClick={refetch}
              className="rounded-md bg-white px-3 py-2 text-sm hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800"
            >
              Call refetch()
            </button>
            <button
              type="button"
              onClick={() => remountDemo()}
              className="rounded-md bg-white px-3 py-2 text-sm hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800"
            >
              Force re-mount
            </button>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <div className="min-w-0 bg-white p-3 dark:bg-neutral-950">
              <div className="truncate text-neutral-500 dark:text-neutral-400">
                resource.state
              </div>
              <div className="font-mono">{loading ? 'refreshing' : 'ready'}</div>
            </div>
            <div className="min-w-0 bg-white p-3 dark:bg-neutral-950">
              <div className="truncate text-neutral-500 dark:text-neutral-400">
                resource()
              </div>
              <div className="font-mono">{formatValue(value)}</div>
            </div>
            <div className="min-w-0 bg-white p-3 dark:bg-neutral-950">
              <div className="truncate text-neutral-500 dark:text-neutral-400">
                resource.latest
              </div>
              <div className="font-mono">{formatValue(latest)}</div>
            </div>
          </div>

          <div className="mt-4 bg-white/70 p-3 dark:bg-neutral-950/35">
            {active.key === 'parent' ? (
              showsFallback ? (
                <DomNode
                  label="<Suspense fallback={<AppFallback />}>"
                  note="Parent boundary owns this whole subtree"
                >
                  <Fallback label={active.fallback} />
                </DomNode>
              ) : (
                <DomNode
                  label="<Suspense fallback={<AppFallback />}>"
                  note="No closer boundary before the read"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <DomNode label="<RouteChrome>">
                      <MiniRoute title="Route chrome stays visible" />
                    </DomNode>
                    <DomNode label="<ChildThatReads>">
                      <Readout
                        label="uncaptured child resource()"
                        value={value}
                      />
                    </DomNode>
                  </div>
                </DomNode>
              )
            ) : active.key === 'captured' ? (
              <DomNode
                label="<Suspense fallback={<AppFallback />}>"
                note="Outer boundary stays mounted"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <DomNode label="<RouteChrome>">
                    <MiniRoute title="Outer route stays visible" />
                  </DomNode>
                  <DomNode
                    label="<Suspense fallback={<LocalFallback />}>"
                    note="Nearest boundary to resource()"
                  >
                    {loading ? (
                      <Fallback label={active.fallback} />
                    ) : (
                      <Readout label="captured child resource()" value={value} />
                    )}
                  </DomNode>
                </div>
              </DomNode>
            ) : active.key === 'passed' ? (
              <DomNode label="<Parent>" note="Creates resource and passes it down">
                <div className="grid gap-3 sm:grid-cols-2">
                  <DomNode label="<Child>">
                    <MiniRoute title="Receives resource prop" />
                  </DomNode>
                  <DomNode
                    label="<Suspense fallback={<LocalFallback />}>"
                    note="Boundary is next to props.resource()"
                  >
                    {loading ? (
                      <Fallback label={active.fallback} />
                    ) : (
                      <Readout label="child props.resource()" value={value} />
                    )}
                  </DomNode>
                </div>
              </DomNode>
            ) : showsFallback ? (
              <Fallback label={active.fallback} full />
            ) : (
              <Readout
                label={
                  active.key === 'latest'
                    ? 'resource.latest'
                    : active.key === 'derived'
                      ? 'doubled()'
                      : active.key === 'memo'
                        ? 'doubledMemo()'
                        : 'resource()'
                }
                value={
                  active.key === 'latest'
                    ? latest
                    : active.key === 'derived'
                      ? doubled
                      : active.key === 'memo'
                        ? memoValue
                        : value
                }
              />
            )}
          </div>

          <div className="mt-4 bg-white/70 p-3 dark:bg-neutral-950/35">
            <div className="mb-2 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Event log
            </div>
            <div className="space-y-1 font-mono text-xs text-neutral-700 dark:text-neutral-300">
              {eventLog.map((item) => (
                <div key={item.id}>{item.message}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function Fallback(props: { label: string; full?: boolean }) {
  return (
    <div
      className={`bg-amber-100 p-3 text-amber-950 dark:bg-amber-950 dark:text-amber-100 ${
        props.full ? 'min-h-24' : ''
      }`}
    >
      <div className="font-medium">{props.label}</div>
      <div className="mt-1 text-sm opacity-80">
        Simulated fetch delay is active.
      </div>
    </div>
  )
}

function DomNode(props: {
  children: ReactNode
  label: string
  note?: string
}) {
  return (
    <div className="bg-neutral-100 p-3 dark:bg-neutral-900">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <div className="font-mono text-xs font-medium text-neutral-900 dark:text-neutral-100">
          {props.label}
        </div>
        {props.note ? (
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {props.note}
          </div>
        ) : null}
      </div>
      {props.children}
    </div>
  )
}

function Readout(props: { label: string; value: number | undefined }) {
  return (
    <div className="bg-emerald-100 p-3 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100">
      <div className="text-sm opacity-80">{props.label}</div>
      <div className="font-mono text-2xl">{formatValue(props.value)}</div>
    </div>
  )
}

function MiniRoute(props: { title: string }) {
  return (
    <div className="bg-white p-3 dark:bg-neutral-950">
      <div className="font-medium">{props.title}</div>
      <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Navigation, layout, and route controls remain mounted.
      </div>
    </div>
  )
}
