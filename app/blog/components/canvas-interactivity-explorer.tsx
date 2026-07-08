'use client'

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type Box = {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  fill: string
}

type Arrow = {
  from: string
  to: string
  label: string
}

type Camera = {
  x: number
  y: number
  scale: number
}

type Point = {
  x: number
  y: number
}

type PointerState = {
  screen: Point
  world: Point
}

type ScatterPoint = {
  x: number
  y: number
  group: number
}

type ScatterIndex = {
  cellSize: number
  cells: Map<string, number[]>
  mode: ScatterMode
  points: ScatterPoint[]
}

type ScatterMode = 'clusters' | 'uniform'

const boxes: Box[] = [
  {
    id: 'input',
    label: 'Pointer event',
    x: 36,
    y: 72,
    width: 138,
    height: 72,
    fill: '#e0f2fe',
  },
  {
    id: 'coords',
    label: 'screenToWorld',
    x: 252,
    y: 42,
    width: 152,
    height: 82,
    fill: '#dcfce7',
  },
  {
    id: 'hit',
    label: 'Hit test',
    x: 486,
    y: 88,
    width: 128,
    height: 72,
    fill: '#fef3c7',
  },
  {
    id: 'render',
    label: 'Redraw',
    x: 298,
    y: 220,
    width: 140,
    height: 76,
    fill: '#fee2e2',
  },
]

const arrows: Arrow[] = [
  { from: 'input', to: 'coords', label: 'event offsets' },
  { from: 'coords', to: 'hit', label: 'world point' },
  { from: 'hit', to: 'render', label: 'hover state' },
  { from: 'render', to: 'input', label: 'next frame' },
]

const cameraDefault: Camera = {
  x: 18,
  y: 14,
  scale: 1,
}

const pointerPresets = {
  input: { x: 96, y: 108 },
  coords: { x: 328, y: 82 },
  gap: { x: 214, y: 158 },
  hit: { x: 548, y: 126 },
  render: { x: 364, y: 252 },
}

function getBox(id: string) {
  const box = boxes.find((candidate) => candidate.id === id)
  if (!box) throw new Error(`Missing box ${id}`)
  return box
}

function center(box: Box) {
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  }
}

function worldToScreen(point: Point, camera: Camera) {
  return {
    x: point.x * camera.scale + camera.x,
    y: point.y * camera.scale + camera.y,
  }
}

function screenToWorld(point: Point, camera: Camera) {
  return {
    x: (point.x - camera.x) / camera.scale,
    y: (point.y - camera.y) / camera.scale,
  }
}

function hitTest(point: Point) {
  for (let index = boxes.length - 1; index >= 0; index -= 1) {
    const box = boxes[index]
    if (isInsideBox(point, box)) return box
  }

  return null
}

function isInsideBox(point: Point, box: Box) {
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height
  )
}

function useCanvasSize(defaultHeight = 320) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 280, height: defaultHeight })

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.max(220, Math.round(entry.contentRect.width))
      setSize({
        width,
        height: width < 560 ? defaultHeight + 64 : defaultHeight,
      })
    })

    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [defaultHeight])

  return { wrapperRef, size }
}

function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const ratio = window.devicePixelRatio || 1
  canvas.width = Math.round(width * ratio)
  canvas.height = Math.round(height * ratio)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const context = canvas.getContext('2d')
  if (!context) return null

  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  return context
}

function clearCanvas(context: CanvasRenderingContext2D) {
  context.save()
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, context.canvas.width, context.canvas.height)
  context.restore()
}

function drawBaseScene(
  context: CanvasRenderingContext2D,
  camera: Camera,
  width: number,
  height: number,
  options: { faded?: boolean } = {}
) {
  clearCanvas(context)
  context.save()
  context.fillStyle = '#fafafa'
  context.fillRect(0, 0, width, height)
  drawGrid(context, camera, width, height)

  context.translate(camera.x, camera.y)
  context.scale(camera.scale, camera.scale)
  context.globalAlpha = options.faded ? 0.35 : 1
  arrows.forEach((arrow) => drawArrow(context, arrow))
  boxes.forEach((box) => drawBox(context, box))
  context.restore()
}

function drawGrid(
  context: CanvasRenderingContext2D,
  camera: Camera,
  width: number,
  height: number
) {
  const spacing = 32 * camera.scale
  const offsetX = camera.x % spacing
  const offsetY = camera.y % spacing

  context.save()
  context.strokeStyle = '#e5e5e5'
  context.lineWidth = 1
  for (let x = offsetX; x < width; x += spacing) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }
  for (let y = offsetY; y < height; y += spacing) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }
  context.restore()
}

function drawBox(context: CanvasRenderingContext2D, box: Box) {
  context.save()
  context.fillStyle = box.fill
  context.strokeStyle = '#171717'
  context.lineWidth = 1.5
  roundRect(context, box.x, box.y, box.width, box.height, 8)
  context.fill()
  context.stroke()

  context.fillStyle = '#171717'
  context.font = '600 15px system-ui, sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(box.label, box.x + box.width / 2, box.y + box.height / 2)
  context.restore()
}

function drawArrow(context: CanvasRenderingContext2D, arrow: Arrow) {
  const from = center(getBox(arrow.from))
  const to = center(getBox(arrow.to))
  const angle = Math.atan2(to.y - from.y, to.x - from.x)
  const start = {
    x: from.x + Math.cos(angle) * 76,
    y: from.y + Math.sin(angle) * 42,
  }
  const end = {
    x: to.x - Math.cos(angle) * 76,
    y: to.y - Math.sin(angle) * 42,
  }

  context.save()
  context.strokeStyle = '#404040'
  context.fillStyle = '#404040'
  context.lineWidth = 1.75
  context.beginPath()
  context.moveTo(start.x, start.y)
  context.lineTo(end.x, end.y)
  context.stroke()

  context.beginPath()
  context.moveTo(end.x, end.y)
  context.lineTo(
    end.x - Math.cos(angle - 0.42) * 12,
    end.y - Math.sin(angle - 0.42) * 12
  )
  context.lineTo(
    end.x - Math.cos(angle + 0.42) * 12,
    end.y - Math.sin(angle + 0.42) * 12
  )
  context.closePath()
  context.fill()

  const mid = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  }
  context.font = '12px system-ui, sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = '#525252'
  context.fillText(arrow.label, mid.x, mid.y - 10)
  context.restore()
}

function drawPointer(
  context: CanvasRenderingContext2D,
  pointer: PointerState,
  camera: Camera,
  hovered: Box | null,
  width: number
) {
  context.save()
  context.strokeStyle = '#7c3aed'
  context.fillStyle = '#7c3aed'
  context.lineWidth = 1.5
  context.setLineDash([5, 5])
  context.beginPath()
  context.moveTo(pointer.screen.x - 18, pointer.screen.y)
  context.lineTo(pointer.screen.x + 18, pointer.screen.y)
  context.moveTo(pointer.screen.x, pointer.screen.y - 18)
  context.lineTo(pointer.screen.x, pointer.screen.y + 18)
  context.stroke()
  context.setLineDash([])
  context.beginPath()
  context.arc(pointer.screen.x, pointer.screen.y, 4, 0, Math.PI * 2)
  context.fill()
  context.restore()

  if (hovered) {
    const boxScreen = worldToScreen({ x: hovered.x, y: hovered.y }, camera)
    context.save()
    context.strokeStyle = '#0284c7'
    context.lineWidth = 3
    context.strokeRect(
      boxScreen.x - 4,
      boxScreen.y - 4,
      hovered.width * camera.scale + 8,
      hovered.height * camera.scale + 8
    )
    context.restore()
  }

  const label = hovered
    ? `hit: ${hovered.id}`
    : 'no hit: pointer is between boxes'
  drawTooltip(context, label, pointer.screen.x, pointer.screen.y, width)
}

function drawTooltip(
  context: CanvasRenderingContext2D,
  label: string,
  pointerX: number,
  pointerY: number,
  width: number
) {
  context.save()
  context.font = '12px system-ui, sans-serif'
  const tooltipWidth = context.measureText(label).width + 18
  const x = Math.min(pointerX + 14, width - tooltipWidth - 8)
  const y = Math.max(pointerY - 36, 8)
  context.fillStyle = '#171717'
  roundRect(context, x, y, tooltipWidth, 28, 6)
  context.fill()
  context.fillStyle = '#ffffff'
  context.textBaseline = 'middle'
  context.fillText(label, x + 9, y + 14)
  context.restore()
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.arcTo(x + width, y, x + width, y + height, radius)
  context.arcTo(x + width, y + height, x, y + height, radius)
  context.arcTo(x, y + height, x, y, radius)
  context.arcTo(x, y, x + width, y, radius)
  context.closePath()
}

function pointerFromWorld(world: Point, camera: Camera): PointerState {
  return {
    world,
    screen: worldToScreen(world, camera),
  }
}

function pointerFromEvent(
  event: ReactPointerEvent<HTMLCanvasElement>,
  camera: Camera
): PointerState {
  const rect = event.currentTarget.getBoundingClientRect()
  const screen = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }

  return {
    screen,
    world: screenToWorld(screen, camera),
  }
}

function zoomCamera(camera: Camera, scale: number): Camera {
  return {
    ...camera,
    scale: Number(Math.max(0.5, Math.min(2.4, scale)).toFixed(2)),
  }
}

function zoomCameraAtScreenPoint(
  camera: Camera,
  nextScale: number,
  anchor: Point
): Camera {
  const worldBefore = screenToWorld(anchor, camera)
  const scale = Number(Math.max(0.5, Math.min(2.4, nextScale)).toFixed(2))

  return {
    scale,
    x: anchor.x - worldBefore.x * scale,
    y: anchor.y - worldBefore.y * scale,
  }
}

export function CanvasWholeSystemPreview() {
  const [camera, setCamera] = useState<Camera>(cameraDefault)
  const [worldPoint, setWorldPoint] = useState<Point>(pointerPresets.coords)

  return (
    <ExplainerShell
      compact
      title="The whole loop"
      prompt="Move the pointer over the canvas. The visible result is small, but the hidden loop is doing four jobs."
    >
      <LayeredCanvas
        camera={camera}
        worldPoint={worldPoint}
        showBase
        showOverlay
        onWorldPointChange={setWorldPoint}
        onWheelZoom={(event) => {
          if (!event.metaKey && !event.ctrlKey) return
          event.preventDefault()
          const rect = event.currentTarget.getBoundingClientRect()
          const anchor = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          }
          const multiplier = event.deltaY < 0 ? 1.12 : 0.88
          setCamera((current) =>
            zoomCameraAtScreenPoint(current, current.scale * multiplier, anchor)
          )
        }}
        zoomControls={{
          onReset: () => setCamera(cameraDefault),
          onZoom: (scale) => setCamera((current) => zoomCamera(current, scale)),
          onPan: (delta, startCamera) =>
            setCamera({
              ...startCamera,
              x: startCamera.x + delta.x,
              y: startCamera.y + delta.y,
            }),
        }}
      />
    </ExplainerShell>
  )
}

export function CanvasSceneModelExplorer() {
  const [camera, setCamera] = useState<Camera>(cameraDefault)
  const [worldPoint, setWorldPoint] = useState<Point>(pointerPresets.gap)
  const pointer = pointerFromWorld(worldPoint, camera)
  const hovered = hitTest(worldPoint)

  return (
    <ExplainerShell
      title="One canvas, one model"
      prompt="Before pressing a preset, predict the hit target. The canvas pixels are not queried; the rectangle data is."
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-2">
          <SceneSingleCanvas
            camera={camera}
            initialWorldPoint={worldPoint}
            onWorldPointChange={setWorldPoint}
            showPointer
            onWheelZoom={(event) => {
              if (!event.metaKey && !event.ctrlKey) return
              event.preventDefault()
              const rect = event.currentTarget.getBoundingClientRect()
              const anchor = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              }
              const multiplier = event.deltaY < 0 ? 1.12 : 0.88
              setCamera((current) =>
                zoomCameraAtScreenPoint(current, current.scale * multiplier, anchor)
              )
            }}
            zoomControls={{
              onReset: () => setCamera(cameraDefault),
              onZoom: (scale) =>
                setCamera((current) => zoomCamera(current, scale)),
              onPan: (delta, startCamera) =>
                setCamera({
                  ...startCamera,
                  x: startCamera.x + delta.x,
                  y: startCamera.y + delta.y,
                }),
            }}
          />
          <ControlGroup horizontal>
            <PresetButton onClick={() => setWorldPoint(pointerPresets.input)}>
              Point inside input
            </PresetButton>
            <PresetButton onClick={() => setWorldPoint(pointerPresets.gap)}>
              Point in empty space
            </PresetButton>
            <PresetButton onClick={() => setWorldPoint(pointerPresets.hit)}>
              Point inside hit test
            </PresetButton>
          </ControlGroup>
        </div>
        <div className="space-y-3">
          <StateCard
            rows={[
              ['screen', formatPoint(pointer.screen)],
              ['world', formatPoint(pointer.world)],
              ['winner', hovered?.label ?? 'none'],
            ]}
          />
          <HitTable point={worldPoint} />
        </div>
      </div>
    </ExplainerShell>
  )
}

export function CanvasHoverLayerExplorer() {
  const [camera, setCamera] = useState<Camera>(cameraDefault)
  const [worldPoint, setWorldPoint] = useState<Point>(pointerPresets.input)
  const [showBase, setShowBase] = useState(true)
  const [showOverlay, setShowOverlay] = useState(true)
  const [baseDraws, setBaseDraws] = useState(0)
  const [overlayDraws, setOverlayDraws] = useState(0)

  return (
    <ExplainerShell
      title="Stable scene, disposable hover"
      prompt="Toggle the overlay off. The base scene remains because hover feedback can live on a separate canvas."
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-2">
          <ControlGroup horizontal>
            <PresetButton onClick={() => setWorldPoint(pointerPresets.input)}>
              Hover a box
            </PresetButton>
            <PresetButton onClick={() => setWorldPoint(pointerPresets.gap)}>
              Hover empty space
            </PresetButton>
          </ControlGroup>
          <LayeredCanvas
            camera={camera}
            worldPoint={worldPoint}
            showBase={showBase}
            showOverlay={showOverlay}
            onWorldPointChange={setWorldPoint}
            onBaseDraw={() => setBaseDraws((count) => count + 1)}
            onOverlayDraw={() => setOverlayDraws((count) => count + 1)}
            onWheelZoom={(event) => {
              if (!event.metaKey && !event.ctrlKey) return
              event.preventDefault()
              const rect = event.currentTarget.getBoundingClientRect()
              const anchor = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              }
              const multiplier = event.deltaY < 0 ? 1.12 : 0.88
              setCamera((current) =>
                zoomCameraAtScreenPoint(current, current.scale * multiplier, anchor)
              )
            }}
            zoomControls={{
              onReset: () => setCamera(cameraDefault),
              onZoom: (scale) =>
                setCamera((current) => zoomCamera(current, scale)),
              onPan: (delta, startCamera) =>
                setCamera({
                  ...startCamera,
                  x: startCamera.x + delta.x,
                  y: startCamera.y + delta.y,
                }),
            }}
          />
        </div>
        <div className="space-y-3">
          <ControlGroup>
            <ToggleButton active={showBase} onClick={() => setShowBase(!showBase)}>
              Base layer
            </ToggleButton>
            <ToggleButton
              active={showOverlay}
              onClick={() => setShowOverlay(!showOverlay)}
            >
              Overlay layer
            </ToggleButton>
          </ControlGroup>
          <StateCard
            rows={[
              ['base draws', String(baseDraws)],
              ['overlay draws', String(overlayDraws)],
              ['hover target', hitTest(worldPoint)?.label ?? 'none'],
            ]}
          />
        </div>
      </div>
    </ExplainerShell>
  )
}

export function CanvasPanMathExplorer() {
  const [camera, setCamera] = useState<Camera>({ x: -20, y: 18, scale: 1 })
  const [dragDelta, setDragDelta] = useState<Point>({ x: 0, y: 0 })

  return (
    <ExplainerShell
      title="Pan the camera, not the objects"
      prompt="Drag the canvas, or use the shared zoom controls. The boxes keep their world coordinates; the camera changes."
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-2">
          <ControlGroup horizontal>
            <PresetButton
              onClick={() => {
                setCamera({ x: -20, y: 18, scale: 1 })
                setDragDelta({ x: 0, y: 0 })
              }}
            >
              Reset camera
            </PresetButton>
            <PresetButton
              onClick={() => {
                setCamera({ x: -146, y: 72, scale: 1.35 })
                setDragDelta({ x: 0, y: 0 })
              }}
            >
              Zoomed preset
            </PresetButton>
          </ControlGroup>
          <SceneSingleCanvas
            camera={camera}
            initialWorldPoint={pointerPresets.render}
            showPointer
            onWheelZoom={(event) => {
              if (!event.metaKey && !event.ctrlKey) return
              event.preventDefault()
              const rect = event.currentTarget.getBoundingClientRect()
              const anchor = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              }
              const multiplier = event.deltaY < 0 ? 1.12 : 0.88
              setCamera((current) =>
                zoomCameraAtScreenPoint(current, current.scale * multiplier, anchor)
              )
            }}
            zoomControls={{
              onReset: () => {
                setCamera({ x: -20, y: 18, scale: 1 })
                setDragDelta({ x: 0, y: 0 })
              },
              onZoom: (scale) =>
                setCamera((current) => zoomCamera(current, scale)),
              onPan: (delta, startCamera) => {
                setDragDelta(delta)
                setCamera({
                  ...startCamera,
                  x: startCamera.x + delta.x,
                  y: startCamera.y + delta.y,
                })
              },
            }}
          />
        </div>
        <div className="space-y-3">
          <StateCard
            rows={[
              ['drag delta', formatPoint(dragDelta)],
              ['camera.x', String(Math.round(camera.x))],
              ['camera.y', String(Math.round(camera.y))],
              ['scale', String(camera.scale)],
            ]}
          />
        </div>
      </div>
    </ExplainerShell>
  )
}

export function CanvasScatterPlotExplorer() {
  const scatterDefaultCamera = { x: 20, y: 32, scale: 0.75 }
  const [camera, setCamera] = useState<Camera>(scatterDefaultCamera)
  const [seed, setSeed] = useState(1)
  const [scatterMode, setScatterMode] = useState<ScatterMode>('clusters')
  const [hovered, setHovered] = useState<{
    candidates: number
    index: number | null
    point: ScatterPoint | null
    screen: Point | null
  }>({
    candidates: 0,
    index: null,
    point: null,
    screen: null,
  })
  const scatter = useMemo(
    () => createScatterIndex(10_000, seed, scatterMode),
    [scatterMode, seed]
  )
  const clearHover = () =>
    setHovered({
      candidates: 0,
      index: null,
      point: null,
      screen: null,
    })

  return (
    <ExplainerShell
      title="10,000 points, same loop"
      prompt="This canvas renders 10,000 points. Move the pointer: hit testing searches nearby grid cells instead of scanning every point."
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-2">
          <ControlGroup horizontal>
            <PresetButton onClick={() => setCamera(scatterDefaultCamera)}>
              Full cloud
            </PresetButton>
            <PresetButton
              onClick={() => setCamera({ x: -318, y: -110, scale: 1.85 })}
            >
              Dense cluster
            </PresetButton>
            <PresetButton
              onClick={() => {
                setSeed((current) => current + 1)
                setScatterMode('clusters')
                clearHover()
              }}
            >
              Random clusters
            </PresetButton>
            <PresetButton
              onClick={() => {
                setSeed((current) => current + 1)
                setScatterMode('uniform')
                clearHover()
              }}
            >
              Random everywhere
            </PresetButton>
          </ControlGroup>
          <ScatterCanvas
            camera={camera}
            index={scatter}
            hoveredIndex={hovered.index}
            onHover={setHovered}
            onWheelZoom={(event) => {
              if (!event.metaKey && !event.ctrlKey) return
              event.preventDefault()
              const rect = event.currentTarget.getBoundingClientRect()
              const anchor = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              }
              const multiplier = event.deltaY < 0 ? 1.12 : 0.88
              setCamera((current) =>
                zoomCameraAtScreenPoint(current, current.scale * multiplier, anchor)
              )
            }}
            zoomControls={{
              onReset: () => setCamera(scatterDefaultCamera),
              onZoom: (scale) =>
                setCamera((current) => zoomCamera(current, scale)),
              onPan: (delta, startCamera) =>
                setCamera({
                  ...startCamera,
                  x: startCamera.x + delta.x,
                  y: startCamera.y + delta.y,
                }),
            }}
          />
        </div>
        <div className="space-y-3">
          <StateCard
            rows={[
              ['points', '10,000'],
              ['mode', scatter.mode],
              ['seed', String(seed)],
              ['grid cells', String(scatter.cells.size)],
              ['candidates', String(hovered.candidates)],
              ['nearest', hovered.index === null ? 'none' : `#${hovered.index}`],
              [
                'world',
                hovered.point
                  ? `${Math.round(hovered.point.x)}, ${Math.round(
                      hovered.point.y
                    )}`
                  : 'none',
              ],
            ]}
          />
        </div>
      </div>
    </ExplainerShell>
  )
}

export function CanvasScatterAnimationExplorer() {
  const animationDefaultCamera = { x: 20, y: 32, scale: 0.75 }
  const animationViewportRef = useRef<HTMLDivElement>(null)
  const [camera, setCamera] = useState<Camera>(animationDefaultCamera)
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [seed, setSeed] = useState(7)
  const directionRef = useRef(1)
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const randomPoints = useMemo(
    () => createScatterIndex(10_000, seed, 'uniform').points,
    [seed]
  )
  const clusterPoints = useMemo(
    () => createScatterIndex(10_000, seed + 1000, 'clusters').points,
    [seed]
  )

  useEffect(() => {
    const element = animationViewportRef.current
    if (!element) return

    let resumeTimeout: number | null = null

    function clearResumeTimeout() {
      if (resumeTimeout !== null) {
        window.clearTimeout(resumeTimeout)
        resumeTimeout = null
      }
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearResumeTimeout()

        if (entry?.isIntersecting) {
          resumeTimeout = window.setTimeout(() => {
            setIsVisible(true)
            resumeTimeout = null
          }, 300)
        } else {
          setIsVisible(false)
        }
      },
      {
        threshold: 0.08,
      }
    )

    observer.observe(element)

    return () => {
      clearResumeTimeout()
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!playing || !isVisible) {
      lastTimeRef.current = null
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      return
    }

    function tick(time: number) {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time
      }

      const delta = time - lastTimeRef.current
      lastTimeRef.current = time
      setProgress((current) => {
        let next = current + (delta / 2000) * directionRef.current

        if (next >= 1) {
          next = 1
          directionRef.current = -1
        } else if (next <= 0) {
          next = 0
          directionRef.current = 1
        }

        return next
      })
      frameRef.current = window.requestAnimationFrame(tick)
    }

    frameRef.current = window.requestAnimationFrame(tick)
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [isVisible, playing])

  return (
    <ExplainerShell
      title="Animate the same 10,000 positions"
      prompt="The animation is just the deterministic time slider moving. At t=0 each point is random; at t=1 the same point has a clustered target."
    >
      <div
        ref={animationViewportRef}
        className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]"
      >
        <div className="space-y-2">
          <ControlGroup horizontal>
            <PresetButton onClick={() => setPlaying((current) => !current)}>
              {playing ? 'Pause' : 'Play'} loop
            </PresetButton>
            <PresetButton
              onClick={() => {
                setProgress(0)
                directionRef.current = 1
                lastTimeRef.current = null
              }}
            >
              Reset time
            </PresetButton>
            <PresetButton
              onClick={() => {
                setSeed((current) => current + 1)
                setProgress(0)
                directionRef.current = 1
                lastTimeRef.current = null
              }}
            >
              New endpoints
            </PresetButton>
          </ControlGroup>
          <label className="block bg-white p-3 text-sm dark:bg-neutral-950">
            <span className="mb-2 flex items-center justify-between gap-3">
              <span>time</span>
              <span className="font-mono">{progress.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              onChange={(event) => {
                setPlaying(false)
                setProgress(Number(event.currentTarget.value))
              }}
              className="w-full"
            />
          </label>
          <AnimatedScatterCanvas
            camera={camera}
            from={randomPoints}
            progress={progress}
            to={clusterPoints}
            onWheelZoom={(event) => {
              if (!event.metaKey && !event.ctrlKey) return
              event.preventDefault()
              const rect = event.currentTarget.getBoundingClientRect()
              const anchor = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              }
              const multiplier = event.deltaY < 0 ? 1.12 : 0.88
              setCamera((current) =>
                zoomCameraAtScreenPoint(current, current.scale * multiplier, anchor)
              )
            }}
            zoomControls={{
              onReset: () => setCamera(animationDefaultCamera),
              onZoom: (scale) =>
                setCamera((current) => zoomCamera(current, scale)),
              onPan: (delta, startCamera) =>
                setCamera({
                  ...startCamera,
                  x: startCamera.x + delta.x,
                  y: startCamera.y + delta.y,
                }),
            }}
          />
        </div>
        <div className="space-y-3">
          <StateCard
            rows={[
              ['points', '10,000'],
              ['t', progress.toFixed(3)],
              ['direction', directionRef.current === 1 ? 'to cluster' : 'to random'],
              ['duration', '2s per leg'],
              ['viewport', isVisible ? 'visible' : 'paused'],
              ['seed', String(seed)],
            ]}
          />
        </div>
      </div>
    </ExplainerShell>
  )
}

export function CanvasInteractivityExplorer() {
  return <CanvasWholeSystemPreview />
}

function SceneSingleCanvas(props: {
  camera: Camera
  initialWorldPoint?: Point
  onWheelZoom?: (event: ReactWheelEvent<HTMLCanvasElement>) => void
  onWorldPointChange?: (point: Point) => void
  showPointer?: boolean
  zoomControls?: {
    onReset: () => void
    onZoom: (scale: number) => void
    onPan?: (delta: Point, startCamera: Camera) => void
  }
}) {
  const { wrapperRef, size } = useCanvasSize()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragRef = useRef<{
    pointerId: number
    start: Point
    camera: Camera
  } | null>(null)
  const [pointer, setPointer] = useState<PointerState | null>(
    props.initialWorldPoint
      ? pointerFromWorld(props.initialWorldPoint, props.camera)
      : null
  )

  useEffect(() => {
    if (!props.initialWorldPoint) return
    setPointer(pointerFromWorld(props.initialWorldPoint, props.camera))
  }, [props.camera, props.initialWorldPoint])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = setupCanvas(canvas, size.width, size.height)
    if (!context) return

    drawBaseScene(context, props.camera, size.width, size.height)
    if (props.showPointer && pointer) {
      drawPointer(
        context,
        pointer,
        props.camera,
        hitTest(pointer.world),
        size.width
      )
    }
  }, [pointer, props.camera, props.showPointer, size])

  function handleMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current
    if (drag && props.zoomControls?.onPan) {
      props.zoomControls.onPan(
        {
          x: event.clientX - drag.start.x,
          y: event.clientY - drag.start.y,
        },
        drag.camera
      )
      return
    }

    const nextPointer = pointerFromEvent(event, props.camera)
    setPointer(nextPointer)
    props.onWorldPointChange?.(nextPointer.world)
  }

  function handleDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!props.zoomControls?.onPan) return

    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      camera: props.camera,
    }
  }

  function stopDrag(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <canvas
        ref={canvasRef}
        className="block cursor-grab touch-none bg-white ring-1 ring-neutral-200 active:cursor-grabbing dark:bg-neutral-950 dark:ring-neutral-800"
        aria-label="Canvas scene model diagram"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onWheel={props.onWheelZoom}
      />
      {props.zoomControls ? (
        <ZoomOverlay
          camera={props.camera}
          onReset={props.zoomControls.onReset}
          onZoom={props.zoomControls.onZoom}
        />
      ) : null}
    </div>
  )
}

function LayeredCanvas(props: {
  camera: Camera
  onBaseDraw?: () => void
  onOverlayDraw?: () => void
  onWheelZoom?: (event: ReactWheelEvent<HTMLCanvasElement>) => void
  onWorldPointChange: (point: Point) => void
  showBase: boolean
  showOverlay: boolean
  worldPoint: Point
  zoomControls?: {
    onReset: () => void
    onZoom: (scale: number) => void
    onPan?: (delta: Point, startCamera: Camera) => void
  }
}) {
  const { wrapperRef, size } = useCanvasSize()
  const baseRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const pointer = useMemo(
    () => pointerFromWorld(props.worldPoint, props.camera),
    [props.camera, props.worldPoint]
  )
  const dragRef = useRef<{
    pointerId: number
    start: Point
    camera: Camera
  } | null>(null)

  useEffect(() => {
    const canvas = baseRef.current
    if (!canvas) return

    const context = setupCanvas(canvas, size.width, size.height)
    if (!context) return

    if (props.showBase) {
      drawBaseScene(context, props.camera, size.width, size.height)
    } else {
      clearCanvas(context)
    }
    props.onBaseDraw?.()
  }, [props.camera, props.showBase, size.height, size.width])

  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    const context = setupCanvas(canvas, size.width, size.height)
    if (!context) return

    if (props.showOverlay) {
      clearCanvas(context)
      drawPointer(context, pointer, props.camera, hitTest(pointer.world), size.width)
    } else {
      clearCanvas(context)
    }
    props.onOverlayDraw?.()
  }, [pointer, props.camera, props.showOverlay, size.height, size.width])

  function handleMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current
    if (drag && props.zoomControls?.onPan) {
      props.zoomControls.onPan(
        {
          x: event.clientX - drag.start.x,
          y: event.clientY - drag.start.y,
        },
        drag.camera
      )
      return
    }

    const nextPointer = pointerFromEvent(event, props.camera)
    props.onWorldPointChange(nextPointer.world)
  }

  function handleDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!props.zoomControls?.onPan) return

    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      camera: props.camera,
    }
  }

  function stopDrag(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <canvas
        ref={baseRef}
        className="absolute inset-0 block bg-white ring-1 ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-800"
        aria-label="Base canvas layer"
      />
      <canvas
        ref={overlayRef}
        className="relative block cursor-grab touch-none active:cursor-grabbing"
        aria-label="Overlay canvas layer"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onWheel={props.onWheelZoom}
      />
      {props.zoomControls ? (
        <ZoomOverlay
          camera={props.camera}
          onReset={props.zoomControls.onReset}
          onZoom={props.zoomControls.onZoom}
        />
      ) : null}
    </div>
  )
}

function ScatterCanvas(props: {
  camera: Camera
  hoveredIndex: number | null
  index: ScatterIndex
  onHover: (state: {
    candidates: number
    index: number | null
    point: ScatterPoint | null
    screen: Point | null
  }) => void
  onWheelZoom?: (event: ReactWheelEvent<HTMLCanvasElement>) => void
  zoomControls?: {
    onReset: () => void
    onZoom: (scale: number) => void
    onPan?: (delta: Point, startCamera: Camera) => void
  }
}) {
  const { wrapperRef, size } = useCanvasSize(360)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragRef = useRef<{
    pointerId: number
    start: Point
    camera: Camera
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = setupCanvas(canvas, size.width, size.height)
    if (!context) return

    drawScatterPlot(
      context,
      props.index.points,
      props.camera,
      size.width,
      size.height,
      props.hoveredIndex
    )
  }, [props.camera, props.hoveredIndex, props.index.points, size])

  function handleMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current
    if (drag && props.zoomControls?.onPan) {
      props.zoomControls.onPan(
        {
          x: event.clientX - drag.start.x,
          y: event.clientY - drag.start.y,
        },
        drag.camera
      )
      return
    }

    const pointer = pointerFromEvent(event, props.camera)
    const result = hitTestScatter(props.index, pointer.world, props.camera)
    props.onHover({
      ...result,
      screen: result.point ? worldToScreen(result.point, props.camera) : null,
    })
  }

  function handleDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!props.zoomControls?.onPan) return

    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      camera: props.camera,
    }
  }

  function stopDrag(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <canvas
        ref={canvasRef}
        className="block cursor-grab touch-none bg-white ring-1 ring-neutral-200 active:cursor-grabbing dark:bg-neutral-950 dark:ring-neutral-800"
        aria-label="10,000 point scatter plot canvas"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onPointerLeave={() =>
          props.onHover({
            candidates: 0,
            index: null,
            point: null,
            screen: null,
          })
        }
        onWheel={props.onWheelZoom}
      />
      {props.zoomControls ? (
        <ZoomOverlay
          camera={props.camera}
          onReset={props.zoomControls.onReset}
          onZoom={props.zoomControls.onZoom}
        />
      ) : null}
    </div>
  )
}

function AnimatedScatterCanvas(props: {
  camera: Camera
  from: ScatterPoint[]
  onWheelZoom?: (event: ReactWheelEvent<HTMLCanvasElement>) => void
  progress: number
  to: ScatterPoint[]
  zoomControls?: {
    onReset: () => void
    onZoom: (scale: number) => void
    onPan?: (delta: Point, startCamera: Camera) => void
  }
}) {
  const { wrapperRef, size } = useCanvasSize(360)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragRef = useRef<{
    pointerId: number
    start: Point
    camera: Camera
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = setupCanvas(canvas, size.width, size.height)
    if (!context) return

    drawScatterTransition(
      context,
      props.from,
      props.to,
      props.progress,
      props.camera,
      size.width,
      size.height
    )
  }, [props.camera, props.from, props.progress, props.to, size])

  function handleMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current
    if (!drag || !props.zoomControls?.onPan) return

    props.zoomControls.onPan(
      {
        x: event.clientX - drag.start.x,
        y: event.clientY - drag.start.y,
      },
      drag.camera
    )
  }

  function handleDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!props.zoomControls?.onPan) return

    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      camera: props.camera,
    }
  }

  function stopDrag(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <canvas
        ref={canvasRef}
        className="block cursor-grab touch-none bg-white ring-1 ring-neutral-200 active:cursor-grabbing dark:bg-neutral-950 dark:ring-neutral-800"
        aria-label="animated scatter plot canvas"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onWheel={props.onWheelZoom}
      />
      {props.zoomControls ? (
        <ZoomOverlay
          camera={props.camera}
          onReset={props.zoomControls.onReset}
          onZoom={props.zoomControls.onZoom}
        />
      ) : null}
    </div>
  )
}

function createScatterIndex(
  count: number,
  seed: number,
  mode: ScatterMode
): ScatterIndex {
  const points: ScatterPoint[] = []
  const cellSize = 32
  const centers = createScatterCenters(seed)

  for (let index = 0; index < count; index += 1) {
    const group = index % centers.length
    if (mode === 'uniform') {
      points.push({
        group,
        x: seededNoise(index, seed, 11) * 720 - 36,
        y: seededNoise(index, seed, 12) * 380 - 28,
      })
    } else {
      const centerPoint = centers[group]
      const angle = seededNoise(index, seed, 1) * Math.PI * 2
      const radius =
        Math.sqrt(seededNoise(index, seed, 2)) * (42 + group * 11) +
        seededNoise(index, seed, 3) * 18
      const skew = (seededNoise(index, seed, 4) - 0.5) * 56

      points.push({
        group,
        x: centerPoint.x + Math.cos(angle) * radius + skew,
        y: centerPoint.y + Math.sin(angle) * radius * 0.62 - skew * 0.22,
      })
    }
  }

  const cells = new Map<string, number[]>()
  points.forEach((point, index) => {
    const key = scatterCellKey(point, cellSize)
    const bucket = cells.get(key)
    if (bucket) {
      bucket.push(index)
    } else {
      cells.set(key, [index])
    }
  })

  return { cellSize, cells, mode, points }
}

function seededNoise(index: number, seed: number, salt: number) {
  const value =
    Math.sin(index * 12.9898 + seed * 37.719 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function createScatterCenters(seed: number) {
  return Array.from({ length: 4 }, (_, index) => ({
    x: 92 + seededNoise(index, seed, 21) * 560,
    y: 74 + seededNoise(index, seed, 22) * 240,
  }))
}

function scatterCellKey(point: Point, cellSize: number) {
  return `${Math.floor(point.x / cellSize)},${Math.floor(point.y / cellSize)}`
}

function hitTestScatter(index: ScatterIndex, world: Point, camera: Camera) {
  const radius = 8 / camera.scale
  const cellX = Math.floor(world.x / index.cellSize)
  const cellY = Math.floor(world.y / index.cellSize)
  const radiusCells = Math.ceil(radius / index.cellSize)
  const candidates: number[] = []

  for (let y = cellY - radiusCells; y <= cellY + radiusCells; y += 1) {
    for (let x = cellX - radiusCells; x <= cellX + radiusCells; x += 1) {
      const bucket = index.cells.get(`${x},${y}`)
      if (bucket) candidates.push(...bucket)
    }
  }

  let nearestIndex: number | null = null
  let nearestDistance = Infinity
  candidates.forEach((candidateIndex) => {
    const point = index.points[candidateIndex]
    const dx = point.x - world.x
    const dy = point.y - world.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance <= radius && distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = candidateIndex
    }
  })

  return {
    candidates: candidates.length,
    index: nearestIndex,
    point: nearestIndex === null ? null : index.points[nearestIndex],
  }
}

function drawScatterPlot(
  context: CanvasRenderingContext2D,
  points: ScatterPoint[],
  camera: Camera,
  width: number,
  height: number,
  hoveredIndex: number | null
) {
  clearCanvas(context)
  context.save()
  context.fillStyle = '#fafafa'
  context.fillRect(0, 0, width, height)
  drawGrid(context, camera, width, height)

  const colors = ['#0284c7', '#16a34a', '#ca8a04', '#dc2626']
  const visibleWorldMin = screenToWorld({ x: -8, y: -8 }, camera)
  const visibleWorldMax = screenToWorld({ x: width + 8, y: height + 8 }, camera)

  context.save()
  context.globalAlpha = 0.58
  points.forEach((point) => {
    if (
      point.x < visibleWorldMin.x ||
      point.x > visibleWorldMax.x ||
      point.y < visibleWorldMin.y ||
      point.y > visibleWorldMax.y
    ) {
      return
    }

    const screen = worldToScreen(point, camera)
    context.fillStyle = colors[point.group]
    context.fillRect(screen.x - 1.4, screen.y - 1.4, 2.8, 2.8)
  })
  context.restore()

  if (hoveredIndex !== null) {
    const point = points[hoveredIndex]
    const screen = worldToScreen(point, camera)
    context.save()
    context.strokeStyle = '#171717'
    context.fillStyle = '#ffffff'
    context.lineWidth = 2
    context.beginPath()
    context.arc(screen.x, screen.y, 6, 0, Math.PI * 2)
    context.fill()
    context.stroke()
    drawTooltip(context, `point #${hoveredIndex}`, screen.x, screen.y, width)
    context.restore()
  }

  context.restore()
}

function drawScatterTransition(
  context: CanvasRenderingContext2D,
  from: ScatterPoint[],
  to: ScatterPoint[],
  progress: number,
  camera: Camera,
  width: number,
  height: number
) {
  clearCanvas(context)
  context.save()
  context.fillStyle = '#fafafa'
  context.fillRect(0, 0, width, height)
  drawGrid(context, camera, width, height)

  const colors = ['#0284c7', '#16a34a', '#ca8a04', '#dc2626']
  const visibleWorldMin = screenToWorld({ x: -8, y: -8 }, camera)
  const visibleWorldMax = screenToWorld({ x: width + 8, y: height + 8 }, camera)
  const eased = easeInOutCubic(progress)

  context.save()
  context.globalAlpha = 0.62
  for (let index = 0; index < from.length; index += 1) {
    const start = from[index]
    const end = to[index]
    const x = start.x + (end.x - start.x) * eased
    const y = start.y + (end.y - start.y) * eased

    if (
      x < visibleWorldMin.x ||
      x > visibleWorldMax.x ||
      y < visibleWorldMin.y ||
      y > visibleWorldMax.y
    ) {
      continue
    }

    const screen = worldToScreen({ x, y }, camera)
    context.fillStyle = colors[start.group]
    context.fillRect(screen.x - 1.4, screen.y - 1.4, 2.8, 2.8)
  }
  context.restore()
  context.restore()
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2
}

function ExplainerShell(props: {
  children: ReactNode
  compact?: boolean
  prompt: string
  title: string
}) {
  const { ref, style } = useCenteredBleedStyle(props.compact ? 'compact' : 'wide')

  return (
    <div
      ref={ref}
      data-canvas-explorer
      className="not-prose my-8 bg-neutral-50 p-3 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50"
      style={style}
    >
      <div className="mb-3 grid gap-2 md:grid-cols-[16rem_1fr]">
        <div>
          <h3 className="!m-0 text-lg font-medium tracking-tight">
            {props.title}
          </h3>
        </div>
        <p className="m-0 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
          {props.prompt}
        </p>
      </div>
      {props.children}
    </div>
  )
}

function useCenteredBleedStyle(mode: 'compact' | 'wide') {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<CSSProperties>({})

  useEffect(() => {
    const element = ref.current
    const parent = element?.parentElement
    if (!element || !parent) return
    const parentElement = parent

    function update() {
      const parentRect = parentElement.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const gutter = 16
      const parentCenter = parentRect.left + parentRect.width / 2
      const leftRoom = Math.max(0, parentCenter - gutter)
      const rightRoom = Math.max(0, viewportWidth - parentCenter - gutter)
      const centeredLimit = 2 * Math.min(leftRoom, rightRoom)
      const desiredWidth =
        mode === 'compact'
          ? Math.min(parentRect.width + 200, viewportWidth * 0.82, 860)
          : Math.min(viewportWidth * 0.92, 1184)
      const width = Math.max(220, Math.min(desiredWidth, centeredLimit))
      const marginLeft = (parentRect.width - width) / 2

      setStyle({
        marginLeft: `${Math.round(marginLeft)}px`,
        width: `${Math.round(width)}px`,
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(parentElement)
    window.addEventListener('resize', update)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [mode])

  return { ref, style }
}

function ControlGroup(props: { children: ReactNode; horizontal?: boolean }) {
  return (
    <div
      className={
        props.horizontal
          ? 'grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]'
          : 'grid gap-2'
      }
    >
      {props.children}
    </div>
  )
}

function ZoomOverlay(props: {
  camera: Camera
  onReset: () => void
  onZoom: (scale: number) => void
}) {
  return (
    <div className="absolute right-2 top-2 z-10 flex items-center overflow-hidden rounded-md border border-neutral-200 bg-white/90 text-xs shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
      <button
        type="button"
        onClick={() => props.onZoom(props.camera.scale / 1.2)}
        className="h-7 w-7 border-r border-neutral-200 text-sm leading-none hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
        aria-label="Zoom out"
      >
        -
      </button>
      <button
        type="button"
        onClick={props.onReset}
        className="h-7 min-w-12 border-r border-neutral-200 px-2 font-mono leading-none hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
        aria-label="Reset zoom"
      >
        {props.camera.scale.toFixed(2)}x
      </button>
      <button
        type="button"
        onClick={() => props.onZoom(props.camera.scale * 1.2)}
        className="h-7 w-7 text-sm leading-none hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label="Zoom in"
      >
        +
      </button>
    </div>
  )
}

function PresetButton(props: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="group flex min-w-0 items-center gap-2 rounded-md bg-white px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800"
    >
      <span className="shrink-0 whitespace-nowrap font-mono text-neutral-400 transition group-hover:text-neutral-950 dark:group-hover:text-neutral-50">
        -&gt;
      </span>
      <span className="min-w-0">{props.children}</span>
    </button>
  )
}

function ToggleButton(props: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={props.active}
      onClick={props.onClick}
      className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800"
    >
      <span>{props.children}</span>
      <span
        className={`h-5 w-9 rounded-full p-0.5 transition ${
          props.active ? 'bg-neutral-950 dark:bg-neutral-50' : 'bg-neutral-300'
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition dark:bg-neutral-950 ${
            props.active ? 'translate-x-4' : ''
          }`}
        />
      </span>
    </button>
  )
}

function StateCard(props: { rows: Array<[string, string]> }) {
  return (
    <div className="bg-white p-3 dark:bg-neutral-950">
      <div className="mb-2 text-sm font-medium">Hidden state</div>
      <div className="space-y-1 text-xs">
        {props.rows.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[6rem_1fr] gap-2 border-b border-neutral-100 py-1 last:border-b-0 dark:border-neutral-900"
          >
            <span className="text-neutral-500 dark:text-neutral-400">
              {label}
            </span>
            <span className="font-mono">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HitTable(props: { point: Point }) {
  return (
    <div className="bg-white p-3 dark:bg-neutral-950">
      <div className="mb-2 text-sm font-medium">Rectangle tests</div>
      <div className="space-y-1 text-xs">
        {boxes.map((box) => {
          const hit = isInsideBox(props.point, box)
          return (
            <div
              key={box.id}
              className="grid grid-cols-[1fr_auto] gap-2 border-b border-neutral-100 py-1 last:border-b-0 dark:border-neutral-900"
            >
              <span>{box.label}</span>
              <span
                className={
                  hit
                    ? 'font-mono text-sky-700 dark:text-sky-300'
                    : 'font-mono text-neutral-500 dark:text-neutral-500'
                }
              >
                {hit ? 'inside' : 'outside'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Legend() {
  return (
    <div className="mt-3 grid gap-2 text-xs text-neutral-700 dark:text-neutral-300 sm:grid-cols-5">
      <LegendItem color="bg-sky-100" label="input event" />
      <LegendItem color="bg-green-100" label="coordinate transform" />
      <LegendItem color="bg-amber-100" label="hit test" />
      <LegendItem color="bg-red-100" label="redraw" />
      <LegendItem color="bg-violet-600" label="pointer state" dark />
    </div>
  )
}

function LegendItem(props: { color: string; dark?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white p-2 dark:bg-neutral-950">
      <span className={`h-3 w-3 rounded-full ${props.color}`} />
      <span className={props.dark ? 'text-neutral-700 dark:text-neutral-300' : ''}>
        {props.label}
      </span>
    </div>
  )
}

function MiniNote(props: { children: ReactNode }) {
  return (
    <div className="bg-white p-3 text-sm leading-6 text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300">
      {props.children}
    </div>
  )
}

function formatPoint(point: Point) {
  return `${Math.round(point.x)}, ${Math.round(point.y)}`
}
