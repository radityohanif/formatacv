export interface PersonalInfo {
  fullName: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  portfolio: string;
  website: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  major: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  coursework: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  techStack: string;
  date: string;
  bullets: string[];
}

export interface ActivityItem {
  id: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  activities: ActivityItem[];
  additional: {
    technicalSkills: string;
    languages: string;
    certifications: string;
    awards: string;
  };
}

export const STORAGE_KEY = "ats_cv_builder_data";

export const sampleCV: CVData = {
  personal: {
    fullName: "Alex Morgan",
    title: "Software Engineer · Business Analyst",
    location: "San Francisco, CA",
    phone: "+1 (415) 555-0142",
    email: "alex.morgan@email.com",
    linkedin: "linkedin.com/in/alexmorgan",
    portfolio: "github.com/alexmorgan",
    website: "alexmorgan.dev",
  },
  summary:
    "Software engineer with 5+ years building reliable internal tools and data workflows. Comfortable owning features end-to-end and translating ambiguous business needs into shippable, well-measured solutions.",
  education: [
    {
      id: "e1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      major: "Minor in Business",
      location: "Berkeley, CA",
      startDate: "Aug 2016",
      endDate: "May 2020",
      gpa: "GPA: 3.8 / 4.0 — Dean's List (6 semesters)",
      coursework: "Relevant coursework: Distributed Systems, Databases, Operations Research",
    },
  ],
  experience: [
    {
      id: "x1",
      company: "Northwind Technologies",
      title: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jun 2022",
      endDate: "Present",
      isCurrent: true,
      bullets: [
        "Improved monthly reporting workflow by reducing manual reconciliation time by 40% across 6 finance teams.",
        "Built a reusable invoice template system used across quotation, invoice, and billing workflows.",
        "Integrated third-party APIs and improved synchronization reliability across internal systems to 99.95% uptime.",
        "Mentored 3 junior engineers through structured code reviews and weekly architecture sessions.",
      ],
    },
    {
      id: "x2",
      company: "Helios Analytics",
      title: "Software Engineer",
      location: "Remote",
      startDate: "Jul 2020",
      endDate: "May 2022",
      isCurrent: false,
      bullets: [
        "Designed and shipped an internal data catalog adopted by 12 analyst teams within 4 months.",
        "Migrated legacy ETL jobs to a managed orchestrator, cutting average pipeline runtime by 35%.",
        "Partnered with product to define acceptance criteria for 20+ analytics features.",
      ],
    },
  ],
  projects: [
    {
      id: "p1",
      name: "OpenLedger",
      techStack: "TypeScript, Postgres, Next.js",
      date: "Jan 2024 – Present",
      bullets: [
        "Open-source double-entry bookkeeping engine with 800+ GitHub stars.",
        "Designed pluggable adapter system supporting CSV, QuickBooks, and Stripe imports.",
      ],
    },
    {
      id: "p2",
      name: "Calendly-for-Clinics",
      techStack: "React, Node.js, Twilio",
      date: "Mar 2023 – Sep 2023",
      bullets: [
        "Booking platform piloted at 3 clinics, handling 1,200+ appointments per month.",
        "Implemented SMS reminders that reduced no-show rate from 18% to 7%.",
      ],
    },
  ],
  activities: [
    {
      id: "a1",
      organization: "Code the Bay",
      role: "Volunteer Mentor",
      location: "San Francisco, CA",
      startDate: "Sep 2021",
      endDate: "Present",
      bullets: [
        "Coach a cohort of 8 career-switchers through weekly project reviews and mock interviews.",
      ],
    },
  ],
  additional: {
    technicalSkills: "TypeScript, React, Node.js, Python, PostgreSQL, AWS, Docker, GraphQL",
    languages: "English (native), Spanish (professional)",
    certifications: "AWS Certified Solutions Architect — Associate",
    awards: "Dean's List, Hackathon Winner 2023",
  },
};

export const sectionIds = [
  "personal",
  "summary",
  "education",
  "experience",
  "projects",
  "activities",
  "skills",
  "review",
] as const;

export type SectionId = (typeof sectionIds)[number];

export const sectionMeta: Record<SectionId, { label: string; description: string; hint: string }> =
  {
    personal: {
      label: "Personal Info",
      description: "Name, contact, and where to reach you.",
      hint: "Keep it scannable — recruiters spend ~7 seconds here.",
    },
    summary: {
      label: "Summary",
      description: "A 2–3 sentence positioning statement.",
      hint: "Lead with years of experience and the value you ship.",
    },
    education: {
      label: "Education",
      description: "Schools, degrees, and notable coursework.",
      hint: "Most recent first. Drop GPA after 5 years of experience.",
    },
    experience: {
      label: "Work Experience",
      description: "Where you've worked and what you delivered.",
      hint: "Action verb + task + measurable result + tools.",
    },
    projects: {
      label: "Projects",
      description: "Side projects, open source, or internal builds.",
      hint: "Pick projects that show range, not just resume filler.",
    },
    activities: {
      label: "Activities",
      description: "Volunteering, communities, leadership.",
      hint: "Anything that shows initiative outside of paid work.",
    },
    skills: {
      label: "Skills & Additional",
      description: "Stack, languages, certifications, awards.",
      hint: "Group by category. Skip outdated tools.",
    },
    review: {
      label: "Review & Export",
      description: "Final checks before downloading.",
      hint: "Run a quick ATS sanity pass.",
    },
  };

export function newId() {
  return Math.random().toString(36).slice(2, 9);
}

export function formatDateRange(start: string, end: string, isCurrent?: boolean) {
  if (!start && !end) return "";
  const endLabel = isCurrent ? "Present" : end;
  if (!start) return endLabel;
  if (!endLabel) return start;
  return `${start} – ${endLabel}`;
}

export function exportFileName(fullName: string, ext: "pdf" | "png") {
  const base =
    fullName
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "") || "My_CV";
  return `${base}_CV.${ext}`;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function migrateLegacyData(raw: Record<string, unknown>): CVData | null {
  const personal = raw.personal as Record<string, unknown> | undefined;
  if (!personal || typeof personal.fullName !== "string") return null;

  const links = typeof personal.links === "string" ? personal.links : "";
  const linkParts = links.split("·").map((s) => s.trim());

  const migrated: CVData = {
    personal: {
      fullName: personal.fullName,
      title: typeof personal.title === "string" ? personal.title : "",
      location: typeof personal.location === "string" ? personal.location : "",
      phone: typeof personal.phone === "string" ? personal.phone : "",
      email: typeof personal.email === "string" ? personal.email : "",
      linkedin: typeof personal.linkedin === "string" ? personal.linkedin : linkParts[0] || "",
      portfolio: typeof personal.portfolio === "string" ? personal.portfolio : linkParts[1] || "",
      website: typeof personal.website === "string" ? personal.website : "",
    },
    summary: typeof raw.summary === "string" ? raw.summary : "",
    education: [],
    experience: [],
    projects: [],
    activities: [],
    additional: {
      technicalSkills: "",
      languages: "",
      certifications: "",
      awards: "",
    },
  };

  if (Array.isArray(raw.education)) {
    migrated.education = raw.education.map((e: Record<string, unknown>) => {
      const range = e.range as Record<string, string> | undefined;
      const details = isStringArray(e.details) ? e.details : [];
      return {
        id: typeof e.id === "string" ? e.id : newId(),
        institution:
          typeof e.institution === "string"
            ? e.institution
            : typeof e.school === "string"
              ? e.school
              : "",
        degree: typeof e.degree === "string" ? e.degree : "",
        major: typeof e.major === "string" ? e.major : "",
        location: typeof e.location === "string" ? e.location : "",
        startDate: typeof e.startDate === "string" ? e.startDate : range?.start || "",
        endDate: typeof e.endDate === "string" ? e.endDate : range?.end || "",
        gpa: typeof e.gpa === "string" ? e.gpa : details[0] || "",
        coursework: typeof e.coursework === "string" ? e.coursework : details[1] || "",
      };
    });
  }

  if (Array.isArray(raw.experience)) {
    migrated.experience = raw.experience.map((x: Record<string, unknown>) => {
      const range = x.range as Record<string, unknown> | undefined;
      return {
        id: typeof x.id === "string" ? x.id : newId(),
        company: typeof x.company === "string" ? x.company : "",
        title: typeof x.title === "string" ? x.title : typeof x.role === "string" ? x.role : "",
        location: typeof x.location === "string" ? x.location : "",
        startDate: typeof x.startDate === "string" ? x.startDate : String(range?.start || ""),
        endDate: typeof x.endDate === "string" ? x.endDate : String(range?.end || ""),
        isCurrent: !!(range?.current ?? x.isCurrent),
        bullets: isStringArray(x.bullets) ? x.bullets : [""],
      };
    });
  }

  if (Array.isArray(raw.projects)) {
    migrated.projects = raw.projects.map((p: Record<string, unknown>) => {
      const range = p.range as Record<string, unknown> | undefined;
      const start = String(range?.start || p.startDate || "");
      const end = String(range?.end || p.endDate || "");
      const current = !!range?.current;
      return {
        id: typeof p.id === "string" ? p.id : newId(),
        name: typeof p.name === "string" ? p.name : "",
        techStack:
          typeof p.techStack === "string"
            ? p.techStack
            : typeof p.stack === "string"
              ? p.stack
              : "",
        date: typeof p.date === "string" ? p.date : formatDateRange(start, end, current),
        bullets: isStringArray(p.bullets) ? p.bullets : [""],
      };
    });
  }

  if (Array.isArray(raw.activities)) {
    migrated.activities = raw.activities.map((a: Record<string, unknown>) => {
      const range = a.range as Record<string, unknown> | undefined;
      return {
        id: typeof a.id === "string" ? a.id : newId(),
        organization: typeof a.organization === "string" ? a.organization : "",
        role: typeof a.role === "string" ? a.role : "",
        location: typeof a.location === "string" ? a.location : "",
        startDate: typeof a.startDate === "string" ? a.startDate : String(range?.start || ""),
        endDate: typeof a.endDate === "string" ? a.endDate : String(range?.end || ""),
        bullets: isStringArray(a.bullets) ? a.bullets : [""],
      };
    });
  }

  const skills = raw.skills as Record<string, unknown> | undefined;
  const additional = raw.additional as Record<string, unknown> | undefined;

  if (additional) {
    migrated.additional = {
      technicalSkills:
        typeof additional.technicalSkills === "string" ? additional.technicalSkills : "",
      languages: typeof additional.languages === "string" ? additional.languages : "",
      certifications:
        typeof additional.certifications === "string" ? additional.certifications : "",
      awards: typeof additional.awards === "string" ? additional.awards : "",
    };
  } else if (skills) {
    migrated.additional = {
      technicalSkills: isStringArray(skills.technical) ? skills.technical.join(", ") : "",
      languages: isStringArray(skills.languages) ? skills.languages.join(", ") : "",
      certifications: isStringArray(skills.certifications) ? skills.certifications.join(", ") : "",
      awards: isStringArray(skills.interests)
        ? skills.interests.join(", ")
        : isStringArray(skills.awards)
          ? skills.awards.join(", ")
          : "",
    };
  }

  return migrated;
}

export function loadCVData(): CVData {
  if (typeof window === "undefined") return sampleCV;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleCV;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return sampleCV;

    const migrated = migrateLegacyData(parsed as Record<string, unknown>);
    if (!migrated) return sampleCV;

    return migrated;
  } catch {
    return sampleCV;
  }
}
