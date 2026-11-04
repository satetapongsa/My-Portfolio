import type { ReactNode } from 'react';
import { CSSPlayground } from '../../components/DeveloperLab/CSSPlayground';
import { MotionLab } from '../../components/DeveloperLab/MotionLab';
import { ResponsivePlayground } from '../../components/DeveloperLab/ResponsivePlayground';
import { useDocumentMeta } from '../../components/SEO/useDocumentMeta';
import { useI18n } from '../../i18n/I18nProvider';
import { routePaths } from '../../router/router';
import { labStrings } from './strings';
import '../../components/DeveloperLab/lab.css';

function Experiment({ id, code, title, lead, children }: { id: string; code: string; title: string; lead: string; children: ReactNode }) {
  return (
    <section id={id} className="lab-section" aria-labelledby={`${id}-title`}>
      <header className="lab-section__head">
        <p className="lab-section__code mono">{code}</p>
        <h2 id={`${id}-title`} className="lab-section__title">
          {title}
        </h2>
        <p className="lab-section__lead">{lead}</p>
      </header>
      {children}
    </section>
  );
}

export default function LabPage() {
  const { lang } = useI18n();
  const s = labStrings[lang];
  useDocumentMeta({ title: s.metaTitle, description: s.metaDescription, path: routePaths.lab });

  const experiments = [
    { id: 'css-playground', code: s.css.code, title: s.css.title },
    { id: 'layout-playground', code: s.layout.code, title: s.layout.title },
    { id: 'motion-lab', code: s.motion.code, title: s.motion.title },
  ];

  return (
    <div className="page lab container">
      <header className="page-head">
        <p className="page-head__meta">{s.label}</p>
        <h1 className="page-head__title">{s.title}</h1>
        <p className="page-head__lead">{s.lead}</p>
        <nav className="lab-jump" aria-label={s.jump}>
          {experiments.map((e) => (
            <a key={e.id} href={`#${e.id}`}>
              <span className="mono">{e.code}</span> {e.title}
            </a>
          ))}
        </nav>
      </header>

      <Experiment id="css-playground" code={s.css.code} title={s.css.title} lead={s.css.lead}>
        <CSSPlayground s={s} />
      </Experiment>
      <Experiment id="layout-playground" code={s.layout.code} title={s.layout.title} lead={s.layout.lead}>
        <ResponsivePlayground s={s} />
      </Experiment>
      <Experiment id="motion-lab" code={s.motion.code} title={s.motion.title} lead={s.motion.lead}>
        <MotionLab s={s} />
      </Experiment>
    </div>
  );
}
