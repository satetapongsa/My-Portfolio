/**
 * Shared content types. Every piece of personal content on the site is typed
 * here and lives in `src/data/*`, so React components never hard-code it.
 */

export type SectionId = 'home' | 'about' | 'skills' | 'projects' | 'journey' | 'credentials' | 'contact';

/** A certificate image recovered from the original portfolio. */
export interface Certificate {
  id: string;
  /** Exactly as printed on the certificate. */
  title: string;
  issuer: string;
  /** ISO date printed on the certificate. */
  date: string;
  /** Original, unmodified file — used for "Open full size" and "Download". */
  image: string;
  /** 640 px WebP for the grid. */
  thumb: string;
  /** 1600 px WebP for the in-page viewer. */
  preview: string;
  width: number;
  height: number;
  /** Optional detail printed on the certificate, e.g. training hours. */
  note?: string;
  /** Public verification URL printed on the certificate, if any. */
  verifyUrl?: string;
}

export interface NavItem {
  id: SectionId;
  label: string;
}

/** An empty string means "not configured" — the UI hides or disables it. */
export interface SocialLink {
  id: 'github' | 'linkedin' | 'tiktok' | 'email' | 'website' | 'other';
  label: string;
  url: string;
  handle?: string;
}

export interface InfoBlock {
  title: string;
  icon: 'education' | 'interests' | 'focus' | 'philosophy';
  items: string[];
}

export interface PortfolioProfile {
  fullName: string;
  /** Real profile photo (path under /public). */
  photo: { src: string; alt: string; width: number; height: number };
  /** Short name used for the brand and casual references. */
  nickname: string;
  role: string;
  tagline: string;
  /** Short line under the hero heading. */
  heroIntro: string;
  /** Professional introduction (raw page intro, About lead, terminal). */
  bio: string;
  /** Interests paragraph (raw page "About Me", About section). */
  aboutMe: string;
  interests: string[];
  education: {
    university: string;
    campus: string;
    field: string;
    /** e.g. "2023 — Present". Empty = not shown. PLACEHOLDER */
    period: string;
  };
  infoBlocks: InfoBlock[];
  contact: {
    /** PLACEHOLDER — your public email. Empty disables copy/mailto actions. */
    email: string;
    /**
     * Optional form endpoint (e.g. Formspree, your own API) that accepts a
     * JSON POST of { name, email, message }. Empty = mailto fallback.
     */
    formEndpoint: string;
    location: string;
    availability: string;
  };
  socials: SocialLink[];
  /** Path to a PDF in /public, e.g. "/resume.pdf". Empty = button disabled. */
  resumePath: string;
}

export type ProficiencyLevel = 'Exploring' | 'Learning' | 'Familiar With' | 'Working Knowledge';

export interface Skill {
  name: string;
  /** Omitted when no honest level is known (e.g. skills taken from the résumé). */
  level?: ProficiencyLevel;
  /** Where the skill is documented; 'resume' shows a résumé tag. */
  source?: 'resume';
  /** Placeholders stay in the data file but are never rendered. */
  placeholder?: boolean;
  note?: string;
}

export type SkillCategoryIcon = 'code' | 'layout' | 'server' | 'database' | 'tools' | 'automation' | 'cube' | 'foundations';

export interface SkillCategory {
  id: string;
  title: string;
  icon: SkillCategoryIcon;
  description: string;
  skills: Skill[];
}

export type ProjectFilter = 'ai' | 'web' | 'tools' | 'iot' | 'interactive';

/** Evidence-based status of a GitHub project. */
export type ProjectStage = 'completed' | 'in-progress' | 'experimental' | 'archived';

export interface ProjectLink {
  /** Empty string = no public URL; the button is not rendered. */
  url: string;
  label: string;
}

export interface ArchitectureLayer {
  name: string;
  detail: string;
}

/** A real screenshot in two widths: `thumb` for cards, `src` for full views. */
export interface ProjectImage {
  src: string;
  thumb: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  /** Short identifier shown in monospace, e.g. "PRJ-01". */
  code: string;
  /** Name exactly as in the repository README title. */
  title: string;
  /** README subtitle (text after the em dash), if any. */
  subtitle?: string;
  /** Repository name on GitHub, shown for transparency. */
  repo: string;
  summary: string;
  filter: ProjectFilter;
  categoryLabel: string;
  tech: string[];
  status: { label: string; stage: ProjectStage };
  /** Real screenshot of the running project; omitted when none exists (a text fallback is shown). */
  cover?: ProjectImage & { alt: string };
  links: {
    github: ProjectLink;
    demo: ProjectLink;
    /** Additional public repositories that belong to the same project. */
    related?: ProjectLink[];
  };
  details: {
    overview: string;
    objective: string;
    architecture: ArchitectureLayer[];
    features: string[];
    /** Real screenshots only. */
    screenshots: (ProjectImage & { caption: string })[];
  };
}

export type JourneyKind = 'education' | 'milestone' | 'interest' | 'project' | 'goal';

export interface JourneyEntry {
  id: string;
  kind: JourneyKind;
  title: string;
  description: string;
  /** Free-form period such as "2024" or "Present". Empty = no date chip. */
  period: string;
  /** Marks an entry whose content still needs to be written by you. */
  placeholder?: boolean;
}
