import { indexMetadata } from "../og-image";
import { getProjectSkills, getSkillItems } from "./data";
import { SkillsIndex } from "./skills-index";

export const metadata = indexMetadata(
  "Skills",
  "The agent skills Byron Wall wrote and uses the most: planning, UI passes, orchestration, and retrospectives.",
  "/skills",
);

export default function SkillsPage() {
  return (
    <main>
      <SkillsIndex skills={getSkillItems()} projectSkills={getProjectSkills()} />
    </main>
  );
}
