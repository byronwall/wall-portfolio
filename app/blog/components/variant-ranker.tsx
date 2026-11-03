'use client'

import { useState } from 'react'
import { varyRuns } from './variant-ranker-data'
import styles from './variant-ranker.module.css'

type Run = (typeof varyRuns)[number]
type Variant = Run['variants'][number]
type Prefer = 'fewer-crossings' | 'compact' | 'stable'

const area = (v: Variant) => v.w * v.h

// Ported from draftably src/cli/variants.ts `improves()`, without --fit.
function improves(v: Variant, base: Variant) {
  if (v.warnings > base.warnings || v.crossings > base.crossings) return false
  if (v.warnings < base.warnings) return true
  const fewer = v.crossings < base.crossings
  return area(v) <= area(base) && (fewer || area(v) < area(base))
}

function keys(v: Variant, prefer: Prefer) {
  if (prefer === 'compact') return [v.warnings, area(v), v.crossings, v.bends]
  if (prefer === 'stable') return [v.warnings, v.moved, v.crossings, area(v)]
  return [v.warnings, v.crossings, area(v), v.bends]
}

const compareKeys = (a: number[], b: number[]) => {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]
  return 0
}

function recommend(run: Run, prefer: Prefer) {
  const [v0, ...rest] = run.variants
  const pick = rest
    .filter(v => improves(v, v0))
    .sort((a, b) => compareKeys(keys(a, prefer), keys(b, prefer)))[0]
  return pick?.id ?? 'v0'
}

const pct = (v: Variant, base: Variant) => Math.round((area(v) / area(base) - 1) * 100)
const signed = (n: number, unit = '') => (n > 0 ? `+${n}${unit}` : `${n}${unit}`)

/** One sentence on why this variant wins, ties, or is a trade the rule will not make. */
function verdict(v: Variant, base: Variant) {
  if (v.id === 'v0') return 'The file as it is. Every other tile is measured against it.'
  const dc = v.crossings - base.crossings
  const da = pct(v, base)
  const dw = v.warnings - base.warnings
  if (dw > 0) return `Adds ${dw} warning${dw > 1 ? 's' : ''}. A new conflict loses, whatever else it fixes.`
  if (dc > 0) return `${dc} more crossing${dc > 1 ? 's' : ''}. Worse on a gate, so it can never win.`
  if (improves(v, base)) {
    const gains = [dc < 0 && `${-dc} fewer crossing${dc < -1 ? 's' : ''}`, da < 0 && `${-da}% smaller`]
      .filter(Boolean)
      .join(' and ')
    return `No worse anywhere, and ${gains || 'a little smaller'}. A safe change.`
  }
  if (dc < 0) return `${-dc} fewer crossing${dc < -1 ? 's' : ''}, but ${da}% bigger. A trade, so the rule leaves it to you.`
  return `Same crossings and ${signed(da, '%')} area. Different, not better.`
}

const PREFER: [Prefer, string][] = [
  ['fewer-crossings', 'Crossings first'],
  ['compact', 'Smallest first'],
  ['stable', 'Least moved first'],
]

export function VariantRanker({ run: runId, quiz = false }: { run?: string; quiz?: boolean }) {
  const fixed = runId ? varyRuns.find(r => r.id === runId) : undefined
  const [current, setCurrent] = useState<string>(fixed?.id ?? varyRuns[0].id)
  const [prefer, setPrefer] = useState<Prefer>('fewer-crossings')
  const [guess, setGuess] = useState<string | null>(null)
  const [focus, setFocus] = useState<string | null>(null)

  const run = varyRuns.find(r => r.id === current)!
  const base = run.variants[0]
  const star = recommend(run, prefer)
  const hidden = quiz && !guess
  const shown = focus ?? (hidden ? null : star)
  const shownVariant = run.variants.find(v => v.id === shown)

  const pick = (id: string) => {
    if (hidden) setGuess(id)
    setFocus(id)
  }

  return (
    <figure className={styles.shell}>
      <header className={styles.head}>
        {fixed ? (
          <p className={styles.kicker}>draftably vary {fixed.id}.draft</p>
        ) : (
          <div className={styles.tabs} role="tablist" aria-label="Example diagram">
            {varyRuns.map(r => (
              <button
                key={r.id}
                role="tab"
                aria-selected={r.id === current}
                className={styles.tab}
                onClick={() => {
                  setCurrent(r.id)
                  setFocus(null)
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
        {!hidden && (
          <div className={styles.prefer} role="radiogroup" aria-label="--prefer">
            <span className={styles.flag}>--prefer</span>
            {PREFER.map(([id, label]) => (
              <button
                key={id}
                role="radio"
                aria-checked={prefer === id}
                className={styles.chip}
                onClick={() => setPrefer(id)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      {hidden && <p className={styles.ask}>Which layout would you keep? Click one.</p>}

      <div className={styles.grid}>
        {run.variants.map(v => {
          const isStar = !hidden && v.id === star
          const da = pct(v, base)
          return (
            <button
              key={v.id}
              className={styles.tile}
              data-star={isStar || undefined}
              data-focus={v.id === shown || undefined}
              data-guess={v.id === guess || undefined}
              onClick={() => pick(v.id)}
              onMouseEnter={() => !hidden && setFocus(v.id)}
              onMouseLeave={() => !hidden && setFocus(null)}
            >
              <span className={styles.tileHead}>
                <b>{v.id}</b> {v.id === 'v0' ? 'current' : v.title}
                {isStar && <span className={styles.star} title="recommended">★</span>}
              </span>
              <span className={styles.frame}>
                <img src={v.img} alt={`${run.label}, ${v.id}: ${v.title}`} loading="lazy" />
              </span>
              <span className={styles.metrics}>
                <Metric label="crossings" value={v.crossings} delta={v.crossings - base.crossings} base={v.id === 'v0'} />
                <Metric label="area" value={v.id === 'v0' ? `${v.w}×${v.h}` : ''} delta={da} unit="%" base={v.id === 'v0'} />
                <Metric label="warnings" value={v.warnings} delta={v.warnings - base.warnings} base={v.id === 'v0'} />
                <Metric label="moved" value={`${v.moved}px`} base />
              </span>
            </button>
          )
        })}
      </div>

      {!hidden && (
        <div className={styles.lower}>
          <Scatter run={run} star={star} focus={shown} onFocus={setFocus} />
          <div className={styles.readout} aria-live="polite">
            {guess && quiz && (
              <p className={styles.guess}>
                {guess === star
                  ? `You picked ${guess}, the same as the rule.`
                  : `You picked ${guess}. The rule picked ${star}.`}
              </p>
            )}
            {shownVariant && (
              <p>
                <b>{shownVariant.id}</b> {verdict(shownVariant, base)}
              </p>
            )}
            <p className={styles.legend}>
              The shaded corner is “no worse on crossings or area.” Only dots inside it, with no new warnings, can be
              recommended. Everything else is a trade.
            </p>
          </div>
        </div>
      )}
    </figure>
  )
}

function Metric(props: { label: string; value: string | number; delta?: number; unit?: string; base?: boolean }) {
  const { label, value, delta = 0, unit = '', base } = props
  const tone = base || delta === 0 ? undefined : delta < 0 ? 'good' : 'bad'
  return (
    <span className={styles.metric} data-tone={tone}>
      <span className={styles.metricLabel}>{label}</span>
      <span>
        {value}
        {!base && (delta !== 0 || value === '') && <i> {signed(delta, unit)}</i>}
      </span>
    </span>
  )
}

/** Crossings vs. area, both relative to v0, with the "no worse" corner shaded. */
function Scatter({ run, star, focus, onFocus }: { run: Run; star: string; focus: string | null; onFocus: (id: string | null) => void }) {
  const base = run.variants[0]
  const pts = run.variants.map(v => ({ v, x: pct(v, base), y: v.crossings - base.crossings }))
  const xMax = Math.max(20, ...pts.map(p => Math.abs(p.x))) * 1.15
  const yMax = Math.max(2, ...pts.map(p => Math.abs(p.y))) + 0.8
  const W = 320
  const H = 220
  const pad = 30
  const sx = (x: number) => pad + ((x + xMax) / (2 * xMax)) * (W - 2 * pad)
  const sy = (y: number) => pad / 2 + ((y + yMax) / (2 * yMax)) * (H - pad * 1.5)

  return (
    <svg className={styles.scatter} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Crossings and area of each variant, relative to the current drawing">
      <rect x={sx(-xMax)} y={sy(-yMax)} width={sx(0) - sx(-xMax)} height={sy(0) - sy(-yMax)} className={styles.better} />
      <line x1={sx(-xMax)} x2={sx(xMax)} y1={sy(0)} y2={sy(0)} className={styles.axis} />
      <line x1={sx(0)} x2={sx(0)} y1={sy(-yMax)} y2={sy(yMax)} className={styles.axis} />
      <text x={sx(-xMax) + 4} y={sy(-yMax) + 11} className={styles.cornerLabel}>
        fewer crossings, smaller
      </text>
      <text x={sx(xMax) - 4} y={H - 4} textAnchor="end" className={styles.axisLabel}>
        bigger than v0 →
      </text>
      <text x={4} y={sy(yMax) + 4} className={styles.axisLabel}>
        ↓ more crossings
      </text>
      {pts.map(({ v, x, y }) => {
        const worse = v.warnings > base.warnings
        return (
          <g
            key={v.id}
            className={styles.dot}
            data-star={v.id === star || undefined}
            data-focus={v.id === focus || undefined}
            data-worse={worse || undefined}
            transform={`translate(${sx(x)} ${sy(y)})`}
            onMouseEnter={() => onFocus(v.id)}
            onMouseLeave={() => onFocus(null)}
            onClick={() => onFocus(v.id)}
          >
            <circle r={v.id === star ? 9 : 7} />
            <text y={v.id === 'v0' ? 20 : -12} textAnchor="middle">
              {v.id}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** The #379 audit: numbers and visual judgment agreed on 39 of 63 pairs. */
export function AgreementWaffle() {
  return (
    <figure className={styles.waffleShell}>
      <div className={styles.waffle} role="img" aria-label="39 of 63 pairs agreed">
        {Array.from({ length: 63 }, (_, i) => (
          <span key={i} data-agree={i < 39 || undefined} />
        ))}
      </div>
      <figcaption>
        In <b>39 of 63</b> pairs, the measures and a visual judgment agreed on which layout was better. The other 24
        are why every card still shows the drawing.
      </figcaption>
    </figure>
  )
}
