import Image from "next/image";
import { Timeline } from "../components/Timeline";

export default function AboutPage() {
  const experienceItems = [
    {
      title: (
        <>
          <a
            href="https://relational.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            RelationalAI
          </a>{" "}
          — Full Stack Engineer
        </>
      ),
      date: "April 2025 – Present",
      children: (
        <ul>
          <li>
            Building server-side components with FastAPI, Pydantic AI, and
            Python for an agentic/LLM data modeling application for Snowflake
            databases
          </li>
          <li>
            Developing client-side components using SolidJS for the same data
            modeling application
          </li>
        </ul>
      ),
    },
    {
      title: "Allison Transmission — Staff Software Developer",
      date: "February 2023 – March 2025",
      children: (
        <ul>
          <li>
            Created and maintain a data analysis platform (100k+ LOC) using C#,
            TypeScript, and React/SolidJS with interactive visualizations via
            D3.js
          </li>
          <li>
            Developed domain-specific language for custom engineering analyses
          </li>
          <li>
            Led security platform migration for Engineering division (800+
            workstations)
          </li>
          <li>
            Created extensive documentation and training materials including 10+
            hours of video content
          </li>
        </ul>
      ),
    },
    {
      title: "Allison Transmission — Staff/Senior Engineer",
      date: "November 2017 – January 2023",
      children: (
        <ul>
          <li>
            Built interactive hydraulic schematic tool using Electron,
            React/SolidJS, and TypeScript
          </li>
          <li>
            Developed visualization tools for engineering design and
            troubleshooting
          </li>
        </ul>
      ),
    },
    {
      title: "TDA Research — Research and Project Engineer",
      date: "August 2015 – October 2017",
      children: (
        <ul>
          <li>
            Designed data pipeline connecting CSV files to InfluxDB with Grafana
            visualization
          </li>
          <li>Developed Excel add-in in C# for database connectivity</li>
          <li>
            Created automated quoting tools reducing processing time from hours
            to minutes
          </li>
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
          I'm a Software Developer with 14+ years of experience in Software and
          Chemical Engineering. I specialize in creating highly interactive
          data-centric applications. With a foundation in Chemical Engineering,
          I've evolved into a full-stack developer focusing on TypeScript,
          React/SolidJS, and C#. I excel at building tools that help engineers
          and technical teams analyze data, visualize complex systems, and
          automate workflows.
        </p>

        <h3>Professional Experience</h3>
        {/* @ts-expect-error - TypeScript cache issue, TimelineItem correctly accepts ReactNode */}
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
              <li>React/SolidJS</li>
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
