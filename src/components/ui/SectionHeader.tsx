import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
}

export function SectionHeader({ index, label, title, lead, id }: SectionHeaderProps) {
  return (
    <Reveal className="section-head">
      <p className="section-head__meta">
        <span className="section-head__index">{index}</span>
        <span className="section-head__rule" aria-hidden="true" />
        <span>{label}</span>
      </p>
      <h2 className="section-head__title" id={id}>
        {title}
      </h2>
      {lead && <p className="section-head__lead">{lead}</p>}
    </Reveal>
  );
}
