/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CENTRAL CONTENT CONFIG
 *  Edit this file (plus projects.ts, skills.ts, journey.ts) to update the site.
 *  Anything marked PLACEHOLDER is intentionally empty: the UI hides or disables
 *  it until you fill it in, so nothing broken or fake is ever shown.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { asset } from '../utils/asset';
import type { NavItem, PortfolioProfile } from './types';

export const profile: PortfolioProfile = {
  fullName: 'Satetapong Sanguansuk',
  // Recovered from the original portfolio (public/assets/legacy/profile/).
  photo: {
    src: asset('assets/legacy/profile/profile.png'),
    alt: 'Portrait of Satetapong Sanguansuk (Wave) in a navy suit and white shirt',
    width: 768,
    height: 1024,
  },
  nickname: 'Wave',
  role: 'Computer Engineering Student & Developer',
  tagline: 'Building ideas into digital experiences.',
  heroIntro:
    'I build software, automation concepts and interactive 3D environments — exploring how code, systems and hardware meet.',
  bio: 'Hello, I’m Satetapong Sanguansuk, also known as Wave. I’m a Computer Engineering student at Sripatum University with a strong interest in programming, software development, system design, and emerging technologies. I enjoy exploring technical concepts and turning ideas into functional digital experiences.',
  aboutMe:
    'I’m interested in software development and programming, especially building web applications and thinking about how systems are designed and fit together. Beyond the web, I’m exploring industrial automation through PLC and HMI concepts, and interactive 3D technology with Unreal Engine. I learn best by building projects and steadily strengthening my engineering fundamentals along the way.',
  interests: [
    'Software Engineering',
    'Frontend Development',
    'Web Applications',
    'System Architecture',
    'PLC & Industrial Automation',
    'Unreal Engine & 3D Interactive Experiences',
  ],
  education: {
    university: 'Sripatum University',
    campus: 'Bang Khen',
    field: 'Computer Engineering',
    period: '2023 – 2027 (Expected)', // from the résumé
  },
  infoBlocks: [
    {
      title: 'Education',
      icon: 'education',
      items: ['Bachelor of Technology in Computer Engineering', 'Sripatum University, Bang Khen', '2023 – 2027 (Expected)'],
    },
    {
      title: 'Technical Interests',
      icon: 'interests',
      items: ['Software & web development', 'System design', 'Automation', 'Interactive technology'],
    },
    {
      title: 'Current Focus',
      icon: 'focus',
      items: [
        'PLC & HMI control system design',
        'Interactive 3D with Unreal Engine 5',
        'Strengthening programming fundamentals',
      ],
    },
    {
      title: 'Development Philosophy',
      icon: 'philosophy',
      items: [
        'Understand the system before writing the code',
        'Build, test, iterate — learn by shipping',
        'Clarity over cleverness',
      ],
    },
  ],
  contact: {
    email: 'satetapongs@gmail.com',
    formEndpoint: '', // OPTIONAL e.g. 'https://formspree.io/f/xxxxxx' — empty uses a mailto: draft
    location: 'Bangkok, Thailand',
    availability: 'Open to internships, collaborations and conversations.',
  },
  socials: [
    { id: 'github', label: 'GitHub', url: 'https://github.com/satetapongsa', handle: 'satetapongsa' },
    { id: 'linkedin', label: 'LinkedIn', url: 'https://th.linkedin.com/in/satetapongsa', handle: 'satetapongsa' },
    { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@wavywvy', handle: '@wavywvy' },
    // Add more, e.g. { id: 'website', label: 'Blog', url: 'https://…', handle: 'blog' }
  ],
  // Recovered from the original portfolio (public/assets/legacy/resume/).
  resumePath: asset('assets/legacy/resume/Resume_Satetapong_Sanguansuk.pdf'),
};

/**
 * "Selected Projects" on the unstyled intro page — the two concepts exactly as
 * specified for that page. They are concepts, so they are not shown in the
 * Projects section (which lists real GitHub repositories only).
 */
export const introProjects = [
  {
    title: 'Automatic Liquid Mixing & Tank Control System',
    category: 'Industrial Automation / PLC',
    description:
      'An industrial process simulation concept involving automatic and manual operating modes, alarm management, process trends, and historical data.',
    status: 'System Design / In Progress',
  },
  {
    title: 'Unreal Engine 5 Penthouse Viewer',
    category: '3D Interactive Experience',
    description:
      'An interactive 3D architectural visualization concept designed to let visitors explore a realistic penthouse environment from a first-person perspective.',
    status: 'Concept / In Progress',
  },
];

export type IntroProject = (typeof introProjects)[number];

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
];
