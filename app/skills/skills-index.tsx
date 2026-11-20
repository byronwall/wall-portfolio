"use client";

import Link from "next/link";
import { useMemo } from "react";
import { countFacets, FacetChips, highlight, ListHeader, listStyles as ui, SearchBox, useUrlFilters } from "../components/list-page";
import type { getProjectSkills, SkillItem } from "./data";
import styles from "./skills.module.css";

const FILTER_KEYS = ["q", "category"] as const;

function Thumb({ skill, eager }: { skill: SkillItem; eager?: boolean }) {
  if (skill.image) return <img src={skill.image} alt="" loading={eager ? "eager" : "lazy"} />;
  return <span className={styles.fileTile}>{skill.folders[0]}/SKILL.md</span>;
}

export function SkillsIndex({
  skills,
  projectSkills,
}: {
  skills: SkillItem[];
  projectSkills: ReturnType<typeof getProjectSkills>;
}) {
  const [{ q: query, category }, update] = useUrlFilters(FILTER_KEYS);
  const needle = query.trim().toLowerCase();
  const matchesQuery = (skill: SkillItem) =>
    !needle || `${skill.title} ${skill.summary} ${skill.folders.join(" ")}`.toLowerCase().includes(needle);
  const visible = skills.filter((skill) => matchesQuery(skill) && (!category || skill.category === category));

  const order = useMemo(() => countFacets(skills, (skill) => [{ value: skill.category, label: skill.category }]), [skills]);
  const facets = order.map((facet) => ({
    ...facet,
    count: skills.filter((skill) => matchesQuery(skill) && skill.category === facet.value).length,
  }));
  const picks = skills.filter((skill) => skill.pick).sort((a, b) => (a.pick ?? 0) - (b.pick ?? 0));
  const isFiltered = Boolean(needle || category);

  return (
    <div className={ui.page}>
      <ListHeader
        title="Skills"
        lede={
          <>
            The agent skills I use the most. Each page says what the skill does and shows what it made, and you can
            read every file. They all live in{" "}
            <a href="https://github.com/byronwall/.agents" target="_blank" rel="noreferrer">
              byronwall/.agents
            </a>
            .
          </>
        }
      />

      <div className={ui.controls}>
        <FacetChips
          label="Filter by category"
          facets={facets}
          value={category}
          onChange={(value) => update({ category: value })}
          top={6}
          moreLabel="More"
        />
        <div className={ui.tools}>
          <SearchBox label="Search skills" value={query} onChange={(value) => update({ q: value })} />
        </div>
      </div>

      {!isFiltered && picks.length > 0 && (
        <section className={ui.section} aria-labelledby="start-here-heading">
          <h2 className={ui.sectionLabel} id="start-here-heading">Start here</h2>
          <ol className={`${ui.picks} ${styles.picks}`}>
            {picks.map((pick) => (
              <li key={pick.slug}>
                <Link className={ui.pick} href={`/skills/${pick.slug}`}>
                  <span className={`${ui.pickImage} ${styles.pickImage}`}>
                    <Thumb skill={pick} eager />
                  </span>
                  <span className={ui.pickCopy}>
                    <span className={ui.pickTitle}>{pick.title}</span>
                    <span className={ui.pickWhy}>{pick.why}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className={ui.resultLine} aria-live="polite">
        {isFiltered ? (
          <>
            {visible.length} of {skills.length} skills
            <button type="button" onClick={() => update({ q: "", category: "" })}>
              Clear filters
            </button>
          </>
        ) : (
          <>All {skills.length} skills</>
        )}
      </p>

      {visible.length === 0 && <p className={ui.empty}>No skills match. Try a shorter search or clear the filters.</p>}

      <ol className={styles.rows}>
        {visible.map((skill) => (
          <li key={skill.slug}>
            <Link className={styles.row} href={`/skills/${skill.slug}`}>
              <span className={styles.thumb}>
                <Thumb skill={skill} />
              </span>
              <span className={styles.copy}>
                <span className={styles.title}>{highlight(skill.title, needle)}</span>
                <span className={styles.summary}>{highlight(skill.summary, needle)}</span>
                <span className={styles.meta}>
                  <span>{skill.category}</span>
                  <code>{skill.folders.join(" + ")}</code>
                  <span>
                    {skill.fileCount} {skill.fileCount === 1 ? "file" : "files"}
                  </span>
                  {skill.projectTitle && (
                    <span className={styles.metaProject}>
                      {skill.projectLogo && <img className="project-logo-plate" src={skill.projectLogo} alt="" />}
                      {skill.projectTitle}
                    </span>
                  )}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {!isFiltered && (
        <section className={styles.projectSkills} aria-labelledby="project-skills-heading">
          <h2 className={ui.sectionLabel} id="project-skills-heading">Skills inside projects</h2>
          <p className={styles.projectLede}>Some projects ship their own skill, so an agent can use the tool without me explaining it.</p>
          <ul className={styles.projectGrid}>
            {projectSkills.map((entry) => (
              <li key={entry.project}>
                <Link className={styles.projectCard} href={`/projects/${entry.project}`}>
                  <span className={styles.projectName}>
                    {entry.logo && <img className="project-logo-plate" src={entry.logo} alt="" />}
                    {entry.title}
                  </span>
                  <code>{entry.skill}</code>
                  <span className={styles.projectSummary}>{entry.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
