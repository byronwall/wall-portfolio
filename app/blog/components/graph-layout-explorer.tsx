'use client'

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import styles from './graph-layout-explorer.module.css'

export type GraphLayoutVariant =
  | 'spring'
  | 'flow'
  | 'collision'
  | 'context'
  | 'sandbox'

type NodeKind = 'root' | 'normal' | 'terminal' | 'context' | 'source'

type GraphNode = {
  id: string
  kind: NodeKind
  label: string
  x: number
  y: number
  vx: number
  vy: number
}

type Edge = {
  from: string
  kind?: 'context' | 'normal'
  to: string
}

type GraphDefinition = {
  edges: Edge[]
  nodes: Omit<GraphNode, 'vx' | 'vy'>[]
}

type Params = {
  collision: number
  direction: number
  fringe: number
  linkDistance: number
  markGap: number
}

type ForceKind =
  | 'anchor'
  | 'collision'
  | 'direction'
  | 'fringe'
  | 'repulsion'
  | 'spring'

type ForceVector = {
  x: number
  y: number
}

type ForceBreakdown = Record<ForceKind, ForceVector>

type VariantCopy = {
  focus: string
  maxTicks: number
  prompt: string
  title: string
}

type LayoutPreset = {
  description: string
  label: string
  params: Partial<Params>
}

type CameraPan = {
  x: number
  y: number
}

type ViewBox = {
  height: number
  width: number
  x: number
  y: number
}

const width = 800
const height = 430
const nodeRadius = 12
const minZoom = 0.6
const maxZoom = 3
const zoomStep = 0.25
const forceKinds: ForceKind[] = [
  'spring',
  'direction',
  'collision',
  'repulsion',
  'fringe',
  'anchor',
]
const forceColors: Record<ForceKind, string> = {
  anchor: '#ad7a17',
  collision: '#c96b34',
  direction: '#7d5bbb',
  fringe: '#43865f',
  repulsion: '#68758a',
  spring: '#2f68dc',
}
const defaultSelectedNode: Record<GraphLayoutVariant, string> = {
  collision: 'title',
  context: 'context',
  flow: 'shape',
  sandbox: 'comment',
  spring: 'child',
}
const defaultPresetName: Record<GraphLayoutVariant, string> = {
  collision: 'Clear labels',
  context: 'Readable upstream',
  flow: 'Readable flow',
  sandbox: 'Balanced',
  spring: 'Balanced',
}

const copy: Record<GraphLayoutVariant, VariantCopy> = {
  spring: {
    focus: 'New desire · spring',
    maxTicks: 140,
    title: 'Start with one spring',
    prompt:
      'Predict where the child will stop. Change the desired distance, then move forward and backward through exactly the same ticks.',
  },
  flow: {
    focus: 'New desire · direction',
    maxTicks: 180,
    title: 'Give the chain a reading order',
    prompt:
      'A spring knows distance, not meaning. Add a down-right desire and watch the same chain acquire a visual direction.',
  },
  collision: {
    focus: 'New desire · collision',
    maxTicks: 220,
    title: 'Let branches negotiate for room',
    prompt:
      'Link distance stays fixed. Change only the clearance threshold and correction strength, with Anatomy available to reveal the protected envelopes.',
  },
  context: {
    focus: 'New rule · semantic edge',
    maxTicks: 260,
    title: 'Place context upstream',
    prompt:
      'The purple provider spans component branches. Give its dashed edges a different direction so it settles in an upper-right lane.',
  },
  sandbox: {
    focus: 'Synthesis · competing desires',
    maxTicks: 500,
    title: 'Tune the crowded graph',
    prompt:
      'Now the desires compete. Scrub time, inspect the exact next-tick vectors, and test which parameter fixes a failure without breaking something else.',
  },
}

const defaultParams: Params = {
  collision: 1.7,
  direction: 1,
  fringe: 2.1,
  linkDistance: 108,
  markGap: 12,
}

const layoutPresets: Record<GraphLayoutVariant, LayoutPreset[]> = {
  spring: [
    {
      label: 'Tight spring',
      description: 'Requests a 70px edge.',
      params: { linkDistance: 70 },
    },
    {
      label: 'Balanced',
      description: 'Requests a 108px edge.',
      params: { linkDistance: 108 },
    },
    {
      label: 'Wide spring',
      description: 'Requests a 160px edge.',
      params: { linkDistance: 160 },
    },
  ],
  flow: [
    {
      label: 'Loose chain',
      description: 'Weak direction leaves the chain flexible.',
      params: { direction: 0.4, linkDistance: 100 },
    },
    {
      label: 'Readable flow',
      description: 'Direction and spring stay in balance.',
      params: { direction: 1, linkDistance: 108 },
    },
    {
      label: 'Rigid flow',
      description: 'Direction begins to overpower local shape.',
      params: { direction: 2, linkDistance: 118 },
    },
  ],
  collision: [
    {
      label: 'Crowded labels',
      description: 'Small envelopes allow a dense branch.',
      params: { collision: 1.2, markGap: 4 },
    },
    {
      label: 'Clear labels',
      description: 'Moderate envelopes protect marks and labels.',
      params: { collision: 1.7, markGap: 12 },
    },
    {
      label: 'Wide gaps',
      description: 'Large envelopes push the branch apart.',
      params: { collision: 2.3, markGap: 26 },
    },
  ],
  context: [
    {
      label: 'Soft upstream',
      description: 'Compact edges with a weak semantic direction.',
      params: { collision: 1.8, direction: 0.8, linkDistance: 84, markGap: 9 },
    },
    {
      label: 'Readable upstream',
      description: 'The context reads upstream without dominating.',
      params: { ...defaultParams, fringe: 0 },
    },
    {
      label: 'Rigid flow',
      description: 'Strong direction flattens competing structure.',
      params: { collision: 1.8, direction: 2, linkDistance: 118, markGap: 14 },
    },
  ],
  sandbox: [
    {
      label: 'Crowded leaves',
      description: 'Short links and weak fringe pressure crowd the trunk.',
      params: {
        collision: 1.9,
        direction: 1.1,
        fringe: 1.4,
        linkDistance: 82,
        markGap: 8,
      },
    },
    {
      label: 'Balanced',
      description: 'No force wins outright.',
      params: defaultParams,
    },
    {
      label: 'Rigid flow',
      description: 'Direction overpowers some local structure.',
      params: {
        collision: 1.8,
        direction: 2.1,
        fringe: 1.5,
        linkDistance: 118,
        markGap: 12,
      },
    },
    {
      label: 'Escaping leaves',
      description: 'Strong fringe pressure stretches terminal edges.',
      params: {
        collision: 2,
        direction: 1,
        fringe: 4,
        linkDistance: 125,
        markGap: 16,
      },
    },
  ],
}

const graphDefinitions: Record<GraphLayoutVariant, GraphDefinition> = {
  spring: {
    nodes: [
      { id: 'root', kind: 'root', label: 'parent', x: 245, y: 190 },
      { id: 'child', kind: 'normal', label: 'child', x: 570, y: 265 },
    ],
    edges: [{ from: 'root', to: 'child' }],
  },
  flow: {
    nodes: [
      { id: 'root', kind: 'root', label: 'route', x: 150, y: 280 },
      { id: 'load', kind: 'normal', label: 'load', x: 330, y: 95 },
      { id: 'shape', kind: 'normal', label: 'shape', x: 500, y: 310 },
      { id: 'render', kind: 'terminal', label: 'render', x: 660, y: 125 },
    ],
    edges: [
      { from: 'root', to: 'load' },
      { from: 'load', to: 'shape' },
      { from: 'shape', to: 'render' },
    ],
  },
  collision: {
    nodes: [
      { id: 'root', kind: 'root', label: 'route', x: 180, y: 120 },
      { id: 'panel', kind: 'normal', label: 'panel', x: 340, y: 225 },
      { id: 'meta', kind: 'terminal', label: 'meta', x: 515, y: 220 },
      { id: 'title', kind: 'terminal', label: 'title', x: 535, y: 225 },
      { id: 'actions', kind: 'normal', label: 'actions', x: 500, y: 230 },
      { id: 'copy', kind: 'terminal', label: 'copy', x: 610, y: 220 },
      { id: 'share', kind: 'terminal', label: 'share', x: 620, y: 235 },
    ],
    edges: [
      { from: 'root', to: 'panel' },
      { from: 'panel', to: 'meta' },
      { from: 'panel', to: 'title' },
      { from: 'panel', to: 'actions' },
      { from: 'actions', to: 'copy' },
      { from: 'actions', to: 'share' },
    ],
  },
  context: {
    nodes: [
      { id: 'root', kind: 'root', label: 'route', x: 145, y: 105 },
      { id: 'page', kind: 'normal', label: 'page', x: 315, y: 225 },
      { id: 'list', kind: 'normal', label: 'list', x: 510, y: 125 },
      { id: 'item', kind: 'normal', label: 'item', x: 525, y: 310 },
      { id: 'meta', kind: 'terminal', label: 'meta', x: 675, y: 110 },
      { id: 'title', kind: 'terminal', label: 'title', x: 690, y: 295 },
      {
        id: 'context',
        kind: 'context',
        label: 'store context',
        x: 690,
        y: 360,
      },
    ],
    edges: [
      { from: 'root', to: 'page' },
      { from: 'page', to: 'list' },
      { from: 'page', to: 'item' },
      { from: 'list', to: 'meta' },
      { from: 'item', to: 'title' },
      { from: 'context', kind: 'context', to: 'list' },
      { from: 'context', kind: 'context', to: 'item' },
    ],
  },
  sandbox: {
    nodes: [
      { id: 'source', kind: 'source', label: 'persisted data', x: 95, y: 85 },
      { id: 'root', kind: 'root', label: 'route', x: 205, y: 220 },
      { id: 'page', kind: 'normal', label: 'page', x: 365, y: 205 },
      { id: 'header', kind: 'normal', label: 'header', x: 455, y: 90 },
      { id: 'content', kind: 'normal', label: 'content', x: 470, y: 320 },
      { id: 'list', kind: 'normal', label: 'list', x: 570, y: 160 },
      { id: 'card', kind: 'normal', label: 'card', x: 585, y: 290 },
      { id: 'meta', kind: 'terminal', label: 'meta', x: 610, y: 105 },
      { id: 'title', kind: 'terminal', label: 'title', x: 645, y: 155 },
      { id: 'empty', kind: 'terminal', label: 'empty state', x: 655, y: 205 },
      { id: 'comment', kind: 'terminal', label: 'comment', x: 655, y: 275 },
      { id: 'actions', kind: 'terminal', label: 'actions', x: 650, y: 325 },
      {
        id: 'data-context',
        kind: 'context',
        label: 'data context',
        x: 650,
        y: 365,
      },
      {
        id: 'ui-context',
        kind: 'context',
        label: 'UI context',
        x: 745,
        y: 350,
      },
    ],
    edges: [
      { from: 'source', to: 'root' },
      { from: 'root', to: 'page' },
      { from: 'page', to: 'header' },
      { from: 'page', to: 'content' },
      { from: 'header', to: 'meta' },
      { from: 'header', to: 'title' },
      { from: 'content', to: 'list' },
      { from: 'content', to: 'card' },
      { from: 'list', to: 'empty' },
      { from: 'card', to: 'comment' },
      { from: 'card', to: 'actions' },
      { from: 'data-context', kind: 'context', to: 'list' },
      { from: 'data-context', kind: 'context', to: 'card' },
      { from: 'ui-context', kind: 'context', to: 'header' },
      { from: 'ui-context', kind: 'context', to: 'actions' },
    ],
  },
}

export function GraphLayoutExplorer({
  variant,
}: {
  variant: GraphLayoutVariant
}) {
  const id = useId().replaceAll(':', '')
  const dragRef = useRef<{
    pan: CameraPan
    pointerX: number
    pointerY: number
  } | null>(null)
  const variantCopy = copy[variant]
  const [tick, setTick] = useState(0)
  const [activePreset, setActivePreset] = useState(defaultPresetName[variant])
  const [isPlaying, setIsPlaying] = useState(false)
  const [showForces, setShowForces] = useState(true)
  const [showBounds, setShowBounds] = useState(variant === 'collision')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState<CameraPan>({ x: 0, y: 0 })
  const [selectedNodeId, setSelectedNodeId] = useState(
    defaultSelectedNode[variant]
  )
  const [params, setParams] = useState<Params>(() => ({
    ...defaultParams,
    direction:
      variant === 'spring' || variant === 'collision'
        ? 0
        : defaultParams.direction,
    fringe: variant === 'sandbox' ? defaultParams.fringe : 0,
  }))

  const graph = graphDefinitions[variant]
  const state = useMemo(
    () => simulate(graph, params, tick, variant),
    [graph, params, tick, variant]
  )
  const camera = useMemo(
    () => cameraForNodes(state.nodes, zoom, pan),
    [pan, state.nodes, zoom]
  )
  const grid = useMemo(() => gridForViewBox(camera), [camera])
  const nextState = useMemo(
    () => simulate(graph, params, tick + 1, variant),
    [graph, params, tick, variant]
  )
  const nextById = new Map(nextState.nodes.map((node) => [node.id, node]))
  const inspection = useMemo(
    () =>
      runTick(
        state.nodes.map((node) => ({ ...node })),
        graph.edges,
        params,
        tick,
        variant
      ),
    [graph.edges, params, state.nodes, tick, variant]
  )
  const selectedNode = state.byId.get(selectedNodeId) ?? state.nodes[0]
  const selectedNextNode = nextById.get(selectedNode.id)
  const selectedForces = inspection.forceParts.get(selectedNode.id)
  const componentForces = state.nodes
    .flatMap((node) =>
      forceKinds.map((kind) => {
        const vector = inspection.forceParts.get(node.id)?.[kind] ?? {
          x: 0,
          y: 0,
        }
        return {
          isSelected: node.id === selectedNode.id,
          kind,
          magnitude: Math.hypot(vector.x, vector.y),
          node,
          vector,
        }
      })
    )
    .filter(({ magnitude }) => magnitude >= 0.005)
    .sort((left, right) => Number(left.isSelected) - Number(right.isSelected))
  const visibleForces = componentForces
    .filter(({ isSelected }) => isSelected)
    .sort((left, right) => right.magnitude - left.magnitude)
  const maxForceMagnitude = Math.max(
    0.001,
    ...componentForces.map(({ magnitude }) => magnitude)
  )
  const requestSum = forceKinds.reduce(
    (sum, kind) => ({
      x: sum.x + (selectedForces?.[kind].x ?? 0),
      y: sum.y + (selectedForces?.[kind].y ?? 0),
    }),
    { x: 0, y: 0 }
  )
  const requestMagnitude = Math.hypot(requestSum.x, requestSum.y)
  const nextDisplacement = selectedNextNode
    ? Math.hypot(
        selectedNextNode.x - selectedNode.x,
        selectedNextNode.y - selectedNode.y
      )
    : 0
  const activePresetCopy = layoutPresets[variant].find(
    (preset) => preset.label === activePreset
  )
  const fringeInspection =
    variant === 'sandbox' && selectedNode.kind === 'terminal'
      ? inspectFringe(selectedNode, state.nodes, graph.edges)
      : null

  useEffect(() => {
    if (!isPlaying) return

    const interval = window.setInterval(() => {
      setTick((current) => {
        const next = Math.min(variantCopy.maxTicks, current + 2)
        if (next >= variantCopy.maxTicks) setIsPlaying(false)
        return next
      })
    }, 70)

    return () => window.clearInterval(interval)
  }, [isPlaying, variantCopy.maxTicks])

  function updateParam<K extends keyof Params>(key: K, value: Params[K]) {
    setActivePreset('')
    setParams((current) => ({ ...current, [key]: value }))
  }

  function applyPreset(preset: LayoutPreset) {
    setActivePreset(preset.label)
    setIsPlaying(false)
    setTick(0)
    fitCamera()
    setParams((current) => ({ ...current, ...preset.params }))
  }

  function fitCamera() {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  function changeZoom(change: number) {
    setZoom((current) =>
      Math.round(clamp(current + change, minZoom, maxZoom) * 100) / 100
    )
  }

  function handlePointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (
      event.button !== 0 ||
      (event.target as Element).closest('[data-graph-mark]')
    ) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pan,
      pointerX: event.clientX,
      pointerY: event.clientY,
    }
  }

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const drag = dragRef.current
    if (!drag) return

    const rect = event.currentTarget.getBoundingClientRect()
    const worldPerPixelX = camera.width / Math.max(1, rect.width)
    const worldPerPixelY = camera.height / Math.max(1, rect.height)
    setPan({
      x: drag.pan.x - (event.clientX - drag.pointerX) * worldPerPixelX,
      y: drag.pan.y - (event.clientY - drag.pointerY) * worldPerPixelY,
    })
  }

  function handlePointerEnd(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
  }

  return (
    <section className={`not-prose ${styles.shell}`} aria-labelledby={`${id}-title`}>
      <header className={styles.header}>
        <div>
          <span className={styles.focus}>{variantCopy.focus}</span>
          <h3 className={styles.title} id={`${id}-title`}>
            {variantCopy.title}
          </h3>
        </div>
        <p className={styles.prompt}>{variantCopy.prompt}</p>
      </header>

      <div className={styles.workspace}>
        <div className={styles.visualColumn}>
        <div className={styles.stage}>
          <div className={styles.cameraControls} aria-label="Graph view controls">
            <button
              aria-label="Zoom out"
              disabled={zoom <= minZoom}
              onClick={() => changeZoom(-zoomStep)}
              type="button"
            >
              −
            </button>
            <output aria-label="Current zoom">{zoom.toFixed(2)}×</output>
            <button
              aria-label="Zoom in"
              disabled={zoom >= maxZoom}
              onClick={() => changeZoom(zoomStep)}
              type="button"
            >
              +
            </button>
            <button onClick={fitCamera} type="button">
              Fit
            </button>
          </div>
          <svg
            viewBox={`${camera.x} ${camera.y} ${camera.width} ${camera.height}`}
            role="img"
            aria-label={`${variantCopy.title}. Interactive force-directed graph at tick ${tick}.`}
            onPointerCancel={handlePointerEnd}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
          >
          <defs>
            <marker
              id={`${id}-edge-arrow`}
              markerHeight="7"
              markerWidth="7"
              orient="auto"
              refX="6"
              refY="3.5"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#8b96a8" />
            </marker>
            <marker
              id={`${id}-context-arrow`}
              markerHeight="7"
              markerWidth="7"
              orient="auto"
              refX="6"
              refY="3.5"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#8b6ac6" />
            </marker>
            <marker
              id={`${id}-force-arrow`}
              markerHeight="7"
              markerWidth="7"
              orient="auto"
              refX="6"
              refY="3.5"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#e23c2b" />
            </marker>
            {forceKinds.map((kind) => (
              <marker
                id={`${id}-${kind}-arrow`}
                key={kind}
                markerHeight="7"
                markerWidth="7"
                orient="auto"
                refX="6"
                refY="3.5"
              >
                <path
                  d="M0,0 L7,3.5 L0,7 Z"
                  fill={forceColors[kind]}
                />
              </marker>
            ))}
          </defs>

          {grid.x.map((x) => (
            <line
              className={styles.gridLine}
              key={`vertical-${x}`}
              x1={x}
              x2={x}
              y1={camera.y}
              y2={camera.y + camera.height}
            />
          ))}
          {grid.y.map((y) => (
            <line
              className={styles.gridLine}
              key={`horizontal-${y}`}
              x1={camera.x}
              x2={camera.x + camera.width}
              y1={y}
              y2={y}
            />
          ))}

          {graph.edges.map((edge) => {
            const from = state.byId.get(edge.from)
            const to = state.byId.get(edge.to)
            if (!from || !to) return null
            const points = edgeEndpoints(from, to)
            const isContext = edge.kind === 'context'
            return (
              <line
                className={`${styles.edge} ${isContext ? styles.contextEdge : ''}`}
                key={`${edge.from}-${edge.to}`}
                markerEnd={`url(#${isContext ? `${id}-context-arrow` : `${id}-edge-arrow`})`}
                x1={points.x1}
                x2={points.x2}
                y1={points.y1}
                y2={points.y2}
              />
            )
          })}

          {showBounds &&
            state.nodes.map((node) => (
              <g className={styles.bounds} key={`bounds-${node.id}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius + params.markGap / 2 + 8}
                />
                <rect
                  height="24"
                  rx="3"
                  width={Math.max(42, node.label.length * 9.2)}
                  x={node.x + 15}
                  y={node.y - 13}
                />
              </g>
            ))}

          {showBounds && fringeInspection && (
            <g className={styles.fringeInspection}>
              <circle
                className={styles.fringeRadius}
                cx={selectedNode.x}
                cy={selectedNode.y}
                r="190"
              />
              {fringeInspection.neighbors.map((neighbor) => (
                <line
                  key={`fringe-neighbor-${neighbor.id}`}
                  x1={selectedNode.x}
                  x2={neighbor.x}
                  y1={selectedNode.y}
                  y2={neighbor.y}
                />
              ))}
              {fringeInspection.center && (
                <>
                  <circle
                    className={styles.localMass}
                    cx={fringeInspection.center.x}
                    cy={fringeInspection.center.y}
                    r="7"
                  />
                  <text
                    className={styles.massLabel}
                    x={fringeInspection.center.x + 12}
                    y={fringeInspection.center.y - 10}
                  >
                    local mass
                  </text>
                </>
              )}
            </g>
          )}

          {showForces &&
            state.nodes.map((node) => {
              const next = nextById.get(node.id)
              if (!next) return null
              const dx = next.x - node.x
              const dy = next.y - node.y
              const magnitude = Math.hypot(dx, dy)
              if (magnitude < 0.05) return null
              return (
                <g key={`force-${node.id}`}>
                  <circle
                    className={styles.forceGhost}
                    cx={next.x}
                    cy={next.y}
                    r={nodeRadius + 4}
                  />
                  <line
                    className={styles.force}
                    markerEnd={`url(#${id}-force-arrow)`}
                    x1={node.x}
                    x2={next.x}
                    y1={node.y}
                    y2={next.y}
                  />
                </g>
              )
            })}

          {showForces &&
            componentForces.map(
              ({ isSelected, kind, magnitude, node, vector }) => {
              const scale = 58 / maxForceMagnitude
              return (
                <line
                  className={`${styles.componentForce} ${
                    isSelected ? styles.selectedComponentForce : ''
                  }`}
                  key={`component-force-${node.id}-${kind}`}
                  markerEnd={`url(#${id}-${kind}-arrow)`}
                  style={{ stroke: forceColors[kind] }}
                  x1={node.x}
                  x2={node.x + vector.x * scale}
                  y1={node.y}
                  y2={node.y + vector.y * scale}
                />
              )
            })}

          {state.nodes.map((node) => (
            <GraphMark
              isSelected={node.id === selectedNode.id}
              key={node.id}
              node={node}
              onSelect={setSelectedNodeId}
            />
          ))}
          </svg>
          <div className={styles.legend} aria-label="Graph legend">
            <span>
              <i className={styles.legendMark} /> component
            </span>
            <span>
              <i className={`${styles.legendMark} ${styles.legendTerminal}`} /> terminal
            </span>
            {(variant === 'context' || variant === 'sandbox') && (
              <span>
                <i className={`${styles.legendMark} ${styles.legendContext}`} /> context
              </span>
            )}
            {variant === 'sandbox' && (
              <span>
                <i className={`${styles.legendMark} ${styles.legendSource}`} /> source
              </span>
            )}
            <span>
              <i className={`${styles.legendMark} ${styles.legendForce}`} /> exact next tick
            </span>
          </div>
        </div>
        {variant === 'sandbox' && (
          <div className={styles.forceInspector} aria-live="polite">
            <div>
              <span className={styles.inspectorEyebrow}>Selected node</span>
              <strong>{selectedNode.label}</strong>
            </div>
            <div className={styles.forceList}>
              {visibleForces.length > 0 ? (
                visibleForces.map(({ kind, magnitude }) => (
                  <span key={`force-readout-${kind}`}>
                    <i style={{ background: forceColors[kind] }} />
                    {kind} <b>{magnitude.toFixed(2)}</b>
                  </span>
                ))
              ) : (
                <span>Settled: no visible request at this tick.</span>
              )}
            </div>
            <p>
              <span className={styles.pipeline}>
                Σ requests <b>{requestMagnitude.toFixed(2)}</b>
                <span aria-hidden="true">→</span>
                velocity + damping + cap
                <span aria-hidden="true">→</span>
                next move <b>{nextDisplacement.toFixed(2)} px</b>
              </span>
              Colored arrows show every request. Select a node to bring its
              arrows forward; red is the exact next displacement.
            </p>
          </div>
        )}
      </div>

      <aside className={styles.controls} aria-label="Layout controls">
        <div className={styles.controlPanel}>
          <div className={styles.presetPanel}>
            <span className={styles.presetTitle}>Try a layout</span>
            <div className={styles.presetGrid}>
              {layoutPresets[variant].map((preset) => (
                <button
                  aria-pressed={activePreset === preset.label}
                  className={styles.presetButton}
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <span className={styles.presetDescription}>
              {activePresetCopy?.description ??
                'Custom values. Compare them with a named failure case.'}
              {activePresetCopy && ' Presets restart at tick 0.'}
            </span>
          </div>
          <div className={styles.buttonRow}>
            <button
              aria-pressed={isPlaying}
              className={styles.button}
              disabled={tick >= variantCopy.maxTicks && !isPlaying}
              onClick={() => setIsPlaying((current) => !current)}
              type="button"
            >
              {isPlaying ? '❚❚ Pause' : '▶ Play'}
            </button>
            {variant === 'sandbox' && (
              <button
                aria-pressed={showForces}
                className={styles.button}
                onClick={() => setShowForces((current) => !current)}
                type="button"
              >
                Forces
              </button>
            )}
            {(variant === 'collision' ||
              variant === 'context' ||
              variant === 'sandbox') && (
              <button
                aria-pressed={showBounds}
                className={styles.button}
                onClick={() => setShowBounds((current) => !current)}
                type="button"
              >
                Anatomy
              </button>
            )}
            <button
              className={styles.button}
              onClick={() => {
                setIsPlaying(false)
                setTick(0)
                fitCamera()
              }}
              type="button"
            >
              Reset
            </button>
          </div>

          <RangeControl
            label="Ticks"
            max={variantCopy.maxTicks}
            min={0}
            onChange={setTick}
            step={1}
            value={tick}
          />

          {(variant === 'spring' || variant === 'sandbox') && (
            <RangeControl
              label="Link distance"
              max={180}
              min={60}
              onChange={(value) => updateParam('linkDistance', value)}
              step={2}
              value={params.linkDistance}
            />
          )}

          {(variant === 'flow' ||
            variant === 'context' ||
            variant === 'sandbox') && (
            <RangeControl
              label="Direction"
              max={2.5}
              min={0}
              onChange={(value) => updateParam('direction', value)}
              step={0.1}
              value={params.direction}
            />
          )}

          {(variant === 'collision' || variant === 'sandbox') && (
            <>
              <RangeControl
                label="Mark gap"
                max={42}
                min={0}
                onChange={(value) => updateParam('markGap', value)}
                step={1}
                value={params.markGap}
              />
              <RangeControl
                label="Collision strength"
                max={3}
                min={0}
                onChange={(value) => updateParam('collision', value)}
                step={0.1}
                value={params.collision}
              />
            </>
          )}

          {variant === 'sandbox' && (
            <RangeControl
              label="Fringe avoidance"
              max={5}
              min={0}
              onChange={(value) => updateParam('fringe', value)}
              step={0.1}
              value={params.fringe}
            />
          )}
        </div>
      </aside>
    </div>
    </section>
  )
}

function RangeControl(props: {
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  step: number
  value: number
}) {
  const id = useId()
  return (
    <label className={styles.rangeGroup} htmlFor={id}>
      <span className={styles.rangeHeader}>
        <span>{props.label}</span>
        <output>{props.value}</output>
      </span>
      <input
        className={styles.range}
        id={id}
        max={props.max}
        min={props.min}
        onChange={(event) => props.onChange(Number(event.currentTarget.value))}
        step={props.step}
        type="range"
        value={props.value}
      />
    </label>
  )
}

function GraphMark({
  isSelected,
  node,
  onSelect,
}: {
  isSelected: boolean
  node: GraphNode
  onSelect: (id: string) => void
}) {
  const color = markColor(node.kind)
  return (
    <g
      aria-label={`${node.label}, ${node.kind}. Select to inspect forces.`}
      className={styles.graphMark}
      data-graph-mark=""
      onClick={() => onSelect(node.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(node.id)
        }
      }}
      role="button"
      tabIndex={0}
    >
      {isSelected && (
        <circle
          className={styles.selectedHalo}
          cx={node.x}
          cy={node.y}
          r={nodeRadius + 9}
        />
      )}
      {node.kind === 'context' ? (
        <rect
          fill={color.fill}
          height="22"
          stroke={color.stroke}
          strokeWidth="2"
          transform={`rotate(45 ${node.x} ${node.y})`}
          width="22"
          x={node.x - 11}
          y={node.y - 11}
        />
      ) : node.kind === 'terminal' ? (
        <rect
          fill={color.fill}
          height="22"
          rx="2"
          stroke={color.stroke}
          strokeWidth="2"
          width="22"
          x={node.x - 11}
          y={node.y - 11}
        />
      ) : (
        <circle
          cx={node.x}
          cy={node.y}
          fill={color.fill}
          r={nodeRadius}
          stroke={color.stroke}
          strokeWidth="2"
        />
      )}
      <text className={styles.nodeLabel} x={node.x + 19} y={node.y + 5}>
        {node.label}
      </text>
    </g>
  )
}

function cameraForNodes(
  nodes: GraphNode[],
  zoom: number,
  pan: CameraPan
): ViewBox {
  const center = nodes.reduce(
    (sum, node) => ({ x: sum.x + node.x, y: sum.y + node.y }),
    { x: 0, y: 0 }
  )
  center.x /= Math.max(1, nodes.length)
  center.y /= Math.max(1, nodes.length)

  let halfWidth = width / 2
  let halfHeight = height / 2
  for (const node of nodes) {
    const labelWidth = Math.max(60, node.label.length * 10 + 30)
    halfWidth = Math.max(
      halfWidth,
      Math.abs(node.x - 42 - center.x),
      Math.abs(node.x + labelWidth - center.x)
    )
    halfHeight = Math.max(
      halfHeight,
      Math.abs(node.y - 48 - center.y),
      Math.abs(node.y + 48 - center.y)
    )
  }

  let fittedWidth = halfWidth * 2 + 40
  let fittedHeight = halfHeight * 2 + 40
  const aspect = width / height
  if (fittedWidth / fittedHeight > aspect) {
    fittedHeight = fittedWidth / aspect
  } else {
    fittedWidth = fittedHeight * aspect
  }

  const viewWidth = fittedWidth / zoom
  const viewHeight = fittedHeight / zoom
  return {
    height: viewHeight,
    width: viewWidth,
    x: center.x - viewWidth / 2 + pan.x,
    y: center.y - viewHeight / 2 + pan.y,
  }
}

function gridForViewBox(viewBox: ViewBox) {
  const spacing = 72
  return {
    x: gridPositions(viewBox.x, viewBox.x + viewBox.width, spacing),
    y: gridPositions(viewBox.y, viewBox.y + viewBox.height, spacing),
  }
}

function gridPositions(start: number, end: number, spacing: number) {
  const positions: number[] = []
  const first = Math.floor(start / spacing) * spacing
  for (
    let position = first;
    position <= end + spacing && positions.length < 40;
    position += spacing
  ) {
    positions.push(position)
  }
  return positions
}

function simulate(
  graph: GraphDefinition,
  params: Params,
  ticks: number,
  variant: GraphLayoutVariant
) {
  const nodes: GraphNode[] = graph.nodes.map((node) => ({
    ...node,
    vx: 0,
    vy: 0,
  }))
  let lastMovement = 0

  for (let tick = 0; tick < ticks; tick += 1) {
    lastMovement = runTick(nodes, graph.edges, params, tick, variant).movement
  }

  return {
    byId: new Map(nodes.map((node) => [node.id, node])),
    lastMovement,
    nodes,
  }
}

function runTick(
  nodes: GraphNode[],
  edges: Edge[],
  params: Params,
  tick: number,
  variant: GraphLayoutVariant
) {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const forces = new Map(nodes.map((node) => [node.id, { x: 0, y: 0 }]))
  const forceParts = new Map(
    nodes.map((node) => [node.id, emptyForceBreakdown()])
  )
  const add = (
    id: string,
    kind: ForceKind,
    x: number,
    y: number
  ) => {
    addForce(forces, id, x, y)
    const breakdown = forceParts.get(id)
    if (!breakdown) return
    breakdown[kind].x += x
    breakdown[kind].y += y
  }
  const connected = new Set(
    edges.flatMap((edge) => [
      `${edge.from}:${edge.to}`,
      `${edge.to}:${edge.from}`,
    ])
  )
  const alpha = 0.24 + 0.76 * Math.exp(-tick / 130)

  for (const edge of edges) {
    const from = byId.get(edge.from)
    const to = byId.get(edge.to)
    if (!from || !to) continue
    const dx = to.x - from.x
    const dy = to.y - from.y
    const distance = Math.max(0.001, Math.hypot(dx, dy))
    const stretch = distance - params.linkDistance
    const spring = stretch * 0.017 * alpha
    add(from.id, 'spring', (dx / distance) * spring, (dy / distance) * spring)
    add(to.id, 'spring', (-dx / distance) * spring, (-dy / distance) * spring)

    if (
      params.direction > 0 &&
      (variant === 'flow' || variant === 'context' || variant === 'sandbox')
    ) {
      const desired =
        edge.kind === 'context'
          ? { x: -Math.SQRT1_2, y: Math.SQRT1_2 }
          : { x: Math.SQRT1_2, y: Math.SQRT1_2 }
      const desiredX = from.x + desired.x * params.linkDistance
      const desiredY = from.y + desired.y * params.linkDistance
      const directionStrength = 0.012 * params.direction * alpha
      const correctionX = (desiredX - to.x) * directionStrength
      const correctionY = (desiredY - to.y) * directionStrength
      add(to.id, 'direction', correctionX, correctionY)
      add(
        from.id,
        'direction',
        -correctionX * 0.32,
        -correctionY * 0.32
      )
    }
  }

  for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < nodes.length;
      rightIndex += 1
    ) {
      const left = nodes[leftIndex]
      const right = nodes[rightIndex]
      let dx = right.x - left.x
      let dy = right.y - left.y
      let distance = Math.hypot(dx, dy)
      if (distance < 0.001) {
        const angle = deterministicAngle(left.id, right.id)
        dx = Math.cos(angle)
        dy = Math.sin(angle)
        distance = 1
      }

      const labelAllowance = 16
      const clearance = nodeRadius * 2 + params.markGap + labelAllowance
      if (distance < clearance && params.collision > 0) {
        const push =
          (clearance - distance) * 0.045 * params.collision * Math.max(0.5, alpha)
        add(left.id, 'collision', (-dx / distance) * push, (-dy / distance) * push)
        add(right.id, 'collision', (dx / distance) * push, (dy / distance) * push)
      }

      if (!connected.has(`${left.id}:${right.id}`) && distance < 150) {
        const charge = (150 - distance) * 0.0018 * alpha
        add(left.id, 'repulsion', (-dx / distance) * charge, (-dy / distance) * charge)
        add(right.id, 'repulsion', (dx / distance) * charge, (dy / distance) * charge)
      }
    }
  }

  if (variant === 'sandbox' && params.fringe > 0) {
    for (const node of nodes) {
      if (node.kind !== 'terminal') continue
      let massX = 0
      let massY = 0
      let mass = 0
      for (const neighbor of nodes) {
        if (
          neighbor.id === node.id ||
          connected.has(`${node.id}:${neighbor.id}`)
        ) {
          continue
        }
        const distance = Math.hypot(neighbor.x - node.x, neighbor.y - node.y)
        if (distance > 190) continue
        const weight = 1 - distance / 190
        massX += neighbor.x * weight
        massY += neighbor.y * weight
        mass += weight
      }
      if (mass > 0.01) {
        const centerX = massX / mass
        const centerY = massY / mass
        const dx = node.x - centerX
        const dy = node.y - centerY
        const distance = Math.max(1, Math.hypot(dx, dy))
        const push = params.fringe * 0.08 * Math.min(3, mass)
        add(node.id, 'fringe', (dx / distance) * push, (dy / distance) * push)
      }
    }
  }

  const anchor = byId.get('root')
  if (anchor) {
    add(anchor.id, 'anchor', (190 - anchor.x) * 0.01, (150 - anchor.y) * 0.01)
  }
  const source = byId.get('source')
  if (source) {
    add(source.id, 'anchor', (85 - source.x) * 0.018, (75 - source.y) * 0.018)
  }

  let totalMovement = 0
  for (const node of nodes) {
    const force = forces.get(node.id) ?? { x: 0, y: 0 }
    node.vx = (node.vx + force.x) * 0.72
    node.vy = (node.vy + force.y) * 0.72
    const speed = Math.hypot(node.vx, node.vy)
    const cap = 10
    if (speed > cap) {
      node.vx = (node.vx / speed) * cap
      node.vy = (node.vy / speed) * cap
    }
    node.x += node.vx
    node.y += node.vy
    totalMovement += Math.hypot(node.vx, node.vy)
  }

  return { forceParts, movement: totalMovement }
}

function emptyForceBreakdown(): ForceBreakdown {
  return {
    anchor: { x: 0, y: 0 },
    collision: { x: 0, y: 0 },
    direction: { x: 0, y: 0 },
    fringe: { x: 0, y: 0 },
    repulsion: { x: 0, y: 0 },
    spring: { x: 0, y: 0 },
  }
}

function inspectFringe(
  selectedNode: GraphNode,
  nodes: GraphNode[],
  edges: Edge[]
) {
  const connected = new Set(
    edges.flatMap((edge) => [
      `${edge.from}:${edge.to}`,
      `${edge.to}:${edge.from}`,
    ])
  )
  const neighbors = nodes.filter((neighbor) => {
    if (
      neighbor.id === selectedNode.id ||
      connected.has(`${selectedNode.id}:${neighbor.id}`)
    ) {
      return false
    }
    return Math.hypot(
      neighbor.x - selectedNode.x,
      neighbor.y - selectedNode.y
    ) <= 190
  })
  let massX = 0
  let massY = 0
  let mass = 0
  for (const neighbor of neighbors) {
    const distance = Math.hypot(
      neighbor.x - selectedNode.x,
      neighbor.y - selectedNode.y
    )
    const weight = 1 - distance / 190
    massX += neighbor.x * weight
    massY += neighbor.y * weight
    mass += weight
  }
  return {
    center:
      mass > 0.01 ? { x: massX / mass, y: massY / mass } : null,
    neighbors,
  }
}

function addForce(
  forces: Map<string, { x: number; y: number }>,
  id: string,
  x: number,
  y: number
) {
  const force = forces.get(id)
  if (!force) return
  force.x += x
  force.y += y
}

function edgeEndpoints(from: GraphNode, to: GraphNode) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.max(1, Math.hypot(dx, dy))
  return {
    x1: from.x + (dx / distance) * (nodeRadius + 2),
    x2: to.x - (dx / distance) * (nodeRadius + 8),
    y1: from.y + (dy / distance) * (nodeRadius + 2),
    y2: to.y - (dy / distance) * (nodeRadius + 8),
  }
}

function markColor(kind: NodeKind) {
  if (kind === 'context') return { fill: '#f1eafe', stroke: '#7d5bbb' }
  if (kind === 'root') return { fill: '#fff3cf', stroke: '#ad7a17' }
  if (kind === 'source') return { fill: '#e7f6ec', stroke: '#43865f' }
  if (kind === 'terminal') return { fill: '#ffffff', stroke: '#60718c' }
  return { fill: '#eef4ff', stroke: '#2f68dc' }
}

function deterministicAngle(left: string, right: string) {
  let hash = 0
  for (const character of `${left}:${right}`) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }
  return (hash / 0xffffffff) * Math.PI * 2
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}
