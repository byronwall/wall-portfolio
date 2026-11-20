import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkills } from "app/blog/utils";
import { CodeFileBrowser } from "app/components/code-file-browser";
import { CustomMDX } from "app/components/mdx";
import { ViewerScope } from "app/components/image-viewer";
import { getOgImageUrl } from "app/og-image";
import { baseUrl } from "app/sitemap";
import projectStyles from "../../projects/projects.module.css";
import { ProjectGallery } from "../../projects/[slug]/project-gallery";
import { formatDay, getSkillFiles, getSkillItems, SKILLS_REPO, toSkillItem, type SkillLink } from "../data";
import styles from "./skill.module.css";

type SkillPageProps = { params: Promise<{ slug: string }> };

function slugifyHeading(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function findSkill(slug: string) {
  return getSkills().find((entry) => entry.slug === slug);
}

export async function generateStaticParams() {
  return getSkills().map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({ params }: SkillPageProps) {
  const { slug } = await params;
  const skill = findSkill(slug);
  if (!skill) return;
  const { title, summary } = skill.metadata;
  const url = `${baseUrl}/skills/${slug}`;
  const image = getOgImageUrl({ title, description: summary, section: "Skill" });
  return {
    title: `${title} skill`,
    description: summary,
    alternates: { canonical: url },
    openGraph: { title: `${title} skill`, description: summary, url, images: [{ url: image, width: 1200, height: 630, alt: `${title} skill — Byron Wall` }] },
    twitter: { card: "summary_large_image", title: `${title} skill`, description: summary, images: [image] },
  };
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const skill = findSkill(slug);
  if (!skill) notFound();
  const item = toSkillItem(skill);
  const headings = Array.from(skill.content.matchAll(/^##\s+(.+)$/gm)).map((match) => match[1].replace(/[*_`]/g, ""));
  headings.push("Read the skill");
  // Every example image, with the skill's chosen image (its strongest output) first.
  const images = Array.from(skill.content.matchAll(/!\[([^\]]*)]\(([^)\s]+)\)/g))
    .map((match) => ({ src: match[2], alt: match[1] }))
    .sort((a, b) => Number(b.src === skill.metadata.image) - Number(a.src === skill.metadata.image));
  const all = getSkillItems();
  const at = all.findIndex((entry) => entry.slug === slug);
  const prev = all[at - 1];
  const next = all[at + 1];
  const relations: Array<[string, SkillLink[]]> = [
    ["Calls", item.uses],
    ["Hands off to", item.feeds],
    ["Called by", item.usedBy],
    ["Gets input from", item.fedBy],
  ];

  return (
    <main className={projectStyles.detailPage}>
      <Link href="/skills" className={projectStyles.backLink}>← Skills</Link>
      <ViewerScope images={images}>
        <header className={`${projectStyles.hero}${images.length ? "" : ` ${projectStyles.heroTextOnly}`}`}>
          <div className={projectStyles.heroCopy}>
            <h1 className={projectStyles.heroTitle}>{item.title}</h1>
            <p>{item.summary}</p>
            <dl className={styles.facts}>
              <dt>Stage</dt>
              <dd>
                <Link href={`/skills?stage=${item.category}`}>{item.category}</Link>
              </dd>
              <dt>{item.folders.length > 1 ? "Skills" : "Skill"}</dt>
              <dd>
                {item.folders.map((folder) => (
                  <a key={folder} className={styles.folder} href={`${SKILLS_REPO}/${folder}`} target="_blank" rel="noreferrer">
                    <code>{folder}</code> ↗
                  </a>
                ))}
              </dd>
              <dt>Size</dt>
              <dd>
                {item.lines} lines · {item.fileCount} {item.fileCount === 1 ? "file" : "files"}
              </dd>
              <dt>Updated</dt>
              <dd>{formatDay(item.updated)}</dd>
              {relations
                .filter(([, links]) => links.length > 0)
                .map(([label, links]) => (
                  <div key={label} className={styles.factRow}>
                    <dt>{label}</dt>
                    <dd>
                      {links.map((partner, index) => (
                        <span key={partner.slug}>
                          {index > 0 && ", "}
                          <Link href={`/skills/${partner.slug}`}>{partner.title}</Link>
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              {item.projectSlug && (
                <>
                  <dt>From</dt>
                  <dd>
                    <Link href={`/projects/${item.projectSlug}`}>{item.projectTitle}</Link>
                  </dd>
                </>
              )}
            </dl>
            <nav className={projectStyles.projectLinks} aria-label="Skill links">
              <a href="#read-the-skill">Read the skill ↓</a>
            </nav>
          </div>
          {images.length > 0 && <ProjectGallery images={images} />}
        </header>

        <div className={projectStyles.story}>
          <aside className={projectStyles.storyNav}>
            <nav aria-label="On this page">
              {headings.map((heading) => (
                <a href={`#${slugifyHeading(heading)}`} key={heading}>{heading}</a>
              ))}
            </nav>
          </aside>
          <article className={`prose ${projectStyles.prose} ${styles.prose}`}>
            <CustomMDX source={skill.content} />
          </article>
        </div>
      </ViewerScope>

      <section className={styles.files} aria-labelledby="read-the-skill">
        <h2 id="read-the-skill">Read the skill</h2>
        <p>
          These are the files the agent loads, copied from{" "}
          <a href="https://github.com/byronwall/.agents" target="_blank" rel="noreferrer">byronwall/.agents</a>. Copy one file, or
          download the folder as a ZIP and drop it into your own skills folder.
        </p>
        {item.folders.map((folder) => (
          <CodeFileBrowser
            key={folder}
            title={folder}
            archiveName={`${folder}.zip`}
            rootFolder={folder}
            files={getSkillFiles(folder)}
          />
        ))}
      </section>

      <nav className={styles.pager} aria-label="Other skills">
        {prev ? (
          <Link href={`/skills/${prev.slug}`}>
            <span>← Previous</span>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        <Link className={styles.pagerAll} href="/skills">All skills</Link>
        {next ? (
          <Link className={styles.pagerNext} href={`/skills/${next.slug}`}>
            <span>Next →</span>
            {next.title}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
