import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "../components/social-icons";
import { baseUrl } from "../sitemap";
import styles from "./about.module.css";

export const metadata = {
  title: "About",
  description: "About Byron Wall, a software engineer who builds data-rich applications and technical tools.",
  alternates: { canonical: `${baseUrl}/about` },
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <h1>About me</h1>
          <p className={styles.lede}>I’m a software engineer with more than 14 years of experience across software and chemical engineering.</p>
          <p>I specialize in highly interactive, data-centric applications. With a foundation in chemical engineering, I evolved into a full-stack developer focused on TypeScript, React and SolidJS, Python, and C#.</p>
          <p>I’m at my best building tools that help engineers and technical teams analyze data, visualize complex systems, and automate the parts of a workflow that get in the way of the real work.</p>
        </div>
        <Image className={styles.portrait} src="/byron-wall-headshot.webp" alt="Byron Wall" width={400} height={400} priority />
      </section>
      <section className={styles.story}>
        <div className={styles.marginTitle}><h2>How I got here</h2></div>
        <div className={styles.storyCopy}>
          <p>I studied chemical engineering at Purdue University and began my career close to experiments, process equipment, and physical systems. Software first entered the picture as a practical answer: a way to connect datasets, automate repetitive analysis, and make complicated behavior visible.</p>
          <p>Those tools became larger and more ambitious. Over time, the center of gravity shifted from engineering supported by software to software shaped by engineering experience. I still approach product work the same way—start with the system, understand how people reason about it, and make the interface reveal what matters.</p>
          <h2>What I care about</h2>
          <p>I care about clean code, thoughtful interfaces, and measurable impact. I like software with enough domain depth that design and engineering cannot be separated: analysis environments, developer tools, data products, and systems that help specialists make better decisions.</p>
          <p>Right now I’m especially interested in agentic interfaces, LLM-assisted data modeling, SolidJS, and better ways to capture the context behind technical work—not just the finished artifact.</p>
        </div>
      </section>
      <section className={styles.footerBand}>
        <div>
          <h2>Elsewhere</h2>
          <p>The fuller chronology lives in Experience. Current projects and working notes live throughout the rest of this site.</p>
        </div>
        <div className={styles.links}>
          <Link href="/experience">Experience <span aria-hidden="true">→</span></Link>
          <a href="https://github.com/byronwall" target="_blank" rel="noreferrer"><SocialIcons.GitHub /> GitHub</a>
          <a href="https://www.linkedin.com/in/byronwall/" target="_blank" rel="noreferrer"><SocialIcons.LinkedIn /> LinkedIn</a>
        </div>
      </section>
    </main>
  );
}
