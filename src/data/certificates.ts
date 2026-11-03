/**
 * Certificates recovered from the original portfolio
 * (public/assets/legacy/certificates/). Titles, issuers, dates and
 * verification links are transcribed from the certificate images themselves —
 * add a new one by dropping the image in that folder and appending an entry.
 * Newest first.
 */
import { asset } from '../utils/asset';
import type { Certificate } from './types';

const dir = 'assets/legacy/certificates/';

/** Original file (download / full size) plus WebP derivatives from `npm run images`. */
const files = (file: string) => {
  // Same slug rule as scripts/optimize-images.mjs
  const slug = file
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return {
    image: asset(`${dir}${file}`),
    thumb: asset(`assets/optimized/certificates/${slug}-640.webp`),
    preview: asset(`assets/optimized/certificates/${slug}-1600.webp`),
  };
};

export const certificates: Certificate[] = [
  {
    id: 'fortinet-nse3',
    title: 'Fortinet NSE 3 Certified in Cybersecurity',
    issuer: 'Fortinet Training Institute',
    date: '2026-10-01',
    note: 'Valid until October 1, 2028',
    ...files(`Fortinet NSE 3 Certified in Cybersecurity-1.png`),
    width: 2339,
    height: 1654,
  },
  {
    id: 'isc2-cc-domain5',
    title: 'CC Domain 5: Security Operations',
    issuer: 'ISC2',
    date: '2026-09-19',
    note: 'Certificate of Completion',
    ...files(`a7b6ba2f-c753-4b6f-b1ec-7ffeb5abc899-1.png`),
    width: 9167,
    height: 6945,
  },
  {
    id: 'ncsa-pentest',
    title: 'Penetration Test — Specialist Course',
    issuer: 'NCSA · Thailand National Cyber Academy (THNCA)',
    date: '2026-03-26',
    note: '28 hours via NCSA e-Learning',
    ...files(`THNCA Pentest.png`),
    width: 2339,
    height: 1654,
  },
  {
    id: 'ncsa-analyst',
    title: 'Cybersecurity Analyst — Specialist Course',
    issuer: 'NCSA · Thailand National Cyber Academy (THNCA)',
    date: '2026-03-26',
    note: '22 hours via NCSA e-Learning',
    ...files(`THNCA Cyber Security Analyst.png`),
    width: 2339,
    height: 1654,
  },
  {
    id: 'paloalto-practitioner',
    title: 'Palo Alto Networks Certified Cybersecurity Practitioner',
    issuer: 'Palo Alto Networks',
    date: '2026-03-26',
    note: 'Certificate of Completion',
    ...files(`Success Network Security.png`),
    width: 2339,
    height: 1654,
  },
  {
    id: 'paloalto-fundamentals',
    title: 'Cybersecurity Fundamentals',
    issuer: 'Palo Alto Networks',
    date: '2026-03-26',
    note: '2 h 30 min training',
    ...files(`Cyber Security Fundemental.png`),
    width: 2339,
    height: 1654,
  },
  {
    id: 'opswat-icip',
    title: 'Introduction to Critical Infrastructure Protection',
    issuer: 'OPSWAT Academy',
    date: '2026-03-26',
    note: 'CPE credits: 0.30',
    ...files(`introduction_ICIP.png`),
    width: 900,
    height: 710,
    verifyUrl: 'https://learn.opswatacademy.com/certificate/wDHF_1MDDQ',
  },
  {
    id: 'coursera-macquarie',
    title: 'Cyber Security: Essentials for Workplace',
    issuer: 'Macquarie University · Coursera',
    date: '2026-03-26',
    note: 'Course Certificate',
    ...files(`Coursera CyberSecurity.png`),
    width: 2200,
    height: 1700,
    verifyUrl: 'https://coursera.org/verify/64U3OJADDW6D',
  },
  {
    id: 'uniathena-data-science',
    title: 'Basics of Data Science',
    issuer: 'UniAthena · Cambridge International Qualifications',
    date: '2026-03-25',
    ...files(`Data Science.png`),
    width: 1639,
    height: 1170,
  },
  {
    id: 'coursera-wordpress',
    title: 'Build a free website with WordPress',
    issuer: 'Coursera',
    date: '2026-03-25',
    note: 'Project Certificate',
    ...files(`coursena_wordpress.png`),
    width: 2200,
    height: 1700,
    verifyUrl: 'https://coursera.org/verify/96WGJG73TY64',
  },
];

/** English: "Oct 1, 2026"; Thai: "1 ต.ค. 2569" (Buddhist-era year, as Thai readers expect). */
export const formatCertDate = (iso: string, lang: 'en' | 'th' = 'en') =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
