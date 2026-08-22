import fs from 'fs'
import path from 'path'
import {
  CodeFileBrowserClient,
  type CodeFile,
} from './code-file-browser-client'

type FileDefinition = {
  path: string
  name?: string
  language?: string
}

type CodeFileBrowserProps = {
  title?: string
  archiveName?: string
  rootFolder?: string
  files?: FileDefinition[]
}

export function CodeFileBrowser({
  title = 'Explore the files',
  archiveName = 'files.zip',
  rootFolder = '',
  files = [],
}: CodeFileBrowserProps) {
  const publicRoot = path.join(process.cwd(), 'public')

  if (files.length === 0) {
    return (
      <p className="not-prose my-8 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        No files are available to preview.
      </p>
    )
  }

  const loadedFiles: CodeFile[] = files.map((file) => {
    const relativePath = file.path.replace(/^\/+/, '')
    const absolutePath = path.resolve(publicRoot, relativePath)

    if (!absolutePath.startsWith(`${publicRoot}${path.sep}`)) {
      throw new Error(`File browser path must stay inside public: ${file.path}`)
    }

    const name = file.name || path.basename(relativePath)
    const archivePath = rootFolder ? `${rootFolder}/${name}` : name

    return {
      name,
      path: archivePath,
      content: fs.readFileSync(absolutePath, 'utf8'),
      language: file.language,
    }
  })

  return (
    <CodeFileBrowserClient
      title={title}
      archiveName={archiveName}
      files={loadedFiles}
    />
  )
}

export function OxAlphaSkillFileBrowser() {
  return (
    <CodeFileBrowser
      title="Final Ox Alpha worker skill"
      archiveName="ox-alpha-workers.zip"
      rootFolder="ox-alpha-workers"
      files={[
        {
          path: '/skills/ox-alpha-workers/SKILL.md',
          language: 'markdown',
        },
        { path: '/skills/ox-alpha-workers/ox-agent', language: 'shell' },
        { path: '/skills/ox-alpha-workers/ox-agent-log', language: 'shell' },
        { path: '/skills/ox-alpha-workers/openai.yaml', language: 'yaml' },
      ]}
    />
  )
}
