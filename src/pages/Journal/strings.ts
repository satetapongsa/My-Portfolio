import type { Lang } from '../../i18n/lang';

const en = {
  label: 'Engineering Journal',
  title: 'Notes from the workbench',
  lead: 'Technical write-ups about things I have actually built — how they work, what went wrong and what I would keep. Articles are only published once they can be backed by real code or documentation.',
  metaTitle: 'Engineering Journal · Satetapong Sanguansuk (Wave)',
  metaDescription: 'Technical articles and development notes by Satetapong Sanguansuk (Wave): React, Vite, CSS animation and the engineering behind real projects.',
  all: 'All',
  filter: 'Filter articles by category',
  minRead: '{n} min read',
  read: 'Read article',
  languages: 'Available in',
  langName: { en: 'English', th: 'Thai' },
  empty: 'No articles in this category yet.',
  count: '{n} published',
  draftsNote: 'Drafts are kept out of the site until they are complete.',
  breadcrumb: 'Breadcrumb',
  home: 'Home',
  journal: 'Journal',
  published: 'Published',
  onThisPage: 'On this page',
  progress: 'Reading progress',
  fallbackNotice: 'This article is currently available in English only.',
  share: 'Share this article',
  copyLink: 'Copy link',
  shareNative: 'Share',
  copied: 'Link copied to clipboard',
  copyFailed: 'Could not copy the link',
  related: 'Related articles',
  back: 'All articles',
  notFound: 'Article not found',
  tags: 'Tags',
};

export type JournalStrings = typeof en;

const th: JournalStrings = {
  label: 'บันทึกทางวิศวกรรม',
  title: 'บันทึกจากโต๊ะทำงาน',
  lead: 'บทความเชิงเทคนิคเกี่ยวกับสิ่งที่ผมสร้างจริง ทำงานอย่างไร อะไรผิดพลาด และอะไรที่ควรเก็บไว้ บทความจะเผยแพร่ก็ต่อเมื่อมีโค้ดหรือเอกสารจริงรองรับเท่านั้น',
  metaTitle: 'บันทึกทางวิศวกรรม · เศรษฐพงศ์ สงวนสุข (Wave)',
  metaDescription: 'บทความเชิงเทคนิคและบันทึกการพัฒนาโดยเศรษฐพงศ์ สงวนสุข (Wave): React, Vite, แอนิเมชัน CSS และงานวิศวกรรมเบื้องหลังโปรเจกต์จริง',
  all: 'ทั้งหมด',
  filter: 'กรองบทความตามหมวดหมู่',
  minRead: 'อ่าน {n} นาที',
  read: 'อ่านบทความ',
  languages: 'มีในภาษา',
  langName: { en: 'อังกฤษ', th: 'ไทย' },
  empty: 'ยังไม่มีบทความในหมวดนี้',
  count: 'เผยแพร่แล้ว {n} บทความ',
  draftsNote: 'ฉบับร่างจะไม่แสดงบนเว็บจนกว่าจะเขียนเสร็จ',
  breadcrumb: 'เส้นทางนำทาง',
  home: 'หน้าแรก',
  journal: 'บันทึก',
  published: 'เผยแพร่เมื่อ',
  onThisPage: 'ในหน้านี้',
  progress: 'ความคืบหน้าการอ่าน',
  fallbackNotice: 'บทความนี้มีเฉพาะภาษาอังกฤษในขณะนี้',
  share: 'แชร์บทความนี้',
  copyLink: 'คัดลอกลิงก์',
  shareNative: 'แชร์',
  copied: 'คัดลอกลิงก์แล้ว',
  copyFailed: 'คัดลอกลิงก์ไม่สำเร็จ',
  related: 'บทความที่เกี่ยวข้อง',
  back: 'บทความทั้งหมด',
  notFound: 'ไม่พบบทความ',
  tags: 'แท็ก',
};

export const journalStrings: Record<Lang, JournalStrings> = { en, th };

export const formatArticleDate = (iso: string, lang: Lang) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
