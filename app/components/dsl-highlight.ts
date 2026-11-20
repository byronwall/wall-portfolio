import { highlight as highlightJs } from 'sugar-high'

/*
 * Highlighters for the two DSLs the blog shows: Draftably's `.draft` and
 * explorEDA's `.eda`. Each is a copy of the project's own tokenizer, so a post
 * colors a file the way that project's site does:
 * - `.draft`: draftably site/highlight.ts (byronwall/draftably)
 * - `.eda`: explorEDA packages/explorEDA/src/lib/dsl/highlight.ts, with the
 *   lexer pieces it imports from parse.ts and compile.ts (byronwall/explorEDA)
 * Copy changes from those files instead of editing the rules here.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ---------------------------------------------------------------- .draft

const DRAFT_COMMANDS = new Set([
  'diagram', 'subtitle', 'compare', 'config', 'state', 'phase', 'was-order',
  'action', 'node', 'group', 'edge', 'layout', 'theme', 'theme-color',
  'legend', 'note', 'range', 'footnote', 'routing', 'order', 'align', 'near',
  'nudge', 'stay', 'pin', 'size', 'view', 'snapshot', 'box',
])
const MARKS = new Set(['+', '-', '~', '.'])
const MARK_NAMES: Record<string, string> = {
  '+': 'added',
  '-': 'removed',
  '~': 'changed',
  '.': 'context',
}

type DraftToken = { text: string; kind: string }

function draftLine(text: string): DraftToken[] {
  const out: DraftToken[] = []
  let i = 0
  let first = true
  const push = (t: string, kind: string) => t && out.push({ text: t, kind })
  while (i < text.length) {
    const c = text[i]
    if (/\s/.test(c)) {
      const start = i
      while (i < text.length && /\s/.test(text[i])) i++
      push(text.slice(start, i), 'space')
      continue
    }
    if (c === '#' || (c === '/' && text[i + 1] === '/')) {
      push(text.slice(i), 'comment')
      break
    }
    const start = i
    let quote = false
    while (i < text.length && (quote || !/\s/.test(text[i]))) {
      if (text[i] === '\\' && quote) i++
      else if (text[i] === '"') quote = !quote
      i++
    }
    const word = text.slice(start, i)
    if (first) {
      first = false
      const marked =
        MARKS.has(word[0]) && word.length > 1 && DRAFT_COMMANDS.has(word.slice(1))
      if (marked) {
        push(word[0], 'mark')
        push(word.slice(1), 'command')
      } else push(word, DRAFT_COMMANDS.has(word) ? 'command' : 'id')
      continue
    }
    const eq = word.indexOf('=')
    if (eq > 0 && !word.startsWith('"')) {
      push(word.slice(0, eq), 'attr')
      push('=', 'attr')
      const value = word.slice(eq + 1)
      push(
        value,
        value.startsWith('"') ? 'string' : /^-?\d/.test(value) ? 'number' : 'value'
      )
    } else if (word.startsWith('"')) push(word, 'string')
    else if (/^[-<]*[-=.]+[>]*$/.test(word) && word.length > 1) push(word, 'arrow')
    else if (/^-?\d+(\.\d+)?$/.test(word)) push(word, 'number')
    else push(word, 'id')
  }
  return out
}

const draftSpan = (t: DraftToken) =>
  t.kind === 'space'
    ? esc(t.text)
    : `<span class="${
        t.kind === 'mark' ? `tok-mark tok-mark-${MARK_NAMES[t.text]}` : `tok-${t.kind}`
      }">${esc(t.text)}</span>`

/** A code node's body: JS and TS get sugar-high's colors, other languages stay plain. */
function bodyHtml(lines: string[], lang: string | undefined) {
  const text = lines.join('\n')
  const html = lang === 'ts' || lang === 'js' ? highlightJs(text) : esc(text)
  return `<span class="tok-body">${html}</span>`
}

export function highlightDraft(source: string): string {
  const lines = source.split('\n')
  const out: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const toks = draftLine(lines[i])
    out.push(toks.map(draftSpan).join(''))
    const words = toks.filter((t) => t.kind !== 'space' && t.kind !== 'comment')
    const tag =
      words.length > 1 && /^<<([A-Za-z_][A-Za-z0-9_]*)$/.exec(words.at(-1)!.text)?.[1]
    const end = tag ? lines.findIndex((t, j) => j > i && t.trim() === tag) : -1
    if (end < 0) continue
    const lang = /(?:^|\s)lang=(\S+)/.exec(lines[i])?.[1]
    out.push(bodyHtml(lines.slice(i + 1, end), lang))
    out.push(`<span class="tok-command">${esc(lines[end])}</span>`)
    i = end
  }
  return out.join('\n')
}

// ---------------------------------------------------------------- .eda

const EDA_KEYWORDS = new Set([
  'scatter', 'hist', 'histogram', 'bar', 'row', 'metric', 'table', 'summary',
  'composition', 'boxplot', 'calendar', 'ecdf', 'heatmap', 'line', 'pivot',
  'parallel', 'sankey', 'hierarchy', 'markdown', 'map',
  'scale', 'group', 'rows', 'filter', 'eda', 'dashboard', 'grid', 'theme',
  'source', 'calc', 'field', 'chart', 'view', 'layout', 'finding',
])
const CONSTANTS = /^(true|false|null|unset)$/
const NUMBER = /^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i
const ALIAS = /^([A-Za-z_]\w*)(:[A-Za-z]+)?=/

type EdaToken = { text: string; kind: string }

/** parse.ts tokenize: words at spaces outside quotes; `{` and `}` stand alone. */
function edaWords(line: string, start = 0) {
  const tokens: { text: string; column: number }[] = []
  let index = start
  while (index < line.length) {
    while (index < line.length && /\s/.test(line[index])) index++
    if (index >= line.length || line[index] === '#') break
    if (line[index] === '{' || line[index] === '}') {
      tokens.push({ text: line[index], column: index })
      index++
      continue
    }
    const begin = index
    let quoteStart: number | undefined
    while (
      index < line.length &&
      (quoteStart !== undefined || !/[\s{}]/.test(line[index]))
    ) {
      const char = line[index]
      if (quoteStart !== undefined) {
        if (char === '\\') index++
        else if (char === '"') quoteStart = undefined
      } else if (char === '"') quoteStart = index
      index++
    }
    if (quoteStart !== undefined) return { tokens, unclosed: quoteStart }
    tokens.push({ text: line.slice(begin, index), column: begin })
  }
  return { tokens, unclosed: undefined as number | undefined }
}

function splitPair(text: string): [string, string] | undefined {
  let inQuote = false
  for (let index = 0; index < text.length; index++) {
    const char = text[index]
    if (char === '"') inQuote = !inQuote
    if (!inQuote && char === '=') {
      return index === 0 ? undefined : [text.slice(0, index), text.slice(index + 1)]
    }
  }
  return undefined
}

function splitItems(raw: string): string[] {
  const items: string[] = []
  let start = 0
  let inQuote = false
  for (let index = 0; index < raw.length; index++) {
    const char = raw[index]
    if (inQuote && char === '\\') index++
    else if (char === '"') inQuote = !inQuote
    else if (!inQuote && char === ',') {
      items.push(raw.slice(start, index))
      start = index + 1
    }
  }
  items.push(raw.slice(start))
  return items
}

function scalar(text: string): EdaToken {
  if (text.startsWith('"')) return { text, kind: 'string' }
  if (CONSTANTS.test(text)) return { text, kind: 'constant' }
  if (NUMBER.test(text)) return { text, kind: 'number' }
  if (text.startsWith('@') && text.length > 1) return { text, kind: 'reference' }
  return { text, kind: 'text' }
}

function valueTokens(raw: string): EdaToken[] {
  const tokens: EdaToken[] = []
  splitItems(raw).forEach((item, index) => {
    if (index > 0) tokens.push({ text: ',', kind: 'operator' })
    if (!item) return
    const range = item.startsWith('"') ? -1 : item.indexOf('..')
    if (range >= 0) {
      const [min, max] = [item.slice(0, range), item.slice(range + 2)]
      if (min) tokens.push(scalar(min))
      tokens.push({ text: '..', kind: 'operator' })
      if (max) tokens.push(scalar(max))
      return
    }
    tokens.push(scalar(item))
  })
  return tokens
}

function wordTokens(word: string, positional: string): EdaToken[] {
  if (word.startsWith('@') && word.length > 1) return [{ text: word, kind: 'reference' }]
  const pair = splitPair(word)
  if (!pair) {
    const tokens = valueTokens(word)
    return positional === 'text'
      ? tokens
      : tokens.map((t) => (t.kind === 'text' ? { ...t, kind: positional } : t))
  }
  return [
    { text: pair[0], kind: 'key' },
    { text: '=', kind: 'operator' },
    ...valueTokens(pair[1]),
  ]
}

function formulaTokens(text: string): EdaToken[] {
  const tokens: EdaToken[] = []
  const pattern =
    /("(?:[^"\\]|\\.)*"?)|(\s+#.*$)|(\s+)|(\d+\.?\d*(?:e[+-]?\d+)?|\.\d+)|([A-Za-z_][\w.]*)|([^\w\s"]+)/gy
  let match: RegExpExecArray | null
  while (pattern.lastIndex < text.length && (match = pattern.exec(text))) {
    const [piece, string, comment, space, number, name] = match
    if (comment) {
      const hash = comment.indexOf('#')
      tokens.push({ text: comment.slice(0, hash), kind: 'space' })
      tokens.push({ text: comment.slice(hash), kind: 'comment' })
    } else {
      tokens.push({
        text: piece,
        kind: string
          ? 'string'
          : space
            ? 'space'
            : number
              ? 'number'
              : name
                ? CONSTANTS.test(name)
                  ? 'constant'
                  : 'text'
                : 'operator',
      })
    }
  }
  return tokens
}

function edaLine(line: string): EdaToken[] {
  const trimmed = line.trimStart()
  const indent = line.slice(0, line.length - trimmed.length)
  if (!trimmed) return [{ text: line, kind: 'space' }]
  if (trimmed.startsWith('#')) {
    return [
      { text: indent, kind: 'space' },
      { text: trimmed, kind: 'comment' },
    ]
  }
  const tokens: EdaToken[] = [{ text: indent, kind: 'space' }]
  let cursor = indent.length
  const keyword = trimmed.slice(0, trimmed.search(/\s|$/))
  if (keyword === 'calc') {
    tokens.push({ text: keyword, kind: 'keyword' })
    const rest = line.slice(cursor + keyword.length)
    const name = /^(\s*)("(?:[^"\\]|\\.)*"|[^\s=]*)(\s*)(=?)/.exec(rest)!
    tokens.push(
      { text: name[1], kind: 'space' },
      { text: name[2], kind: name[2].startsWith('"') ? 'string' : 'key' },
      { text: name[3], kind: 'space' },
      { text: name[4], kind: 'operator' },
      ...formulaTokens(rest.slice(name[0].length))
    )
    return tokens
  }
  const { tokens: words, unclosed } = edaWords(line, cursor)
  words.forEach((word, index) => {
    tokens.push({ text: line.slice(cursor, word.column), kind: 'space' })
    cursor = word.column + word.text.length
    if (word.text === '{' || word.text === '}') {
      tokens.push({ text: word.text, kind: 'operator' })
      return
    }
    const previous = words[index - 1]?.text
    const first = index === 0 || previous === '{' || previous === '}'
    if (first && EDA_KEYWORDS.has(word.text)) {
      tokens.push({ text: word.text, kind: 'keyword' })
      return
    }
    const alias = first ? ALIAS.exec(word.text) : null
    if (alias) {
      tokens.push(
        { text: alias[1], kind: 'key' },
        { text: alias[2] ?? '', kind: 'type' },
        { text: '=', kind: 'operator' },
        ...valueTokens(word.text.slice(alias[0].length))
      )
      return
    }
    if (first && /^\d+:$/.test(word.text)) {
      tokens.push({ text: word.text, kind: 'number' })
      return
    }
    tokens.push(...wordTokens(word.text, previous === 'chart' ? 'type' : 'text'))
  })
  const rest = line.slice(cursor)
  const restText = rest.trimStart()
  tokens.push({ text: rest.slice(0, rest.length - restText.length), kind: 'space' })
  if (unclosed !== undefined) {
    const quote = restText.indexOf('"')
    const head = restText.slice(0, quote)
    const pair = head.endsWith('=') ? head.slice(0, -1) : undefined
    tokens.push(
      ...(pair !== undefined
        ? [
            { text: pair, kind: 'key' },
            { text: '=', kind: 'operator' },
          ]
        : [{ text: head, kind: 'text' }]),
      { text: restText.slice(quote), kind: 'string' }
    )
  } else if (restText) tokens.push({ text: restText, kind: 'comment' })
  return tokens
}

export function highlightEda(source: string): string {
  return source
    .split(/\r?\n/)
    .map((line) =>
      edaLine(line)
        .filter((t) => t.text)
        .map((t) =>
          t.kind === 'space' || t.kind === 'text'
            ? esc(t.text)
            : `<span class="eda-dsl-${t.kind}">${esc(t.text)}</span>`
        )
        .join('')
    )
    .join('\n')
}

// ---------------------------------------------------------------- diff

/** A unified diff: added and removed lines get a band and a color. */
export function highlightDiff(source: string): string {
  return source
    .split('\n')
    .map((line) => {
      const kind = line.startsWith('@@')
        ? 'hunk'
        : line.startsWith('+')
          ? 'added'
          : line.startsWith('-')
            ? 'removed'
            : ''
      return kind ? `<span class="diff-${kind}">${esc(line)}</span>` : esc(line)
    })
    .join('\n')
}
