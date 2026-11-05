import { Download, ExternalLink, FileText } from 'lucide-react';
import { formatBytes, resumes } from '../../data/resume';
import { useI18n } from '../../i18n/I18nProvider';
import { Reveal } from '../ui/Reveal';
import './resume.css';

const copy = {
  en: {
    heading: 'Résumé',
    lead: 'One page covering technical skills, projects, activities and education — currently seeking a co-op internship (5 Jan – 30 Apr 2027).',
    format: 'Format',
    file: 'File name',
    size: 'Size',
    pages: 'Pages',
    language: 'Language',
    langName: { en: 'English', th: 'Thai' },
    view: 'View résumé',
    download: 'Download PDF',
    preview: 'Preview of page 1 of the résumé',
    openPreview: 'Open the résumé PDF',
    onlyEnglish: '',
    page: (n: number) => `${n} ${n === 1 ? 'page' : 'pages'}`,
  },
  th: {
    heading: 'เรซูเม่',
    lead: 'หนึ่งหน้า สรุปทักษะทางเทคนิค ผลงาน กิจกรรม และการศึกษา — กำลังหาที่ฝึกงานสหกิจ (5 ม.ค. – 30 เม.ย. 2570)',
    format: 'รูปแบบไฟล์',
    file: 'ชื่อไฟล์',
    size: 'ขนาด',
    pages: 'จำนวนหน้า',
    language: 'ภาษา',
    langName: { en: 'อังกฤษ', th: 'ไทย' },
    view: 'ดูเรซูเม่',
    download: 'ดาวน์โหลด PDF',
    preview: 'ภาพตัวอย่างหน้าแรกของเรซูเม่',
    openPreview: 'เปิดไฟล์ PDF เรซูเม่',
    onlyEnglish: 'ขณะนี้มีเรซูเม่เฉพาะฉบับภาษาอังกฤษ',
    page: (n: number) => `${n} หน้า`,
  },
};

/** The real résumé PDF: page-1 preview, file facts, view and download. */
export function ResumeCard() {
  const { lang, t } = useI18n();
  const c = copy[lang];
  // Prefer a résumé in the visitor's language; fall back to the one that exists.
  const resume = resumes.find((r) => r.lang === lang) ?? resumes[0];
  if (!resume) return null;
  const fallback = resume.lang !== lang;

  return (
    <Reveal className="resume glow-card" y={16}>
      <a className="resume__preview" href={resume.url} target="_blank" rel="noopener noreferrer" aria-label={`${c.openPreview} ${t.common.opensInNewTab}`}>
        <img
          src={resume.preview.small}
          srcSet={`${resume.preview.small} 480w, ${resume.preview.src} 960w`}
          sizes="(max-width: 760px) 70vw, 300px"
          alt={c.preview}
          width={resume.preview.width}
          height={resume.preview.height}
          loading="lazy"
          decoding="async"
        />
      </a>

      <div className="resume__body">
        <p className="resume__eyebrow mono">
          <FileText aria-hidden /> {c.heading}
        </p>
        <h3 className="resume__title">
          Satetapong Sanguansuk <span>· {resume.headline}</span>
        </h3>
        <p className="resume__lead">{c.lead}</p>
        {fallback && c.onlyEnglish && <p className="resume__notice">{c.onlyEnglish}</p>}

        <dl className="resume__facts">
          <div>
            <dt>{c.format}</dt>
            <dd className="mono">PDF</dd>
          </div>
          <div>
            <dt>{c.size}</dt>
            <dd className="mono">{formatBytes(resume.sizeBytes)}</dd>
          </div>
          <div>
            <dt>{c.pages}</dt>
            <dd className="mono">{c.page(resume.pages)}</dd>
          </div>
          <div>
            <dt>{c.language}</dt>
            <dd>{c.langName[resume.lang]}</dd>
          </div>
          <div className="resume__facts-wide">
            <dt>{c.file}</dt>
            <dd className="mono">{resume.fileName}</dd>
          </div>
        </dl>

        <div className="resume__actions">
          <a className="btn btn--primary" href={resume.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden /> {c.view}
            <span className="sr-only"> {t.common.opensInNewTab}</span>
          </a>
          <a className="btn btn--ghost" href={resume.url} download={resume.fileName}>
            <Download aria-hidden /> {c.download}
          </a>
        </div>
      </div>
    </Reveal>
  );
}
