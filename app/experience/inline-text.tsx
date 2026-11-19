import type { ReactNode } from "react";

// Experience strings are plain text with two marks: `code` and [label](https://url).
export function InlineText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /`([^`]+)`|\[([^\]]+)\]\((https?:[^)\s]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    parts.push(
      match[1] ? (
        <code key={at}>{match[1]}</code>
      ) : (
        <a key={at} href={match[3]} target="_blank" rel="noreferrer">
          {match[2]}
        </a>
      ),
    );
    last = at + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
