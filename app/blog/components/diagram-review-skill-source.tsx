import fs from 'fs'
import path from 'path'
import styles from './diagram-review-skill-source.module.css'

const skillPath = path.join(
  process.cwd(),
  'public',
  'skills',
  'diagram-and-graphic-review.md'
)

export function DiagramReviewSkillSource() {
  const source = fs.readFileSync(skillPath, 'utf8')
  const lineCount = source.trimEnd().split('\n').length

  return (
    <details className={`${styles.source} not-prose`} open>
      <summary>
        <span>Read the full skill</span>
        <small>{lineCount.toLocaleString()} lines of Markdown</small>
      </summary>
      <pre>
        <code>{source}</code>
      </pre>
    </details>
  )
}
