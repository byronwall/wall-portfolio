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

/** The Draftably export of content/skills-map.draft, sized to its column, with links kept on this site. */
function mapSvg() {
  return fs
    .readFileSync(path.join(process.cwd(), "content/skills-map.svg"), "utf8")
    .replace(/ width="\d+" height="\d+"/, "")
    .replaceAll("https://byroni.us/skills/", "/skills/")
    .replaceAll(' target="_blank"', "");
}

export default function SkillsPage() {
  const skills = getSkillItems();
  const dates = Object.fromEntries(skills.map((skill) => [skill.slug, formatDay(skill.updated)]));
  return (
    <main>
      <SkillsIndex skills={skills} stages={STAGES} projectSkills={getProjectSkills()} mapSvg={mapSvg()} dates={dates} />
    </main>
  );
}
