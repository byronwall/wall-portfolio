// Copy the skill folders named in content/skills/*.mdx from ~/.agents into
// public/skills/<name>/, so the Skills pages can show the real files.
// Copies only files tracked in the public byronwall/.agents repo, text only.
// It also writes content/skills-manifest.json with each skill's git history.
// Run: node scripts/sync-skills.mjs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const agents = path.join(os.homedir(), ".agents");
const root = process.cwd();
const textExt = new Set([".md", ".mjs", ".js", ".py", ".json", ".dot", ".css", ".yaml", ".yml", ".sh", ".txt"]);

const names = new Set();
const manifest = {};
for (const file of fs.readdirSync(path.join(root, "content/skills"))) {
  if (!file.endsWith(".mdx")) continue;
  const text = fs.readFileSync(path.join(root, "content/skills", file), "utf8");
  const line = text.match(/^skills: \[(.*)\]$/m);
  if (!line) throw new Error(`${file} has no skills: [...] line`);
  line[1].split(",").forEach((name) => names.add(name.trim().replace(/^["']|["']$/g, "")));
}

for (const name of names) {
  const tracked = execFileSync("git", ["-C", agents, "ls-files", `skills/${name}`], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  if (tracked.length === 0) throw new Error(`skills/${name} has no tracked files in ${agents}`);

  const out = path.join(root, "public/skills", name);
  fs.rmSync(out, { recursive: true, force: true });
  let count = 0;
  for (const rel of tracked) {
    const ext = path.extname(rel) || (path.basename(rel).includes(".") ? "" : ".sh");
    if (!textExt.has(ext)) continue;
    const dest = path.join(out, rel.slice(`skills/${name}/`.length));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(agents, rel), dest);
    count += 1;
  }
  // How much real use the skill has seen: commits that touched it, and the dates of the first and last.
  const dates = execFileSync("git", ["-C", agents, "log", "--format=%cs", "--", `skills/${name}`], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  const lines = fs.readFileSync(path.join(agents, "skills", name, "SKILL.md"), "utf8").split("\n").length;
  manifest[name] = { revisions: dates.length, first: dates.at(-1), last: dates[0], lines };
  console.log(`${name}: ${count} files, ${dates.length} revisions`);
}

fs.writeFileSync(path.join(root, "content/skills-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
