import type { SkillItem, SkillLink } from "./data";

/** Every skill this one connects to, in either direction, once each. */
export function partnersOf(skill: SkillItem) {
  const seen = new Map<string, SkillLink>();
  for (const partner of [...skill.uses, ...skill.feeds, ...skill.usedBy, ...skill.fedBy]) seen.set(partner.slug, partner);
  return Array.from(seen.values());
}
