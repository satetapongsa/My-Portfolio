/**
 * Localised personal content. English comes straight from src/data; Thai is
 * the same data with the overrides from content.th.ts applied, so structure,
 * links and images are never duplicated.
 */
import { certificates } from '../data/certificates';
import { journey } from '../data/journey';
import { introProjects, navItems, profile } from '../data/portfolio';
import { projectFilters, projects } from '../data/projects';
import { skillCategories } from '../data/skills';
import type { Lang } from './lang';
import {
  certificateNotesTh,
  certificateTitlesTh,
  filtersTh,
  introProjectsTh,
  journeyTh,
  navTh,
  profileTh,
  projectsTh,
  skillsTh,
} from './content.th';

const en = { profile, navItems, projectFilters, projects, skillCategories, journey, certificates, introProjects };

export type Content = typeof en;

const th: Content = {
  profile: {
    ...profile,
    photo: { ...profile.photo, alt: profileTh.photoAlt },
    role: profileTh.role,
    tagline: profileTh.tagline,
    heroIntro: profileTh.heroIntro,
    bio: profileTh.bio,
    aboutMe: profileTh.aboutMe,
    interests: profileTh.interests,
    education: { ...profile.education, ...profileTh.education },
    infoBlocks: profile.infoBlocks.map((block, i) => ({ ...block, ...profileTh.infoBlocks[i] })),
    contact: { ...profile.contact, location: profileTh.location, availability: profileTh.availability },
  },
  navItems: navItems.map((item) => ({ ...item, label: navTh[item.id] ?? item.label })),
  projectFilters: projectFilters.map((f) => ({ ...f, label: filtersTh[f.id] ?? f.label })),
  projects: projects.map((p) => {
    const t = projectsTh[p.id];
    if (!t) return p;
    return {
      ...p,
      summary: t.summary,
      categoryLabel: t.categoryLabel,
      status: { ...p.status, label: t.status },
      cover: p.cover && { ...p.cover, alt: t.alt ?? p.cover.alt },
      links: {
        ...p.links,
        demo: { ...p.links.demo, label: t.demoLabel ?? 'เดโมจริง' },
        related: p.links.related?.map((link, i) => ({ ...link, label: t.relatedLabels?.[i] ?? link.label })),
      },
      details: {
        ...p.details,
        overview: t.overview,
        objective: t.objective,
        architecture: t.architecture,
        features: t.features,
        screenshots: p.details.screenshots.map((s, i) => ({ ...s, caption: t.captions[i] ?? s.caption })),
      },
    };
  }),
  skillCategories: skillCategories.map((c) => {
    const t = skillsTh[c.id];
    if (!t) return c;
    return {
      ...c,
      title: t.title ?? c.title,
      description: t.description ?? c.description,
      skills: c.skills.map((s) => ({ ...s, name: t.names?.[s.name] ?? s.name })),
    };
  }),
  journey: journey.map((j) => ({ ...j, ...journeyTh[j.id], period: journeyTh[j.id]?.period ?? j.period })),
  certificates: certificates.map((c) => ({ ...c, title: certificateTitlesTh[c.id] ?? c.title, note: certificateNotesTh[c.id] ?? c.note })),
  introProjects: introProjectsTh,
};

const byLang: Record<Lang, Content> = { en, th };

export const getContent = (lang: Lang): Content => byLang[lang];

/** <title> per language; English matches index.html. */
export const documentTitles: Record<Lang, string> = {
  en: 'Satetapong Sanguansuk (Wave) — Computer Engineering Student & Developer',
  th: profileTh.documentTitle,
};
