'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './date-table-embed.module.css'

const DATE_TABLE_URL = '/tools/date-table.html'

export function DateTableEmbed() {
  const [expanded, setExpanded] = useState(false)
  const expandButtonRef = useRef<HTMLButtonElement>(null)
  const exitButtonRef = useRef<HTMLButtonElement>(null)
  const wasExpandedRef = useRef(false)

  useEffect(() => {
    if (!expanded) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setExpanded(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    requestAnimationFrame(() => exitButtonRef.current?.focus())

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [expanded])

  useEffect(() => {
    if (expanded) {
      wasExpandedRef.current = true
      return
    }

    if (wasExpandedRef.current) {
      requestAnimationFrame(() => expandButtonRef.current?.focus())
    }
  }, [expanded])

  return (
    <div
      className={`${styles.embed} ${expanded ? styles.expanded : ''} not-prose`}
      id="date-table-overlay"
      role={expanded ? 'dialog' : undefined}
      aria-modal={expanded ? true : undefined}
      aria-labelledby={expanded ? 'date-table-overlay-title' : undefined}
    >
      <div className={styles.surface}>
        {expanded && (
          <div className={styles.toolbar}>
            <p className={styles.toolbarTitle} id="date-table-overlay-title">
              Interactive Date Table
            </p>
            <div className={styles.toolbarActions}>
              <a href={DATE_TABLE_URL}>Open the Date Table in its own page</a>
              <button
                ref={exitButtonRef}
                className={styles.actionButton}
                type="button"
                aria-label="Exit full viewport size"
                aria-expanded={expanded}
                aria-controls="date-table-overlay"
                onClick={() => setExpanded(false)}
              >
                Exit full viewport size
              </button>
            </div>
          </div>
        )}

        <iframe
          className={styles.frame}
          src={DATE_TABLE_URL}
          title="Interactive Date Table editor"
        />

        {!expanded && (
          <div className={styles.normalActions}>
            <button
              ref={expandButtonRef}
              className={styles.actionButton}
              type="button"
              aria-label="Expand to full viewport size"
              aria-expanded={expanded}
              aria-controls="date-table-overlay"
              onClick={() => setExpanded(true)}
            >
              Expand to full viewport size
            </button>
            <a href={DATE_TABLE_URL}>Open the Date Table in its own page</a>
          </div>
        )}
      </div>
    </div>
  )
}
