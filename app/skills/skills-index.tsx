"use client";

import Link from "next/link";
import { Fragment, useMemo } from "react";
import { FacetChips, highlight, ListHeader, listStyles as ui, SearchBox, useUrlFilters } from "../components/list-page";
import type { getProjectSkills, SkillItem, SkillLink } from "./data";
import { partnersOf } from "./partners";
import styles from "./skills.module.css";

const FILTER_KEYS = ["q", "stage"] as const;

type Stage = { name: string; line: string };

function Thumb({ skill, eager }: { skill: SkillItem; eager?: boolean }) {
  if (skill.image) return <img src={skill.image} alt="" loading={eager ? "eager" : "lazy"} />;
  return <span className={styles.fileTile}>{skill.folders[0]}/SKILL.md</span>;
}

/** "Works with" names, linked. Rows are links already, so these are plain text there. */
function Partners({ links, needle }: { links: SkillLink[]; needle: string }) {
  return (
    <>
      {links.map((partner, index) => (
        <Fragment key={partner.slug}>
          {index > 0 && ", "}
          {highlight(partner.title, needle)}
        </Fragment>
      ))}
    </>
  );
}

export function SkillsIndex({
  skills,
  stages,
  projectSkills,
  mapSvg,
  dates,
}: {
  skills: SkillItem[];
  stages: readonly Stage[];
  projectSkills: ReturnType<typeof getProjectSkills>;
  mapSvg: string;
  dates: Record<string, string>;
}) {
  const [{ q: query, stage }, update] = useUrlFilters(FILTER_KEYS);
  const needle = query.trim().toLowerCase();
  const matchesQuery = (skill: SkillItem) =>
    !needle ||
    `${skill.title} ${skill.summary} ${skill.folders.join(" ")} ${partnersOf(skill)
      .map((partner) => partner.title)
      .join(" ")}`
      .toLowerCase()
      .includes(needle);
  const visible = skills.filter((skill) => matchesQuery(skill) && (!stage || skill.category === stage));

  const facets = useMemo(
    () =>
      stages.map((entry) => ({
        value: entry.name,
        label: entry.name,
        count: skills.filter((skill) => matchesQuery(skill) && skill.category === entry.name).length,
      })),
    // matchesQuery only reads needle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skills, stages, needle],
  );
  const picks = skills.filter((skill) => skill.pick).sort((a, b) => (a.pick ?? 0) - (b.pick ?? 0));
  const isFiltered = Boolean(needle || stage);

  return (
    <div className={ui.page}>
      <ListHeader
        title="Skills"
        lede={
          <>
            The agent skills I use the most, in the order a piece of work uses them: plan, build, then learn from the run.
            Each page shows real output, and you can read every file. They all live in{" "}
            <a href="https://github.com/byronwall/.agents" target="_blank" rel="noreferrer">
              byronwall/.agents
            </a>
            .
          </>
        }
      />

      <div className={ui.controls}>
        <FacetChips
          label="Filter by stage"
          facets={facets}
          value={stage}
          onChange={(value) => update({ stage: value })}
          top={3}
          moreLabel="More"
        />
        <div className={ui.tools}>
          <SearchBox label="Search skills" value={query} onChange={(value) => update({ q: value })} />
        </div>
      </div>

      {!isFiltered && (
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
            <button type="button" onClick={() => update({ q: "", stage: "" })}>
              Clear filters
            </button>
          </>
        ) : (
          <>All {skills.length} skills, by stage</>
        )}
      </p>

      {visible.length === 0 && <p className={ui.empty}>No skills match. Try a shorter search or clear the filters.</p>}

      {stages.map((entry) => {
        const rows = visible.filter((skill) => skill.category === entry.name);
        if (rows.length === 0) return null;
        return (
          <section className={styles.stage} key={entry.name} aria-labelledby={`stage-${entry.name}`}>
            <h2 className={styles.stageLabel} id={`stage-${entry.name}`}>
              {entry.name} <span>{entry.line}</span>
            </h2>
            <ol className={styles.rows}>
              {rows.map((skill) => {
                const partners = partnersOf(skill);
                return (
                  <li key={skill.slug}>
                    <Link className={styles.row} href={`/skills/${skill.slug}`}>
                      <span className={styles.thumb}>
                        <Thumb skill={skill} />
                      </span>
                      <span className={styles.copy}>
                        <span className={styles.title}>{highlight(skill.title, needle)}</span>
                        <span className={styles.summary}>{highlight(skill.summary, needle)}</span>
                        <span className={styles.meta}>
                          {partners.length > 0 && (
                            <span>
                              Works with <Partners links={partners} needle={needle} />
                            </span>
                          )}
                          {skill.projectTitle && (
                            <span className={styles.metaProject}>
                              {skill.projectLogo && <img className="project-logo-plate" src={skill.projectLogo} alt="" />}
                              From {skill.projectTitle}
                            </span>
                          )}
                          <span>
                            {skill.lines} lines · updated {dates[skill.slug]}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      {!isFiltered && (
        <>
          <section className={styles.map} aria-labelledby="map-heading">
            <h2 className={ui.sectionLabel} id="map-heading">How they connect</h2>
            <p className={styles.mapLede}>
              Only the handoffs the skill files state. Click a box to open that skill. Drawn with{" "}
              <Link href="/projects/draftably">Draftably</Link>.
            </p>
            <div className={styles.mapFigure} dangerouslySetInnerHTML={{ __html: mapSvg }} />
          </section>

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
        </>
      )}
    </div>
  );
}
