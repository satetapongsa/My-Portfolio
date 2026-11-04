import { Copy, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { LabStrings } from '../../pages/DeveloperLab/strings';
import { copyText } from '../../utils/links';
import { useToast } from '../ui/Toast';
import { Segmented, Slider, Toggle } from './controls';

type Align = 'start' | 'center' | 'end' | 'stretch';

interface LayoutState {
  columns: number;
  gap: number;
  width: number; // % of the stage
  items: number;
  align: Align;
  justify: Align;
  useBreakpoint: boolean;
  breakpoint: number; // px, container width
  narrowColumns: number;
}

const DEFAULTS: LayoutState = {
  columns: 4,
  gap: 16,
  width: 100,
  items: 8,
  align: 'stretch',
  justify: 'stretch',
  useBreakpoint: true,
  breakpoint: 520,
  narrowColumns: 2,
};

/** Grid CSS for the preview — also what "Copy CSS" copies. A container query handles the breakpoint. */
function layoutCss(l: LayoutState) {
  const lines = [
    '.layout-frame {',
    '  container-type: inline-size;',
    '}',
    '',
    '.layout-grid {',
    '  display: grid;',
    `  grid-template-columns: repeat(${l.columns}, minmax(0, 1fr));`,
    `  gap: ${l.gap}px;`,
    `  align-items: ${l.align};`,
    `  justify-items: ${l.justify};`,
    '}',
  ];
  if (l.useBreakpoint) {
    lines.push('', `@container (max-width: ${l.breakpoint}px) {`, '  .layout-grid {', `    grid-template-columns: repeat(${l.narrowColumns}, minmax(0, 1fr));`, '  }', '}');
  }
  return lines.join('\n');
}

// Uneven heights so align-items has something to show.
const HEIGHTS = [64, 96, 72, 120, 80, 104, 68, 88, 112, 76, 92, 60];

export function ResponsivePlayground({ s }: { s: LabStrings }) {
  const notify = useToast();
  const [layout, setLayout] = useState<LayoutState>(DEFAULTS);
  const set = <K extends keyof LayoutState>(key: K) => (value: LayoutState[K]) => setLayout((prev) => ({ ...prev, [key]: value }));
  const css = useMemo(() => layoutCss(layout), [layout]);
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameWidth, setFrameWidth] = useState(0);
  const l = s.layout;

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setFrameWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const active = layout.useBreakpoint && frameWidth > 0 && frameWidth <= layout.breakpoint;
  const alignOptions: { value: Align; label: string }[] = [
    { value: 'start', label: l.start },
    { value: 'center', label: l.center },
    { value: 'end', label: l.end },
    { value: 'stretch', label: l.stretch },
  ];

  const copy = async () => {
    const ok = await copyText(css);
    notify(ok ? s.copied : s.copyFailed, ok ? 'success' : 'error');
  };

  return (
    <div className="lab-exp">
      <div className="lab-exp__controls" role="group" aria-label={`${l.title} — ${s.controls}`}>
        <Slider label={l.columns} value={layout.columns} min={1} max={6} onChange={set('columns')} />
        <Slider label={l.gap} value={layout.gap} min={0} max={48} unit="px" onChange={set('gap')} />
        <Slider label={l.width} value={layout.width} min={30} max={100} unit="%" onChange={set('width')} />
        <Slider label={l.items} value={layout.items} min={2} max={12} onChange={set('items')} />
        <Segmented label={l.align} value={layout.align} options={alignOptions} onChange={set('align')} />
        <Segmented label={l.justify} value={layout.justify} options={alignOptions} onChange={set('justify')} />
        <Toggle label={l.useBreakpoint} checked={layout.useBreakpoint} onChange={set('useBreakpoint')} />
        {layout.useBreakpoint && (
          <>
            <Slider label={l.breakpoint} value={layout.breakpoint} min={240} max={900} step={10} unit="px" onChange={set('breakpoint')} />
            <Slider label={l.breakpointCols} value={layout.narrowColumns} min={1} max={4} onChange={set('narrowColumns')} />
          </>
        )}
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setLayout(DEFAULTS)}>
          <RotateCcw aria-hidden /> {s.reset}
        </button>
      </div>

      <div className="lab-exp__output">
        <div className="lab-layout__status">
          <p className="lab-exp__label mono">{s.preview}</p>
          <p className="mono lab-layout__measure" aria-live="polite">
            {l.measured.replace('{w}', String(frameWidth))} ·{' '}
            {layout.useBreakpoint ? <span className={active ? 'is-on' : ''}>{active ? l.active : l.inactive}</span> : '—'}
          </p>
        </div>
        <div className="lab-layout__stage">
          <style>{css}</style>
          <div ref={frameRef} className="layout-frame lab-layout__frame" style={{ width: `${layout.width}%` }}>
            <div className="layout-grid">
              {Array.from({ length: layout.items }, (_, i) => (
                <div key={i} className="lab-layout__item mono" style={{ minHeight: layout.align === 'stretch' ? undefined : HEIGHTS[i % HEIGHTS.length] }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lab-code">
          <div className="lab-code__bar">
            <p className="lab-exp__label mono">{s.generated}</p>
            <button type="button" className="btn btn--primary btn--sm" onClick={copy}>
              <Copy aria-hidden /> {s.copyCss}
            </button>
          </div>
          <pre tabIndex={0} aria-label={s.generated}>
            <code>{css}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
