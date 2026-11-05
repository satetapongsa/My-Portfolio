/**
 * Résumé files. Only real documents are listed: there is one résumé, in
 * English. A Thai version does not exist, so none is offered.
 *
 * The preview images are page 1 of the PDF rendered to WebP (480 / 960 px);
 * the PDF itself is the original, unmodified file.
 */
import type { Lang } from '../i18n/lang';
import { asset } from '../utils/asset';

export interface ResumeFile {
  lang: Lang;
  /** Headline printed on the résumé. */
  headline: string;
  url: string;
  fileName: string;
  sizeBytes: number;
  pages: number;
  preview: { src: string; small: string; width: number; height: number };
}

export const resumes: ResumeFile[] = [
  {
    lang: 'en',
    headline: 'Full-Stack Developer Intern',
    url: asset('assets/legacy/resume/Resume_Satetapong_Sanguansuk.pdf'),
    fileName: 'Resume_Satetapong_Sanguansuk.pdf',
    sizeBytes: 46140,
    pages: 1,
    preview: {
      src: asset('assets/optimized/resume/resume-page1-960.webp'),
      small: asset('assets/optimized/resume/resume-page1-480.webp'),
      width: 960,
      height: 1358,
    },
  },
];

export const formatBytes = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);
