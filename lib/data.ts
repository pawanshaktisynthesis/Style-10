/**
 * Content model for the PawanShakti Synthesis site.
 *
 * Copy is deliberately concrete: named systems, real numbers, plain verbs.
 * Nothing here says "empowering your digital journey".
 */

export const BRAND = {
  name: "PawanShakti Synthesis",
  short: "PawanShakti",
  /** pawan (wind) + shakti (power) — the etymology drives the whole visual system. */
  etymology: "pawan · wind — shakti · power",
  tagline: "Premium technology. Premium design. Premium business solutions.",
  description:
    "PawanShakti Synthesis designs and builds AI systems, enterprise software, and digital products for companies that treat engineering and design as the same discipline.",
  email: "hello@pawanshaktisynthesis.com",
  phone: "+91 98765 43210",
  location: "Bengaluru · Singapore · remote across 14 timezones",
  founded: 2017,
} as const;

/** Section registry — drives the nav, the scroll spy, and the 3D stage machine. */
export const SECTIONS = [
  { id: "hero", label: "Index", stage: "vayu", phase: "01", title: "The Current" },
  { id: "about", label: "Studio", stage: "agni", phase: "02", title: "The Studio" },
  { id: "services", label: "Capabilities", stage: "tejas", phase: "03", title: "Capabilities" },
  { id: "process", label: "Method", stage: "kriya", phase: "04", title: "The Method" },
  { id: "work", label: "Work", stage: "rupa", phase: "05", title: "Selected Work" },
  { id: "stack", label: "Stack", stage: "yantra", phase: "06", title: "The Stack" },
  { id: "voices", label: "Clients", stage: "vak", phase: "07", title: "Client Voices" },
  { id: "contact", label: "Contact", stage: "sandhi", phase: "08", title: "Start Something" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/* -------------------------------------------------------------------------- */
/* Studio                                                                      */
/* -------------------------------------------------------------------------- */

export const METRICS = [
  { value: 214, suffix: "", label: "Systems shipped", detail: "since 2017" },
  { value: 38, suffix: "M", label: "Requests served daily", detail: "across client infrastructure" },
  { value: 99.98, suffix: "%", label: "Median uptime", decimals: 2, detail: "trailing 12 months" },
  { value: 41, suffix: "", label: "Engineers and designers", detail: "one team, no handoffs" },
] as const;

export const TIMELINE = [
  {
    year: "2017",
    title: "Two people, one contract",
    body: "Started as a two-person practice rebuilding a logistics platform that was losing four hours a week to manual reconciliation. We shipped it in eleven weeks. That client is still with us.",
  },
  {
    year: "2019",
    title: "Design moved in-house",
    body: "We stopped subcontracting interface work. Designers and engineers began sharing a repository, a review process, and a definition of done. Delivery time dropped by a third.",
  },
  {
    year: "2021",
    title: "The infrastructure practice",
    body: "Client systems outgrew single regions. We built a platform team to handle multi-region deployment, observability, and cost control so product teams could stay on product.",
  },
  {
    year: "2023",
    title: "Applied AI, in production",
    body: "We put our first retrieval system in front of real users. Since then we have shipped fourteen more — document intelligence, forecasting, and agent workflows that hold up under audit.",
  },
  {
    year: "2026",
    title: "Forty-one people, three continents",
    body: "Still one team. Still no handoffs between design and engineering. We take on a limited number of engagements each quarter so that senior people stay on every project.",
  },
] as const;

export const PRINCIPLES = [
  {
    title: "Taste is an engineering constraint",
    body: "A system that is unpleasant to use is unfinished, no matter what the tests say. Interface quality goes in the acceptance criteria alongside latency and correctness.",
  },
  {
    title: "Senior people, on the work",
    body: "The people in the pitch are the people in the pull requests. We cap concurrent engagements rather than staffing up with juniors to fill a gap.",
  },
  {
    title: "You own what we build",
    body: "Source, infrastructure, and documentation transfer to you at every milestone. There is no proprietary runtime you have to keep paying us for.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Capabilities                                                                */
/* -------------------------------------------------------------------------- */

export type Service = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  points: string[];
  /** Drives the generative glyph rendered on each card. */
  glyph: "orbit" | "grid" | "wave" | "stack" | "cloud" | "flow" | "frame" | "prism" | "shift" | "chart" | "node" | "vault";
};

export const SERVICES: Service[] = [
  {
    id: "ai",
    title: "AI Solutions",
    summary: "Retrieval, reasoning, and agent systems that survive contact with real users.",
    detail:
      "We build AI features that are evaluated, observable, and cost-bounded — not demos that fall over on the tenth query.",
    points: ["Retrieval architecture", "Evaluation harnesses", "Guardrails and audit trails", "Inference cost control"],
    glyph: "orbit",
  },
  {
    id: "ml",
    title: "Machine Learning",
    summary: "Forecasting, ranking, and detection models with the pipeline to keep them honest.",
    detail:
      "Training is the short part. We build the feature stores, drift monitoring, and retraining schedules that keep a model useful past month three.",
    points: ["Feature pipelines", "Drift monitoring", "Retraining automation", "Model governance"],
    glyph: "chart",
  },
  {
    id: "software",
    title: "Software Development",
    summary: "Core systems built to be read, changed, and handed over.",
    detail:
      "Typed end to end, tested where it counts, documented in the repository. We optimise for the engineer who inherits it.",
    points: ["Domain modelling", "API design", "Test strategy", "Migration paths"],
    glyph: "stack",
  },
  {
    id: "web",
    title: "Web Development",
    summary: "Interfaces that load fast on a mid-range phone and still feel expensive.",
    detail:
      "Performance budgets are set before the first component. We hold to them through launch and after.",
    points: ["Edge rendering", "Core Web Vitals budgets", "Design systems", "Accessibility to WCAG 2.2 AA"],
    glyph: "frame",
  },
  {
    id: "mobile",
    title: "Mobile Apps",
    summary: "iOS and Android products that work offline and update without a store review.",
    detail:
      "Native where it matters, shared where it does not. Release trains, staged rollout, and crash budgets from day one.",
    points: ["Native and React Native", "Offline-first sync", "Release automation", "Store compliance"],
    glyph: "shift",
  },
  {
    id: "cloud",
    title: "Cloud & Platform",
    summary: "Infrastructure your team can operate without paging us at 3am.",
    detail:
      "Reproducible environments, real observability, and a cost model you can explain to finance.",
    points: ["Infrastructure as code", "Multi-region deployment", "Observability", "FinOps and cost control"],
    glyph: "cloud",
  },
  {
    id: "automation",
    title: "Automation",
    summary: "Workflow systems that remove the spreadsheet in the middle of your process.",
    detail:
      "We map the real process first — including the parts nobody documented — then automate what actually costs time.",
    points: ["Process mapping", "Integration layers", "Approval workflows", "Exception handling"],
    glyph: "flow",
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    summary: "Product design grounded in the constraints of the system underneath.",
    detail:
      "Our designers read the schema. That is why the handoff works — there is no wall to throw anything over.",
    points: ["Product strategy", "Interaction design", "Design systems", "Usability testing"],
    glyph: "grid",
  },
  {
    id: "brand",
    title: "Brand Design",
    summary: "Identity systems built for interfaces, not just for a logo sheet.",
    detail:
      "A wordmark that survives a 32px favicon and a motion language that carries into the product.",
    points: ["Identity systems", "Motion language", "Editorial art direction", "Brand governance"],
    glyph: "prism",
  },
  {
    id: "transformation",
    title: "Digital Transformation",
    summary: "Moving a working business onto new systems without stopping the business.",
    detail:
      "Strangler-fig migrations, parallel running, and reversible cutovers. Nobody has a big-bang weekend.",
    points: ["Legacy assessment", "Incremental migration", "Change management", "Team enablement"],
    glyph: "wave",
  },
  {
    id: "data",
    title: "Data Analytics",
    summary: "One number, one definition, one place to find it.",
    detail:
      "Warehouse modelling and semantic layers so that two dashboards stop disagreeing about revenue.",
    points: ["Warehouse modelling", "Semantic layers", "Executive reporting", "Data quality contracts"],
    glyph: "node",
  },
  {
    id: "enterprise",
    title: "Custom Enterprise Systems",
    summary: "The system that runs the company, rebuilt properly.",
    detail:
      "Long-lived internal platforms with the access control, audit, and integration depth that regulated work demands.",
    points: ["Role-based access", "Audit and compliance", "ERP and CRM integration", "Long-term support"],
    glyph: "vault",
  },
];

/* -------------------------------------------------------------------------- */
/* Method — a genuine ordered sequence, so the numbering is load-bearing.      */
/* -------------------------------------------------------------------------- */

export const PROCESS = [
  {
    n: "01",
    title: "Diagnose",
    duration: "1–2 weeks",
    body: "We sit with the people doing the work and read the code that already exists. You get a written assessment of what is worth keeping and what is costing you money.",
    outputs: ["System assessment", "Risk register", "Cost model"],
  },
  {
    n: "02",
    title: "Frame",
    duration: "2 weeks",
    body: "Scope, architecture, and interface direction land together, because deciding them separately is how projects go wrong. You approve one plan, not three.",
    outputs: ["Architecture decision records", "Interface direction", "Delivery plan"],
  },
  {
    n: "03",
    title: "Build",
    duration: "6–20 weeks",
    body: "Two-week increments against a live environment. Every increment is deployable, reviewable, and demonstrated to you — not described in a status report.",
    outputs: ["Working increments", "Test coverage", "Deployment pipeline"],
  },
  {
    n: "04",
    title: "Harden",
    duration: "2–4 weeks",
    body: "Load testing, security review, accessibility audit, and failure drills. We break it on purpose before your users find the edges.",
    outputs: ["Load and chaos testing", "Security review", "Accessibility audit"],
  },
  {
    n: "05",
    title: "Hand over",
    duration: "Ongoing",
    body: "Documentation, runbooks, and pairing sessions until your team ships without us. We stay on retainer only if you want us there.",
    outputs: ["Runbooks", "Team enablement", "Optional retainer"],
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Work                                                                        */
/* -------------------------------------------------------------------------- */

export type CaseStudy = {
  id: string;
  client: string;
  sector: string;
  title: string;
  summary: string;
  year: string;
  scope: string[];
  results: { value: string; label: string }[];
  /** Selects the generated SVG composition used as the case visual. */
  art: "dashboard" | "network" | "mobile" | "terrain" | "flow" | "grid";
  accent: "prana" | "shakti" | "ember";
};

export const WORK: CaseStudy[] = [
  {
    id: "meridian",
    client: "Meridian Freight",
    sector: "Logistics",
    title: "Routing that reprices itself every ninety seconds",
    summary:
      "A forecasting and routing engine that replaced a spreadsheet-driven planning desk across 19 depots. Planners now approve exceptions instead of building every route by hand.",
    year: "2025",
    scope: ["Machine learning", "Platform engineering", "Interface design"],
    results: [
      { value: "31%", label: "Lower empty-mile rate" },
      { value: "4.2h", label: "Planner time saved daily" },
      { value: "19", label: "Depots migrated with no downtime" },
    ],
    art: "terrain",
    accent: "prana",
  },
  {
    id: "kavach",
    client: "Kavach Health",
    sector: "Healthcare",
    title: "Clinical document intelligence that passes audit",
    summary:
      "A retrieval system over eleven years of unstructured clinical records. Every answer cites its source document and page, because in this sector an uncited answer is worthless.",
    year: "2025",
    scope: ["AI solutions", "Data platform", "Compliance"],
    results: [
      { value: "1.4M", label: "Documents indexed" },
      { value: "97.3%", label: "Citation accuracy at review" },
      { value: "8s → 0.9s", label: "Median lookup time" },
    ],
    art: "network",
    accent: "shakti",
  },
  {
    id: "aurum",
    client: "Aurum Capital",
    sector: "Financial services",
    title: "A trading desk interface built for the eleventh hour",
    summary:
      "Real-time positions across six asset classes at 60fps, designed so that the most dangerous action on the screen is also the hardest one to trigger by accident.",
    year: "2024",
    scope: ["Interface design", "Web engineering", "Observability"],
    results: [
      { value: "60fps", label: "Sustained under full book load" },
      { value: "−64%", label: "Mis-entry incidents" },
      { value: "12ms", label: "P95 render latency" },
    ],
    art: "dashboard",
    accent: "prana",
  },
  {
    id: "tarang",
    client: "Tarang Retail",
    sector: "Commerce",
    title: "Storefront rebuilt to a 1.1 second budget",
    summary:
      "A commerce platform for 340 stores where the performance budget was set before the first component and defended through launch. Mobile conversion followed the load time down.",
    year: "2024",
    scope: ["Web engineering", "Design system", "Cloud"],
    results: [
      { value: "1.1s", label: "LCP on 4G mid-range" },
      { value: "+27%", label: "Mobile conversion" },
      { value: "340", label: "Storefronts on one system" },
    ],
    art: "mobile",
    accent: "ember",
  },
  {
    id: "prithvi",
    client: "Prithvi Energy",
    sector: "Energy",
    title: "Grid telemetry from 12,000 sensors, in one view",
    summary:
      "An operations platform ingesting continuous telemetry from distributed solar assets, with anomaly detection that flags degradation weeks before a site visit would catch it.",
    year: "2023",
    scope: ["Data platform", "Machine learning", "Enterprise systems"],
    results: [
      { value: "12k", label: "Sensors streaming live" },
      { value: "3.1 wks", label: "Median early fault warning" },
      { value: "₹18cr", label: "Annual output recovered" },
    ],
    art: "flow",
    accent: "shakti",
  },
  {
    id: "sutra",
    client: "Sutra Education",
    sector: "Education",
    title: "One platform replacing nine internal tools",
    summary:
      "A consolidation programme across admissions, scheduling, and assessment for a university group — migrated department by department with parallel running throughout.",
    year: "2023",
    scope: ["Digital transformation", "Enterprise systems", "UI/UX"],
    results: [
      { value: "9 → 1", label: "Systems consolidated" },
      { value: "0", label: "Days of service interruption" },
      { value: "58k", label: "Students onboarded" },
    ],
    art: "grid",
    accent: "prana",
  },
];

/* -------------------------------------------------------------------------- */
/* Stack                                                                       */
/* -------------------------------------------------------------------------- */

export const STACK_GROUPS = [
  {
    group: "Interface",
    items: ["TypeScript", "React", "Next.js", "Swift", "Kotlin", "WebGL", "Three.js", "Motion"],
  },
  {
    group: "Services",
    items: ["Go", "Rust", "Python", "Node.js", "GraphQL", "gRPC", "PostgreSQL", "Redis"],
  },
  {
    group: "Intelligence",
    items: ["PyTorch", "LangGraph", "pgvector", "Ray", "Triton", "DuckDB", "dbt", "Airflow"],
  },
  {
    group: "Platform",
    items: ["Kubernetes", "Terraform", "AWS", "GCP", "Cloudflare", "Kafka", "ClickHouse", "OpenTelemetry"],
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Voices                                                                      */
/* -------------------------------------------------------------------------- */

export const TESTIMONIALS = [
  {
    quote:
      "They rewrote the part of our platform everyone was afraid to touch, and did it without a single unplanned outage. Six months on, our own engineers are shipping in that code confidently.",
    name: "Anjali Rao",
    role: "Chief Technology Officer",
    company: "Meridian Freight",
  },
  {
    quote:
      "The first thing they did was tell us which half of our roadmap was not worth building. That conversation saved us more than the engagement cost.",
    name: "David Okonjo",
    role: "VP Product",
    company: "Aurum Capital",
  },
  {
    quote:
      "We have worked with three agencies before this. PawanShakti is the only one where the people who pitched were the people who wrote the code.",
    name: "Meera Krishnan",
    role: "Founder",
    company: "Tarang Retail",
  },
  {
    quote:
      "Our compliance team signed off on their AI system in one review. I have never seen that happen before, in any project, anywhere.",
    name: "Dr. Samuel Hart",
    role: "Head of Clinical Systems",
    company: "Kavach Health",
  },
  {
    quote:
      "The handover was the most impressive part. Runbooks, architecture records, and two weeks of pairing. We were operating it alone by the end of the month.",
    name: "Lena Fischer",
    role: "Director of Engineering",
    company: "Prithvi Energy",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Contact                                                                     */
/* -------------------------------------------------------------------------- */

export const BUDGETS = ["Under ₹20L", "₹20L – ₹60L", "₹60L – ₹1.5Cr", "Above ₹1.5Cr", "Not sure yet"] as const;

export const INTERESTS = [
  "AI Solutions",
  "Software Development",
  "Web Development",
  "Mobile Apps",
  "Cloud & Platform",
  "UI/UX Design",
  "Digital Transformation",
  "Data Analytics",
] as const;
