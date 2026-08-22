'use client'

import { highlight } from 'sugar-high'
import { useMemo, useState } from 'react'
import styles from './code-file-browser.module.css'

export type CodeFile = {
  name: string
  path: string
  content: string
  language?: string
}

type CodeFileBrowserClientProps = {
  title: string
  archiveName: string
  files: CodeFile[]
}

const encoder = new TextEncoder()

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff

  for (let index = 0; index < bytes.length; index += 1) {
    crc ^= bytes[index]
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }

  return (crc ^ 0xffffffff) >>> 0
}

function setUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true)
}

function setUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true)
}

function joinBytes(parts: Uint8Array[]) {
  const result = new Uint8Array(
    parts.reduce((total, part) => total + part.byteLength, 0)
  )
  let offset = 0

  for (const part of parts) {
    result.set(part, offset)
    offset += part.byteLength
  }

  return result
}

function makeZip(files: CodeFile[]) {
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let localOffset = 0

  for (const file of files) {
    const name = encoder.encode(file.path)
    const data = encoder.encode(file.content)
    const checksum = crc32(data)

    const localHeader = new Uint8Array(30)
    const localView = new DataView(localHeader.buffer)
    setUint32(localView, 0, 0x04034b50)
    setUint16(localView, 4, 20)
    setUint16(localView, 6, 0x0800)
    setUint16(localView, 8, 0)
    setUint32(localView, 14, checksum)
    setUint32(localView, 18, data.byteLength)
    setUint32(localView, 22, data.byteLength)
    setUint16(localView, 26, name.byteLength)

    localParts.push(localHeader, name, data)

    const centralHeader = new Uint8Array(46)
    const centralView = new DataView(centralHeader.buffer)
    setUint32(centralView, 0, 0x02014b50)
    setUint16(centralView, 4, 20)
    setUint16(centralView, 6, 20)
    setUint16(centralView, 8, 0x0800)
    setUint16(centralView, 10, 0)
    setUint32(centralView, 16, checksum)
    setUint32(centralView, 20, data.byteLength)
    setUint32(centralView, 24, data.byteLength)
    setUint16(centralView, 28, name.byteLength)
    setUint32(centralView, 42, localOffset)

    centralParts.push(centralHeader, name)
    localOffset += localHeader.byteLength + name.byteLength + data.byteLength
  }

  const centralDirectory = joinBytes(centralParts)
  const end = new Uint8Array(22)
  const endView = new DataView(end.buffer)
  setUint32(endView, 0, 0x06054b50)
  setUint16(endView, 8, files.length)
  setUint16(endView, 10, files.length)
  setUint32(endView, 12, centralDirectory.byteLength)
  setUint32(endView, 16, localOffset)

  return new Blob([...localParts, centralDirectory, end], {
    type: 'application/zip',
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function copyText(content: string) {
  try {
    await navigator.clipboard.writeText(content)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = content
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14" />
    </svg>
  )
}

export function CodeFileBrowserClient({
  title,
  archiveName,
  files,
}: CodeFileBrowserClientProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [message, setMessage] = useState('')
  const activeFile = files[activeIndex]
  const highlightedCode = useMemo(
    () => highlight(activeFile.content),
    [activeFile.content]
  )
  const lineCount = activeFile.content.trimEnd().split('\n').length

  function showMessage(nextMessage: string) {
    setMessage(nextMessage)
    window.setTimeout(() => setMessage(''), 1800)
  }

  async function handleCopy() {
    await copyText(activeFile.content)
    showMessage(`Copied ${activeFile.name}`)
  }

  function handleFileDownload() {
    downloadBlob(new Blob([activeFile.content], { type: 'text/plain' }), activeFile.name)
    showMessage(`Downloaded ${activeFile.name}`)
  }

  function handleArchiveDownload() {
    downloadBlob(makeZip(files), archiveName)
    showMessage(`Downloaded ${archiveName}`)
  }

  return (
    <section className={`${styles.browser} not-prose`} aria-label={title}>
      <header className={styles.topbar}>
        <div>
          <h3>{title}</h3>
          <p>{files.length} files · ready to copy or download</p>
        </div>
        <button className={styles.primaryAction} type="button" onClick={handleArchiveDownload}>
          <DownloadIcon />
          Download ZIP
        </button>
      </header>

      <div className={styles.workspace}>
        <nav className={styles.fileList} aria-label="Files">
          {files.map((file, index) => (
            <button
              className={index === activeIndex ? styles.activeFile : styles.file}
              type="button"
              key={file.path}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <span className={styles.fileGlyph} aria-hidden="true" />
              <span>{file.name}</span>
            </button>
          ))}
        </nav>

        <div className={styles.viewer}>
          <div className={styles.viewerBar}>
            <div className={styles.fileMeta}>
              <strong>{activeFile.name}</strong>
              <span>{activeFile.path}</span>
            </div>
            <div className={styles.actions}>
              <button type="button" onClick={handleCopy}>
                <CopyIcon />
                Copy
              </button>
              <button type="button" onClick={handleFileDownload}>
                <DownloadIcon />
                Download
              </button>
            </div>
          </div>

          <pre className={styles.code} tabIndex={0}>
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </pre>

          <footer className={styles.statusbar}>
            <span>{activeFile.language || 'text'}</span>
            <span>{lineCount.toLocaleString()} lines</span>
            <span aria-live="polite">{message}</span>
          </footer>
        </div>
      </div>
    </section>
  )
}
