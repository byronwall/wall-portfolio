'use client'

import { useEffect, useRef, useState } from 'react'

type XWidgets = {
  createTweet: (
    id: string,
    container: HTMLElement,
    options: {
      align: 'center'
      dnt: true
    }
  ) => Promise<HTMLElement | undefined>
}

type XApi = {
  ready?: (callback: (api: XApi) => void) => void
  widgets?: XWidgets
}

declare global {
  interface Window {
    twttr?: XApi
  }
}

let widgetsPromise: Promise<XWidgets> | undefined

function loadWidgets() {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr.widgets)
  if (widgetsPromise) return widgetsPromise

  widgetsPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error('X embed script did not become ready'))
    }, 10000)

    const resolveWhenReady = () => {
      if (window.twttr?.widgets) {
        window.clearTimeout(timeout)
        resolve(window.twttr.widgets)
        return
      }

      window.twttr?.ready?.((api) => {
        if (!api.widgets) return
        window.clearTimeout(timeout)
        resolve(api.widgets)
      })
    }

    const existingScript = document.getElementById('x-widgets-script')
    if (existingScript) {
      existingScript.addEventListener('load', resolveWhenReady, { once: true })
      resolveWhenReady()
      return
    }

    const script = document.createElement('script')
    script.id = 'x-widgets-script'
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.addEventListener('load', resolveWhenReady, { once: true })
    script.addEventListener(
      'error',
      () => {
        window.clearTimeout(timeout)
        reject(new Error('X embed script failed to load'))
      },
      { once: true }
    )
    document.head.appendChild(script)
  })

  return widgetsPromise
}

export function TweetEmbed({ id, url }: { id: string; url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')

  useEffect(() => {
    let cancelled = false

    async function renderTweet() {
      try {
        const widgets = await loadWidgets()
        if (cancelled || !containerRef.current) return

        containerRef.current.replaceChildren()
        const tweet = await widgets.createTweet(id, containerRef.current, {
          align: 'center',
          dnt: true,
        })
        if (!cancelled) setStatus(tweet ? 'loaded' : 'failed')
      } catch {
        if (!cancelled) setStatus('failed')
      }
    }

    renderTweet()

    return () => {
      cancelled = true
      containerRef.current?.replaceChildren()
    }
  }, [id])

  return (
    <div className="not-prose my-8">
      <div ref={containerRef} />
      {status !== 'loaded' && (
        <p className="mx-auto max-w-xl rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          {status === 'loading'
            ? 'Loading the original post from X…'
            : 'The X embed could not load in this browser.'}
        </p>
      )}
      <p className="mt-3 text-center text-sm">
        <a href={url} target="_blank" rel="noopener noreferrer">
          View the original post on X
        </a>
      </p>
    </div>
  )
}
