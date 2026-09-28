// "Content coming soon" is a tracking marker in project frontmatter, not a
// status a visitor should read, so it is treated the same as no status.
const hiddenStatuses = new Set(["content coming soon"]);

export function getProjectStatus(status: unknown) {
  if (typeof status !== "string") return undefined;
  const trimmed = status.trim();
  return trimmed && !hiddenStatuses.has(trimmed.toLowerCase()) ? trimmed : undefined;
}
