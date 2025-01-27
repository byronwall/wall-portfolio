import Image from "next/image";

export default function AboutPage() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">about me</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <div className="mb-8">
          <Image
            src="/byron-wall-2024.jpeg"
            alt="Byron Wall"
            width={150}
            height={150}
            className="rounded-full"
            priority
          />
        </div>

        <h2>Byron Wall</h2>
        <p className="mb-8">
          Software Developer & Engineer based in Indianapolis, IN
        </p>

        <h3>Professional Experience</h3>

        <h4>Allison Transmission — Hydraulic and Fluid Systems Engineer</h4>
        <p>November 2017 – Present</p>
        <ul>
          <li>
            Created a data analysis platform (60k+ LOC) using C#, TypeScript,
            and React
          </li>
          <li>
            Developed interactive hydraulic schematic tools using Electron and
            React
          </li>
          <li>Enhanced Python tools for transmission architecture search</li>
          <li>Managed technical aspects of transmission fluid globally</li>
        </ul>

        <h4>TDA Research — Research and Project Engineer</h4>
        <p>August 2015 – October 2017</p>
        <ul>
          <li>Supported $2MM+ CO2 capture pilot plant design and operation</li>
          <li>Developed data pipelines and visualization tools</li>
          <li>Created Excel add-ins using C#</li>
        </ul>

        <h4>
          Chevron Phillips Chemical Company — Operations and Process Engineer
        </h4>
        <p>June 2010 – July 2014</p>
        <ul>
          <li>Developed Excel VBA add-ins for data analysis</li>
          <li>Built desktop applications with C#</li>
          <li>Consistently ranked in top 5% of employees</li>
        </ul>

        <h3>Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4>Expert in:</h4>
            <ul>
              <li>TypeScript/JavaScript</li>
              <li>Excel/VBA</li>
              <li>Data Analysis</li>
              <li>Statistics</li>
            </ul>
          </div>
          <div>
            <h4>Proficient in:</h4>
            <ul>
              <li>C#</li>
              <li>React</li>
              <li>Node.js</li>
              <li>Python</li>
              <li>Git</li>
              <li>RESTful APIs</li>
            </ul>
          </div>
        </div>

        <h3>Education</h3>
        <h4>Purdue University</h4>
        <p>Bachelor of Science in Chemical Engineering</p>
        <p>GPA: 3.97/4.00</p>
      </div>
    </section>
  );
}
