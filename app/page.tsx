import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <h1 className="font-bold text-3xl mb-8">Byron Wall</h1>
      <p className="prose prose-neutral dark:prose-invert mb-8">
        Software engineer with 10+ years of experience building data-driven
        applications. Currently working as a Hydraulic and Fluid Systems
        Engineer at Allison Transmission, where I develop software solutions for
        data analysis and visualization.
      </p>

      <h2 className="font-bold text-2xl mb-4">Featured Projects</h2>
      <ul className="list-disc list-inside space-y-4 mb-8">
        <li>
          <strong>Transmission Data Analysis Platform</strong>
          <p className="ml-6">
            Built a 60k+ LOC platform using C#, TypeScript, and React for
            analyzing transmission testing data. Features include a custom
            calculation DSL and interactive visualizations using d3.js and
            DC.js.
          </p>
        </li>
        <li>
          <strong>Interactive Hydraulic Schematic Tool</strong>
          <p className="ml-6">
            Developed an Electron-based application using React and TypeScript
            for hydraulic system visualization and analysis.
          </p>
        </li>
        <li>
          <strong>runnDAILY.com</strong>
          <p className="ml-6">
            Co-founded and developed a fitness mapping website using PHP, MySQL,
            and JavaScript.
          </p>
        </li>
      </ul>

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
          <Link href="/blog">Read my blog</Link> or{" "}
          <a href="mailto:byron@byroni.us">get in touch</a>.
        </p>
      </div>
    </section>
  );
}
