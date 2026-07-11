#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const MAX_COLUMNS = 88;

function usage() {
  return `Render terminal output as a deterministic 1200x630 PNG.

Usage:
  pnpm terminal-card -- --input capture.txt --output public/image.png
  pnpm terminal-card -- --mdx post.mdx --block 1 --output public/image.png

Options:
  --input <path>   Read terminal text from a plain-text file.
  --mdx <path>     Extract a fenced code block from an MDX file.
  --block <n>      One-based fenced block number. Defaults to 1.
  --output <path>  Required PNG output path.
  --title <text>   Terminal title. Defaults to "terminal".
  --help           Show this help text.`;
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--") continue;
    if (argument === "--help") args.help = true;
    else if (argument.startsWith("--")) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${argument}`);
      }
      args[argument.slice(2)] = value;
      index += 1;
    } else {
      throw new Error(`Unexpected argument: ${argument}`);
    }
  }

  return args;
}

function extractCodeBlock(source, requestedBlock) {
  const blocks = Array.from(source.matchAll(/```[^\n]*\n([\s\S]*?)```/g));
  const block = blocks[requestedBlock - 1];

  if (!block) {
    throw new Error(`MDX contains ${blocks.length} fenced blocks; block ${requestedBlock} does not exist.`);
  }

  return block[1].replace(/\n$/, "");
}

function wrapLine(line) {
  if (line.length <= MAX_COLUMNS) return [line];

  const wrapped = [];
  let remainder = line;

  while (remainder.length > MAX_COLUMNS) {
    let splitAt = remainder.lastIndexOf(" ", MAX_COLUMNS);
    if (splitAt < Math.floor(MAX_COLUMNS * 0.6)) splitAt = MAX_COLUMNS;
    wrapped.push(remainder.slice(0, splitAt));
    remainder = remainder.slice(splitAt).replace(/^ /, "");
  }

  wrapped.push(remainder);
  return wrapped;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function lineColor(line) {
  if (line.startsWith("error:")) return { color: "#ff7b72", weight: 700 };
  if (line.startsWith("fatal:")) return { color: "#f38ba8", weight: 700 };
  if (line.startsWith("send-pack:")) return { color: "#f9e2af", weight: 500 };
  if (line === "Everything up-to-date") return { color: "#7f8aa6", weight: 500 };
  return null;
}

function renderProgressLine(line) {
  const tokenPattern = /(100% \([^)]+\)|\b\d+(?:\.\d+)?(?: MiB(?:\/s)?| threads)?\b)/g;
  const segments = [];
  let cursor = 0;

  for (const match of line.matchAll(tokenPattern)) {
    if (match.index > cursor) {
      segments.push({ text: line.slice(cursor, match.index), color: "#8d98b6" });
    }
    const value = match[0];
    segments.push({
      text: value,
      color: value.startsWith("100%") ? "#a6e3a1" : "#89b4fa",
    });
    cursor = match.index + value.length;
  }

  if (cursor < line.length) {
    segments.push({ text: line.slice(cursor), color: "#cdd6f4" });
  }

  return segments
    .map(({ text, color }) => `<tspan fill="${color}">${escapeXml(text)}</tspan>`)
    .join("");
}

function renderTerminalSvg(text, title) {
  const lines = text.split("\n").flatMap(wrapLine);
  const lineHeight = lines.length > 12 ? 30 : 34;
  const fontSize = lines.length > 12 ? 17 : 19;
  const terminalHeight = Math.min(520, 112 + lines.length * lineHeight);
  const terminalY = Math.round((HEIGHT - terminalHeight) / 2);
  const firstLineY = terminalY + 104;

  const lineElements = lines.map((line, index) => {
    const emphasis = lineColor(line);
    const y = firstLineY + index * lineHeight;
    if (emphasis) {
      return `<text x="94" y="${y}" fill="${emphasis.color}" font-weight="${emphasis.weight}">${escapeXml(line)}</text>`;
    }
    return `<text x="94" y="${y}" xml:space="preserve">${renderProgressLine(line)}</text>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#eef1f6"/>
  <g>
    <rect x="55" y="${terminalY}" width="1090" height="${terminalHeight}" rx="22" fill="#0b1020"/>
    <path d="M77 ${terminalY}h1046a22 22 0 0 1 22 22v42H55v-42a22 22 0 0 1 22-22Z" fill="#151b2d"/>
    <path d="M55 ${terminalY + 64}h1090" stroke="#283047"/>
    <circle cx="85" cy="${terminalY + 32}" r="7" fill="#ff5f57"/>
    <circle cx="109" cy="${terminalY + 32}" r="7" fill="#febc2e"/>
    <circle cx="133" cy="${terminalY + 32}" r="7" fill="#28c840"/>
    <text x="159" y="${terminalY + 37}" fill="#8390aa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="15" letter-spacing=".5">${escapeXml(title)}</text>
    <g font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace" font-size="${fontSize}">${lineElements}</g>
  </g>
</svg>`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }
  if (!args.output) throw new Error("--output is required");
  if (Boolean(args.input) === Boolean(args.mdx)) {
    throw new Error("Provide exactly one of --input or --mdx");
  }

  const sourcePath = path.resolve(args.input ?? args.mdx);
  const source = await fs.readFile(sourcePath, "utf8");
  const text = args.mdx
    ? extractCodeBlock(source, Number.parseInt(args.block ?? "1", 10))
    : source.replace(/\n$/, "");
  const outputPath = path.resolve(args.output);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(Buffer.from(renderTerminalSvg(text, args.title ?? "terminal")))
    .png()
    .toFile(outputPath);

  console.log(`Rendered ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
