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
  /** Path under /public. */
  image: string;
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

export type ProjectFilter = 'web' | 'automation' | 'interactive' | 'other';

export type ProjectStage = 'concept' | 'design' | 'in-progress' | 'built' | 'completed';

export interface ProjectLink {
  /** Empty string = not published yet; the button renders disabled. */
  url: string;
  label: string;
}

export interface ArchitectureLayer {
  name: string;
  detail: string;
}

export interface Project {
  id: string;
  /** Also list this project on the unstyled intro page. */
  onRawPage?: boolean;
  /** Short identifier shown in monospace, e.g. "PRJ-01". */
  code: string;
  title: string;
  summary: string;
  filter: ProjectFilter;
  categoryLabel: string;
  tech: string[];
  status: { label: string; stage: ProjectStage };
  cover: {
    /** Put a real screenshot in /public/projects and set its path here. */
    src: string;
    alt: string;
    /** Built-in illustrated placeholder used while `src` is empty. */
    placeholder: 'tank-system' | 'penthouse' | 'generic';
  };
  links: { github: ProjectLink; demo: ProjectLink };
  details: {
    overview: string;
    objective: string;
    architecture: ArchitectureLayer[];
    features: string[];
    /** Real screenshots only. Empty array renders a clearly-labelled slot. */
    screenshots: { src: string; caption: string }[];
    process: string[];
    challenges: { challenge: string; approach: string }[];
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
