import { ArrowDown } from 'lucide-react';
import type { CaseStudyDiagram, DiagramTone } from '../../data/caseStudies';

export interface DiagramLabels {
  stage: string;
  then: string;
  legend: string;
  tones: Record<DiagramTone, string>;
}

const TONES: DiagramTone[] = ['source', 'process', 'store', 'human', 'output'];

/**
 * A data-driven flow diagram: stages run top to bottom, nodes inside a stage
 * sit side by side, and connector labels name the protocol or trigger. It is
 * an ordered list underneath, so screen readers get the same sequence.
 */
export function ArchitectureDiagram({ diagram, labels }: { diagram: CaseStudyDiagram; labels: DiagramLabels }) {
  const used = TONES.filter((tone) => diagram.stages.some((s) => s.nodes.some((n) => (n.tone ?? 'process') === tone)));
  return (
    <figure className="arch">
      <figcaption className="arch__head">
        <span className="arch__title">{diagram.title}</span>
        <span className="arch__caption">{diagram.caption}</span>
      </figcaption>

      <ol className="arch__flow">
        {diagram.stages.map((stage, i) => (
          <li key={stage.title} className="arch__stage">
            <p className="arch__stage-title mono">
              <span className="sr-only">{labels.stage} </span>
              <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span> {stage.title}
            </p>
            <ul className="arch__nodes">
              {stage.nodes.map((node) => (
                <li key={node.label} className={`arch__node arch__node--${node.tone ?? 'process'}`}>
                  <span className="arch__label">{node.label}</span>
                  {node.detail && <span className="arch__detail">{node.detail}</span>}
                </li>
              ))}
            </ul>
            {i < diagram.stages.length - 1 && (
              <div className="arch__link">
                <ArrowDown aria-hidden />
                {stage.link ? (
                  <span className="arch__link-label mono">
                    <span className="sr-only">{labels.then} </span>
                    {stage.link}
                  </span>
                ) : (
                  <span className="sr-only">{labels.then}</span>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>

      {diagram.notes && diagram.notes.length > 0 && (
        <ul className="arch__notes">
          {diagram.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      <ul className="arch__legend" aria-label={labels.legend}>
        {used.map((tone) => (
          <li key={tone} className={`arch__legend-item arch__node--${tone}`}>
            <span className="arch__swatch" aria-hidden="true" />
            {labels.tones[tone]}
          </li>
        ))}
      </ul>
    </figure>
  );
}
