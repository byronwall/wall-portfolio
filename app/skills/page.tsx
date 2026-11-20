import fs from "fs";
import path from "path";
import { indexMetadata } from "../og-image";
import { formatDay, getProjectSkills, getSkillItems, STAGES } from "./data";
import { SkillsIndex } from "./skills-index";

export const metadata = indexMetadata(
  "Skills",
  "The agent skills Byron Wall wrote and uses the most: planning, UI passes, orchestration, and retrospectives.",
  "/skills",
);

/** A Draftably export of content/skills-map.draft, sized to its column, with links kept on this site.
    Each copy gets an id prefix, so the light and dark drawings can share the page. */
function mapSvg(file: string, prefix: string) {
  return fs
    .readFileSync(path.join(process.cwd(), "content", file), "utf8")
    .replace(/ width="\d+" height="\d+"/, "")
    .replaceAll("https://byroni.us/skills/", "/skills/")
    .replaceAll(' target="_blank"', "")
    .replace(/(\bid=")|(url\(#)|(href="#)|(aria-labelledby=")/g, (match) => match + prefix);
}

export default function SkillsPage() {
  const skills = getSkillItems();
  const dates = Object.fromEntries(skills.map((skill) => [skill.slug, formatDay(skill.updated)]));
  return (
    <main>
      <SkillsIndex skills={skills} stages={STAGES} projectSkills={getProjectSkills()} mapSvg={{ light: mapSvg("skills-map.svg", "light-"), dark: mapSvg("skills-map-dark.svg", "dark-") }} dates={dates} />
    </main>
  );
}
