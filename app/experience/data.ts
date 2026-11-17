export type Experience = {
  slug: string;
  company: string;
  mark: string;
  logoUrl?: string;
  role: string;
  dates: string;
  location: string;
  summary: string;
  overview: string;
  focus: string[];
  tools: string[];
  reflection: string;
  artifactLabel: string;
  externalUrl: string;
};

export const experiences: Experience[] = [
  {
    slug: "relationalai",
    company: "RelationalAI",
    mark: "RAI",
    logoUrl: "https://cdn.prod.website-files.com/68c66131e7dc76329c719913/68c81ce60b127fb633e554aa_relationalai-lockup-blue.svg",
    role: "Full Stack Engineer",
    dates: "April 2025 – Present",
    location: "Remote",
    summary: "Building an agentic data-modeling product for Snowflake, across Python services and a SolidJS client.",
    overview: "RelationalAI builds tools for expressing and working with the relationships hidden inside operational data. I work on an LLM-driven data-modeling application that helps teams understand and shape Snowflake databases.",
    focus: [
      "Server-side agent workflows with FastAPI, Pydantic AI, and Python.",
      "A fast, stateful SolidJS interface for inspecting and refining data models.",
      "Product behavior that keeps generated output reviewable and under the user’s control.",
    ],
    tools: ["Python", "FastAPI", "Pydantic AI", "TypeScript", "SolidJS", "Snowflake"],
    reflection: "This role brings together the threads I care about most: data-rich software, complex technical domains, and interfaces that make an emerging technology feel understandable rather than magical.",
    artifactLabel: "",
    externalUrl: "https://relational.ai",
  },
  {
    slug: "allison-software",
    company: "Allison Transmission",
    mark: "AT",
    logoUrl: "https://allisontransmission.bynder.com/transform/8149412d-f2e2-457c-beb4-928e6ae38ca4/ATI_Header_Logo-png?io=transform:fill,width:418,height:103,gravity:center",
    role: "Senior Software Engineer, Engineering Systems",
    dates: "February 2023 – April 2025",
    location: "Indianapolis, Indiana",
    summary: "Built an engineering analysis platform and the tools, documentation, and infrastructure around it.",
    overview: "I moved into a dedicated software role after years of building engineering tools alongside product-development work. The central project was a large data-analysis platform used to turn test and simulation data into repeatable engineering decisions.",
    focus: [
      "Created and maintained a 100k+ line analysis platform using C#, TypeScript, React/SolidJS, and D3.",
      "Designed a domain-specific language for reusable engineering analyses.",
      "Led a security-platform migration across more than 800 engineering workstations.",
      "Produced extensive documentation and more than ten hours of training material.",
    ],
    tools: ["TypeScript", "C#", "React", "SolidJS", "D3", "Data visualization"],
    reflection: "The work reinforced a lesson that still shapes how I build: an internal tool succeeds when its model matches the way specialists already reason, not when it asks them to become software developers.",
    artifactLabel: "",
    externalUrl: "https://www.allisontransmission.com",
  },
  {
    slug: "allison-engineering",
    company: "Allison Transmission",
    mark: "AT",
    logoUrl: "https://allisontransmission.bynder.com/transform/8149412d-f2e2-457c-beb4-928e6ae38ca4/ATI_Header_Logo-png?io=transform:fill,width:418,height:103,gravity:center",
    role: "Senior, then Staff Product Engineer, Hydraulic Systems",
    dates: "November 2017 – January 2023",
    location: "Indianapolis, Indiana",
    summary: "Developed hydraulic systems and interactive software for design, analysis, and troubleshooting.",
    overview: "My work sat between physical product development and software. I designed and analyzed hydraulic systems while building custom visualization tools that made schematics, test data, and system behavior easier to interrogate.",
    focus: [
      "Built an interactive hydraulic schematic tool with Electron, TypeScript, and React/SolidJS.",
      "Created visualization tools for design reviews and system troubleshooting.",
      "Translated fluid-system behavior into software models engineers could inspect and reuse.",
    ],
    tools: ["Hydraulics", "TypeScript", "Electron", "React", "SolidJS", "Engineering analysis"],
    reflection: "This was the bridge between chemical engineering and full-time software. Building for my own engineering team taught me to treat domain knowledge as product input, not background context.",
    artifactLabel: "",
    externalUrl: "https://www.allisontransmission.com",
  },
  {
    slug: "tda-research",
    company: "TDA Research",
    mark: "TDA",
    logoUrl: "https://images.squarespace-cdn.com/content/v1/67d84de53503701949732b2d/2375c654-0370-4aad-87ed-8c9325f97d9c/TDA-Logo-Color-PNG.png",
    role: "Process Engineer",
    dates: "August 2015 – October 2017",
    location: "Golden, Colorado",
    summary: "Designed process systems and small software tools for research, quoting, and experimental data.",
    overview: "At TDA Research I worked close to physical experiments and process equipment. The role combined research engineering with the practical work of making experimental data easier to capture, inspect, and use.",
    focus: [
      "Connected CSV-based experimental data to InfluxDB and Grafana.",
      "Built a C# Excel add-in for database connectivity.",
      "Automated quoting workflows, reducing work that took hours to minutes.",
    ],
    tools: ["Chemical engineering", "C#", "Excel", "InfluxDB", "Grafana", "Process systems"],
    reflection: "Small tools had disproportionate value here. Automating one awkward handoff or making one dataset visible could give researchers more time to focus on the experiment itself.",
    artifactLabel: "",
    externalUrl: "https://www.tda.com",
  },
  {
    slug: "continental-technologies",
    company: "Continental Technologies",
    mark: "CT",
    role: "Project Engineer",
    dates: "November 2014 – July 2015",
    location: "Boulder, Colorado",
    summary: "Designed a pilot-scale refining facility for an industrial client, from process simulation to hazard review.",
    overview: "Continental Technologies set out to supply turnkey pilot-scale process plants for industrial clients. I worked between process and project engineering on one pilot refining facility, from the first simulations to the hazard review with the client.",
    focus: [
      "Simulated the client’s refinery processes in VMGSim and produced stream summaries and process diagrams.",
      "Sized and selected vessels, equipment, and relief valves, and wrote the design documents and specification sheets.",
      "Took part in a process hazard analysis of the pilot design with the client’s engineers.",
    ],
    tools: ["Process simulation", "VMGSim", "Equipment sizing", "Relief valves", "Process hazard analysis"],
    reflection: "",
    artifactLabel: "",
    externalUrl: "",
  },
  {
    slug: "chevron-phillips-chemical",
    company: "Chevron Phillips Chemical",
    mark: "CPChem",
    logoUrl: "/images/experience/cpchem.svg",
    role: "Process Engineer, then Operations Engineer",
    dates: "June 2010 – July 2014",
    location: "Pasadena, Texas",
    summary: "Supported polypropylene and polyethylene units, from process support to daily operation of a 2 MMlb/day unit.",
    overview: "My first role after Purdue was at a large plastics complex near Houston. I started in process support for the polypropylene and K-Resin units, then ran day-to-day engineering for operating units, working with shift supervisors, operators, the production scheduler, and the business team.",
    focus: [
      "Supported daily operation of a 2 MMlb/day polyethylene unit that ran experimental catalyst systems and frequent resin changes.",
      "Coordinated the isolation of a polypropylene unit for demolition: 60+ lines air-gapped on the required four-month schedule.",
      "Built an Excel add-in that pulled lab quality data and drew control charts, used by about 20–30 engineers.",
      "Built time-series charts for morning reviews, so an upset such as flaring could be traced to its cause at a glance.",
    ],
    tools: ["Process engineering", "Operations", "Excel", "VBA", "Time-series analysis", "SAP"],
    reflection: "Morning reviews of plant data were where I first learned to make a chart answer one question quickly. That thread runs straight through to the analysis software I built later.",
    artifactLabel: "",
    externalUrl: "https://www.cpchem.com",
  },
];

export function getExperience(slug: string) {
  return experiences.find((experience) => experience.slug === slug);
}
