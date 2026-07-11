'use client'

import { useRef, useState, type HTMLAttributes } from 'react'

export function CodeBlock(props: HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    const code = preRef.current?.querySelector('code')?.textContent
    if (!code) return

    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="code-block">
      <pre ref={preRef} {...props} />
      <button
        className="code-copy-button"
        type="button"
        aria-label={copied ? 'Code copied' : 'Copy code'}
        title={copied ? 'Copied' : 'Copy code'}
        onClick={copyCode}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12 4 4L19 6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="8" y="8" width="11" height="11" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
        )}
      </button>
    </div>
  )
}
