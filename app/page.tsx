import Link from "next/link";
import { ProjectCards } from "./components/project-cards";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm">
        <h1 className="text-4xl font-bold mb-4">Byron Wall</h1>
        <p className="text-xl mb-8">
          Software engineer with 14+ years of experience building data-driven
          applications.{" "}
        </p>
        <p className="text-xl">
          Currently working as a{" "}
          <span className="font-semibold">Staff Software Developer</span> at{" "}
          <Link
            href="https://allisontransmission.com"
            target="_blank"
            className="hover:underline"
          >
            Allison Transmission
          </Link>
          , where I develop software solutions for data analysis and
          visualization.
        </p>

        <ProjectCards />

        <section>
          <h2 className="font-bold text-2xl mb-4">Additional Projects</h2>
          <ul className="list-disc list-inside space-y-4 mb-8">
            <li>
              <strong>Transmission Data Analysis Platform</strong>
              <p className="ml-6">
                Built a 100k+ LOC platform using C#, TypeScript, and React for
                analyzing transmission testing data. Features include a custom
                calculation DSL and interactive visualizations using custom
                charting components (SVG + canvas).
              </p>
            </li>
            <li>
              <strong>Interactive Hydraulic Schematic Tool</strong>
              <p className="ml-6">
                Developed an Electron-based application using React and
                TypeScript for hydraulic system visualization and analysis.
                Allows for user defined schematics with complicated logic and
                connectivity.
              </p>
            </li>
            <li>
              <strong>runnDAILY.com</strong>
              <p className="ml-6">
                Co-founded and developed a fitness mapping website using PHP,
                MySQL, and JavaScript.
              </p>
            </li>
          </ul>
        </section>

        <h2 className="font-bold text-2xl mb-4">Skills</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Expert</h3>
            <ul className="list-disc list-inside">
              <li>TypeScript/JavaScript</li>
              <li>Excel/VBA</li>
              <li>Data Analysis</li>
              <li>Statistics</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Proficient</h3>
            <ul className="list-disc list-inside">
              <li>C#</li>
              <li>React</li>
              <li>Node.js</li>
              <li>Python</li>
              <li>Git</li>
            </ul>
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert">
          <p>
            Check out my <Link href="/projects">projects</Link>,{" "}
            <Link href="/blog">read my blog</Link> or{" "}
            <a href="mailto:byron@byroni.us">get in touch</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
