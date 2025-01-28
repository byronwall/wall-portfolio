import Image from "next/image";
import { Timeline } from "app/components/Timeline";

export default function AboutPage() {
  const experienceItems = [
    {
      title: "Allison Transmission — Hydraulic and Fluid Systems Engineer",
      date: "November 2017 – Present",
      children: (
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
      ),
    },
    {
      title: "TDA Research — Research and Project Engineer",
      date: "August 2015 – October 2017",
      children: (
        <ul>
          <li>Supported $2MM+ CO2 capture pilot plant design and operation</li>
          <li>Developed data pipelines and visualization tools</li>
          <li>Created Excel add-ins using C#</li>
        </ul>
      ),
    },
    {
      title:
        "Chevron Phillips Chemical Company — Operations and Process Engineer",
      date: "June 2010 – July 2014",
      children: (
        <ul>
          <li>Developed Excel VBA add-ins for data analysis</li>
          <li>Built desktop applications with C#</li>
          <li>Consistently ranked in top 5% of employees</li>
        </ul>
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-end">
        <h1 className="font-medium text-4xl  tracking-tighter">
          About: Byron Wall
        </h1>

        <Image
          src="/byron-wall-2024.jpeg"
          alt="Byron Wall"
          width={150}
          height={150}
          className="rounded-full"
          priority
        />
      </div>
      <div className="prose prose-neutral dark:prose-invert">
        <p className="mb-8 text-lg">
          I'm a Chemical Engineer by education who has consistently leveraged
          software development throughout my engineering career. From developing
          data analysis platforms and automation tools to creating enterprise
          applications, I've combined my engineering background with my passion
          for programming to deliver innovative solutions across various
          industries.
        </p>

        <p className="mb-8">
          Software Developer & Engineer based in Indianapolis, IN
        </p>

        <h3>Professional Experience</h3>
        <Timeline items={experienceItems} />

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
      </div>
    </section>
  );
}
